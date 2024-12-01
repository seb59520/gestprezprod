import { Timestamp } from 'firebase/firestore';

export interface OrganizationSettings {
  baseUrl: string;
  maxReservationDays: number;
  minAdvanceHours: number;
  emailNotifications: {
    newReservation: boolean;
    posterRequest: boolean;
    maintenance: boolean;
  };
  maintenance: {
    preventiveIntervalMonths: number;
    emailNotifications: boolean;
  };
}

export interface AssemblyInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email?: string;
  phone?: string;
  coordinates?: {
    lat: string;
    lng: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  assembly?: AssemblyInfo;
  settings: OrganizationSettings;
  appSettings?: {
    title: string;
    icon: string;
    description: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// ... rest of the types remain unchanged