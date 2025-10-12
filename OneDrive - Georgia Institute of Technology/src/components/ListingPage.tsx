import { MapPin, Star, Shield, MessageCircle, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import { useState } from 'react';
import { BookingModal } from './BookingModal';
import { Listing } from './ListingCard';

interface ListingPageProps {
  listingId: string;
  onBack: () => void;
}

export function ListingPage({ listingId, onBack }: ListingPageProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  // Mock listing data - in real app would fetch based on listingId
  const listing = {
    id: listingId,
    title: 'Modern Apartment near Stadium',
    host: 'Maria Silva',
    hostImage: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=200&h=200&fit=crop',
    community: 'Brazil Fan',
    location: 'São Paulo, Brazil',
    price: 75,
    matchDayPrice: 120,
    rating: 4.9,
    reviews: 47,
    verified: true,
    image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjAyMzg0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Spacious modern apartment just 15 minutes from the stadium. Perfect for match days! Includes high-speed WiFi, fully equipped kitchen, and a comfortable living space.',
    amenities: ['WiFi', 'Kitchen', 'AC', 'TV', 'Parking'],
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    responseTime: '< 1 hour',
    hostSince: '2022',
  };

  const similarListings: Listing[] = [
    {
      id: '2',
      title: 'Cozy Studio in City Center',
      host: 'Ahmed Hassan',
      hostImage: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'Argentina Fan',
      location: 'Buenos Aires',
      price: 60,
      rating: 4.8,
      verified: true,
      image: 'https://images.unsplash.com/photo-1703782498522-f9c2b9c1bc25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjAyNTUyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '3',
      title: 'Luxury Villa with Pool',
      host: 'Sophie Martin',
      hostImage: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'France Fan',
      location: 'Paris',
      price: 150,
      rating: 5.0,
      verified: true,
      image: 'https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDI1NTY3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 color:bg-gradient-to-br color:from-pink-100 color:via-purple-100 color:to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 color:text-purple-700 hover:bg-gray-100 dark:hover:bg-gray-800 color:hover:bg-purple-200"
        >
          ← Back to listings
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden h-96 shadow-lg"
            >
              <ImageWithFallback
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 color:text-purple-700">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{listing.rating} ({listing.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Host Info */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <div className="flex items-start gap-4">
                <ImageWithFallback
                  src={listing.hostImage}
                  alt={listing.host}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900">{listing.host}</h3>
                    {listing.verified && (
                      <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 color:text-purple-600 fill-current" />
                    )}
                  </div>
                  <Badge variant="secondary" className="mb-3 bg-gray-100 dark:bg-gray-700 color:bg-purple-200 text-gray-700 dark:text-gray-300 color:text-purple-900">
                    {listing.community}
                  </Badge>
                  <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400 color:text-purple-700">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Host since {listing.hostSince}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Responds in {listing.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <div>
              <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-3">About this space</h3>
              <p className="text-gray-600 dark:text-gray-400 color:text-purple-700">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 color:border-purple-400 text-gray-700 dark:text-gray-300 color:text-purple-800"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card - Sticky */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-gradient-to-br color:from-white/90 color:to-purple-50/90 shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-teal-600 dark:text-teal-400 color:text-purple-700">${listing.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 color:text-purple-600">/night</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 color:text-purple-700">
                  ${listing.matchDayPrice} on match days
                </p>
              </div>

              <Separator className="mb-6" />

              <div className="space-y-3 mb-6 text-gray-700 dark:text-gray-300 color:text-purple-800">
                <div className="flex items-center justify-between">
                  <span>Bedrooms</span>
                  <span>{listing.bedrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bathrooms</span>
                  <span>{listing.bathrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max guests</span>
                  <span>{listing.guests}</span>
                </div>
              </div>

              <Button
                onClick={() => setBookingOpen(true)}
                className="w-full mb-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white"
              >
                Book Stay
              </Button>

              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 color:border-purple-400 text-gray-700 dark:text-gray-300 color:text-purple-800 hover:bg-gray-100 dark:hover:bg-gray-700 color:hover:bg-purple-100"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Host
              </Button>
            </Card>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-12">
          <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-6">Similar Stays Nearby</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarListings.map((similar) => {
              const ListingCard = require('./ListingCard').ListingCard;
              return (
                <ListingCard
                  key={similar.id}
                  listing={similar}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        </div>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        listing={listing}
        onConfirm={() => {}}
      />
    </div>
  );
}
