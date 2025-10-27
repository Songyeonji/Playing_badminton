import type { MatchInput, SetScore, TotalPoints } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates a set score
 */
export function validateSetScore(
  set: SetScore,
  totalPoints: TotalPoints
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if scores are non-negative
  if (set.a < 0) {
    errors.push({
      field: 'setA',
      message: '점수는 0 이상이어야 합니다',
    });
  }

  if (set.b < 0) {
    errors.push({
      field: 'setB',
      message: '점수는 0 이상이어야 합니다',
    });
  }

  // Check for tie
  if (set.a === set.b) {
    errors.push({
      field: 'set',
      message: '세트는 동점일 수 없습니다',
    });
  }

  // Check if scores exceed reasonable limits (allow deuce games)
  const maxScore = totalPoints + 10; // Allow up to 10 points over for deuce
  if (set.a > maxScore || set.b > maxScore) {
    errors.push({
      field: 'set',
      message: `점수가 너무 높습니다 (최대: ${maxScore})`,
    });
  }

  // Winning score should be at least the total points (unless deuce)
  const winner = Math.max(set.a, set.b);
  const loser = Math.min(set.a, set.b);

  if (winner < totalPoints && loser >= totalPoints - 2) {
    errors.push({
      field: 'set',
      message: `승리 점수는 최소 ${totalPoints}점이어야 합니다`,
    });
  }

  return errors;
}

/**
 * Validates player names
 */
export function validatePlayerNames(
  teamA: [string, string],
  teamB: [string, string]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for empty names
  if (!teamA[0]?.trim()) {
    errors.push({
      field: 'teamA.player1',
      message: '선수 이름을 입력해주세요',
    });
  }

  if (!teamA[1]?.trim()) {
    errors.push({
      field: 'teamA.player2',
      message: '선수 이름을 입력해주세요',
    });
  }

  if (!teamB[0]?.trim()) {
    errors.push({
      field: 'teamB.player1',
      message: '선수 이름을 입력해주세요',
    });
  }

  if (!teamB[1]?.trim()) {
    errors.push({
      field: 'teamB.player2',
      message: '선수 이름을 입력해주세요',
    });
  }

  return errors;
}

/**
 * Validates a complete match
 */
export function validateMatch(
  match: MatchInput,
  totalPoints: TotalPoints
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate player names
  errors.push(...validatePlayerNames(match.teamA, match.teamB));

  // Check if at least one set exists
  if (match.sets.length === 0) {
    errors.push({
      field: 'sets',
      message: '최소 1개의 세트를 입력해주세요',
    });
  }

  // Check maximum sets
  if (match.sets.length > 5) {
    errors.push({
      field: 'sets',
      message: '최대 5개의 세트까지만 입력 가능합니다',
    });
  }

  // Validate each set
  match.sets.forEach((set, index) => {
    const setErrors = validateSetScore(set, totalPoints);
    errors.push(
      ...setErrors.map(err => ({
        ...err,
        field: `set${index + 1}.${err.field}`,
      }))
    );
  });

  return errors;
}
