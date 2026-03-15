import React, { useEffect } from 'react';
import { User, MapPin, Mail, Phone } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';

const About: React.FC = () => {
  const { data: profile, loading: profileLoading } = useApi(() => portfolioApi.getProfile());
  const { data: skills, loading: skillsLoading } = useApi(() => portfolioApi.getSkills());

  useEffect(() => {
    if (skills) {
      console.log('Skills loaded:', skills);
    }
  }, [skills]);
  const { data: experience, loading: experienceLoading } = useApi(() => portfolioApi.getExperience());

  const skillCategories = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Base de données',
    tools: 'Outils'
  };

  if (profileLoading || skillsLoading || experienceLoading) {
    return (
      <section className="py-20 bg-dark-50">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-algae-800 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="apropos" className="py-20 bg-dark-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-800 mb-6">À propos de moi</h2>
          <div className="w-24 h-1 bg-algae-600 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Bio & Contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-algae-600 mr-3" />
                <h3 className="text-2xl font-semibold text-dark-800">Profil</h3>
              </div>

              {/* Avatar, Name & Title */}
              <div className="flex items-center mb-6">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={`${profile.name} avatar`} className="w-20 h-20 rounded-full object-cover mr-4" />
                ) : (
                  <User className="w-12 h-12 text-algae-600 mr-4" />
                )}
                <div>
                  <h4 className="text-xl font-semibold text-dark-800">{profile?.name}</h4>
                  <p className="text-algae-600">{profile?.title}</p>
                </div>
              </div>

              <p className="text-dark-600 leading-relaxed text-lg">
                {profile?.bio}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-dark-800 mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-algae-600 mr-3" />
                  <span className="text-dark-600">{profile?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-algae-600 mr-3" />
                  <span className="text-dark-600">{profile?.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-algae-600 mr-3" />
                  <span className="text-dark-600">{profile?.location}</span>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-dark-800 mb-6">Expérience</h3>
              <div className="space-y-6">
                {experience?.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-algae-600 pl-6">
                    <h4 className="text-lg font-semibold text-dark-800">{exp.position}</h4>
                    <p className="text-algae-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-dark-500 mb-2">{exp.period}</p>
                    <p className="text-dark-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-dark-800 mb-8">Compétences</h3>
            
            {Object.entries(skillCategories).map(([category, label]) => {
              const categorySkills = skills?.filter(skill => skill.category === category) || [];
              
              if (categorySkills.length === 0) return null;

              return (
                <div key={category} className="mb-8">
                  <h4 className="text-lg font-semibold text-algae-700 mb-4">{label}</h4>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            {skill.icon && (
                              <img
                                src={skill.icon}
                                alt={`${skill.name} logo`}
                                title={skill.name}
                                className="w-6 h-6 mr-2 object-contain"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <span className="text-dark-700 font-medium">{skill.name}</span>
                          </div>
                          <span className="text-algae-600 font-semibold">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-dark-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-algae-600 to-algae-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
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

export default About;
