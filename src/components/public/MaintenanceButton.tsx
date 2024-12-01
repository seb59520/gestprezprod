import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MaintenanceButtonProps {
  onClick: () => void;
}

const MaintenanceButton: React.FC<MaintenanceButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="btn bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl w-full"
    >
      <AlertTriangle className="h-4 w-4 mr-2" />
      Signaler un problème
    </button>
  );
};

export default MaintenanceButton;