import { doc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DisplayStand, MaintenanceRecord } from '../types';

export const addMaintenance = async (
  stand: DisplayStand,
  maintenance: Omit<MaintenanceRecord, 'id'>
): Promise<void> => {
  try {
    const standRef = doc(db, 'stands', stand.id);
    const maintenanceRef = doc(collection(db, 'maintenance'));
    
    const maintenanceData: MaintenanceRecord = {
      id: maintenanceRef.id,
      ...maintenance,
    };

    // First create the maintenance record
    await addDoc(collection(db, 'maintenance'), {
      ...maintenanceData,
      standId: stand.id,
      createdAt: serverTimestamp()
    });

    // Then update the stand with the maintenance reference
    await updateDoc(standRef, {
      maintenanceHistory: [
        ...(stand.maintenanceHistory || []),
        maintenanceData
      ],
      lastMaintenance: new Date().toISOString(),
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding maintenance:', error);
    throw error;
  }
};

export const updateMaintenanceStatus = async (
  stand: DisplayStand,
  maintenanceId: string,
  status: 'completed' | 'cancelled'
): Promise<void> => {
  try {
    const standRef = doc(db, 'stands', stand.id);
    const maintenanceRef = doc(db, 'maintenance', maintenanceId);
    
    // Update the maintenance record
    await updateDoc(maintenanceRef, {
      status,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update the stand's maintenance history
    await updateDoc(standRef, {
      maintenanceHistory: stand.maintenanceHistory?.map(m => 
        m.id === maintenanceId
          ? { ...m, status, completedAt: new Date().toISOString() }
          : m
      ),
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    throw error;
  }
};