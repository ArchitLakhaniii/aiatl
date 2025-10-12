import { MapPin, Star, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export interface Listing {
  id: string;
  title: string;
  host: string;
  hostImage: string;
  community: string;
  location: string;
  price: number;
  rating: number;
  verified: boolean;
  image: string;
  matchDay?: boolean;
}

interface ListingCardProps {
  listing: Listing;
  onClick: (id: string) => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={() => onClick(listing.id)}
        className="overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-800 color:border-purple-400/30 bg-white dark:bg-gray-800 color:bg-gradient-to-br color:from-purple-500/10 color:to-pink-500/10 hover:shadow-lg transition-all duration-200"
      >
        <div className="relative h-48">
          <ImageWithFallback
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {listing.matchDay && (
            <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white border-0">
              Match Day
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900">{listing.title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-700 dark:text-gray-300 color:text-purple-800">{listing.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <ImageWithFallback
              src={listing.hostImage}
              alt={listing.host}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-gray-600 dark:text-gray-400 color:text-purple-700">{listing.host}</span>
            {listing.verified && (
              <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400 color:text-purple-600 fill-current" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 color:text-purple-600">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
            <div>
              <span className="text-teal-600 dark:text-teal-400 color:text-purple-700">${listing.price}</span>
              <span className="text-gray-500 dark:text-gray-400 color:text-purple-600">/night</span>
            </div>
          </div>

          <Badge variant="secondary" className="mt-3 bg-gray-100 dark:bg-gray-700 color:bg-purple-200 text-gray-700 dark:text-gray-300 color:text-purple-900">
            {listing.community}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}
