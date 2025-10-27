import type { MatchInput, PlayerAggregate, TotalPoints, SetScore } from '@/types';

/**
 * Determines which team won a set based on scores
 */
function getSetWinner(set: SetScore): 'a' | 'b' | 'draw' {
  if (set.a > set.b) return 'a';
  if (set.b > set.a) return 'b';
  return 'draw';
}

/**
 * Calculates match winner based on sets won
 */
function getMatchWinner(sets: SetScore[]): 'a' | 'b' | 'draw' {
  let teamAWins = 0;
  let teamBWins = 0;

  sets.forEach(set => {
    const winner = getSetWinner(set);
    if (winner === 'a') teamAWins++;
    if (winner === 'b') teamBWins++;
  });

  if (teamAWins > teamBWins) return 'a';
  if (teamBWins > teamAWins) return 'b';
  return 'draw';
}

/**
 * Calculate win points based on total points setting
 */
function getWinPoints(totalPoints: TotalPoints): number {
  return totalPoints === 21 ? 11 : 13;
}

/**
 * Aggregates all matches to calculate player statistics
 */
export function aggregateMatches(
  matches: MatchInput[],
  totalPoints: TotalPoints
): PlayerAggregate[] {
  const playerMap = new Map<string, PlayerAggregate>();
  const winPoints = getWinPoints(totalPoints);

  // Initialize or get player stats
  function getOrCreatePlayer(name: string): PlayerAggregate {
    if (!playerMap.has(name)) {
      playerMap.set(name, {
        name,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointDiff: 0,
        winPoints: 0,
      });
    }
    return playerMap.get(name)!;
  }

  // Process each match
  matches.forEach(match => {
    const winner = getMatchWinner(match.sets);

    // Process all players in team A
    match.teamA.forEach(playerName => {
      const player = getOrCreatePlayer(playerName);

      if (winner === 'a') {
        player.matchesWon++;
        player.winPoints += winPoints;
      } else if (winner === 'b') {
        player.matchesLost++;
      }

      // Count sets and points
      match.sets.forEach(set => {
        const setWinner = getSetWinner(set);
        if (setWinner === 'a') {
          player.setsWon++;
        } else if (setWinner === 'b') {
          player.setsLost++;
        }
        player.pointsFor += set.a;
        player.pointsAgainst += set.b;
      });
    });

    // Process all players in team B
    match.teamB.forEach(playerName => {
      const player = getOrCreatePlayer(playerName);

      if (winner === 'b') {
        player.matchesWon++;
        player.winPoints += winPoints;
      } else if (winner === 'a') {
        player.matchesLost++;
      }

      // Count sets and points
      match.sets.forEach(set => {
        const setWinner = getSetWinner(set);
        if (setWinner === 'b') {
          player.setsWon++;
        } else if (setWinner === 'a') {
          player.setsLost++;
        }
        player.pointsFor += set.b;
        player.pointsAgainst += set.a;
      });
    });
  });

  // Calculate point differential
  playerMap.forEach(player => {
    player.pointDiff = player.pointsFor - player.pointsAgainst;
  });

  return Array.from(playerMap.values());
}

/**
 * Sorts players by ranking criteria:
 * 1. Win points (descending)
 * 2. Matches won (descending)
 * 3. Point differential (descending)
 * 4. Points for (descending)
 * 5. Sets won (descending)
 * 6. Name (alphabetically)
 */
export function sortPlayersByRank(players: PlayerAggregate[]): PlayerAggregate[] {
  return [...players].sort((a, b) => {
    // 1. Win points
    if (b.winPoints !== a.winPoints) return b.winPoints - a.winPoints;

    // 2. Matches won
    if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;

    // 3. Point differential
    if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;

    // 4. Points for
    if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;

    // 5. Sets won
    if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;

    // 6. Name alphabetically
    return a.name.localeCompare(b.name);
  });
}
