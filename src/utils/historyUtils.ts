import { DisplayStand, HistoryRecord } from '../types';

export const addHistoryRecord = (
  stand: DisplayStand,
  type: HistoryRecord['type'],
  performedBy: string,
  details: HistoryRecord['details']
): HistoryRecord[] => {
  const newRecord: HistoryRecord = {
    id: crypto.randomUUID(),
    type,
    date: new Date().toISOString(),
    performedBy,
    details
  };

  return [...(stand.history || []), newRecord];
};

export const formatHistoryAction = (record: HistoryRecord): string => {
  switch (record.type) {
    case 'reservation':
      return record.details.action === 'create' 
        ? `Réservation par ${record.details.newState.reservedBy}`
        : `Annulation de la réservation de ${record.details.previousState.reservedBy}`;
    
    case 'maintenance':
      return `Maintenance ${record.details.type} - ${record.details.description}`;
    
    case 'poster_change':
      return `Changement d'affiche : ${record.details.previousState} → ${record.details.newState}`;
    
    case 'stock_update':
      return `Mise à jour du stock des publications`;
    
    case 'publication_association':
      return record.details.action === 'add'
        ? `Association de nouvelles publications`
        : `Retrait de publications`;
    
    default:
      return 'Action non spécifiée';
  }
};