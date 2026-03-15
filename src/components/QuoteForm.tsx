import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, AlertCircle, Calculator, Clock, DollarSign } from 'lucide-react';
import { sendQuoteNotification, QuoteNotificationData } from '../services/emailService';
import { generateQuotePDF } from '../services/pdfService';
import type { GeneratedQuote } from '../types/portfolio';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
}

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    budget: '',
    timeline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [generatedQuote, setGeneratedQuote] = useState<GeneratedQuote | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Auto-masquer le message de statut après 5 secondes
  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQuote = (formData: QuoteFormData): GeneratedQuote => {
    // Calcul automatique basé sur le type de projet (même logique que le Chatbot)
    const baseRates = {
      'site web': { hours: 80, rate: 50, features: ['Design responsive', '5 pages', 'Formulaire de contact', 'Optimisation SEO', 'Hébergement 1 an'] },
      'application mobile': { hours: 160, rate: 60, features: ['Design UI/UX', 'iOS & Android', 'Backend API', 'Base de données', 'Tests utilisateurs'] },
      'e-commerce': { hours: 120, rate: 55, features: ['Catalogue produits', 'Panier d\'achat', 'Paiement sécurisé', 'Gestion admin', 'Suivi commandes'] },
      'application web': { hours: 100, rate: 55, features: ['Interface utilisateur', 'Backend robuste', 'Base de données', 'Authentification', 'API REST'] },
      'design UI/UX': { hours: 40, rate: 45, features: ['Analyse utilisateur', 'Wireframes', 'Maquettes haute fidélité', 'Prototype interactif', 'Guide de style'] },
      'autre': { hours: 60, rate: 50, features: ['Analyse des besoins', 'Proposition technique', 'Développement personnalisé', 'Tests et déploiement', 'Support post-lancement'] }
    };

    const projectConfig = baseRates[formData.projectType as keyof typeof baseRates] || baseRates['autre'];

    // Ajustement basé sur le budget souhaité
    let adjustedHours = projectConfig.hours;
    let adjustedRate = projectConfig.rate;

    if (formData.budget === 'moins de 1000€') {
      adjustedHours = Math.max(20, projectConfig.hours * 0.5);
      adjustedRate = projectConfig.rate * 0.8;
    } else if (formData.budget === '1000€ - 5000€') {
      adjustedHours = Math.max(40, projectConfig.hours * 0.7);
      adjustedRate = projectConfig.rate * 0.9;
    }

    // Ajustement basé sur le délai
    if (formData.timeline === 'urgent (1-2 semaines)') {
      adjustedRate = adjustedRate * 1.3; // Majoration pour urgence
    } else if (formData.timeline === 'flexible') {
      adjustedRate = adjustedRate * 0.9; // Réduction pour délai flexible
    }

    const totalAmountUSD = Math.round(adjustedHours * adjustedRate);
    // Conversion FCFA (approximatif 1 USD = 650 FCFA)
    const totalAmount = Math.round(totalAmountUSD * 650);

    return {
      id: Date.now().toString(),
      clientName: formData.name,
      clientEmail: formData.email,
      projectType: formData.projectType,
      description: formData.description,
      estimatedHours: Math.round(adjustedHours),
      hourlyRate: Math.round(adjustedRate),
      totalAmount,
      timeline: formData.timeline,
      features: projectConfig.features,
      createdAt: new Date()
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const quote = generateQuote(formData);
      setGeneratedQuote(quote);

      // Créer les données pour la notification email
      const notificationData = {
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        projectType: formData.projectType,
        description: formData.description,
        budget: formData.budget,
        timeline: formData.timeline,
        estimatedHours: quote.estimatedHours,
        hourlyRate: quote.hourlyRate,
        totalAmount: quote.totalAmount,
        features: quote.features,
        generatedAt: quote.createdAt
      };

      const success = await sendQuoteNotification(notificationData);

      if (success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          description: '',
          budget: '',
          timeline: '',
        });

        // Générer automatiquement le PDF
        generateQuotePDF(quote);

        // Fermer le modal après 2 secondes en cas de succès et ouvrir le modal de devis
        setTimeout(() => {
          onClose();
          setShowQuoteModal(true);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du devis:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50 shadow-2xl">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-400/20 via-transparent to-primary-800/30"></div>
          <div className="relative flex items-center justify-between p-8">
            <div className="flex items-center">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mr-6 border border-white/30">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">Demander un devis</h3>
                <p className="text-primary-100 text-lg">Remplissez le formulaire ci-dessous</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 border border-white/30"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Informations essentielles */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Type de projet */}
          <div>
            <label htmlFor="projectType" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Type de projet *
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">Choisissez un type</option>
              <option value="site web">Site Web</option>
              <option value="application mobile">Application Mobile</option>
              <option value="e-commerce">E-commerce</option>
              <option value="application web">Application Web</option>
              <option value="design UI/UX">Design UI/UX</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Description du projet *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
              placeholder="Décrivez brièvement votre projet..."
            />
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/20 dark:to-emerald-500/20 border-2 border-green-400 dark:border-green-500/50 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="p-3 bg-green-500 rounded-2xl mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-green-800 dark:text-green-300 font-semibold text-lg">Devis généré avec succès !</p>
                <p className="text-green-700 dark:text-green-400">Le PDF a été téléchargé automatiquement. Vous recevrez une réponse bientôt.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-500/20 dark:to-pink-500/20 border-2 border-red-400 dark:border-red-500/50 rounded-2xl backdrop-blur-sm shadow-lg">
              <div className="p-3 bg-red-500 rounded-2xl mr-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-red-800 dark:text-red-300 font-semibold text-lg">Erreur lors de l'envoi</p>
                <p className="text-red-700 dark:text-red-400">Veuillez réessayer ou nous contacter directement.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white font-bold rounded-2xl hover:shadow-2xl disabled:opacity-50 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:hover:scale-100 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-400/20 via-transparent to-primary-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  <span className="relative z-10">Génération en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Demander le devis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && generatedQuote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50">
            {/* Modal Header */}
            <div className="relative overflow-hidden rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-400/20 via-transparent to-primary-800/30"></div>
              <div className="relative flex items-center justify-between p-8">
                <div className="flex items-center">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl mr-6 border border-white/30">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">📋 Devis Automatique</h2>
                    <p className="text-primary-100 mt-1 text-lg">Généré pour {generatedQuote.clientName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 border border-white/30"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-10 space-y-8">
              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-2">👤 Client</p>
                  <p className="font-bold text-gray-900 dark:text-white text-xl">{generatedQuote.clientName}</p>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-2">📧 Email</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{generatedQuote.clientEmail}</p>
                </div>
              </div>

              {/* Type de projet */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-3">🎯 Type de projet</p>
                <p className="font-bold text-gray-900 dark:text-white text-2xl capitalize">{generatedQuote.projectType}</p>
              </div>

              {/* Fonctionnalités incluses */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-4">✨ Fonctionnalités incluses</p>
                <div className="flex flex-wrap gap-3">
                  {generatedQuote.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 rounded-2xl text-sm font-semibold border border-primary-200 dark:border-primary-700 shadow-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estimation financière */}
              <div className="bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-primary-900/20 dark:via-primary-800/20 dark:to-primary-700/20 p-8 rounded-3xl border-2 border-primary-200 dark:border-primary-800 shadow-xl">
                <h3 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-6 text-center">💰 Estimation Financière</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-2">⏱️ Heures estimées</p>
                    <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">{generatedQuote.estimatedHours}h</p>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-2">💵 Tarif horaire</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{generatedQuote.hourlyRate}$</p>
                    <p className="text-lg text-primary-500 dark:text-primary-300">({Math.round(generatedQuote.hourlyRate * 650)} FCFA)</p>
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-2">💎 Total estimé</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{generatedQuote.totalAmount} FCFA</p>
                    <p className="text-lg text-green-500 dark:text-green-300">({Math.round(generatedQuote.totalAmount / 650)}$)</p>
                  </div>
                </div>
              </div>

              {/* Délai */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-3">📅 Délai de réalisation</p>
                <p className="font-bold text-gray-900 dark:text-white text-xl">{generatedQuote.timeline}</p>
              </div>

              {/* Description du projet */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide mb-3">📝 Description du projet</p>
                <p className="text-gray-900 dark:text-white leading-relaxed text-lg">{generatedQuote.description}</p>
              </div>

              {/* Notification envoyée */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/20 dark:to-emerald-500/20 border-2 border-green-400 dark:border-green-500/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-green-500 rounded-2xl shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 dark:text-green-200 text-xl">
                      ✅ Notification envoyée à Jeanne
                    </p>
                    <p className="text-green-700 dark:text-green-400 text-lg">
                      Il vous contactera bientôt pour discuter du projet
                    </p>
                  </div>
                </div>
              </div>

              {/* Date de génération */}
              <div className="text-center text-gray-500 dark:text-gray-400 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
                <p className="text-lg font-medium">
                  Devis généré automatiquement le {generatedQuote.createdAt.toLocaleDateString('fr-FR')} à {generatedQuote.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-10 py-6 rounded-b-3xl flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  generateQuotePDF(generatedQuote);
                  setShowQuoteModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-400/20 via-transparent to-primary-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-2xl relative z-10">📄</span>
                <span className="relative z-10">Télécharger le PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteForm;