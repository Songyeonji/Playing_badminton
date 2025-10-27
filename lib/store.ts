import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import type { AppState, MatchInput, SessionSettings, Session, ToastType } from '@/types';

// Configure localforage for IndexedDB
localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'BadmintonMatchTracker',
  version: 2.0,
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
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      toastMessage: null,
      initialSetupDone: false,

      // Session management
      createSession: (name: string, settings: SessionSettings) => {
        const sessionId = nanoid();
        const newSession: Session = {
          id: sessionId,
          name,
          createdAt: Date.now(),
          settings,
          matches: [],
          stagedMatches: [],
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: sessionId,
        }));
        return sessionId;
      },

      deleteSession: (sessionId: string) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSessionId:
            state.currentSessionId === sessionId ? null : state.currentSessionId,
        })),

      setCurrentSession: (sessionId: string | null) =>
        set(() => ({
          currentSessionId: sessionId,
        })),

      updateSessionSettings: (sessionId: string, settings: Partial<SessionSettings>) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, settings: { ...session.settings, ...settings } }
              : session
          ),
        })),

      renameSession: (sessionId: string, name: string) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, name } : session
          ),
        })),

      // Match management (within current session)
      addStagedMatch: (match: MatchInput) =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? { ...session, stagedMatches: [...session.stagedMatches, match] }
                : session
            ),
          };
        }),

      removeStagedMatch: (matchId: string) =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? {
                    ...session,
                    stagedMatches: session.stagedMatches.filter((m) => m.id !== matchId),
                  }
                : session
            ),
          };
        }),

      updateStagedMatch: (matchId: string, updates: Partial<MatchInput>) =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? {
                    ...session,
                    stagedMatches: session.stagedMatches.map((m) =>
                      m.id === matchId ? { ...m, ...updates } : m
                    ),
                  }
                : session
            ),
          };
        }),

      commitStagedMatches: () =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? {
                    ...session,
                    matches: [...session.matches, ...session.stagedMatches],
                    stagedMatches: [],
                  }
                : session
            ),
          };
        }),

      clearStagedMatches: () =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? { ...session, stagedMatches: [] }
                : session
            ),
          };
        }),

      deleteMatch: (matchId: string) =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? {
                    ...session,
                    matches: session.matches.filter((m) => m.id !== matchId),
                  }
                : session
            ),
          };
        }),

      updateMatch: (matchId: string, updates: Partial<MatchInput>) =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId
                ? {
                    ...session,
                    matches: session.matches.map((m) =>
                      m.id === matchId ? { ...m, ...updates } : m
                    ),
                  }
                : session
            ),
          };
        }),

      clearAllMatches: () =>
        set((state) => {
          const currentSessionId = state.currentSessionId;
          if (!currentSessionId) return state;
          return {
            sessions: state.sessions.map((session) =>
              session.id === currentSessionId ? { ...session, matches: [] } : session
            ),
          };
        }),

      // Toast
      showToast: (message: string, type: ToastType = 'info') =>
        set(() => ({
          toastMessage: { id: nanoid(), message, type },
        })),

      hideToast: () =>
        set(() => ({
          toastMessage: null,
        })),

      // Initial setup
      completeInitialSetup: () =>
        set(() => ({
          initialSetupDone: true,
        })),
    }),
    {
      name: 'badminton-match-storage-v2',
      storage: createJSONStorage(() => localforageStorage),
    }
  )
);
