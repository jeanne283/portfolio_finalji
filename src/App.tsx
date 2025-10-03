import React, { useState, useEffect } from 'react';
import ModernNavigation from './components/ModernNavigation';
import Hero from './components/Hero';
import ModernAbout from './components/ModernAbout';
import Projects from './components/Projects';
import ModernContact from './components/ModernContact';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedTab, setDisplayedTab] = useState('accueil');

  useEffect(() => {
    if (activeTab !== displayedTab) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedTab(activeTab);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, displayedTab]);

  const renderContent = () => {
    switch (displayedTab) {
      case 'accueil':
        return <Hero />;
      case 'apropos':
        return <ModernAbout />;
      case 'projets':
        return <Projects />;
      case 'contact':
        return <ModernContact />;
      default:
        return <Hero />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-950 dark:via-dark-900 dark:to-primary-950 transition-colors duration-300">
        <ModernNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className={`transition-all duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0 transform scale-95 translate-x-8' : 'opacity-100 transform scale-100 translate-x-0'
        }`}>
          <div className="animate-page-enter">
            {renderContent()}
          </div>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    </ThemeProvider>
  );
}

export default App;