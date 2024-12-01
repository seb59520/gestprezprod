import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { predictStock } from '../utils/stockPrediction';
import { Publication } from '../types';
import HelpTooltip from './HelpTooltip';

interface StockPredictionTooltipProps {
  publication: Publication & { currentStock: number };
}

const StockPredictionTooltip: React.FC<StockPredictionTooltipProps> = ({ publication }) => {
  const prediction = predictStock(publication);

  return (
    <div className="absolute z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 mt-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Analyse du stock</h3>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Stock actuel</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{publication.currentStock}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Stock minimum</span>
              <HelpTooltip
                title="Stock minimum"
                content="Niveau minimum de stock à maintenir pour assurer un service continu"
                position="right"
              />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{publication.minStock}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Stock de sécurité</span>
              <HelpTooltip
                title="Stock de sécurité"
                content="Stock tampon pour faire face aux variations imprévues de la demande"
                position="right"
              />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{prediction.safetyStock}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Point de réappro.</span>
              <HelpTooltip
                title="Point de réapprovisionnement"
                content="Niveau de stock déclenchant une commande de réapprovisionnement"
                position="right"
              />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{prediction.restockPoint}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Niveau prédit (30j)</span>
              <HelpTooltip
                title="Niveau prédit"
                content="Estimation du niveau de stock dans 30 jours basée sur la consommation moyenne"
                position="right"
              />
            </div>
            <span className={`font-medium ${
              prediction.predictedLevel < prediction.restockPoint
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {Math.round(prediction.predictedLevel)}
            </span>
          </div>
        </div>

        {prediction.daysUntilRestock <= 30 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Réapprovisionnement recommandé
              </span>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
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

export default StockPredictionTooltip;