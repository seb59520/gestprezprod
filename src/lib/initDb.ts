import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const initializeDatabase = async (userId: string, email: string) => {
  try {
    // Create organization document first
    const organizationRef = doc(db, 'organizations', userId);
    await setDoc(organizationRef, {
      name: 'Mon Organisation',
      domain: window.location.hostname,
      createdAt: new Date(),
      settings: {
        baseUrl: `${window.location.origin}/stand/`,
        maxReservationDays: 30,
        minAdvanceHours: 24,
        emailNotifications: {
          newReservation: true,
          posterRequest: true,
          maintenance: true
        },
        maintenance: {
          preventiveIntervalMonths: 3,
          emailNotifications: true
        }
      }
    });

    // Create user profile with reference to organization and admin role
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      email,
      role: 'admin',
      organizationId: userId,
      createdAt: new Date(),
      permissions: ['all']
    });

    // Create initial data
    const initialData = {
      stands: [
        {
          name: 'Présentoir Entrée',
          location: 'Hall Principal',
          currentPoster: 'Bienvenue',
          isReserved: false,
          organizationId: userId,
          maintenanceHistory: [],
          posterRequests: [],
          publications: [],
          createdAt: new Date(),
          lastUpdated: new Date()
        }
      ],
      posters: [
        {
          name: 'Affiche Bienvenue',
          description: 'Affiche de bienvenue standard',
          imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
          category: 'Standard',
          isActive: true,
          organizationId: userId,
          createdAt: new Date()
        }
      ],
      publications: [
        {
          title: 'Guide Visiteur',
          description: 'Guide complet pour les visiteurs',
          imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14',
          category: 'Guides',
          isActive: true,
          minStock: 10,
          organizationId: userId,
          createdAt: new Date()
        }
      ]
    };

    // Create collections in batch
    const batch = [];

    // Create stands
    for (const stand of initialData.stands) {
      batch.push(
        setDoc(doc(collection(db, 'stands')), stand)
      );
    }

    // Create posters
    for (const poster of initialData.posters) {
      batch.push(
        setDoc(doc(collection(db, 'posters')), poster)
      );
    }

    // Create publications
    for (const publication of initialData.publications) {
      batch.push(
        setDoc(doc(collection(db, 'publications')), publication)
      );
    }

    // Execute all operations
    await Promise.all(batch);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};