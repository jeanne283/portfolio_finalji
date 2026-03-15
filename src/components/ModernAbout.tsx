import React from 'react';
import { 
  User, 
  Code, 
  Database, 
  Palette, 
  Briefcase, 
  Star, 
  Calendar,
  Server, 
  Layout, 
  Plus
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';

const ModernAbout: React.FC = () => {
  const { data: profile, loading: profileLoading } = useApi(() => portfolioApi.getProfile());
  const { data: skills, loading: skillsLoading } = useApi(() => portfolioApi.getSkills());
  const { data: experience, loading: experienceLoading } = useApi(() => portfolioApi.getExperience());

  const skillCategories = {
    frontend: {
      label: "Frontend",
      icon: Code,
      gradient: "from-blue-400 to-blue-500"
    },
    backend: {
      label: "Backend",
      icon: Server,
      gradient: "from-green-400 to-green-500"
    },
    database: {
      label: "Base de données",
      icon: Database,
      gradient: "from-orange-400 to-orange-500"
    },
    design: {
      label: "Design",
      icon: Palette,
      gradient: "from-purple-400 to-purple-500"
    },
    uiux: {
      label: "UI/UX Design",
      icon: Layout,
      gradient: "from-pink-400 to-pink-500"
    },
    other: {
      label: "Autres",
      icon: Plus,
      gradient: "from-gray-400 to-gray-500"
    }
  };

  const skillLogos: Record<string, string> = {
    // Frontend
    "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "React": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "TailwindCSS": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tailwindcss.svg",
    
    // Backend
    "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "Express": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "PHP": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    "Linux/Shell": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    "Python": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg",
    "C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    
    // Database
    "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "JSON-Server": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg",
    "Prisma": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/prisma.svg",
    
    // Design
    "Figma": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    "Photoshop": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
    "Illustrator": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
    "Adobe XD": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobexd.svg",
    "Canva": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/canva.svg",
    
    // UI/UX
    "Recherche utilisateur": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googleanalytics.svg",
    "Wireframing": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/sketch.svg",
    "Prototypage": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    "Design System": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/storybook.svg",
    "Tests utilisateurs": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/testcafe.svg",
    "Personas": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/aboutdotme.svg",
    "Parcours utilisateur": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/miro.svg",
    "Cartographie d'expérience": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/miro.svg",
    
    // Other
    "XML-UML": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/uml.svg",
    "ZOD": "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/zod.svg"
  };

  if (profileLoading || skillsLoading || experienceLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </section>
    );
  }

  return (
    <section id="apropos" className="min-h-screen py-16 pt-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            À propos de <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">moi</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-4 rounded-full"></div>
        </div>

        {/* Profil et Expérience groupés */}
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-300/30 mb-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Section Profil */}
            <div>
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-primary-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profil</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {profile?.bio}
              </p>
            </div>

            {/* Section Expérience */}
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 text-primary-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expérience</h3>
              </div>
              <div className="space-y-4">
                {experience?.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 bg-gray-200/30 dark:bg-white/5 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{exp.position}</h4>
                        <p className="text-xs text-primary-500 dark:text-primary-400">{exp.company}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{exp.period}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Compétences par catégories en cards */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Compétences</h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {Object.entries(skillCategories).map(([category, config]) => {
              const categorySkills = skills?.filter(skill => skill.category === category) || [];
              if (categorySkills.length === 0) return null;

              const CategoryIcon = config.icon;
              return (
                <div key={category} className="bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-300/30">
                  <div className="flex items-center mb-4">
                    <div className={`p-2 bg-gradient-to-r ${config.gradient} rounded-lg mr-3`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{config.label}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => {
                      const logoUrl = skillLogos[skill.name];
                      
                      return (
                        <div key={skill.id} className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-200">
                          <div className={`w-12 h-12 bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-2 shadow-sm border border-gray-200/50 dark:border-gray-600/30`}>
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={skill.name}
                                className="w-7 h-7 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallbackDiv = target.nextElementSibling as HTMLElement;
                                  if (fallbackDiv) {
                                    fallbackDiv.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div className={`w-6 h-6 ${logoUrl ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                              <Plus className="w-6 h-6" />
                            </div>
                          </div>
                          <h5 className="text-xs font-medium text-gray-900 dark:text-white mb-1 text-center leading-tight">{skill.name}</h5>
                          <div className="text-sm font-bold text-primary-500">{skill.level}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernAbout;
