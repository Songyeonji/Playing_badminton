export type PlayerName = string;

export interface SetScore {
  a: number;
  b: number;
}

export interface MatchInput {
  id: string;
  teamA: [PlayerName, PlayerName];
  teamB: [PlayerName, PlayerName];
  sets: SetScore[];
  totalScoreA?: number; // VS 사이 입력 필드용
  totalScoreB?: number; // VS 사이 입력 필드용
  timestamp: number;
}

export interface PlayerAggregate {
  name: PlayerName;
  matchesWon: number;
  matchesLost: number;
  setsWon: number;
  setsLost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  winPoints: number; // 11 or 13 per match win
}

export type TotalPoints = 21 | 25;

export interface SessionSettings {
  totalPoints: TotalPoints;
  teamAName: string;
  teamBName: string;
}

export interface Session {
  id: string;
  name: string;
  createdAt: number;
  settings: SessionSettings;
  matches: MatchInput[]; // 집계 완료된 경기들
  stagedMatches: MatchInput[]; // 스테이징 영역: 아직 집계되지 않은 경기들
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface AppState {
  sessions: Session[];
  currentSessionId: string | null;
  toastMessage: ToastMessage | null;
  initialSetupDone: boolean;

  // Session management
  createSession: (name: string, settings: SessionSettings) => string; // returns session id
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  updateSessionSettings: (sessionId: string, settings: Partial<SessionSettings>) => void;
  renameSession: (sessionId: string, name: string) => void;

  // Match management (within current session)
  addStagedMatch: (match: MatchInput) => void;
  removeStagedMatch: (matchId: string) => void;
  updateStagedMatch: (matchId: string, match: Partial<MatchInput>) => void;
  commitStagedMatches: () => void; // Move staged matches to matches
  clearStagedMatches: () => void;
  deleteMatch: (matchId: string) => void; // Delete from matches
  updateMatch: (matchId: string, match: Partial<MatchInput>) => void;
  clearAllMatches: () => void;

  // Toast
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;

  // Initial setup
  completeInitialSetup: () => void;
}
