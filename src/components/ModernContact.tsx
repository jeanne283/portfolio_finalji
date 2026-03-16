import React, { useState, useEffect } from 'react';
import { Send, MapPin, Mail, CheckCircle, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { portfolioApi } from '../services/api';
import { sendEmail } from '../services/emailService';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ModernContact: React.FC = () => {
  const { data: profile, loading } = useApi(() => portfolioApi.getProfile());
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Auto-masquer le message de statut après 5 secondes
  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const success = await sendEmail(formData);
      
      if (success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !profile) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </section>
    );
  }

  return (
    <section id="contact" className="min-h-screen py-20 pt-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
            Contactez-<span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">moi</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-black dark:text-gray-300 max-w-3xl mx-auto">
            Vous avez un projet en tête ? Discutons-en ensemble
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid gap-6">
              <div className="group bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-white/20 hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Email</p>
                    <p className="text-black dark:text-white font-medium text-lg">{profile.email}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-300 dark:border-white/20 hover:border-primary-400/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Localisation</p>
                    <p className="text-black dark:text-white font-medium text-lg">{profile.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-primary-100 dark:from-primary-600/20 to-primary-200 dark:to-primary-800/20 backdrop-blur-xl rounded-2xl p-8 border border-primary-300 dark:border-primary-500/30">
              <div className="flex items-center mb-4">
                <Sparkles className="w-8 h-8 text-primary-500 dark:text-primary-400 mr-3 animate-pulse" />
                <h3 className="text-2xl font-semibold text-black dark:text-white">Prêt à collaborer ?</h3>
              </div>
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
                Je suis toujours ouvert aux nouvelles opportunités et aux projets passionnants. 
                N'hésitez pas à me contacter pour discuter de votre prochain projet.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-gray-300 dark:border-white/20">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mr-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-black dark:text-white">Envoyez-moi un message</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-black dark:text-gray-300 font-medium mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-black dark:text-gray-300 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-black dark:text-gray-300 font-medium mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-black dark:text-gray-300 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
                  placeholder="Votre message..."
                />
              </div>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <div className="flex items-center p-4 bg-green-100 dark:bg-green-500/20 border border-green-400 dark:border-green-500/50 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-green-800 dark:text-green-300">Message envoyé avec succès !</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center p-4 bg-red-100 dark:bg-red-500/20 border border-red-400 dark:border-red-500/50 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                  <span className="text-red-800 dark:text-red-300">Erreur lors de l'envoi. Veuillez réessayer.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-sm disabled:opacity-50 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernContact;
