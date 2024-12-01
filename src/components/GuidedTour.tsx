import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    title: 'Bienvenue sur Gest\'Prez',
    description: 'Découvrez comment gérer efficacement vos présentoirs et leurs réservations.',
    target: 'body',
    position: 'bottom'
  },
  {
    title: 'Tableau de bord',
    description: 'Visualisez rapidement l\'état de tous vos présentoirs, les réservations en cours et les stocks à surveiller.',
    target: '[data-tour="dashboard"]',
    position: 'bottom'
  },
  {
    title: 'Vue Galerie/Tableau',
    description: 'Basculez entre une vue en galerie ou en tableau selon vos préférences. Votre choix sera mémorisé.',
    target: '[data-tour="view-toggle"]',
    position: 'bottom'
  },
  {
    title: 'Gestion des présentoirs',
    description: 'Consultez les détails de chaque présentoir, gérez les réservations et le stock des publications.',
    target: '[data-tour="stands-list"]',
    position: 'top'
  },
  {
    title: 'QR Codes',
    description: 'Chaque présentoir dispose d\'un QR code unique permettant un accès rapide aux informations et à la réservation.',
    target: '[data-tour="qr-code"]',
    position: 'right'
  },
  {
    title: 'Statistiques',
    description: 'Analysez l\'utilisation de vos présentoirs et optimisez leur gestion grâce aux données détaillées.',
    target: '[data-tour="statistics"]',
    position: 'left'
  }
];

const GuidedTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    const tourSeen = localStorage.getItem('guidedTourSeen');
    if (!tourSeen) {
      setIsOpen(true);
      localStorage.setItem('guidedTourSeen', 'true');
    }
    setHasSeenTour(!!tourSeen);
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton d'aide pour relancer la visite */}
      {hasSeenTour && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Lancer la visite guidée"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      )}

      {/* Modal de la visite guidée */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-auto p-6">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {tourSteps[currentStep].title}
              </Dialog.Title>

              <Dialog.Description className="text-gray-600 dark:text-gray-400">
                {tourSteps[currentStep].description}
              </Dialog.Description>

              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="btn btn-secondary"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSkip}
                    className="btn btn-secondary"
                  >
                    Passer
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn btn-primary"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Terminer' : 'Suivant'}
                    {currentStep < tourSteps.length - 1 && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-1 pt-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      index === currentStep
                        ? 'w-4 bg-blue-600 dark:bg-blue-500'
                        : 'w-1.5 bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default GuidedTour;