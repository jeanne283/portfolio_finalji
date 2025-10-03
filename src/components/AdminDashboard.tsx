import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../services/api';
import type { Skill, Experience } from '../types/portfolio';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'skills' | 'experiences'>('skills');

  // Form states
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({ name: '', level: 50, category: 'frontend' });
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({ company: '', position: '', period: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [skillsData, experiencesData] = await Promise.all([
        portfolioApi.getSkills(),
        portfolioApi.getExperience()
      ]);
      setSkills(skillsData);
      setExperiences(experiencesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Skills CRUD
  const handleCreateSkill = async () => {
    try {
      const created = await portfolioApi.createSkill(newSkill);
      setSkills([...skills, created]);
      setNewSkill({ name: '', level: 50, category: 'frontend' });
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  };

  const handleUpdateSkill = async (id: number, updates: Partial<Skill>) => {
    try {
      const updated = await portfolioApi.updateSkill(id, updates);
      setSkills(skills.map(skill => skill.id === id ? updated : skill));
      setEditingSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      try {
        await portfolioApi.deleteSkill(id);
        setSkills(skills.filter(skill => skill.id !== id));
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };

  // Experience CRUD
  const handleCreateExperience = async () => {
    try {
      const created = await portfolioApi.createExperience(newExperience);
      setExperiences([...experiences, created]);
      setNewExperience({ company: '', position: '', period: '', description: '' });
    } catch (error) {
      console.error('Error creating experience:', error);
    }
  };

  const handleUpdateExperience = async (id: number, updates: Partial<Experience>) => {
    try {
      const updated = await portfolioApi.updateExperience(id, updates);
      setExperiences(experiences.map(exp => exp.id === id ? updated : exp));
      setEditingExperience(null);
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      try {
        await portfolioApi.deleteExperience(id);
        setExperiences(experiences.filter(exp => exp.id !== id));
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Admin</h1>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'skills'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
            }`}
          >
            Compétences
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'experiences'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
            }`}
          >
            Expériences
          </button>
        </div>

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Add New Skill */}
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ajouter une compétence</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Nom de la compétence"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Niveau (0-100)"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Base de données</option>
                  <option value="design">Design</option>
                  <option value="uiux">UI/UX</option>
                  <option value="other">Autre</option>
                </select>
                <button
                  onClick={handleCreateSkill}
                  className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </button>
              </div>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
                  {editingSkill?.id === skill.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingSkill.name}
                        onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      />
                      <input
                        type="number"
                        value={editingSkill.level}
                        onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      />
                      <select
                        value={editingSkill.category}
                        onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Base de données</option>
                        <option value="design">Design</option>
                        <option value="uiux">UI/UX</option>
                        <option value="other">Autre</option>
                      </select>
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleUpdateSkill(skill.id, editingSkill)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
                        >
                          <Save className="w-5 h-5 mr-2" />
                          Sauver
                        </button>
                        <button
                          onClick={() => setEditingSkill(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Niveau: {skill.level}%</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Catégorie: {skill.category}</p>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => setEditingSkill(skill)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                        >
                          <Edit className="w-5 h-5 mr-2" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            {/* Add New Experience */}
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ajouter une expérience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Entreprise"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Poste"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Période (ex: 2022 - 2023)"
                  value={newExperience.period}
                  onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
                <div className="flex space-x-2">
                  <textarea
                    placeholder="Description"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                  <button
                    onClick={handleCreateExperience}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors flex items-center self-end"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Experiences List */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Liste des expériences</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-dark-700">
                {experiences.map((experience) => (
                  <div key={experience.id} className="p-6">
                    {editingExperience?.id === experience.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Entreprise"
                          value={editingExperience.company}
                          onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                          className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Poste"
                          value={editingExperience.position}
                          onChange={(e) => setEditingExperience({ ...editingExperience, position: e.target.value })}
                          className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Période"
                          value={editingExperience.period}
                          onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                          className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                        />
                        <div className="flex space-x-2">
                          <textarea
                            placeholder="Description"
                            value={editingExperience.description}
                            onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                          />
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleUpdateExperience(experience.id, editingExperience)}
                              className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Sauver
                            </button>
                            <button
                              onClick={() => setEditingExperience(null)}
                              className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{experience.position}</h3>
                          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{experience.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{experience.period}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{experience.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setEditingExperience(experience)}
                            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(experience.id)}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
