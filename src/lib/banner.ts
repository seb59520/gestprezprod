import { collection, query, getDocs, addDoc, updateDoc, doc, serverTimestamp, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-hot-toast';

export interface Banner {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  organizationId: string;
  createdAt: any;
  updatedAt?: any;
  order?: number;
}

export const getBannersRef = (organizationId: string) => 
  collection(db, 'organizations', organizationId, 'banners');

export const getBannersQuery = (organizationId: string) => 
  query(
    getBannersRef(organizationId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );

export const createBanner = async (organizationId: string, data: Omit<Banner, 'id' | 'createdAt' | 'organizationId'>) => {
  try {
    const bannersRef = getBannersRef(organizationId);
    
    // Get current count for ordering
    const snapshot = await getDocs(bannersRef);
    const order = snapshot.size;

    await addDoc(bannersRef, {
      ...data,
      organizationId,
      order,
      createdAt: serverTimestamp()
    });
    
    toast.success('Bannière créée avec succès');
  } catch (error) {
    console.error('Error creating banner:', error);
    toast.error('Erreur lors de la création de la bannière');
    throw error;
  }
};

export const updateBanner = async (organizationId: string, bannerId: string, data: Partial<Banner>) => {
  try {
    const bannerRef = doc(getBannersRef(organizationId), bannerId);
    await updateDoc(bannerRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    toast.success('Bannière mise à jour avec succès');
  } catch (error) {
    console.error('Error updating banner:', error);
    toast.error('Erreur lors de la mise à jour de la bannière');
    throw error;
  }
};

export const deleteBanner = async (organizationId: string, bannerId: string) => {
  try {
    const bannerRef = doc(getBannersRef(organizationId), bannerId);
    await updateDoc(bannerRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
    toast.success('Bannière désactivée avec succès');
  } catch (error) {
    console.error('Error deleting banner:', error);
    toast.error('Erreur lors de la désactivation de la bannière');
    throw error;
  }
};