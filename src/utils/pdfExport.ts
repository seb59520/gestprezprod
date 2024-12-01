import jsPDF from 'jspdf';
import { DisplayStand } from '../types';
import * as QRCode from 'qrcode';

export const generateQRCodePDF = async (stands: DisplayStand[], baseUrl: string) => {
  // Créer un nouveau document PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Définir les dimensions et marges
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const qrSize = 50;
  const itemsPerRow = 2;
  const spacing = 10;

  // Calculer la largeur disponible et l'espacement
  const availableWidth = pageWidth - (2 * margin);
  const columnWidth = (availableWidth - (spacing * (itemsPerRow - 1))) / itemsPerRow;

  // Position initiale
  let x = margin;
  let y = margin;

  // Ajouter le titre
  pdf.setFontSize(16);
  pdf.text('QR Codes des Présentoirs', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Pour chaque présentoir
  for (let i = 0; i < stands.length; i++) {
    const stand = stands[i];
    const qrUrl = `${baseUrl}${stand.id}`;

    try {
      // Générer le QR code en base64
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: qrSize * 10,
        margin: 1,
        errorCorrectionLevel: 'H'
      });

      // Ajouter le QR code
      pdf.addImage(qrDataUrl, 'PNG', x, y, qrSize, qrSize);

      // Ajouter les informations du présentoir
      pdf.setFontSize(12);
      pdf.text(stand.name, x, y + qrSize + 5);
      pdf.setFontSize(10);
      pdf.text(stand.location, x, y + qrSize + 10);

      // Passer à la colonne suivante ou à la ligne suivante
      if ((i + 1) % itemsPerRow === 0) {
        x = margin;
        y += qrSize + 25;

        // Vérifier si on a besoin d'une nouvelle page
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      } else {
        x += columnWidth + spacing;
      }
    } catch (error) {
      console.error(`Erreur lors de la génération du QR code pour ${stand.name}:`, error);
      continue;
    }
  }

  // Sauvegarder le PDF
  pdf.save('presentoirs-qrcodes.pdf');
};

export const generateStandDetailsPDF = async (stand: DisplayStand, baseUrl: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const qrSize = 60;

  // Titre
  pdf.setFontSize(20);
  pdf.text('Détails du Présentoir', pageWidth / 2, margin, { align: 'center' });

  try {
    // QR Code
    const qrUrl = `${baseUrl}${stand.id}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: qrSize * 10,
      margin: 1,
      errorCorrectionLevel: 'H'
    });

    // Centrer le QR code
    const qrX = (pageWidth - qrSize) / 2;
    pdf.addImage(qrDataUrl, 'PNG', qrX, margin + 10, qrSize, qrSize);

    // Informations du présentoir
    let y = margin + qrSize + 20;
    pdf.setFontSize(14);
    pdf.text('Informations', margin, y);
    y += 10;

    pdf.setFontSize(12);
    const info = [
      `Nom: ${stand.name}`,
      `Localisation: ${stand.location}`,
      `Affiche actuelle: ${stand.currentPoster || 'Aucune'}`,
      `Statut: ${stand.isReserved ? 'Réservé' : 'Disponible'}`,
    ];

    if (stand.isReserved) {
      info.push(`Réservé par: ${stand.reservedBy}`);
      if (stand.reservedUntil) {
        info.push(`Jusqu'au: ${new Date(stand.reservedUntil).toLocaleDateString()}`);
      }
    }

    info.forEach(line => {
      pdf.text(line, margin, y);
      y += 7;
    });

    // Sauvegarder le PDF
    pdf.save(`presentoir-${stand.id}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};