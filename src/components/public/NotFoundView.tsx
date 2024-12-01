import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Présentoir non trouvé
        </h2>
        <p className="text-gray-600 mb-6">
          Le présentoir demandé n'existe pas ou n'est plus disponible.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFoundView;