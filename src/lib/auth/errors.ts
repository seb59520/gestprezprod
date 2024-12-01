import { toast } from 'react-hot-toast';

export const handleAuthError = (error: any) => {
  let message = 'Une erreur est survenue lors de la connexion';
  
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
    case 'auth/popup-blocked':
      message = 'La fenêtre pop-up a été bloquée. Veuillez autoriser les pop-ups pour ce site.';
      break;
    case 'auth/operation-not-allowed':
      message = 'Cette méthode de connexion n\'est pas activée';
      break;
  }

  toast.error(message);
  throw error;
};