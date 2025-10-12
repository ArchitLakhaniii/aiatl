import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ListingPage } from './components/ListingPage';
import { CommunityPage } from './components/CommunityPage';
import { DashboardPage } from './components/DashboardPage';
import { MessagesPage } from './components/MessagesPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedListing(null);
  };

  const handleViewListing = (id: string) => {
    setSelectedListing(id);
    setCurrentPage('listing');
  };

  const renderPage = () => {
    if (currentPage === 'listing' && selectedListing) {
      return (
        <ListingPage
          listingId={selectedListing}
          onBack={() => setCurrentPage('home')}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onViewListing={handleViewListing} />;
      case 'community':
        return <CommunityPage />;
      case 'messages':
        return <MessagesPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <HomePage onViewListing={handleViewListing} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
