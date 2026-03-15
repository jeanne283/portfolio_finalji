import jsPDF from 'jspdf';
import type { GeneratedQuote } from '../types/portfolio';

export const generateQuotePDF = (quote: GeneratedQuote): void => {
  const doc = new jsPDF();

  // Couleurs de la palette rose
  const primaryColor: [number, number, number] = [219, 39, 119]; // Rose primaire (primary-600)
  const secondaryColor: [number, number, number] = [244, 114, 182]; // Rose accent (primary-400)
  const darkGreen: [number, number, number] = [190, 24, 93]; // Rose foncé (primary-700)
  const lightGreen: [number, number, number] = [251, 207, 232]; // Rose clair (primary-200)

  // Configuration de la page
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let currentY = margin;

  // Fonction helper pour centrer le texte
  const centerText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Fonction helper pour ajouter du texte avec retour à la ligne
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 7) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    for (let i = 0; i < lines.length; i++) {
      if (y + (i * lineHeight) > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], x, y + (i * lineHeight));
    }
    return y + (lines.length * lineHeight);
  };

  // En-tête avec logo/branding vert
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Ajouter un dégradé vert
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 35, pageWidth, 15, 'F');

  doc.setTextColor(255, 255, 255);
  centerText('DEVIS AUTOMATIQUE', 20, 18);
  centerText('Portfolio Jeanne Young', 35, 12);
  centerText('Développement Web & Mobile', 45, 10);

  currentY = 60;

  // Informations du devis
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS DE PRESTATION', margin, currentY);
  currentY += 15;

  // Numéro et date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Numéro: ${quote.id}`, margin, currentY);
  doc.text(`Date: ${quote.createdAt.toLocaleDateString('fr-FR')}`, pageWidth - margin - 60, currentY);
  currentY += 20;

  // Section Client avec fond vert clair
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 25, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nom: ${quote.clientName}`, margin + 2, currentY);
  doc.text(`Email: ${quote.clientEmail}`, pageWidth / 2, currentY);
  currentY += 10;

  // Section Projet
  currentY += 10;
  doc.setFillColor(240, 253, 244); // Vert très clair
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 35, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJET', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Type: ${quote.projectType}`, margin + 2, currentY);
  doc.text(`Délai: ${quote.timeline}`, pageWidth / 2, currentY);
  currentY += 10;
  currentY = addWrappedText(`Description: ${quote.description}`, margin + 2, currentY, pageWidth - 2 * margin - 4, 5);
  currentY += 10;

  // Fonctionnalités incluses
  doc.setFillColor(220, 252, 231); // Vert pâle
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 40, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FONCTIONNALITÉS INCLUSES', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  quote.features.forEach((feature, index) => {
    doc.text(`• ${feature}`, margin + 5, currentY + (index * 5));
  });
  currentY += quote.features.length * 5 + 15;

  // Estimation financière avec fond vert
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTIMATION FINANCIÈRE', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFontSize(11);
  doc.text(`Heures estimées: ${quote.estimatedHours}h`, margin + 2, currentY);
  doc.text(`Tarif horaire: ${quote.hourlyRate}$ (${Math.round(quote.hourlyRate * 650)} FCFA)`, pageWidth / 2, currentY);
  currentY += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: ${quote.totalAmount} FCFA (${Math.round(quote.totalAmount / 650)}$)`, margin + 2, currentY);
  currentY += 20;

  // Conditions et mentions légales
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  currentY = addWrappedText(
    'CONDITIONS: Ce devis est valable 30 jours à compter de la date d\'émission. Le paiement s\'effectue en 3 tranches : 30% à la commande, 40% à mi-parcours, 30% à la livraison.',
    margin,
    currentY,
    pageWidth - 2 * margin,
    4
  );

  currentY += 15;

  // Pied de page avec branding rose
  const footerY = pageHeight - 35;
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
  doc.rect(margin, footerY - 5, pageWidth - margin, 30, 'F');

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(9);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  centerText('Jeanne Young - Développeur Full Stack', footerY + 5);
  centerText('Email: youngjeanne283@outlook.fr | Tél: +1 514 298 7202', footerY + 12);
  centerText(`Devis généré automatiquement le ${quote.createdAt.toLocaleDateString('fr-FR')}`, footerY + 19);

  // Ajouter un petit élément décoratif rose
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.circle(margin + 10, footerY + 25, 2, 'F');
  doc.circle(pageWidth - margin - 10, footerY + 25, 2, 'F');

  // Générer le nom du fichier
  const fileName = `devis-${quote.clientName.toLowerCase().replace(/\s+/g, '-')}-${quote.id}.pdf`;

  // Télécharger le PDF
  doc.save(fileName);
};

export const generateQuotePDFBlob = (quote: GeneratedQuote): Blob => {
  const doc = new jsPDF();

  // Couleurs de la palette rose
  const primaryColor: [number, number, number] = [219, 39, 119]; // Rose primaire (primary-600)
  const secondaryColor: [number, number, number] = [244, 114, 182]; // Rose accent (primary-400)
  const darkGreen: [number, number, number] = [190, 24, 93]; // Rose foncé (primary-700)
  const lightGreen: [number, number, number] = [251, 207, 232]; // Rose clair (primary-200)

  // Configuration de la page
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let currentY = margin;

  // Fonction helper pour centrer le texte
  const centerText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Fonction helper pour ajouter du texte avec retour à la ligne
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 7) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], x, y + (i * lineHeight));
    }
    return y + (lines.length * lineHeight);
  };

  // En-tête avec logo/branding vert
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Ajouter un dégradé vert
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(0, 35, pageWidth, 15, 'F');

  doc.setTextColor(255, 255, 255);
  centerText('DEVIS AUTOMATIQUE', 20, 18);
  centerText('Portfolio Jeanne Young', 35, 12);
  centerText('Développement Web & Mobile', 45, 10);

  currentY = 60;

  // Informations du devis
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS DE PRESTATION', margin, currentY);
  currentY += 15;

  // Numéro et date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Numéro: ${quote.id}`, margin, currentY);
  doc.text(`Date: ${quote.createdAt.toLocaleDateString('fr-FR')}`, pageWidth - margin - 60, currentY);
  currentY += 20;

  // Section Client avec fond vert clair
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 25, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nom: ${quote.clientName}`, margin + 2, currentY);
  doc.text(`Email: ${quote.clientEmail}`, pageWidth / 2, currentY);
  currentY += 10;

  // Section Projet
  currentY += 10;
  doc.setFillColor(240, 253, 244); // Vert très clair
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 35, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJET', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Type: ${quote.projectType}`, margin + 2, currentY);
  doc.text(`Délai: ${quote.timeline}`, pageWidth / 2, currentY);
  currentY += 10;
  currentY = addWrappedText(`Description: ${quote.description}`, margin + 2, currentY, pageWidth - 2 * margin - 4, 5);
  currentY += 10;

  // Fonctionnalités incluses
  doc.setFillColor(220, 252, 231); // Vert pâle
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 40, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FONCTIONNALITÉS INCLUSES', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  quote.features.forEach((feature, index) => {
    doc.text(`• ${feature}`, margin + 5, currentY + (index * 5));
  });
  currentY += quote.features.length * 5 + 15;

  // Estimation financière avec fond vert
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTIMATION FINANCIÈRE', margin + 2, currentY + 5);

  currentY += 15;
  doc.setFontSize(11);
  doc.text(`Heures estimées: ${quote.estimatedHours}h`, margin + 2, currentY);
  doc.text(`Tarif horaire: ${quote.hourlyRate}$ (${Math.round(quote.hourlyRate * 650)} FCFA)`, pageWidth / 2, currentY);
  currentY += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: ${quote.totalAmount} FCFA (${Math.round(quote.totalAmount / 650)}$)`, margin + 2, currentY);
  currentY += 20;

  // Conditions
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  currentY = addWrappedText(
    'CONDITIONS: Ce devis est valable 30 jours. Paiement en 3 tranches.',
    margin,
    currentY,
    pageWidth - 2 * margin,
    4
  );

  // Pied de page avec branding vert
  const footerY = doc.internal.pageSize.height - 35;
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
  doc.rect(margin, footerY - 5, pageWidth - 2 * margin, 30, 'F');

  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(9);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  centerText('Jeanne Young - Développeur Full Stack', footerY + 5);
  centerText('Email: youngjeanne283@outlook.fr | Tél: +1 514 298 7202', footerY + 12);

  // Retourner le blob du PDF
  return doc.output('blob');
};