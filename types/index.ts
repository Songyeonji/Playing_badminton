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

export interface AppSettings {
  totalPoints: TotalPoints;
  mergePlayersByName: boolean; // true = merge same names
  teamAName: string;
  teamBName: string;
  initialSetupDone: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
}

export interface AppState {
  settings: AppSettings;
  matches: MatchInput[];
  stagedMatches: MatchInput[]; // 스테이징 영역: 아직 집계되지 않은 경기들
  toastMessage: ToastMessage | null;
  setSettings: (settings: Partial<AppSettings>) => void;
  addMatch: (match: MatchInput) => void;
  updateMatch: (id: string, match: Partial<MatchInput>) => void;
  deleteMatch: (id: string) => void;
  clearAllMatches: () => void;
  addStagedMatch: (match: MatchInput) => void; // 스테이징에 경기 추가
  removeStagedMatch: (id: string) => void; // 스테이징에서 경기 제거
  commitStagedMatches: () => void; // 스테이징의 모든 경기를 실제 matches로 이동하고 집계
  clearStagedMatches: () => void; // 스테이징 비우기
  showToast: (message: string) => void;
  hideToast: () => void;
}
