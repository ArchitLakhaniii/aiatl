import { Home, Users, MessageCircle, User, Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { mode, setMode } = useTheme();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'dashboard', icon: User, label: 'Profile' },
  ];

  const cycleTheme = () => {
    const modes: Array<'light' | 'dark' | 'color'> = ['light', 'dark', 'color'];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setMode(nextMode);
  };

  const getThemeIcon = () => {
    if (mode === 'light') return <Sun className="w-5 h-5" />;
    if (mode === 'dark') return <Moon className="w-5 h-5" />;
    return <Palette className="w-5 h-5" />;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 color:bg-gradient-to-r color:from-purple-600 color:to-pink-600 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 color:border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onNavigate('home')}
          >
            <span className="text-teal-600 dark:text-teal-400 color:text-white">YABI</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`p-2 sm:px-4 sm:py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-teal-100 dark:bg-teal-900 color:bg-white/20 text-teal-600 dark:text-teal-400 color:text-white'
                      : 'text-gray-600 dark:text-gray-300 color:text-white/70 hover:bg-gray-100 dark:hover:bg-gray-800 color:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={cycleTheme}
              className="ml-2 p-2 rounded-full transition-all duration-200 bg-gray-100 dark:bg-gray-800 color:bg-white/20 text-gray-600 dark:text-gray-300 color:text-white hover:scale-110"
              title={`Current: ${mode} mode`}
            >
              {getThemeIcon()}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
