export interface MaintenanceRecord {
  id: string;
  type: 'preventive' | 'curative';
  date: string;
  performedBy: string;
  description: string;
  issues?: string;
  resolution?: string;
  status: 'pending' | 'completed' | 'cancelled';
  sparePartsUsed?: string[];
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface SparePart {
  id: string;
  name: string;
  reference: string;
  quantity: number;
  minStock: number;
  supplier: string;
  category: string;
  lastOrderDate?: string;
  notes?: string;
}

export interface MaintenanceRequest {
  id: string;
  standId: string;
  standName: string;
  type: 'preventive' | 'curative';
  date: string;
  description: string;
  issues?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  notes?: string;
}