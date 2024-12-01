import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { handleAuthError } from './errors';
import { toast } from 'react-hot-toast';

export const createUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'user',
      createdAt: serverTimestamp(),
      permissions: ['read']
    });
    
    toast.success('Compte créé avec succès');
    return userCredential.user;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success('Connexion réussie');
    return userCredential.user;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    toast.success('Déconnexion réussie');
  } catch (error) {
    return handleAuthError(error);
  }
};