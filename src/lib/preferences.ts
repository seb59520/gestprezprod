import { openDB } from 'idb';

const DB_NAME = 'user-preferences';
const STORE_NAME = 'preferences';
const DB_VERSION = 1;

const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export interface UserPreferences {
  viewMode: 'gallery' | 'table';
  theme: 'light' | 'dark';
  defaultView: 'gallery' | 'table';
  colors: {
    available: string;
    reserved: string;
    maintenance: string;
    urgent: string;
    aging: string;
    new: string;
  };
}

export const defaultPreferences: UserPreferences = {
  viewMode: 'gallery',
  theme: 'light',
  defaultView: 'gallery',
  colors: {
    available: 'green',
    reserved: 'red',
    maintenance: 'yellow',
    urgent: 'red',
    aging: 'yellow',
    new: 'green'
  }
};

export const preferences = {
  async get(key: string): Promise<any> {
    const db = await getDB();
    return db.get(STORE_NAME, key) || defaultPreferences;
  },

  async set(key: string, value: any): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, value, key);
  },

  async getAll(): Promise<UserPreferences> {
    const db = await getDB();
    const prefs = await db.get(STORE_NAME, 'userPreferences');
    return prefs || defaultPreferences;
  },

  async saveAll(prefs: Partial<UserPreferences>): Promise<void> {
    const db = await getDB();
    const current = await this.getAll();
    await db.put(STORE_NAME, { ...current, ...prefs }, 'userPreferences');
  }
};