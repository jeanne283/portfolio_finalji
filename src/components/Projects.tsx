import React, { useState, useRef } from 'react';
import { ExternalLink, Github, Filter, Grid3X3, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';
import ProjectCarousel from './ProjectCarousel';
import ImageModal from './ImageModal';


const Projects: React.FC = () => {
  const { data: projects, loading } = useApi(() => portfolioApi.getProjects());
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when filter changes
  const handleFilterChange = (filterKey: string) => {
    setActiveFilter(filterKey);
    setCurrentPage(0);
  };
  const projectsPerPage = 6;
  const containerRef = useRef<HTMLDivElement>(null);

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'UIUX-Design/UX Recherche', label: 'UI/UX Design' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'fullstack', label: 'Full Stack' },
  ];

  const filteredProjects = projects?.filter(project => 
    activeFilter === 'all' || project.category === activeFilter
  ) || [];

  const totalPages = Math.ceil((filteredProjects?.length || 0) / projectsPerPage);
  const displayedProjects = filteredProjects?.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </section>
    );
  }

  return (
    <section id="projets" className="py-20 bg-white dark:bg-dark-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 dark:text-white text-4xl font-bold">
            Mes <span className="text-primary-600 dark:text-primary-400">Projets</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Découvrez une sélection de mes réalisations les plus marquantes
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center mr-4">
              <Filter className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-gray-300 font-medium">Filtrer:</span>
            </div>
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-primary-400 shadow-sm'
                    : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'carousel'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Diaporama</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grille</span>
            </button>
          </div>
        </div>

        {/* Project Display */}
        {viewMode === 'carousel' ? (
          <ProjectCarousel projects={filteredProjects} />
        ) : (
          <>
            <div ref={containerRef} className="relative">
              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-white/20 hover:border-primary-500/50 transition-all duration-500"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                        onClick={() => setSelectedImage({ url: project.image, title: project.title })}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          {project.github && (
                            <a
                              href={project.github}
                              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-primary-500/50 transition-all duration-200 transform hover:scale-110"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          <a
                            href={project.demo}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-primary-600/50 transition-all duration-200 transform hover:scale-110"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                      {project.featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold rounded-full">
                          ⭐ VEDETTE
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 dark:bg-white/10 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-white/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Carousel */}
              {filteredProjects.length > projectsPerPage && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-2 rounded-full ${
                      currentPage === 0
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    } transition-all duration-300`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentPage(index);
                          scrollToTop();
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentPage
                            ? 'bg-primary-500 scale-125'
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages - 1
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    } transition-all duration-300`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun projet trouvé pour cette catégorie.</p>
              </div>
            )}
          </>
        )}

        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url || ''}
          title={selectedImage?.title || ''}
        />
      </div>
    </section>
  );
};

export default Projects;
