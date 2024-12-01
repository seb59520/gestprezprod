import React from 'react';
import { Publication } from '../types';
import { AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { predictStock } from '../utils/stockPrediction';

interface StockAnalysisPopoverProps {
  publication: Publication & { currentStock: number };
}

const StockAnalysisPopover: React.FC<StockAnalysisPopoverProps> = ({ publication }) => {
  const prediction = predictStock(publication);

  return (
    <div className="absolute z-10 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 mt-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Analyse du stock</h3>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stock actuel</span>
            <span className="font-medium">{publication.currentStock}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stock minimum</span>
            <span className="font-medium">{publication.minStock}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stock de sécurité</span>
            <span className="font-medium">{prediction.safetyStock}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Point de réappro.</span>
            <span className="font-medium">{prediction.restockPoint}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Niveau prédit (30j)</span>
            <span className={`font-medium ${
              prediction.predictedLevel < prediction.restockPoint
                ? 'text-orange-600'
                : 'text-green-600'
            }`}>
              {Math.round(prediction.predictedLevel)}
            </span>
          </div>
        </div>

        {prediction.daysUntilRestock <= 30 && (
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Réapprovisionnement recommandé
              </span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              {prediction.daysUntilRestock <= 0
                ? 'Stock critique - Réapprovisionner maintenant'
                : `Réapprovisionner dans ${prediction.daysUntilRestock} jours`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAnalysisPopover;