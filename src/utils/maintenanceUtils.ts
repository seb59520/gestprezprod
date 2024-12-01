import { DisplayStand, MaintenanceRecord } from '../types';
import { addMonths, isBefore } from 'date-fns';

export const needsMaintenance = (
  stand: DisplayStand, 
  preventiveIntervalMonths: number = 3
): { needed: boolean; reason: 'preventive' | 'curative' | null } => {
  // Check for pending curative maintenance requests
  const hasPendingCurative = stand.maintenanceHistory?.some(
    m => m.type === 'curative' && m.status === 'pending'
  );
  
  if (hasPendingCurative) {
    return { needed: true, reason: 'curative' };
  }

  // Check for preventive maintenance based on interval
  const lastMaintenance = stand.maintenanceHistory
    ?.filter(m => m.type === 'preventive' && m.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!lastMaintenance) {
    return { needed: true, reason: 'preventive' };
  }

  const nextMaintenanceDate = addMonths(new Date(lastMaintenance.date), preventiveIntervalMonths);
  const isPreventiveNeeded = isBefore(nextMaintenanceDate, new Date());

  return {
    needed: isPreventiveNeeded,
    reason: isPreventiveNeeded ? 'preventive' : null
  };
};

export const getNextMaintenanceDate = (
  stand: DisplayStand,
  preventiveIntervalMonths: number = 3
): Date => {
  const lastMaintenance = stand.maintenanceHistory
    ?.filter(m => m.type === 'preventive' && m.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!lastMaintenance) {
    return new Date();
  }

  return addMonths(new Date(lastMaintenance.date), preventiveIntervalMonths);
};

export const calculateMTBF = (maintenanceHistory: MaintenanceRecord[]): number => {
  const curativeMaintenances = maintenanceHistory
    .filter(m => m.type === 'curative' && m.status === 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (curativeMaintenances.length < 2) return 0;

  let totalDays = 0;
  for (let i = 1; i < curativeMaintenances.length; i++) {
    const days = Math.floor(
      (new Date(curativeMaintenances[i].date).getTime() - 
       new Date(curativeMaintenances[i-1].date).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    totalDays += days;
  }

  return Math.round(totalDays / (curativeMaintenances.length - 1));
};