import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { AppState, MatchInput } from '@/types';

// Configure localforage for IndexedDB
localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'BadmintonMatchTracker',
  version: 1.0,
  storeName: 'app_state',
  description: 'Badminton match tracking data',
});

// Custom storage implementation using localforage
const localforageStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await localforage.getItem<string>(name);
    return value || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        totalPoints: 21,
        mergePlayersByName: true,
      },
      matches: [],

      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      addMatch: (match) =>
        set((state) => ({
          matches: [...state.matches, match],
        })),

      updateMatch: (id, updates) =>
        set((state) => ({
          matches: state.matches.map((match) =>
            match.id === id ? { ...match, ...updates } : match
          ),
        })),

      deleteMatch: (id) =>
        set((state) => ({
          matches: state.matches.filter((match) => match.id !== id),
        })),

      clearAllMatches: () =>
        set(() => ({
          matches: [],
        })),
    }),
    {
      name: 'badminton-match-storage',
      storage: createJSONStorage(() => localforageStorage),
    }
  )
);
