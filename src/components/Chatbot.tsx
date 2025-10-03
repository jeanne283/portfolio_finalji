import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';
import { sendQuoteNotification } from '../services/emailService';
import { generateQuotePDF } from '../services/pdfService';
import type { ChatMessage, QuickReply, Profile, QuoteRequest, GeneratedQuote } from '../types/portfolio';

const Chatbot: React.FC = () => {
  const { data: profile } = useApi(() => portfolioApi.getProfile());
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    budget: '',
    timeline: ''
  });
  const [generatedQuote, setGeneratedQuote] = useState<GeneratedQuote | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick replies for common questions
  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Parlez-moi de vous', action: 'about' },
    { id: '2', text: 'Vos compétences', action: 'skills' },
    { id: '3', text: 'Vos projets', action: 'projects' },
    { id: '4', text: 'Comment vous contacter', action: 'contact' },
    { id: '5', text: 'Demander un devis', action: 'quote' },
  ];

  // Initial welcome message
  useEffect(() => {
    if (profile && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Bonjour ! Je suis ${profile.name}, ${profile.title}. Comment puis-je vous aider à en savoir plus sur mon travail ?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [profile, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Bot responses based on user input
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return `Bonjour ! Ravi de vous rencontrer. Je suis ${profile?.name}, ${profile?.title}. Que souhaitez-vous savoir sur mon travail ?`;
    }

    if (message.includes('compétence') || message.includes('skill') || message.includes('technologie')) {
      return "Je maîtrise JavaScript, React, TypeScript, Node.js, PHP, MySQL, et Tailwind CSS. Je suis également passionné par le design UI/UX. Voulez-vous en savoir plus sur un domaine spécifique ?";
    }

    if (message.includes('projet') || message.includes('travail') || message.includes('portfolio')) {
      return "J'ai travaillé sur plusieurs projets intéressants : My-Wallet (application mobile), SEEK-IMMO (plateforme immobilière), et CareLine (e-commerce). Vous pouvez les découvrir dans la section Projets de mon portfolio.";
    }

    if (message.includes('contact') || message.includes('email') || message.includes('téléphone')) {
      return `Vous pouvez me contacter par email : ${profile?.email} ou par téléphone : ${profile?.phone}. N'hésitez pas à me laisser un message !`;
    }

    if (message.includes('expérience') || message.includes('cv') || message.includes('parcours')) {
      return "J'ai plus de 3 ans d'expérience en développement web, avec un parcours allant du développement frontend au full-stack. J'ai travaillé sur des projets variés allant des applications mobiles aux plateformes e-commerce.";
    }

    if (message.includes('devis') || message.includes('prix') || message.includes('tarif') || message.includes('coût')) {
      setShowQuoteForm(true);
      return "Parfait ! Je vais vous aider à obtenir un devis personnalisé. Remplissez le formulaire ci-dessous avec les détails de votre projet.";
    }

    if (message.includes('merci') || message.includes('thank')) {
      return "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne journée !";
    }

    // Default response
    return "Je suis ravi de votre intérêt ! Pour en savoir plus sur mon travail, vous pouvez explorer les différentes sections de mon portfolio ou me poser des questions spécifiques sur mes compétences, projets ou expérience.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (action: string) => {
    let message = '';

    switch (action) {
      case 'about':
        message = 'Parlez-moi de vous';
        break;
      case 'skills':
        message = 'Quelles sont vos compétences ?';
        break;
      case 'projects':
        message = 'Quels sont vos projets ?';
        break;
      case 'contact':
        message = 'Comment vous contacter ?';
        break;
      case 'quote':
        message = 'Je voudrais un devis';
        break;
      default:
        message = action;
    }

    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuoteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateQuote = (formData: QuoteRequest): GeneratedQuote => {
    // Calcul automatique basé sur le type de projet
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

    if (formData.budget === '1000€ - 5000€') {
      adjustedHours = Math.max(40, projectConfig.hours * 0.7);
      adjustedRate = projectConfig.rate * 0.9;
    } else if (formData.budget === 'moins de 1000€') {
      adjustedHours = Math.max(20, projectConfig.hours * 0.5);
      adjustedRate = projectConfig.rate * 0.8;
    }

    // Ajustement basé sur le délai
    if (formData.timeline === 'urgent (1-2 semaines)') {
      adjustedRate = adjustedRate * 1.3; // Majoration pour urgence
    } else if (formData.timeline === 'flexible') {
      adjustedRate = adjustedRate * 0.9; // Réduction pour délai flexible
    }

    const totalAmount = Math.round(adjustedHours * adjustedRate);

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

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!quoteForm.name || !quoteForm.email || !quoteForm.projectType || !quoteForm.description) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsTyping(true);

    // Générer le devis automatiquement
    const quote = generateQuote(quoteForm);
    setGeneratedQuote(quote);

    // Envoyer une notification par email au propriétaire
    try {
      await sendQuoteNotification({
        clientName: quoteForm.name,
        clientEmail: quoteForm.email,
        clientPhone: quoteForm.phone,
        projectType: quoteForm.projectType,
        description: quoteForm.description,
        budget: quoteForm.budget,
        timeline: quoteForm.timeline,
        estimatedHours: quote.estimatedHours,
        hourlyRate: quote.hourlyRate,
        totalAmount: quote.totalAmount,
        features: quote.features,
        generatedAt: quote.createdAt
      });
      console.log('Notification de devis envoyée au propriétaire');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }

    // Simuler le traitement
    setTimeout(() => {
      const quoteMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: `Parfait ${quoteForm.name} ! J'ai généré automatiquement un devis personnalisé pour votre projet. Cliquez sur le bouton ci-dessous pour le consulter :`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, quoteMessage]);
      setShowQuoteForm(false);
      setShowQuoteModal(true);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-4 md:right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
              setShowQuoteForm(false);
            }
          }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 w-auto md:w-96 h-[500px] max-w-[calc(100vw-2rem)] md:max-w-none bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
              <img
                src={profile?.avatar}
                alt={profile?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{profile?.name}</h3>
              <p className="text-xs opacity-90">En ligne</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    {message.sender === 'bot' ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-dark-600">
                        <img
                          src={profile?.avatar}
                          alt={profile?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User size={16} className="text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-dark-600">
                    <img
                      src={profile?.avatar}
                      alt={profile?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-dark-700 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Questions populaires :</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.action)}
                      className="px-3 py-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quote Button */}
          {generatedQuote && (
            <div className="p-4 border-t border-gray-200 dark:border-dark-700">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-sm"
              >
                <span className="text-lg">📋</span>
                <span className="font-semibold">Voir le devis généré</span>
                <span className="text-sm opacity-90">({generatedQuote.totalAmount}€)</span>
              </button>
            </div>
          )}

          {/* Quote Form */}
          {showQuoteForm && (
            <div className="p-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Demande de devis</h3>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={quoteForm.name}
                      onChange={handleQuoteFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={quoteForm.email}
                      onChange={handleQuoteFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={quoteForm.phone}
                      onChange={handleQuoteFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de projet *
                    </label>
                    <select
                      name="projectType"
                      value={quoteForm.projectType}
                      onChange={handleQuoteFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="site web">Site Web</option>
                      <option value="application mobile">Application Mobile</option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="application web">Application Web</option>
                      <option value="design UI/UX">Design UI/UX</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description du projet *
                  </label>
                  <textarea
                    name="description"
                    value={quoteForm.description}
                    onChange={handleQuoteFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    placeholder="Décrivez votre projet, vos besoins spécifiques..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Budget approximatif
                    </label>
                    <select
                      name="budget"
                      value={quoteForm.budget}
                      onChange={handleQuoteFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    >
                      <option value="">Sélectionnez une fourchette</option>
                      <option value="moins de 1000€">Moins de 1000€</option>
                      <option value="1000€ - 5000€">1000€ - 5000€</option>
                      <option value="5000€ - 10000€">5000€ - 10000€</option>
                      <option value="plus de 10000€">Plus de 10000€</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Délai souhaité
                    </label>
                    <select
                      name="timeline"
                      value={quoteForm.timeline}
                      onChange={handleQuoteFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                    >
                      <option value="">Sélectionnez un délai</option>
                      <option value="urgent">Urgent (1-2 semaines)</option>
                      <option value="1 mois">1 mois</option>
                      <option value="2-3 mois">2-3 mois</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    Envoyer la demande
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && generatedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">📋 Devis Automatique</h2>
                  <p className="text-primary-100 mt-1">Généré pour {generatedQuote.clientName}</p>
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Client</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{generatedQuote.clientName}</p>
                </div>
                <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{generatedQuote.clientEmail}</p>
                </div>
              </div>

              {/* Type de projet */}
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Type de projet</p>
                <p className="font-semibold text-gray-900 dark:text-white text-lg capitalize">{generatedQuote.projectType}</p>
              </div>

              {/* Fonctionnalités incluses */}
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">Fonctionnalités incluses</p>
                <div className="flex flex-wrap gap-2">
                  {generatedQuote.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estimation financière */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-lg border border-primary-200 dark:border-primary-800">
                <h3 className="text-lg font-bold text-primary-800 dark:text-primary-200 mb-4">💰 Estimation Financière</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Heures estimées</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{generatedQuote.estimatedHours}h</p>
                  </div>
                  <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tarif horaire</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{generatedQuote.hourlyRate}€</p>
                  </div>
                  <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total estimé</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{generatedQuote.totalAmount}€</p>
                  </div>
                </div>
              </div>

              {/* Délai */}
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Délai de réalisation</p>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{generatedQuote.timeline}</p>
              </div>

              {/* Description du projet */}
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Description du projet</p>
                <p className="text-gray-900 dark:text-white leading-relaxed">{generatedQuote.description}</p>
              </div>

              {/* Notification envoyée */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      Notification envoyée à Abdoulaye
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Il vous contactera bientôt pour discuter du projet
                    </p>
                  </div>
                </div>
              </div>

              {/* Date de génération */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-dark-600">
                Devis généré automatiquement le {generatedQuote.createdAt.toLocaleDateString('fr-FR')} à {generatedQuote.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  generateQuotePDF(generatedQuote);
                  setShowQuoteModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>📄</span>
                Télécharger le PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;