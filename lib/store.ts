import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
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
        teamAName: '팀 A',
        teamBName: '팀 B',
        initialSetupDone: false,
      },
      matches: [],
      stagedMatches: [],
      toastMessage: null,

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

      addStagedMatch: (match) =>
        set((state) => ({
          stagedMatches: [...state.stagedMatches, match],
        })),

      removeStagedMatch: (id) =>
        set((state) => ({
          stagedMatches: state.stagedMatches.filter((match) => match.id !== id),
        })),

      commitStagedMatches: () =>
        set((state) => ({
          matches: [...state.matches, ...state.stagedMatches],
          stagedMatches: [],
        })),

      clearStagedMatches: () =>
        set(() => ({
          stagedMatches: [],
        })),

      showToast: (message) =>
        set(() => ({
          toastMessage: { id: nanoid(), message },
        })),

      hideToast: () =>
        set(() => ({
          toastMessage: null,
        })),
    }),
    {
      name: 'badminton-match-storage',
      storage: createJSONStorage(() => localforageStorage),
    }
  )
);
