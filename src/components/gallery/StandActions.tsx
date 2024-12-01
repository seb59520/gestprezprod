import React from 'react';
import { FileText, Plus, Wrench, History } from 'lucide-react';
import { DisplayStand } from '../../types';

interface StandActionsProps {
  stand: DisplayStand;
  onSelectAction: (stand: DisplayStand, action: string) => void;
}

const StandActions: React.FC<StandActionsProps> = ({ stand, onSelectAction }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {stand.isReserved ? (
        <button
          onClick={() => onSelectAction(stand, 'cancel')}
          className="btn bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
        >
          Annuler
        </button>
      ) : (
        <button
          onClick={() => onSelectAction(stand, 'reserve')}
          className="btn bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
        >
          Réserver
        </button>
      )}
      
      <button
        onClick={() => onSelectAction(stand, 'poster')}
        className="btn btn-secondary"
      >
        <FileText className="h-4 w-4 mr-1" />
        Affiche
      </button>
      
      <button
        onClick={() => onSelectAction(stand, 'publications')}
        className="btn btn-secondary"
      >
        <Plus className="h-4 w-4 mr-1" />
        Publications
      </button>
      
      <button
        onClick={() => onSelectAction(stand, 'maintenance')}
        className="btn btn-secondary"
      >
        <Wrench className="h-4 w-4 mr-1" />
        Entretien
      </button>
      
      <button
        onClick={() => onSelectAction(stand, 'history')}
        className="btn btn-secondary col-span-2"
      >
        <History className="h-4 w-4 mr-1" />
        Historique
      </button>
    </div>
  );
};

export default StandActions;