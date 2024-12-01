import { collection, query, where, orderBy, limit, addDoc, updateDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: any;
  organizationId: string;
  userId: string;
  link?: string;
  category?: 'maintenance' | 'reservation' | 'stock' | 'system';
}

export const getNotificationsRef = (organizationId: string) => 
  collection(db, 'organizations', organizationId, 'notifications');

export const getUnreadNotificationsQuery = (organizationId: string, userId: string) => 
  query(
    getNotificationsRef(organizationId),
    where('userId', '==', userId),
    where('isRead', '==', false),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

export const createNotification = async (
  organizationId: string, 
  userId: string,
  data: Omit<Notification, 'id' | 'createdAt' | 'organizationId' | 'userId' | 'isRead'>
) => {
  try {
    const notificationsRef = getNotificationsRef(organizationId);
    await addDoc(notificationsRef, {
      ...data,
      organizationId,
      userId,
      isRead: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const markAsRead = async (organizationId: string, notificationId: string) => {
  try {
    const notificationRef = doc(getNotificationsRef(organizationId), notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
      readAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async (organizationId: string, userId: string) => {
  try {
    const batch = writeBatch(db);
    const unreadQuery = query(
      getNotificationsRef(organizationId),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(unreadQuery);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        isRead: true,
        readAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    toast.success('Toutes les notifications ont été marquées comme lues');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    toast.error('Erreur lors de la mise à jour des notifications');
    throw error;
  }
};