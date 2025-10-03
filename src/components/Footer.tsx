import React from 'react';
import { Heart, Code } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 dark:bg-black/30 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 text-gray-800 dark:text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="relative">
              <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              Abdoulaye Diallo
            </span>
          </div>

          <div className="text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0">
            © 2025 Abdoulaye Diallo. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
