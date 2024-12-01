import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserRole {
  role: 'admin' | 'user';
  permissions: string[];
  organizationId?: string;
}

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    
    const data = userDoc.data();
    return {
      role: data.role || 'user',
      permissions: data.permissions || ['read'],
      organizationId: data.organizationId
    };
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const isUserAdmin = (role: UserRole | null): boolean => {
  return role?.role === 'admin';
};