export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface QuoteNotificationData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectType: string;
  description: string;
  budget: string;
  timeline: string;
  estimatedHours: number;
  hourlyRate: number;
  totalAmount: number;
  features: string[];
  generatedAt: Date;
}

export const sendEmail = async (formData: EmailData): Promise<boolean> => {
  try {
    // Option 1: Utiliser Web3Forms (gratuit et simple)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '30ebe735-d1c9-418a-84eb-83a84a56f7e9', // Remplacez par votre clé Web3Forms
          from_name: formData.name,
          email: formData.email,
          subject: `[Portfolio Contact] ${formData.subject}`,
          message: `Nom: ${formData.name}\nEmail: ${formData.email}\nSujet: ${formData.subject}\n\nMessage:\n${formData.message}`
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Réponse Web3Forms:', result);
        if (result.success) {
          console.log('Email envoyé via Web3Forms avec succès');
          return true;
        } else {
          console.error('Erreur Web3Forms:', result.message);
        }
      } else {
        console.error('Erreur HTTP Web3Forms:', response.status, response.statusText);
      }
    } catch (web3Error) {
      console.error('Erreur Web3Forms:', web3Error);
    }

    // Fallback vers mailto (ouvre le client email)
    console.log('Utilisation de mailto pour:', formData);
    
    const subject = encodeURIComponent(`[Portfolio Contact] ${formData.subject}`);
    const body = encodeURIComponent(
      `Bonjour,\n\n` +
      `Vous avez reçu un nouveau message depuis votre portfolio:\n\n` +
      `Nom: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Sujet: ${formData.subject}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\n` +
      `Message envoyé depuis le portfolio web`
    );
    
    // Ouvrir le client email par défaut
    const mailtoLink = `mailto:youngjeanne283@outlook.fr?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_self');
    
    // Petite pause pour permettre à l'email client de s'ouvrir et afficher le statut
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};

// Fonction pour envoyer une notification de devis au propriétaire
export const sendQuoteNotification = async (quoteData: QuoteNotificationData): Promise<boolean> => {
  try {
    const subject = `🔔 Nouveau devis généré - ${quoteData.projectType}`;
    const message = `
🎉 NOUVEAU DEVIS GÉNÉRÉ AUTOMATIQUEMENT

📋 INFORMATIONS CLIENT
Nom: ${quoteData.clientName}
Email: ${quoteData.clientEmail}
Téléphone: ${quoteData.clientPhone || 'Non fourni'}

🏗️ DÉTAILS DU PROJET
Type: ${quoteData.projectType}
Description: ${quoteData.description}
Budget souhaité: ${quoteData.budget}
Délai souhaité: ${quoteData.timeline}

💰 ESTIMATION AUTOMATIQUE
Heures estimées: ${quoteData.estimatedHours}h
Tarif horaire: ${quoteData.hourlyRate}$ (${Math.round(quoteData.hourlyRate * 650)} FCFA)
Total estimé: ${quoteData.totalAmount} FCFA (${Math.round(quoteData.totalAmount / 650)}$)

✅ FONCTIONNALITÉS INCLUSES
${quoteData.features.map(feature => `• ${feature}`).join('\n')}

📅 GÉNÉRÉ LE
${quoteData.generatedAt.toLocaleDateString('fr-FR')} à ${quoteData.generatedAt.toLocaleTimeString('fr-FR')}

---
💡 Actions recommandées:
1. Contacter le client rapidement
2. Discuter des détails spécifiques
3. Ajuster l'estimation si nécessaire
4. Confirmer la faisabilité du projet

📧 Répondre à: ${quoteData.clientEmail}
    `;

    // Utiliser Web3Forms pour envoyer la notification
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '30ebe735-d1c9-418a-84eb-83a84a56f7e9',
          from_name: 'Portfolio Chatbot',
          email: 'noreply@portfolio.dev',
          subject: subject,
          message: message
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('Notification de devis envoyée avec succès');
          return true;
        }
      }
    } catch (web3Error) {
      console.error('Erreur Web3Forms pour notification devis:', web3Error);
    }

    // Fallback vers mailto
    const encodedSubject = encodeURIComponent(subject);
    const encodedMessage = encodeURIComponent(message);
    const mailtoLink = `mailto:youngjeanne283@outlook.fr?subject=${encodedSubject}&body=${encodedMessage}`;

    window.open(mailtoLink, '_self');
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification devis:', error);
    return false;
  }
};

// Configuration simple pour Web3Forms
// 1. Allez sur https://web3forms.com
// 2. Entrez votre email youngjeanne283@outlook.fr
// 3. Récupérez votre Access Key
// 4. Remplacez 'YOUR_ACCESS_KEY_HERE' dans le code ci-dessus
