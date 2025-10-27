import { useMemo } from 'react';
import { useAppStore } from './store';
import type { Session } from '@/types';

export function useCurrentSession(): Session | null {
  const { sessions, currentSessionId } = useAppStore();

  return useMemo(
    () => sessions.find((s) => s.id === currentSessionId) || null,
    [sessions, currentSessionId]
  );
}
