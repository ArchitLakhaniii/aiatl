import { Users, Heart, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export function CommunityPage() {
  const nearbyFans = [
    {
      name: 'Carlos Rodriguez',
      image: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'Spain Fan',
      compatibility: 95,
      location: 'Madrid',
      attending: 'Spain vs Portugal - Jun 15',
    },
    {
      name: 'Sophie Martin',
      image: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'France Fan',
      compatibility: 88,
      location: 'Paris',
      attending: 'France vs Germany - Jun 18',
    },
    {
      name: 'Ahmed Hassan',
      image: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      community: 'Argentina Fan',
      compatibility: 92,
      location: 'Buenos Aires',
      attending: 'Argentina vs Brazil - Jun 20',
    },
  ];

  const localVendors = [
    {
      name: 'Fan Zone Cafe',
      type: 'Restaurant',
      discount: '20% off for YABI users',
      image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?w=400&h=300&fit=crop',
    },
    {
      name: 'Stadium Shuttle',
      type: 'Transportation',
      discount: 'Free rides on match days',
      image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400&h=300&fit=crop',
    },
  ];

  const upcomingMeetups = [
    {
      title: 'Pre-Match Meetup',
      date: 'June 15, 2025',
      location: 'Central Plaza',
      attendees: 24,
    },
    {
      title: 'Watch Party - Finals',
      date: 'July 18, 2025',
      location: 'Fan Zone Bar',
      attendees: 156,
    },
  ];

  const communityUpdates = [
    {
      user: 'Maria Silva',
      avatar: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      content: 'Just arrived in São Paulo! Looking forward to meeting fellow fans at tomorrow\'s match!',
      timestamp: '2 hours ago',
      likes: 12,
    },
    {
      user: 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      content: 'Amazing atmosphere at the stadium today! Best World Cup experience ever 🎉',
      timestamp: '5 hours ago',
      likes: 28,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 color:bg-gradient-to-br color:from-pink-100 color:via-purple-100 color:to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-2">Community</h1>
          <p className="text-gray-600 dark:text-gray-400 color:text-purple-700">
            Connect with fans, discover local spots, and join meetups
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Community Updates */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-4">Recent Updates</h2>
              <div className="space-y-6">
                {communityUpdates.map((update, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3"
                  >
                    <Avatar>
                      <AvatarImage src={update.avatar} />
                      <AvatarFallback>{update.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900 dark:text-gray-100 color:text-purple-900">
                          {update.user}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500 color:text-purple-600">
                          · {update.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 color:text-purple-800 mb-2">
                        {update.content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 dark:text-gray-400 color:text-purple-600 hover:text-teal-600 dark:hover:text-teal-400 color:hover:text-purple-800"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {update.likes}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Nearby Fans */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400 color:text-purple-600" />
                <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Nearby Fans</h2>
              </div>
              <div className="space-y-4">
                {nearbyFans.map((fan, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 color:hover:bg-purple-100/50 transition-colors"
                  >
                    <ImageWithFallback
                      src={fan.image}
                      alt={fan.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-900 dark:text-gray-100 color:text-purple-900">
                          {fan.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-teal-100 dark:bg-teal-900 color:bg-purple-200 text-teal-700 dark:text-teal-300 color:text-purple-900"
                        >
                          {fan.compatibility}% match
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="mb-2 bg-gray-100 dark:bg-gray-700 color:bg-purple-200 text-gray-700 dark:text-gray-300 color:text-purple-900">
                        {fan.community}
                      </Badge>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 color:text-purple-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{fan.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{fan.attending}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Local Vendors */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 color:text-purple-600" />
                <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Local Partners</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {localVendors.map((vendor, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 color:border-purple-300 hover:shadow-md transition-shadow"
                  >
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-1">
                        {vendor.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 color:text-purple-600 mb-2">
                        {vendor.type}
                      </p>
                      <Badge className="bg-teal-100 dark:bg-teal-900 color:bg-purple-200 text-teal-700 dark:text-teal-300 color:text-purple-900 border-0">
                        {vendor.discount}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Meetups */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-gradient-to-br color:from-white/90 color:to-purple-50/90">
              <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-4">Upcoming Meetups</h3>
              <div className="space-y-4">
                {upcomingMeetups.map((meetup, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 color:bg-purple-100/50 border border-gray-200 dark:border-gray-600 color:border-purple-300"
                  >
                    <h4 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-2">
                      {meetup.title}
                    </h4>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400 color:text-purple-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{meetup.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{meetup.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{meetup.attendees} attending</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white"
                    >
                      Join Meetup
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
