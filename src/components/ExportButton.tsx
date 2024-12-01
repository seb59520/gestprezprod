import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { generateQRCodePDF, generateStandDetailsPDF } from '../utils/pdfExport';
import { DisplayStand } from '../types';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'react-hot-toast';

interface ExportButtonProps {
  stands?: DisplayStand[];
  stand?: DisplayStand;
  type: 'multiple' | 'single';
}

const ExportButton: React.FC<ExportButtonProps> = ({ stands, stand, type }) => {
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  const handleExport = async () => {
    try {
      setLoading(true);
      
      if (type === 'multiple' && stands) {
        await generateQRCodePDF(stands, settings.baseUrl);
        toast.success('PDF des QR codes généré avec succès');
      } else if (type === 'single' && stand) {
        await generateStandDetailsPDF(stand, settings.baseUrl);
        toast.success('PDF du présentoir généré avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="btn btn-secondary"
      title={type === 'multiple' ? 'Exporter tous les QR codes' : 'Exporter les détails'}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Export...
        </div>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {type === 'multiple' ? 'Exporter QR codes' : 'Exporter PDF'}
        </>
      )}
    </button>
  );
};

export default ExportButton;