import { Calendar, MapPin, Star, TrendingUp, MessageCircle, Award, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Slider } from './ui/slider';

export function DashboardPage() {
  const [satisfaction, setSatisfaction] = useState([8]);
  const [submitted, setSubmitted] = useState(false);

  const upcomingStays = [
    {
      id: '1',
      title: 'Modern Apartment near Stadium',
      host: 'Maria Silva',
      location: 'São Paulo, Brazil',
      checkIn: 'June 15, 2025',
      checkOut: 'June 18, 2025',
      image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?w=400&h=300&fit=crop',
      price: 225,
    },
  ];

  const pastStays = [
    {
      id: '2',
      title: 'Cozy Studio in City Center',
      host: 'Ahmed Hassan',
      location: 'Buenos Aires, Argentina',
      checkIn: 'May 10, 2025',
      checkOut: 'May 13, 2025',
      image: 'https://images.unsplash.com/photo-1703782498522-f9c2b9c1bc25?w=400&h=300&fit=crop',
      rating: 5,
    },
  ];

  const recommendations = [
    {
      title: 'Match Day Apartment',
      location: 'Madrid, Spain',
      compatibility: 92,
      price: 95,
      image: 'https://images.unsplash.com/photo-1493134799591-2c9eed26201a?w=400&h=300&fit=crop',
    },
    {
      title: 'Fan Zone House',
      location: 'Paris, France',
      compatibility: 88,
      price: 120,
      image: 'https://images.unsplash.com/photo-1679364297777-1db77b6199be?w=400&h=300&fit=crop',
    },
  ];

  const stats = {
    totalStays: 3,
    countries: 2,
    reviewsGiven: 3,
    trustScore: 95,
  };

  const handleSubmitFeedback = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 color:bg-gradient-to-br color:from-pink-100 color:via-purple-100 color:to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 color:text-purple-700">
            Manage your stays and track your journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Stays', value: stats.totalStays, icon: Calendar, color: 'teal' },
            { label: 'Countries', value: stats.countries, icon: MapPin, color: 'blue' },
            { label: 'Reviews Given', value: stats.reviewsGiven, icon: Star, color: 'yellow' },
            { label: 'Trust Score', value: `${stats.trustScore}%`, icon: Award, color: 'purple' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-4 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900 color:bg-purple-200`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400 color:text-purple-700`} />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 color:text-purple-600">{stat.label}</p>
                      <p className="text-gray-900 dark:text-gray-100 color:text-purple-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Stays */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-4">Upcoming Stays</h2>
              {upcomingStays.map((stay) => (
                <div key={stay.id} className="flex gap-4">
                  <ImageWithFallback
                    src={stay.image}
                    alt={stay.title}
                    className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-1">{stay.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 mb-3">
                      Hosted by {stay.host}
                    </p>
                    <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-400 color:text-purple-700 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{stay.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{stay.checkIn} - {stay.checkOut}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 color:border-purple-400"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message Host
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Card>

            {/* Past Stays */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-4">Past Stays</h2>
              <div className="space-y-4">
                {pastStays.map((stay) => (
                  <div key={stay.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 color:hover:bg-purple-100/50 transition-colors">
                    <ImageWithFallback
                      src={stay.image}
                      alt={stay.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-1">
                            {stay.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 mb-2">
                            {stay.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-700 dark:text-gray-300 color:text-purple-800">{stay.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-500 color:text-purple-600">
                        {stay.checkIn} - {stay.checkOut}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Feedback Section */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400 color:text-purple-600" />
                <h2 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Help Us Improve</h2>
              </div>
              
              {!submitted ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 mb-4">
                    How satisfied are you with YABI? (0-10)
                  </p>
                  <div className="mb-6">
                    <Slider
                      value={satisfaction}
                      onValueChange={setSatisfaction}
                      max={10}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 color:text-purple-600">
                      <span>Not satisfied</span>
                      <span className="text-teal-600 dark:text-teal-400 color:text-purple-700">{satisfaction[0]}/10</span>
                      <span>Very satisfied</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleSubmitFeedback}
                    className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white"
                  >
                    Submit Feedback
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-teal-600 dark:text-teal-400 color:text-purple-700">
                    Thank you for your feedback! 🎉
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-gradient-to-br color:from-white/90 color:to-purple-50/90">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 color:text-purple-600" />
                <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Recommended for You</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 mb-4">
                Based on your preferences and past stays
              </p>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 color:border-purple-300 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <ImageWithFallback
                      src={rec.image}
                      alt={rec.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 mb-2">
                        {rec.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-teal-100 dark:bg-teal-900 color:bg-purple-200 text-teal-700 dark:text-teal-300 color:text-purple-900 border-0">
                          {rec.compatibility}% match
                        </Badge>
                        <span className="text-gray-900 dark:text-gray-100 color:text-purple-900">
                          ${rec.price}/night
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Engagement Stats */}
            <Card className="p-6 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-gradient-to-br color:from-white/90 color:to-purple-50/90">
              <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 color:text-purple-800">Profile Completion</span>
                    <span className="text-gray-700 dark:text-gray-300 color:text-purple-800">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <Separator />
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 color:text-purple-800">Community Engagement</span>
                    <span className="text-gray-700 dark:text-gray-300 color:text-purple-800">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
