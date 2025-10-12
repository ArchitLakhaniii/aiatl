import { Send, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { motion } from 'motion/react';

export function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState('1');
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Maria Silva',
      avatar: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      lastMessage: 'Looking forward to your stay!',
      time: '2 min ago',
      unread: 2,
      listing: 'Modern Apartment near Stadium',
    },
    {
      id: '2',
      name: 'Carlos Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop',
      lastMessage: 'Thank you for the recommendation',
      time: '1 hour ago',
      unread: 0,
      listing: 'Fan House with Great Views',
    },
  ];

  const messages = [
    {
      id: '1',
      sender: 'Maria Silva',
      content: 'Hi! Thank you for booking my apartment. I\'m excited to host you!',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: '2',
      sender: 'You',
      content: 'Thanks! I\'m really looking forward to it. Is parking available?',
      time: '10:32 AM',
      isMe: true,
    },
    {
      id: '3',
      sender: 'Maria Silva',
      content: 'Yes, there\'s free parking right in front of the building. I\'ll send you all the details before your arrival.',
      time: '10:35 AM',
      isMe: false,
    },
    {
      id: '4',
      sender: 'You',
      content: 'Perfect! See you on June 15th.',
      time: '10:36 AM',
      isMe: true,
    },
    {
      id: '5',
      sender: 'Maria Silva',
      content: 'Looking forward to your stay!',
      time: '10:38 AM',
      isMe: false,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, would send message here
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 color:bg-gradient-to-br color:from-pink-100 color:via-purple-100 color:to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-gray-900 dark:text-gray-100 color:text-purple-900 mb-6">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6 min-h-[650px] mb-8">
          {/* Conversations List */}
          <Card className="lg:col-span-1 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80 flex flex-col h-[650px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 color:border-purple-300">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 color:bg-purple-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {conversations.map((conv, idx) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      selectedChat === conv.id
                        ? 'bg-teal-50 dark:bg-teal-900/20 color:bg-purple-200/50'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 color:hover:bg-purple-100/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-900 dark:text-gray-100 color:text-purple-900 truncate">
                            {conv.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500 color:text-purple-600 flex-shrink-0 ml-2">
                            {conv.time}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 color:text-purple-700 truncate mb-1">
                          {conv.lastMessage}
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 color:text-purple-600">
                          Re: {conv.listing}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 dark:bg-teal-500 color:bg-purple-600 text-white flex items-center justify-center">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 color:border-purple-300 bg-white dark:bg-gray-800 color:bg-white/80 flex flex-col h-[650px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 color:border-purple-300">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1656582117510-3a177bf866c3?w=100&h=100&fit=crop" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-gray-900 dark:text-gray-100 color:text-purple-900">Maria Silva</h3>
                  <p className="text-gray-500 dark:text-gray-400 color:text-purple-600">
                    Modern Apartment near Stadium
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.isMe
                          ? 'bg-teal-600 dark:bg-teal-700 color:bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 color:bg-purple-100 text-gray-900 dark:text-gray-100 color:text-purple-900'
                      }`}
                    >
                      <p className="mb-1">{msg.content}</p>
                      <p
                        className={`${
                          msg.isMe
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400 color:text-purple-600'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 color:border-purple-300">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 dark:bg-gray-700 color:bg-purple-100 border-0 focus-visible:ring-teal-600 dark:focus-visible:ring-teal-400 color:focus-visible:ring-purple-600"
                />
                <Button
                  onClick={handleSend}
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 color:bg-purple-600 color:hover:bg-purple-700 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
