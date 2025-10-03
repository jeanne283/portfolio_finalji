import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernNavigation from './components/ModernNavigation';
import Hero from './components/Hero';
import ModernAbout from './components/ModernAbout';
import Projects from './components/Projects';
import ModernContact from './components/ModernContact';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-950 dark:via-dark-900 dark:to-primary-950 transition-colors duration-300">
          <ModernNavigation />
          <main className="transition-all duration-500 ease-in-out">
            <div className="animate-page-enter">
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<ModernAbout />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<ModernContact />} />
                <Route path="/admin1501" element={<AdminDashboard />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <AIChatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
