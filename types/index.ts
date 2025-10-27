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

export interface AppState {
  settings: AppSettings;
  matches: MatchInput[];
  setSettings: (settings: Partial<AppSettings>) => void;
  addMatch: (match: MatchInput) => void;
  updateMatch: (id: string, match: Partial<MatchInput>) => void;
  deleteMatch: (id: string) => void;
  clearAllMatches: () => void;
}
