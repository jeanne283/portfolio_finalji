import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Play, Pause } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';
import ImageModal from './ImageModal';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  github: string;
  demo: string;
  featured: boolean;
}

interface ProjectCarouselProps {
  projects?: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects: propsProjects }) => {
  const { data: apiProjects, loading } = useApi(() => portfolioApi.getProjects());
  const projects = propsProjects || apiProjects;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  // Reset slide when projects change
  useEffect(() => {
    if (projects && currentSlide >= projects.length) {
      setCurrentSlide(0);
    }
  }, [projects, currentSlide]);

  useEffect(() => {
    if (!isAutoPlay || !projects?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, projects?.length]);

  const nextSlide = () => {
    if (projects?.length) {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }
  };

  const prevSlide = () => {
    if (projects?.length) {
      setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  if ((!propsProjects && loading)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400 text-lg">Aucun projet trouvé pour cette catégorie.</p>
      </div>
    );
  }

  const currentProject = projects[currentSlide];

  return (
    <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
      {/* Main Carousel */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out cursor-pointer"
          style={{ backgroundImage: `url(${currentProject.image})` }}
          onClick={() => setSelectedImage({ url: currentProject.image, title: currentProject.title })}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-4">
                {currentProject.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold rounded-full">
                    ⭐ VEDETTE
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full capitalize">
                  {currentProject.category}
                </span>
              </div>
              
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-slide-up">
                {currentProject.title}
              </h3>
              
              <p className="text-xl text-gray-200 mb-6 leading-relaxed animate-fade-in">
                {currentProject.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-8">
                {currentProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <a
                  href={currentProject.github}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <Github className="w-5 h-5" />
                  <span>Code</span>
                </a>
                <a
                  href={currentProject.demo}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:shadow-sm transition-all duration-300 transform hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Démo</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300"
        >
          {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-3 p-6 bg-white/5">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-gradient-to-r from-primary-400 to-primary-500 scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail Navigation */}
      <div className="p-6 bg-white/5">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setCurrentSlide(index)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentSlide
                  ? 'border-primary-400 scale-110'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage({ url: project.image, title: project.title })}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        title={selectedImage?.title || ''}
      />
    </div>
  );
};

export default ProjectCarousel;
