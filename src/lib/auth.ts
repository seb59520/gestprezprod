import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { toast } from 'react-hot-toast';

// Enable persistent auth state
setPersistence(auth, browserLocalPersistence);

export interface UserRole {
  role: 'admin' | 'user';
  permissions: string[];
}

// Get user role
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    
    const data = userDoc.data();
    return {
      role: data.role || 'user',
      permissions: data.permissions || []
    };
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Create a new user
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
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

// Sign in with email/password
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success('Connexion réussie');
    return userCredential.user;
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    toast.success('Déconnexion réussie');
  } catch (error: any) {
    handleAuthError(error);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Handle authentication errors
const handleAuthError = (error: any) => {
  let message = 'Une erreur est survenue';
  
  switch (error.code) {
    case 'auth/invalid-email':
      message = 'Adresse email invalide';
      break;
    case 'auth/user-disabled':
      message = 'Ce compte a été désactivé';
      break;
    case 'auth/user-not-found':
      message = 'Aucun compte associé à cet email';
      break;
    case 'auth/wrong-password':
      message = 'Email ou mot de passe incorrect';
      break;
    case 'auth/email-already-in-use':
      message = 'Cette adresse email est déjà utilisée';
      break;
    case 'auth/weak-password':
      message = 'Le mot de passe doit contenir au moins 6 caractères';
      break;
    case 'auth/too-many-requests':
      message = 'Trop de tentatives. Veuillez réessayer plus tard.';
      break;
  }

  toast.error(message);
};