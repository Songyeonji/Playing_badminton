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
    showToast(`${session.stagedMatches.length}개의 경기가 집계되었습니다.`, 'success');
  };

  const handleClear = () => {
    if (window.confirm('추가된 모든 경기를 삭제하시겠습니까?')) {
      clearStagedMatches();
      showToast('추가된 경기가 모두 삭제되었습니다.', 'success');
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
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900">
          추가된 경기 ({session.stagedMatches.length}개)
        </h3>
        <div className="flex gap-2">
          <button onClick={handleClear} className="flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-xs sm:text-sm">전체 삭제</button>
          <button onClick={handleCommit} className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-bold text-xs sm:text-base shadow-md">
            <IoCheckmarkCircle className="text-base sm:text-xl" />
            <span className="hidden sm:inline">한번에 집계하기</span>
            <span className="sm:hidden">집계하기</span>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {session.stagedMatches.map((match) => {
          const summary = getMatchSummary(match);
          return (
            <div key={match.id} className="bg-gray-50 p-2 sm:p-4 rounded-lg border-2 border-gray-200 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                  <div className="font-bold text-xs sm:text-base text-gray-900 truncate">{match.teamA[0]}, {match.teamA[1]}</div>
                  <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-cyan-600 text-white font-bold rounded text-[10px] sm:text-sm self-start">VS</div>
                  <div className="font-bold text-xs sm:text-base text-gray-900 truncate">{match.teamB[0]}, {match.teamB[1]}</div>
                </div>
                <div className="text-[10px] sm:text-sm text-gray-700">
                  점수: {summary.teamATotal} - {summary.teamBTotal}
                </div>
              </div>
              <button onClick={() => removeStagedMatch(match.id)} className="text-red-600 hover:text-red-800 p-1 sm:p-2 hover:bg-red-50 rounded transition-colors flex-shrink-0" title="삭제">
                <FiTrash2 className="text-base sm:text-xl" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
