import React, { useState } from 'react';
import { Github, Linkedin, Mail, ArrowDown, Code2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';
import QuoteForm from './QuoteForm';

const Hero: React.FC = () => {
  const { data: profile, loading } = useApi(() => portfolioApi.getProfile());
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !profile) {
    return (
      <section id="accueil" className="min-h-screen bg-gradient-to-br from-algae-800 to-algae-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  return (
    <section id="accueil" className="min-h-screen relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900/20 via-transparent to-dark-900/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-ping" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-20 flex items-center min-h-screen relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Content */}
          <div className="text-gray-900 dark:text-white animate-slide-up">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Bonjour, je suis <br />
              <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">{profile.name}</span>
            </h1>
            <h2 className="text-2xl lg:text-3xl font-light mb-6 text-primary-600 dark:text-primary-100">
              {profile.title}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-200 mb-8 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Social Links */}
            <div className="flex space-x-6 mb-12">
              <a href="https://github.com/abdoulaye150199" target="_blank" rel="noopener noreferrer" className="group relative p-4 bg-white/10 backdrop-blur-sm hover:bg-primary-600/30 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                <Github className="w-6 h-6 text-white group-hover:text-primary-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-primary-600/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </a>
              <a href="https://www.linkedin.com/in/abdoulaye-diallo-gl-uiuxdesigner" target="_blank" rel="noopener noreferrer" className="group relative p-4 bg-white/10 backdrop-blur-sm hover:bg-primary-500/30 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                <Linkedin className="w-6 h-6 text-white group-hover:text-primary-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-primary-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </a>
              <a href={`mailto:${profile.email}`} className="group relative p-4 bg-white/10 backdrop-blur-sm hover:bg-primary-700/30 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                <Mail className="w-6 h-6 text-white group-hover:text-primary-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700/50 to-primary-600/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex">
              <button
                onClick={() => setIsQuoteFormOpen(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Demander un devis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Avatar with Modern Design */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <div className="relative group">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5 transform group-hover:scale-105 transition-all duration-500">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full opacity-30 animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('apropos')}
            className="p-2 rounded-full border-2 border-white text-white hover:bg-white hover:text-algae-800 transition-all duration-300"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Quote Form Modal */}
      <QuoteForm
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </section>
  );
};

export default Hero;