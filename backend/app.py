from __future__ import annotations

import asyncio
import json
import os
import random
import re
import uuid
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple

import httpx
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .feature_encoder import FeatureEncoder


ROOT_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT_DIR / "MLmodel" / "matchmaker_model.joblib"
COLUMNS_PATH = ROOT_DIR / "MLmodel" / "model_columns.json"
SYNTHETIC_DATA_DIR = ROOT_DIR / "synthetic-data"

GEMINI_SERVICE_URL = os.getenv("GEMINI_SERVICE_URL", "http://127.0.0.1:3001")

if not MODEL_PATH.exists():
    raise RuntimeError(f"Expected to find model artefact at {MODEL_PATH}")

model = joblib.load(MODEL_PATH)
with open(COLUMNS_PATH, "r", encoding="utf-8") as fh:
    model_columns: List[str] = json.load(fh)

encoder = FeatureEncoder(model_columns)
positive_class_index = int(np.where(model.classes_ == 1)[0][0]) if hasattr(model, "classes_") else 1

DEMO_SELLER_PROFILES: List[Dict[str, Any]] = [
    {
        "user_id": "sustainable_style_aisha",
        "raw_text": "Austin-based sustainable fashion seller with over 140 eco-conscious apparel transactions.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "sustainable_style_aisha",
            "context": {
                "original_text": "Austin-based sustainable fashion seller with over 140 eco-conscious apparel transactions."
            },
            "profile_keywords": ["sustainable fashion", "eco textiles", "upcycled", "slow fashion", "austin"],
            "inferred_major": "Sustainability Studies",
            "inferred_location_keywords": ["Austin"],
            "sales_history_summary": [
                {
                    "category": "Eco-Friendly Apparel",
                    "item_examples": [
                        "recycled denim jacket with plant-based dyes",
                        "organic cotton tote bag with refillable clasp",
                        "hemp infinity scarf lined with cork buttons",
                    ],
                    "total_items_sold": 142,
                    "avg_price_per_item": 35.7,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Sustainable Accessories",
                    "item_examples": [
                        "reclaimed leather belt with brass buckle",
                        "bamboo loop earrings with natural lacquer",
                        "upcycled denim headwrap with herbal dye",
                    ],
                    "total_items_sold": 64,
                    "avg_price_per_item": 24.5,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Circular Fashion", "Eco Accessories"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Recycled denim jacket",
                "category": "Eco-Friendly Apparel",
                "tags": ["sustainable", "upcycled", "denim"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 50.0,
                "price": 48.0,
            },
            "context": {
                "urgency": "medium",
                "reason": "Campus sustainability showcase",
                "original_text": "Upcycled denim jacket tagged with sustainability markers and sizing notes.",
            },
            "location": {"text_input": "UT Austin Green Market", "device_gps": None},
        },
    },
    {
        "user_id": "miami_refurb_mateo",
        "raw_text": "Miami tech refurbisher handling laptops and accessories with verified condition guarantees.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "miami_refurb_mateo",
            "context": {
                "original_text": "Miami tech refurbisher handling laptops and accessories with verified condition guarantees."
            },
            "profile_keywords": ["refurbished electronics", "laptops", "warranty", "diagnostics", "miami"],
            "inferred_major": "Computer Engineering",
            "inferred_location_keywords": ["Miami"],
            "sales_history_summary": [
                {
                    "category": "Refurbished Tech",
                    "item_examples": [
                        "used MacBook Air 2020 with 12-month warranty",
                        "wireless gaming mouse (refurbished grade A)",
                        "refurbished iPad Mini with battery health swap",
                    ],
                    "total_items_sold": 95,
                    "avg_price_per_item": 325.0,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Verified Accessories",
                    "item_examples": [
                        "USB-C docking station with stress test log",
                        "noise-canceling headset tuned for latency",
                        "portable SSD 1TB with SMART report attached",
                    ],
                    "total_items_sold": 58,
                    "avg_price_per_item": 62.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Performance Accessories", "Tech Warranties"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Refurbished MacBook Air 2020 bundle",
                "category": "Refurbished Tech",
                "tags": ["verified", "laptop", "refurbished"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 680.0,
                "price": 650.0,
            },
            "context": {
                "urgency": "medium",
                "reason": "New semester enrollment",
                "original_text": "Verified-condition MacBook Air with battery health report and extended warranty offer.",
            },
            "location": {"text_input": "Miami Tech CoLab", "device_gps": None},
        },
    },
    {
        "user_id": "ai_art_evelyn",
        "raw_text": "Portland AI artist blending neural art prints with hand-crafted frames for sustainability-minded buyers.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "ai_art_evelyn",
            "context": {
                "original_text": "Portland AI artist blending neural art prints with hand-crafted frames for sustainability-minded buyers."
            },
            "profile_keywords": ["ai art", "handmade frames", "sustainability", "gallery", "portland"],
            "inferred_major": "Digital Arts",
            "inferred_location_keywords": ["Portland"],
            "sales_history_summary": [
                {
                    "category": "Art & Decor",
                    "item_examples": [
                        "eco print 'Neural Garden' with soy ink",
                        "recycled-wood frame set with cedar inlay",
                        "AI abstract 'Post-Human Bloom' on bamboo paper",
                    ],
                    "total_items_sold": 58,
                    "avg_price_per_item": 51.7,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Limited Series",
                    "item_examples": [
                        "AI canvas 'Retrofuture Roots'",
                        "neural sketch 'Rainforest Signals'",
                        "framed mini-print set 'Polymer Dreams'",
                    ],
                    "total_items_sold": 21,
                    "avg_price_per_item": 72.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Gallery Exhibits", "Sustainable Materials"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "AI print 'Neural Garden' with recycled frame",
                "category": "Art & Decor",
                "tags": ["ai", "sustainable", "print"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 65.0,
                "price": 60.0,
            },
            "context": {
                "urgency": "low",
                "reason": "Creative showcase pop-up",
                "original_text": "Limited-run AI print mounted in a recycled wood frame, signed and numbered.",
            },
            "location": {"text_input": "Portland Makers Collective", "device_gps": None},
        },
    },
    {
        "user_id": "diy_drone_rajesh",
        "raw_text": "Newark hobbyist crafting custom drones and RC components with technical documentation for buyers.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "diy_drone_rajesh",
            "context": {"original_text": "Newark hobbyist crafting custom drones and RC components with technical documentation for buyers."},
            "profile_keywords": ["custom drones", "rc components", "engineering", "telemetry", "newark"],
            "inferred_major": "Electrical Engineering",
            "inferred_location_keywords": ["Newark"],
            "sales_history_summary": [
                {
                    "category": "Custom Drones",
                    "item_examples": [
                        "3D-printed drone frame with carbon inserts",
                        "quadcopter with GPS module and telemetry",
                        "LiPo battery pack with balance charger",
                    ],
                    "total_items_sold": 77,
                    "avg_price_per_item": 150.0,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "RC Components",
                    "item_examples": [
                        "brushless motor kit with ESC tuning guide",
                        "FPV camera module with low-latency firmware",
                        "custom soldered flight controller stack",
                    ],
                    "total_items_sold": 49,
                    "avg_price_per_item": 92.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["FPV Racing", "Engineering Clubs"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Custom quadcopter with GPS",
                "category": "Custom Drones",
                "tags": ["drone", "gps", "custom build"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 265.0,
                "price": 250.0,
            },
            "context": {
                "urgency": "high",
                "reason": "Engineering race weekend",
                "original_text": "Hand-built quadcopter tuned for stability with GPS and telemetry modules, includes configuration notes.",
            },
            "location": {"text_input": "Newark Robotics Lab", "device_gps": None},
        },
    },
    {
        "user_id": "fair_trade_nia",
        "raw_text": "Minneapolis curator of fair-trade jewelry from African cooperatives with over 200 artisan accessory sales.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "fair_trade_nia",
            "context": {"original_text": "Minneapolis curator of fair-trade jewelry from African cooperatives with over 200 artisan accessory sales."},
            "profile_keywords": ["fair trade", "artisan jewelry", "african cooperatives", "storytelling", "minneapolis"],
            "inferred_major": "International Development",
            "inferred_location_keywords": ["Minneapolis"],
            "sales_history_summary": [
                {
                    "category": "Fair-Trade Jewelry",
                    "item_examples": [
                        "beaded Congolese necklace with recycled glass",
                        "woven bracelet from Ghana with Adinkra symbols",
                        "Tanzanian copper earrings with hammered finish",
                    ],
                    "total_items_sold": 210,
                    "avg_price_per_item": 29.7,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Story Collection",
                    "item_examples": [
                        "artisan story card set with QR code videos",
                        "community impact bracelet trio",
                        "limited anklet supporting cooperative fund",
                    ],
                    "total_items_sold": 88,
                    "avg_price_per_item": 18.5,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Nonprofit Partnerships", "Cultural Storytelling"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Fair-trade Congolese necklace",
                "category": "Fair-Trade Jewelry",
                "tags": ["artisan", "fair trade", "necklace"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 42.0,
                "price": 38.0,
            },
            "context": {
                "urgency": "medium",
                "reason": "Cultural showcase fundraiser",
                "original_text": "Handmade beaded necklace with cooperative origin story and donation allocation.",
            },
            "location": {"text_input": "Minneapolis Cultural Exchange Hall", "device_gps": None},
        },
    },
    {
        "user_id": "vintage_tools_tom",
        "raw_text": "Retired Boise carpenter restoring vintage woodworking tools with meticulous maintenance notes.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "vintage_tools_tom",
            "context": {"original_text": "Retired Boise carpenter restoring vintage woodworking tools with meticulous maintenance notes."},
            "profile_keywords": ["vintage tools", "woodworking", "restoration", "carpentry", "boise"],
            "inferred_major": "Carpentry",
            "inferred_location_keywords": ["Boise"],
            "sales_history_summary": [
                {
                    "category": "Restored Woodworking Tools",
                    "item_examples": [
                        "Stanley hand plane (1940s) tuned blade",
                        "cast-iron saw set with new oak handle",
                        "restored measuring square with brass inlay",
                    ],
                    "total_items_sold": 126,
                    "avg_price_per_item": 58.0,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Maintenance Kits",
                    "item_examples": [
                        "linseed oil care kit for antique handles",
                        "restoration guide booklet with step photos",
                        "precision sharpening stone tri-pack",
                    ],
                    "total_items_sold": 47,
                    "avg_price_per_item": 33.5,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Tool Collecting", "Workshop Restoration"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Restored Stanley hand plane",
                "category": "Restored Woodworking Tools",
                "tags": ["vintage", "woodworking", "restored"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 65.0,
                "price": 58.0,
            },
            "context": {
                "urgency": "low",
                "reason": "Collector showcase",
                "original_text": "1940s Stanley hand plane restored with detailed maintenance notes and sharpening guide.",
            },
            "location": {"text_input": "Boise Heritage Workshop", "device_gps": None},
        },
    },
    {
        "user_id": "minimal_decor_keiko",
        "raw_text": "San Francisco minimalist decor designer crafting Japanese-inspired pieces for modern apartments.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "minimal_decor_keiko",
            "context": {"original_text": "San Francisco minimalist decor designer crafting Japanese-inspired pieces for modern apartments."},
            "profile_keywords": ["minimalist decor", "japanese design", "ikebana", "modern home", "san francisco"],
            "inferred_major": "Industrial Design",
            "inferred_location_keywords": ["San Francisco"],
            "sales_history_summary": [
                {
                    "category": "Minimalist Home Decor",
                    "item_examples": [
                        "ceramic bonsai planter with matte glaze",
                        "origami-inspired lamp with rice paper shade",
                        "bamboo shelving set with hidden fasteners",
                    ],
                    "total_items_sold": 89,
                    "avg_price_per_item": 94.3,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Harmony Collections",
                    "item_examples": [
                        "matcha tea tray with slate accent",
                        "balance stones centerpiece kit",
                        "henshi incense holder with ash groove",
                    ],
                    "total_items_sold": 32,
                    "avg_price_per_item": 58.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Interior Styling", "Zen Living"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Origami-inspired minimalist lamp",
                "category": "Minimalist Home Decor",
                "tags": ["minimalist", "lighting", "japanese design"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 105.0,
                "price": 95.0,
            },
            "context": {
                "urgency": "low",
                "reason": "Apartment staging refresh",
                "original_text": "LED origami-inspired lamp crafted to balance light and shadow for serene spaces.",
            },
            "location": {"text_input": "SoMa Design Studio", "device_gps": None},
        },
    },
    {
        "user_id": "streetwear_jamal",
        "raw_text": "Atlanta sneaker and streetwear collector flipping limited drops with rapid sell-through and high engagement.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "streetwear_jamal",
            "context": {"original_text": "Atlanta sneaker and streetwear collector flipping limited drops with rapid sell-through and high engagement."},
            "profile_keywords": ["sneakers", "streetwear", "limited edition", "resell", "atlanta"],
            "inferred_major": "Marketing",
            "inferred_location_keywords": ["Atlanta"],
            "sales_history_summary": [
                {
                    "category": "Sneakers & Streetwear",
                    "item_examples": [
                        "Nike Dunk Low 'Panda' (deadstock)",
                        "Yeezy Boost 350 'Zebra' with authenticity tag",
                        "Supreme hoodie FW23 'City Grid'",
                    ],
                    "total_items_sold": 340,
                    "avg_price_per_item": 236.7,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Collector Drops",
                    "item_examples": [
                        "Travis Scott Air Jordan 1 swap pack",
                        "Fear of God Essentials crewneck (2024 run)",
                        "Palace tri-ferg tee limited release",
                    ],
                    "total_items_sold": 112,
                    "avg_price_per_item": 188.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["Hype Drops", "Collector Communities"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Nike Dunk Low 'Panda'",
                "category": "Sneakers & Streetwear",
                "tags": ["limited", "sneaker", "resell"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 240.0,
                "price": 220.0,
            },
            "context": {
                "urgency": "immediate",
                "reason": "Streetwear swap meet",
                "original_text": "Deadstock Nike Dunk Low 'Panda' with original box and authentication receipts.",
            },
            "location": {"text_input": "Atlanta Sneaker Exchange", "device_gps": None},
        },
    },
    {
        "user_id": "edu_kits_lena",
        "raw_text": "Chicago physics education PhD crafting hands-on science kits with safety certifications and learning outcomes.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "edu_kits_lena",
            "context": {"original_text": "Chicago physics education PhD crafting hands-on science kits with safety certifications and learning outcomes."},
            "profile_keywords": ["STEM kits", "education", "hands-on learning", "safety certified", "chicago"],
            "inferred_major": "Physics Education",
            "inferred_location_keywords": ["Chicago"],
            "sales_history_summary": [
                {
                    "category": "Educational Kits",
                    "item_examples": [
                        "DIY microscope kit for grades 5-8",
                        "chemistry reaction box with safety goggles",
                        "solar power puzzle kit with mini panels",
                    ],
                    "total_items_sold": 62,
                    "avg_price_per_item": 45.0,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Classroom Bundles",
                    "item_examples": [
                        "phonics magnet lab with teacher guide",
                        "circuits discovery box with LED maze",
                        "planetarium projector kit with star maps",
                    ],
                    "total_items_sold": 38,
                    "avg_price_per_item": 52.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["STEM Outreach", "Learning Labs"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "DIY microscope science kit",
                "category": "Educational Kits",
                "tags": ["STEM", "education", "microscope"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 55.0,
                "price": 48.0,
            },
            "context": {
                "urgency": "medium",
                "reason": "Classroom enrichment week",
                "original_text": "Hands-on DIY microscope kit with safety-certified components and lesson plans.",
            },
            "location": {"text_input": "Chicago Learning Commons", "device_gps": None},
        },
    },
    {
        "user_id": "smart_home_omar",
        "raw_text": "Seattle smart home builder delivering Raspberry Pi automation kits with firmware support for early adopters.",
        "parsed_profile": {
            "schema_type": "SELLER_PROFILE",
            "user_id": "smart_home_omar",
            "context": {"original_text": "Seattle smart home builder delivering Raspberry Pi automation kits with firmware support for early adopters."},
            "profile_keywords": ["smart home", "raspberry pi", "automation", "firmware", "seattle"],
            "inferred_major": "Computer Science",
            "inferred_location_keywords": ["Seattle"],
            "sales_history_summary": [
                {
                    "category": "Smart Home Systems",
                    "item_examples": [
                        "Pi home controller kit with Zigbee bridge",
                        "motion sensor automation pack with scene scripts",
                        "indoor security camera module with Python API",
                    ],
                    "total_items_sold": 113,
                    "avg_price_per_item": 93.3,
                    "dominant_transaction_type_in_category": "sell",
                },
                {
                    "category": "Automation Add-ons",
                    "item_examples": [
                        "smart thermostat relay kit with Node-RED flow",
                        "rain sensor garden automation board",
                        "entryway smart lock retrofit module with firmware",
                    ],
                    "total_items_sold": 54,
                    "avg_price_per_item": 78.0,
                    "dominant_transaction_type_in_category": "sell",
                },
            ],
            "overall_dominant_transaction_type": "sell",
            "related_categories_of_interest": ["IoT Projects", "Home Automation"],
        },
        "representative_item": {
            "schema_type": "FLASH_REQUEST",
            "item_meta": {
                "parsed_item": "Raspberry Pi smart home controller kit",
                "category": "Smart Home Systems",
                "tags": ["raspberry pi", "automation", "smart home"],
            },
            "transaction": {
                "type_preferred": "sell",
                "type_acceptable": ["sell"],
                "price_max": 120.0,
                "price": 110.0,
            },
            "context": {
                "urgency": "medium",
                "reason": "Home automation installation",
                "original_text": "Comprehensive Pi-based controller kit with GitHub firmware links and setup documentation.",
            },
            "location": {"text_input": "Seattle Maker Garage", "device_gps": None},
        },
    },
]

DEMO_PROFILE_HISTORY: Dict[str, List[Dict[str, Any]]] = {
    "sustainable_style_aisha": [
        {
            "id": "aisha-001",
            "title": "Austin farmers market denim drop",
            "counterpartName": "Cam",
            "date": "2025-11-05T14:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "aisha-002",
            "title": "Organic cotton tote pre-order",
            "counterpartName": "Liv",
            "date": "2025-10-20T17:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "aisha-003",
            "title": "Cork-button hemp scarf commission",
            "counterpartName": "Marisol",
            "date": "2025-09-28T19:10:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "aisha-004",
            "title": "Campus zero-waste runway fittings",
            "counterpartName": "Dylan",
            "date": "2025-08-30T22:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "aisha-005",
            "title": "Reclaimed leather belt swap",
            "counterpartName": "Pri",
            "date": "2025-07-18T18:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "aisha-006",
            "title": "Bamboo earrings collaboration",
            "counterpartName": "Greta",
            "date": "2025-06-05T16:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "aisha-007",
            "title": "Repair clinic denim tailoring",
            "counterpartName": "Leo",
            "date": "2025-05-22T21:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "aisha-008",
            "title": "Eco gala styling package",
            "counterpartName": "Fern",
            "date": "2025-04-10T20:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
    ],
    "miami_refurb_mateo": [
        {
            "id": "mateo-001",
            "title": "MacBook Air 2020 diagnostics bundle",
            "counterpartName": "Shay",
            "date": "2025-11-03T15:20:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "mateo-002",
            "title": "Gaming mouse latency tune-up",
            "counterpartName": "Raj",
            "date": "2025-10-16T18:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "mateo-003",
            "title": "iPad Mini battery replacement handoff",
            "counterpartName": "Isa",
            "date": "2025-09-26T19:35:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "mateo-004",
            "title": "USB-C dock stress test report",
            "counterpartName": "Noel",
            "date": "2025-08-29T21:10:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "mateo-005",
            "title": "Noise-canceling headset refurb",
            "counterpartName": "Lena",
            "date": "2025-07-21T20:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "mateo-006",
            "title": "SSD diagnostics upload",
            "counterpartName": "Vic",
            "date": "2025-06-30T17:25:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "mateo-007",
            "title": "Warranty consult for campus IT",
            "counterpartName": "Ari",
            "date": "2025-05-12T13:50:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "mateo-008",
            "title": "Surface laptop logic board rescue",
            "counterpartName": "Kai",
            "date": "2025-04-07T18:30:00Z",
            "status": "FAILED",
            "notes": "Board corrosion beyond recovery – deposit refunded",
        },
    ],
    "ai_art_evelyn": [
        {
            "id": "evelyn-001",
            "title": "Neural Garden gallery pickup",
            "counterpartName": "Rowan",
            "date": "2025-11-01T22:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "evelyn-002",
            "title": "Recycled cedar frame delivery",
            "counterpartName": "Elle",
            "date": "2025-10-18T19:40:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "evelyn-003",
            "title": "Post-Human Bloom limited print",
            "counterpartName": "Theo",
            "date": "2025-09-14T20:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "evelyn-004",
            "title": "Retrofuture Roots canvas commission",
            "counterpartName": "Mika",
            "date": "2025-08-26T18:20:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "evelyn-005",
            "title": "Rainforest Signals print install",
            "counterpartName": "Jun",
            "date": "2025-07-30T21:55:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "evelyn-006",
            "title": "Polymer Dreams triptych loan",
            "counterpartName": "Nia",
            "date": "2025-06-25T18:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "evelyn-007",
            "title": "Frame repair for eco market",
            "counterpartName": "Cleo",
            "date": "2025-05-19T17:10:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "evelyn-008",
            "title": "Gallery install reschedule",
            "counterpartName": "ArtLab",
            "date": "2025-04-03T16:05:00Z",
            "status": "CANCELLED",
            "notes": "Client delayed venue opening – deposit credited",
        },
    ],
    "diy_drone_rajesh": [
        {
            "id": "rajesh-001",
            "title": "GPS quadcopter race tune",
            "counterpartName": "Milo",
            "date": "2025-11-06T18:50:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "rajesh-002",
            "title": "Telemetry coaching session",
            "counterpartName": "Anika",
            "date": "2025-10-10T16:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "rajesh-003",
            "title": "FPV camera low-light upgrade",
            "counterpartName": "Zed",
            "date": "2025-09-21T20:25:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "rajesh-004",
            "title": "ESC tuning workshop",
            "counterpartName": "Ravi",
            "date": "2025-08-15T19:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "rajesh-005",
            "title": "LiPo battery safety refresh",
            "counterpartName": "Jae",
            "date": "2025-07-27T17:35:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "rajesh-006",
            "title": "3D-printed frame swap",
            "counterpartName": "Omar",
            "date": "2025-06-18T15:40:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "rajesh-007",
            "title": "Flight controller solder repair",
            "counterpartName": "Nico",
            "date": "2025-05-02T21:55:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "rajesh-008",
            "title": "Drone scrimmage delivery delay",
            "counterpartName": "STEM Club",
            "date": "2025-03-29T18:05:00Z",
            "status": "CANCELLED",
            "notes": "Client postponed the race meet due to weather",
        },
    ],
    "fair_trade_nia": [
        {
            "id": "nia-001",
            "title": "Congolese beadwork showcase",
            "counterpartName": "Ivy",
            "date": "2025-11-04T17:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "nia-002",
            "title": "Ghana bracelet storytelling booth",
            "counterpartName": "Rekha",
            "date": "2025-10-13T19:50:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "nia-003",
            "title": "Tanzanian copper earrings drop",
            "counterpartName": "Olu",
            "date": "2025-09-19T18:35:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "nia-004",
            "title": "Story cards printing fulfillment",
            "counterpartName": "Grace",
            "date": "2025-08-24T15:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "nia-005",
            "title": "Impact bracelet trio fundraiser",
            "counterpartName": "Leo",
            "date": "2025-07-16T16:25:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "nia-006",
            "title": "Anklet cooperative restock",
            "counterpartName": "Tari",
            "date": "2025-06-08T20:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "nia-007",
            "title": "Cultural showcase livestream",
            "counterpartName": "BridgeOrg",
            "date": "2025-05-04T21:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "nia-008",
            "title": "Donation split planning session",
            "counterpartName": "Co-op Council",
            "date": "2025-03-22T17:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
    ],
    "vintage_tools_tom": [
        {
            "id": "tom-001",
            "title": "Stanley plane restoration drop-off",
            "counterpartName": "Harper",
            "date": "2025-11-02T18:40:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "tom-002",
            "title": "Cast-iron saw set appointment",
            "counterpartName": "Finn",
            "date": "2025-10-12T17:20:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "tom-003",
            "title": "Brass square calibration",
            "counterpartName": "Mason",
            "date": "2025-09-17T19:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "tom-004",
            "title": "Linseed care kit handover",
            "counterpartName": "Inez",
            "date": "2025-08-21T15:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "tom-005",
            "title": "Restoration guide workshop",
            "counterpartName": "Judge",
            "date": "2025-07-25T16:50:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "tom-006",
            "title": "Sharpening stone tutorial",
            "counterpartName": "Pam",
            "date": "2025-06-14T14:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "tom-007",
            "title": "Collector showcase staging",
            "counterpartName": "Orson",
            "date": "2025-05-08T19:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "tom-008",
            "title": "Antique lathe parts sourcing",
            "counterpartName": "Marla",
            "date": "2025-04-02T12:55:00Z",
            "status": "FAILED",
            "notes": "Supplier ran out of compatible bearings",
        },
    ],
    "minimal_decor_keiko": [
        {
            "id": "keiko-001",
            "title": "Origami lamp loft install",
            "counterpartName": "Aya",
            "date": "2025-11-07T21:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "keiko-002",
            "title": "Ceramic bonsai planter styling",
            "counterpartName": "Noah",
            "date": "2025-10-22T18:40:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "keiko-003",
            "title": "Bamboo shelving custom fit",
            "counterpartName": "Wes",
            "date": "2025-09-29T20:10:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "keiko-004",
            "title": "Matcha tray centerpiece design",
            "counterpartName": "Iris",
            "date": "2025-08-19T19:20:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "keiko-005",
            "title": "Balance stones mindfulness set",
            "counterpartName": "Luz",
            "date": "2025-07-31T18:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "keiko-006",
            "title": "Incense holder gallery event",
            "counterpartName": "Dev",
            "date": "2025-06-27T17:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "keiko-007",
            "title": "Zen micro-apartment consult",
            "counterpartName": "Kai",
            "date": "2025-05-06T14:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "keiko-008",
            "title": "Studio install reschedule",
            "counterpartName": "SOMA Hub",
            "date": "2025-03-25T16:25:00Z",
            "status": "CANCELLED",
            "notes": "Client requested redesign for lighting plan",
        },
    ],
    "streetwear_jamal": [
        {
            "id": "jamal-001",
            "title": "Nike Dunk Low 'Panda' handoff",
            "counterpartName": "KC",
            "date": "2025-11-07T18:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "jamal-002",
            "title": "Yeezy Boost 350 'Zebra' flip",
            "counterpartName": "JB",
            "date": "2025-11-03T15:10:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "jamal-003",
            "title": "Supreme City Grid hoodie trade",
            "counterpartName": "MT",
            "date": "2025-10-27T16:25:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "jamal-004",
            "title": "Travis Scott AJ1 swap meet",
            "counterpartName": "AL",
            "date": "2025-10-12T14:50:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "jamal-005",
            "title": "Fear of God crewneck drop",
            "counterpartName": "JB",
            "date": "2025-09-02T17:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "jamal-006",
            "title": "Palace tri-ferg tee overnight ship",
            "counterpartName": "MT",
            "date": "2025-08-18T13:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "jamal-007",
            "title": "Sneaker summit raffle assist",
            "counterpartName": "JB",
            "date": "2025-07-23T21:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "jamal-008",
            "title": "Streetwear livestream no-show",
            "counterpartName": "KC",
            "date": "2025-07-05T18:00:00Z",
            "status": "FAILED",
            "notes": "Buyer missed scheduled livestream pickup",
        },
    ],
    "edu_kits_lena": [
        {
            "id": "lena-001",
            "title": "DIY microscope fair delivery",
            "counterpartName": "Aria",
            "date": "2025-11-02T13:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "lena-002",
            "title": "Chemistry reaction box lab",
            "counterpartName": "Bo",
            "date": "2025-10-15T16:20:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "lena-003",
            "title": "Solar puzzle STEM night",
            "counterpartName": "Jules",
            "date": "2025-09-25T18:30:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "lena-004",
            "title": "Phonics magnet classroom kit",
            "counterpartName": "Kim",
            "date": "2025-08-31T15:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "lena-005",
            "title": "Circuits discovery box workshop",
            "counterpartName": "Mon",
            "date": "2025-07-28T20:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "lena-006",
            "title": "Planetarium projector kit install",
            "counterpartName": "Rio",
            "date": "2025-06-19T17:40:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "lena-007",
            "title": "Teacher training webinar",
            "counterpartName": "STEM Lab",
            "date": "2025-05-09T19:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "lena-008",
            "title": "Safety certification renewal",
            "counterpartName": "City Schools",
            "date": "2025-03-27T12:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
    ],
    "smart_home_omar": [
        {
            "id": "omar-001",
            "title": "Pi controller install with Zigbee",
            "counterpartName": "Nikhil",
            "date": "2025-11-06T20:40:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "omar-002",
            "title": "Motion automation script setup",
            "counterpartName": "Safa",
            "date": "2025-10-11T18:25:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "omar-003",
            "title": "Indoor camera firmware handoff",
            "counterpartName": "Wren",
            "date": "2025-09-22T19:35:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "omar-004",
            "title": "Smart thermostat relay retrofit",
            "counterpartName": "El",
            "date": "2025-08-16T17:15:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "omar-005",
            "title": "Rain sensor garden automation",
            "counterpartName": "Jia",
            "date": "2025-07-19T15:45:00Z",
            "status": "SUCCESS",
            "ratingGiven": 4,
        },
        {
            "id": "omar-006",
            "title": "Entryway smart lock firmware push",
            "counterpartName": "Hugo",
            "date": "2025-06-24T20:05:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "omar-007",
            "title": "Home lab GitHub training",
            "counterpartName": "UW Robotics",
            "date": "2025-05-18T22:00:00Z",
            "status": "SUCCESS",
            "ratingGiven": 5,
        },
        {
            "id": "omar-008",
            "title": "Sensor array parts shortage",
            "counterpartName": "Makers Co",
            "date": "2025-04-01T19:25:00Z",
            "status": "FAILED",
            "notes": "Vendor backorder delayed automation install",
        },
    ],
}


WORD_RE = re.compile(r"[A-Za-z0-9']+")


def tokenize(text: Optional[str]) -> List[str]:
    if not text:
        return []
    return [token.lower() for token in WORD_RE.findall(str(text)) if len(token) > 2]


def tokens_from_iterable(values: Optional[Iterable[Any]]) -> Set[str]:
    tokens: Set[str] = set()
    if not values:
        return tokens
    for value in values:
        tokens.update(tokenize(value))
    return tokens


def build_seller_keyword_index() -> Dict[str, Set[str]]:
    index: Dict[str, Set[str]] = {}
    for entry in DEMO_SELLER_PROFILES:
        tokens: Set[str] = set()
        tokens.update(tokenize(entry.get("raw_text")))

        parsed_profile = entry.get("parsed_profile") or {}
        tokens.update(tokens_from_iterable(parsed_profile.get("profile_keywords")))
        tokens.update(tokens_from_iterable(parsed_profile.get("related_categories_of_interest")))

        for summary in parsed_profile.get("sales_history_summary") or []:
            tokens.update(tokenize(summary.get("category")))
            tokens.update(tokens_from_iterable(summary.get("item_examples")))

        representative_item = entry.get("representative_item") or {}
        item_meta = representative_item.get("item_meta") or {}
        tokens.update(tokenize(item_meta.get("parsed_item")))
        tokens.update(tokens_from_iterable(item_meta.get("tags")))

        item_context = representative_item.get("context") or {}
        tokens.update(tokenize(item_context.get("original_text")))

        index[entry["user_id"]] = {token for token in tokens if token}
    return index


SELLER_KEYWORD_INDEX = build_seller_keyword_index()

SELLER_CATEGORY_BY_USER: Dict[str, Optional[str]] = {
    entry["user_id"]: ((entry.get("representative_item") or {}).get("item_meta") or {}).get("category")
    for entry in DEMO_SELLER_PROFILES
}

_category_keywords: Dict[str, Set[str]] = defaultdict(set)
_category_canonical: Dict[str, str] = {}
for entry in DEMO_SELLER_PROFILES:
    category = ((entry.get("representative_item") or {}).get("item_meta") or {}).get("category")
    if not category:
        continue
    key = category.lower()
    _category_canonical.setdefault(key, category)
    _category_keywords[key].update(SELLER_KEYWORD_INDEX.get(entry["user_id"], set()))

CATEGORY_KEYWORD_INDEX: Dict[str, Tuple[str, Set[str]]] = {
    key: (_category_canonical[key], keywords)
    for key, keywords in _category_keywords.items()
}


def infer_category_from_tokens(tokens: Set[str]) -> Optional[str]:
    best_category: Optional[str] = None
    best_score = 0
    for key, (canonical, keywords) in CATEGORY_KEYWORD_INDEX.items():
        score = len(tokens & keywords)
        if score > best_score:
            best_score = score
            best_category = canonical
    if best_category and best_score >= 2:
        return best_category
    return None


def extract_request_tokens(request_record: Dict[str, Any]) -> Set[str]:
    tokens: Set[str] = set()
    tokens.update(tokenize(request_record.get("raw_text")))

    parsed_request = request_record.get("parsed_request") or {}
    item_meta = parsed_request.get("item_meta") or {}
    tokens.update(tokenize(item_meta.get("parsed_item")))
    tokens.update(tokenize(item_meta.get("category")))
    tokens.update(tokens_from_iterable(item_meta.get("tags")))

    context = parsed_request.get("context") or {}
    tokens.update(tokenize(context.get("reason")))
    tokens.update(tokenize(context.get("original_text")))

    location = parsed_request.get("location") or {}
    tokens.update(tokenize(location.get("text_input")))

    metadata = request_record.get("metadata") or {}
    tokens.update(tokens_from_iterable(metadata.values() if isinstance(metadata, dict) else []))

    return {token for token in tokens if token}


def _format_display_name(user_id: str) -> str:
    return " ".join(part.capitalize() for part in user_id.split("_"))


def build_profile_history_summary(user_id: str, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_transactions = len(transactions)
    successful = [t for t in transactions if t.get("status") == "SUCCESS"]
    rating_values = [t.get("ratingGiven", 0) for t in successful if t.get("ratingGiven")]
    average_rating = round(sum(rating_values) / len(rating_values), 2) if rating_values else 0.0

    return {
        "userId": user_id,
        "displayName": _format_display_name(user_id),
        "avatarUrl": None,
        "totalTransactions": total_transactions,
        "successfulTransactions": len(successful),
        "averageRating": average_rating,
        "ratingCount": len(rating_values),
    }


app = FastAPI(
    title="Flash Matchmaker Service",
    version="0.1.0",
    description="Glue layer between the Gemini parsers, matching model, and UI.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FlashRequestCreate(BaseModel):
    text: str = Field(..., description="Raw flash request free-form text")
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional structured metadata collected from the UI wizard.",
    )


class SellerProfileCreate(BaseModel):
    user_id: str = Field(..., description="Stable identifier supplied by the client/UI")
    text: str = Field(..., description="Seller profile free-form text blob to parse")
    metadata: Optional[Dict[str, Any]] = None


class PingMatchesRequest(BaseModel):
    matchIds: List[str] = Field(default_factory=list)
    broadcastType: Optional[str] = Field(
        default=None, description="Either 'narrow', 'wide', or omitted for direct pings"
    )


flash_requests: Dict[str, Dict[str, Any]] = {}
seller_profiles: Dict[str, Dict[str, Any]] = {}


async def call_gemini_parser(endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    url = f"{GEMINI_SERVICE_URL.rstrip('/')}{endpoint}"
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail={
                "message": "Gemini parsing service returned an error",
                "payload": exc.response.json() if exc.response.content else None,
            },
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail={"message": f"Gemini parsing service is unavailable: {exc}"},
        ) from exc


def urgency_from_ui(urgency_idx: Optional[int]) -> Optional[str]:
    if urgency_idx is None:
        return None
    mapping = {
        0: "immediate",
        1: "high",
        2: "medium",
        3: "low",
    }
    return mapping.get(int(urgency_idx))


def apply_request_metadata(parsed: Dict[str, Any], metadata: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    if not metadata:
        return parsed

    parsed = json.loads(json.dumps(parsed))  # deep copy to avoid aliasing

    item_meta = parsed.setdefault("item_meta", {})
    context = parsed.setdefault("context", {})
    location = parsed.setdefault("location", {})
    transaction = parsed.setdefault("transaction", {})

    detected_category = metadata.get("detectedCategory") or metadata.get("category")
    if detected_category:
        item_meta["category"] = detected_category

    quantity = metadata.get("quantity")
    if quantity:
        tags = set(item_meta.get("tags") or [])
        tags.add(f"quantity:{quantity}")
        item_meta["tags"] = sorted(tags)

    when_text = metadata.get("when")
    if when_text:
        context["reason"] = when_text

    location_text = metadata.get("location")
    if location_text:
        location["text_input"] = location_text

    urgency_value = metadata.get("urgency")
    urgency_label = urgency_from_ui(urgency_value)
    if urgency_label:
        context["urgency"] = urgency_label

    price_max = metadata.get("priceMax")
    if price_max is not None:
        try:
            transaction["price_max"] = float(price_max)
        except (TypeError, ValueError):
            pass

    return parsed


def build_representative_item(profile: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    history: List[Dict[str, Any]] = profile.get("sales_history_summary") or []
    if not history:
        return None

    best_entry = max(history, key=lambda entry: entry.get("total_items_sold") or 0)
    examples = best_entry.get("item_examples") or []
    parsed_item = next(
        (example for example in examples if isinstance(example, str) and example.strip()),
        best_entry.get("category"),
    )

    inferred_locations = profile.get("inferred_location_keywords") or []
    location_text = next(
        (loc for loc in inferred_locations if isinstance(loc, str) and loc.strip()),
        None,
    )

    dominant = profile.get("overall_dominant_transaction_type") or "sell"
    if dominant not in {"sell", "lend", "buy"}:
        dominant = "sell"

    avg_price = best_entry.get("avg_price_per_item")

    representative = {
        "schema_type": "FLASH_REQUEST",
        "item_meta": {
            "parsed_item": parsed_item or best_entry.get("category") or "",
            "category": best_entry.get("category") or "",
            "tags": examples[1:4],
        },
        "transaction": {
            "type_preferred": dominant,
            "type_acceptable": [dominant],
            "price_max": avg_price,
            "price": avg_price,
        },
        "context": {
            "urgency": "medium",
            "reason": "Derived from seller profile history",
            "original_text": "; ".join(examples[:3]) or best_entry.get("category") or "",
        },
        "location": {
            "text_input": location_text,
            "device_gps": None,
        },
    }
    return representative


def pseudo_random(seed_input: str) -> random.Random:
    seed = hash(seed_input) & 0xFFFFFFFF
    return random.Random(seed)


def display_name_from_user_id(user_id: str) -> str:
    if not user_id:
        return "Unknown Seller"
    cleaned = user_id.replace("_", " ").replace("-", " ").strip()
    parts = cleaned.split()
    return " ".join(part.capitalize() for part in parts if part)


def score_profile_for_ui(profile: Dict[str, Any], request_id: str) -> Dict[str, Any]:
    rng = pseudo_random(f"{profile.get('user_id')}::{request_id}")
    rating = round(rng.uniform(4.2, 4.95), 2)
    trust_score = int(rng.uniform(78, 98))
    past_trades = int(rng.uniform(8, 45))
    badges = []
    if trust_score > 90:
        badges.append("Top Helper")
    if rng.random() > 0.3:
        badges.append("Verified Student")
    return {
        "rating": rating,
        "trustScore": trust_score,
        "pastTrades": past_trades,
        "badges": badges,
    }


def compute_shared_traits(request: Dict[str, Any], profile: Dict[str, Any], item: Optional[Dict[str, Any]]) -> List[str]:
    traits: List[str] = []
    request_category = (request.get("item_meta") or {}).get("category")
    item_category = (item or {}).get("item_meta", {}).get("category") if item else None
    seller_major = profile.get("inferred_major")

    if request_category and item_category and request_category.lower() == item_category.lower():
        traits.append("Same category speciality")
    if seller_major:
        traits.append(f"{seller_major} major")
    location_keywords = profile.get("inferred_location_keywords") or []
    if location_keywords:
        traits.append(f"Near {location_keywords[0]}")
    if not traits:
        traits.append("Active campus seller")
    return traits


def encode_and_score(request_record: Dict[str, Any], profile_record: Dict[str, Any]) -> Tuple[float, List[Tuple[str, float]]]:
    feature_row, activated = encoder.encode(
        request_record["parsed_request"],
        profile_record["parsed_profile"],
        profile_record.get("representative_item"),
    )
    probabilities = model.predict_proba([feature_row])[0]
    probability = float(probabilities[positive_class_index])
    return probability, activated


def seed_profiles_from_synthetic(limit: int = 150) -> int:
    if not SYNTHETIC_DATA_DIR.exists():
        return 0
    loaded = 0
    for json_path in sorted(SYNTHETIC_DATA_DIR.glob("*.json")):
        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        seller_profile = data.get("seller_profile")
        actual_item = data.get("actual_item")
        if not seller_profile or not seller_profile.get("user_id"):
            continue
        user_id = seller_profile["user_id"]
        if user_id in seller_profiles:
            continue
        seller_profiles[user_id] = {
            "user_id": user_id,
            "parsed_profile": seller_profile,
            "raw_text": (seller_profile.get("context") or {}).get("original_text"),
            "representative_item": actual_item,
            "created_at": datetime.utcnow().isoformat(),
            "source": "synthetic",
            "metadata": {"seed_path": str(json_path)},
        }
        loaded += 1
        if limit and loaded >= limit:
            break
    return loaded


def load_demo_profiles() -> int:
    global seller_profiles
    seller_profiles.clear()
    inserted = 0
    for entry in DEMO_SELLER_PROFILES:
        user_id = entry["user_id"]
        if user_id in seller_profiles:
            continue
        seller_profiles[user_id] = {
            "user_id": user_id,
            "parsed_profile": entry["parsed_profile"],
            "raw_text": entry.get("raw_text"),
            "representative_item": entry.get("representative_item"),
            "created_at": datetime.utcnow().isoformat(),
            "source": "demo",
            "metadata": {"note": "demo_profile"},
        }
        inserted += 1
    return inserted


def build_match_payload(request_id: str, request_record: Dict[str, Any]) -> Dict[str, Any]:
    matches: List[Dict[str, Any]] = []
    parsed_request = request_record.get("parsed_request") or {}
    item_meta = parsed_request.setdefault("item_meta", {}) or {}

    request_tokens = extract_request_tokens(request_record)
    request_category = (item_meta.get("category") or "").strip()

    if not request_category:
        inferred_category = infer_category_from_tokens(request_tokens)
        if inferred_category:
            item_meta["category"] = inferred_category
            request_category = inferred_category

    request_tag_tokens: Set[str] = set()
    for tag in item_meta.get("tags") or []:
        request_tag_tokens.update(tokenize(tag))

    for profile in seller_profiles.values():
        probability, activated = encode_and_score(request_record, profile)
        rng = pseudo_random(f"{request_id}::{profile['user_id']}")
        distance_minutes = round(rng.uniform(0.2, 3.5), 2)
        traits = compute_shared_traits(
            request_record["parsed_request"],
            profile["parsed_profile"],
            profile.get("representative_item"),
        )

        seller_id = profile["user_id"]
        seller_keywords = SELLER_KEYWORD_INDEX.get(seller_id, set())
        keyword_overlap = len(request_tokens & seller_keywords)

        representative_item = profile.get("representative_item") or {}
        rep_item_meta = representative_item.get("item_meta") or {}
        rep_category = (rep_item_meta.get("category") or "").strip()
        category_match = (
            bool(request_category)
            and bool(rep_category)
            and request_category.lower() == rep_category.lower()
        )

        seller_tag_tokens: Set[str] = set()
        for tag in rep_item_meta.get("tags") or []:
            seller_tag_tokens.update(tokenize(tag))
        tag_overlap = len(request_tag_tokens & seller_tag_tokens)

        boost = min(keyword_overlap * 0.05, 0.25)
        if category_match:
            boost += 0.15
        if tag_overlap:
            boost += min(tag_overlap * 0.04, 0.12)

        boosted_probability = min(probability + boost, 0.999)

        ui_stats = score_profile_for_ui(profile["parsed_profile"], request_id)
        matches.append(
            {
                "user": {
                    "id": profile["user_id"],
                    "name": display_name_from_user_id(profile["user_id"]),
                    "major": profile["parsed_profile"].get("inferred_major") or "Undeclared",
                    "dorm": (profile["parsed_profile"].get("inferred_location_keywords") or ["On campus"])[0],
                    "verified": "Verified Student" in ui_stats["badges"],
                    **ui_stats,
                },
                "likelihood": round(boosted_probability * 100, 1),
                "distanceMin": distance_minutes,
                "sharedTraits": traits,
                "debug": {
                    "probability": boosted_probability,
                    "modelProbability": probability,
                    "activatedFeatures": activated[:40],
                    "representativeItem": profile.get("representative_item"),
                    "sellerProfile": profile.get("parsed_profile"),
                    "source": profile.get("source"),
                    "heuristics": {
                        "keywordOverlap": keyword_overlap,
                        "categoryMatch": category_match,
                        "tagOverlap": tag_overlap,
                        "boostApplied": round(max(boosted_probability - probability, 0.0), 4),
                    },
                },
            }
        )

    matches.sort(key=lambda item: item["likelihood"], reverse=True)
    diversified: List[Dict[str, Any]] = []
    seen_categories: set[str] = set()
    for match in matches:
        category = (
            (match.get("debug") or {})
            .get("representativeItem", {})
            .get("item_meta", {})
            .get("category")
        )
        normalized = category.lower() if isinstance(category, str) else None
        if normalized and normalized in seen_categories:
            continue
        if normalized:
            seen_categories.add(normalized)
        diversified.append(match)
        if len(diversified) >= 10:
            break

    if len(diversified) < min(len(matches), 25):
        for match in matches:
            if match in diversified:
                continue
            diversified.append(match)
            if len(diversified) >= min(len(matches), 25):
                break

    top_matches = diversified

    return {
        "success": True,
        "requestId": request_id,
        "request": request_record["parsed_request"],
        "matches": top_matches,
        "debug": {
            "model": {
                "type": type(model).__name__,
                "positiveClassIndex": positive_class_index,
                "featureCount": len(model_columns),
                "artifact": MODEL_PATH.name,
            },
            "requestMetadata": request_record.get("metadata"),
            "generatedAt": datetime.utcnow().isoformat(),
        },
    }


@app.on_event("startup")
async def startup_event() -> None:
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, load_demo_profiles)


@app.get("/health")
async def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "modelLoaded": MODEL_PATH.name,
        "profiles": len(seller_profiles),
        "requests": len(flash_requests),
    }


@app.post("/api/flash-requests")
async def create_flash_request(payload: FlashRequestCreate) -> Dict[str, Any]:
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Flash request text cannot be empty.")

    parsed = await call_gemini_parser("/api/parse-request", {"text": payload.text})
    parsed = apply_request_metadata(parsed, payload.metadata)

    request_id = str(uuid.uuid4())
    flash_requests[request_id] = {
        "id": request_id,
        "raw_text": payload.text,
        "parsed_request": parsed,
        "created_at": datetime.utcnow().isoformat(),
        "metadata": payload.metadata or {},
    }

    return build_match_payload(request_id, flash_requests[request_id])


@app.get("/api/flash-requests/{request_id}")
async def get_flash_request(request_id: str) -> Dict[str, Any]:
    record = flash_requests.get(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Flash request not found.")
    return {
        "success": True,
        "requestId": request_id,
        "request": record["parsed_request"],
        "metadata": record.get("metadata"),
    }


@app.get("/api/flash-requests/{request_id}/matches")
async def get_flash_request_matches(request_id: str) -> Dict[str, Any]:
    record = flash_requests.get(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Flash request not found.")
    return build_match_payload(request_id, record)


@app.post("/api/profiles")
async def create_seller_profile(payload: SellerProfileCreate) -> Dict[str, Any]:
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Seller profile text cannot be empty.")

    parsed_profile = await call_gemini_parser(
        "/api/parse-profile", {"text": payload.text, "userId": payload.user_id}
    )

    representative_item = build_representative_item(parsed_profile)

    seller_profiles[payload.user_id] = {
        "user_id": payload.user_id,
        "raw_text": payload.text,
        "parsed_profile": parsed_profile,
        "representative_item": representative_item,
        "created_at": datetime.utcnow().isoformat(),
        "source": "live",
        "metadata": payload.metadata or {},
    }

    return {
        "success": True,
        "profile": parsed_profile,
        "representativeItem": representative_item,
        "totalProfiles": len(seller_profiles),
    }


@app.get("/api/profiles")
async def list_profiles() -> Dict[str, Any]:
    summaries = [
        {
            "userId": profile["user_id"],
            "source": profile.get("source"),
            "createdAt": profile.get("created_at"),
            "inferredMajor": profile["parsed_profile"].get("inferred_major"),
            "dominantTransactionType": profile["parsed_profile"].get(
                "overall_dominant_transaction_type"
            ),
        }
        for profile in seller_profiles.values()
    ]
    summaries.sort(key=lambda entry: entry["userId"])
    return {"success": True, "profiles": summaries}


@app.post("/api/profiles/seed")
async def seed_profiles(limit: int = 150) -> Dict[str, Any]:
    loop = asyncio.get_event_loop()
    loaded = await loop.run_in_executor(None, seed_profiles_from_synthetic, limit)
    return {
        "success": True,
        "loaded": loaded,
        "totalProfiles": len(seller_profiles),
    }


@app.post("/api/flash-requests/{request_id}/pings")
async def send_pings(request_id: str, payload: PingMatchesRequest) -> Dict[str, Any]:
    record = flash_requests.get(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Flash request not found.")
    entry = {
        "matchIds": payload.matchIds,
        "broadcastType": payload.broadcastType,
        "timestamp": datetime.utcnow().isoformat(),
    }
    record.setdefault("pings", []).append(entry)
    return {
        "success": True,
        "pinged": len(payload.matchIds),
        "broadcastType": payload.broadcastType,
    }


@app.get("/api/profiles/{user_id}/history")
async def get_profile_history(user_id: str, cursor: Optional[int] = None) -> Dict[str, Any]:
    history = DEMO_PROFILE_HISTORY.get(user_id)
    if history is None:
        raise HTTPException(status_code=404, detail="Profile history not found.")

    start = cursor or 0
    if start < 0:
        start = 0

    page_size = 10
    end = start + page_size
    transactions = history[start:end]
    next_cursor = None if end >= len(history) else str(end)

    summary = build_profile_history_summary(user_id, history)

    return {
        "summary": summary,
        "transactions": transactions,
        "nextCursor": next_cursor,
    }

