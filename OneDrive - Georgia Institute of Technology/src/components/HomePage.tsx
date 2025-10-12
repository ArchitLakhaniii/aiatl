import { Search, TrendingUp, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ListingCard, Listing } from './ListingCard';
import { motion } from 'motion/react';

interface HomePageProps {
  onViewListing: (id: string) => void;
}

export function HomePage({ onViewListing }: HomePageProps) {
  const featuredListings: Listing[] = [
    {
      id: '1',
      title: 'Modern Apartment near Stadium',
      host: 'Maria Silva',
      hostImage: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'Brazil Fan',
      location: 'São Paulo',
      price: 75,
      rating: 4.9,
      verified: true,
      image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjAyMzg0MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      matchDay: true,
    },
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
    {
      id: '4',
      title: 'Fan House with Great Views',
      host: 'Carlos Rodriguez',
      hostImage: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'Spain Fan',
      location: 'Madrid',
      price: 85,
      rating: 4.7,
      verified: true,
      image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjAyNjM4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      matchDay: true,
    },
  ];

  const trendingCities = [
    { name: 'Atlanta', matches: 8 },
    { name: 'Rio de Janeiro', matches: 7 },
    { name: 'Buenos Aires', matches: 6 },
    { name: 'Madrid', matches: 7 },
    { name: 'Paris', matches: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 color:bg-gradient-to-br color:from-pink-100 color:via-purple-100 color:to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-800 dark:to-blue-800 color:from-purple-600 color:via-pink-600 color:to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-white mb-4">
              Find Stays Near Upcoming Matches
            </h1>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with verified fans worldwide. Affordable, trustworthy accommodations for the ultimate World Cup experience.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 color:bg-white/95 p-2 rounded-2xl shadow-2xl">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="City, stadium, or team..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white rounded-xl px-8">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-gray-50 dark:fill-gray-950 color:fill-pink-100"
            />
          </svg>
        </div>
      </div>

      {/* Trending Cities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400 color:text-purple-600" />
          <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Trending Cities</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {trendingCities.map((city, idx) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 color:bg-white/80 border border-gray-200 dark:border-gray-700 color:border-purple-300 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 color:text-purple-600" />
                <span className="text-gray-900 dark:text-gray-100 color:text-purple-900">{city.name}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 color:text-purple-700">
                {city.matches} matches
              </p>
            </motion.div>
          ))}
        </div>

        {/* Featured Listings */}
        <div className="mb-6">
          <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-6">Featured Stays</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing, idx) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ListingCard listing={listing} onClick={onViewListing} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
