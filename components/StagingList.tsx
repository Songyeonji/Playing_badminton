'use client';

import { useAppStore } from '@/lib/store';
import { useCurrentSession } from '@/lib/hooks';
import { FiTrash2 } from 'react-icons/fi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import type { MatchInput } from '@/types';

export default function StagingList() {
  const { removeStagedMatch, commitStagedMatches, clearStagedMatches, showToast } = useAppStore();
  const session = useCurrentSession();

  if (!session || session.stagedMatches.length === 0) {
    return null;
  }

  const handleCommit = () => {
    commitStagedMatches();
    showToast(`${session.stagedMatches.length}개의 경기가 집계되었습니다.`);
  };

  const handleClear = () => {
    if (window.confirm('추가된 모든 경기를 삭제하시겠습니까?')) {
      clearStagedMatches();
      showToast('추가된 경기가 모두 삭제되었습니다.');
    }
  };

  const getMatchSummary = (match: MatchInput) => {
    const teamAWins = match.sets.filter(s => s.a > s.b).length;
    const teamBWins = match.sets.filter(s => s.b > s.a).length;
    const teamATotal = match.sets.reduce((sum, s) => sum + s.a, 0);
    const teamBTotal = match.sets.reduce((sum, s) => sum + s.b, 0);
    return { teamAWins, teamBWins, teamATotal, teamBTotal };
  };

  return (
    <div className="bg-surface rounded-xl shadow-lg border-2 border-accent p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          추가된 경기 ({session.stagedMatches.length}개)
        </h3>
        <div className="flex gap-2">
          <button onClick={handleClear} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium text-sm">전체 삭제</button>
          <button onClick={handleCommit} className="flex items-center gap-2 px-6 py-2 bg-teal text-white rounded-lg hover:bg-opacity-90 transition-colors font-bold text-base shadow-md">
            <IoCheckmarkCircle className="text-xl" />
            한번에 집계하기
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {session.stagedMatches.map((match) => {
          const summary = getMatchSummary(match);
          return (
            <div key={match.id} className="bg-white p-4 rounded-lg border-2 border-accent flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-bold text-gray-900">{match.teamA[0]}, {match.teamA[1]}</div>
                  <div className="px-3 py-1 bg-darkTeal text-white font-bold rounded text-sm">VS</div>
                  <div className="font-bold text-gray-900">{match.teamB[0]}, {match.teamB[1]}</div>
                </div>
                <div className="text-sm text-gray-700">
                  세트: {summary.teamAWins} - {summary.teamBWins} | 총점: {summary.teamATotal} - {summary.teamBTotal}
                </div>
              </div>
              <button onClick={() => removeStagedMatch(match.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors" title="삭제">
                <FiTrash2 className="text-xl" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
