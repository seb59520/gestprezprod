import { Publication } from '../types';

interface StockPrediction {
  predictedLevel: number;
  restockPoint: number;
  restockDate: Date | null;
  safetyStock: number;
  dailyUsage: number;
  daysUntilRestock: number;
}

export const predictStock = (publication: Publication & { currentStock: number }): StockPrediction => {
  // Safety stock calculation (20% of minimum stock)
  const safetyStock = Math.ceil(publication.minStock * 0.2);
  
  // Restock point (minimum stock + safety stock)
  const restockPoint = publication.minStock + safetyStock;
  
  // Estimated average daily usage
  const dailyUsage = 0.5; // Average consumption per day
  
  // Days until restock needed
  const daysUntilRestock = Math.floor((publication.currentStock - restockPoint) / dailyUsage);
  
  // Predicted level in 30 days
  const predictedLevel = Math.max(0, publication.currentStock - (dailyUsage * 30));
  
  // Recommended restock date
  const restockDate = publication.currentStock <= restockPoint 
    ? new Date() 
    : new Date(Date.now() + (daysUntilRestock * 24 * 60 * 60 * 1000));

  return {
    predictedLevel,
    restockPoint,
    restockDate,
    safetyStock,
    dailyUsage,
    daysUntilRestock
  };
};