'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useCurrentSession } from '@/lib/hooks';
import { FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import type { MatchInput } from '@/types';

export default function MatchList() {
  const { deleteMatch, updateMatch, showToast } = useAppStore();
  const session = useCurrentSession();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    teamA1: string;
    teamA2: string;
    teamB1: string;
    teamB2: string;
    scoreA: string;
    scoreB: string;
  } | null>(null);

  if (!session || session.matches.length === 0) {
    return null;
  }

  const handleEdit = (match: MatchInput) => {
    setEditingId(match.id);
    setEditData({
      teamA1: match.teamA[0],
      teamA2: match.teamA[1],
      teamB1: match.teamB[0],
      teamB2: match.teamB[1],
      scoreA: String(match.totalScoreA || match.sets[0]?.a || 0),
      scoreB: String(match.totalScoreB || match.sets[0]?.b || 0),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSave = (matchId: string) => {
    if (!editData) return;

    const scoreA = parseInt(editData.scoreA) || 0;
    const scoreB = parseInt(editData.scoreB) || 0;

    if (scoreA === scoreB) {
      showToast('동점은 허용되지 않습니다');
      return;
    }

    const maxWinPoints = session.settings.totalPoints === 21 ? 11 : 13;
    if (scoreA > maxWinPoints || scoreB > maxWinPoints) {
      showToast(`점수는 ${maxWinPoints}점을 넘을 수 없습니다`);
      return;
    }

    updateMatch(matchId, {
      teamA: [editData.teamA1.trim(), editData.teamA2.trim()],
      teamB: [editData.teamB1.trim(), editData.teamB2.trim()],
      sets: [{ a: scoreA, b: scoreB }],
      totalScoreA: scoreA,
      totalScoreB: scoreB,
    });

    showToast('경기가 수정되었습니다');
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = (matchId: string) => {
    if (window.confirm('이 경기를 삭제하시겠습니까?')) {
      deleteMatch(matchId);
      showToast('경기가 삭제되었습니다');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
        집계된 경기 ({session.matches.length}개)
      </h3>
      <div className="space-y-3">
        {session.matches.map((match) => {
          const isEditing = editingId === match.id;
          const scoreA = match.totalScoreA || match.sets[0]?.a || 0;
          const scoreB = match.totalScoreB || match.sets[0]?.b || 0;

          return (
            <div
              key={match.id}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg border-2 border-gray-200"
            >
              {isEditing && editData ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editData.teamA1}
                        onChange={(e) =>
                          setEditData({ ...editData, teamA1: e.target.value })
                        }
                        className="flex-1 sm:w-24 px-2 py-2 border-2 border-cyan-500 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={editData.teamA2}
                        onChange={(e) =>
                          setEditData({ ...editData, teamA2: e.target.value })
                        }
                        className="flex-1 sm:w-24 px-2 py-2 border-2 border-cyan-500 rounded-lg text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editData.scoreA}
                        onChange={(e) =>
                          setEditData({ ...editData, scoreA: e.target.value })
                        }
                        className="w-14 px-2 py-2 border-2 border-cyan-500 rounded-lg text-center font-bold text-base"
                      />
                      <span className="text-xl font-bold">:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editData.scoreB}
                        onChange={(e) =>
                          setEditData({ ...editData, scoreB: e.target.value })
                        }
                        className="w-14 px-2 py-2 border-2 border-emerald-500 rounded-lg text-center font-bold text-base"
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editData.teamB1}
                        onChange={(e) =>
                          setEditData({ ...editData, teamB1: e.target.value })
                        }
                        className="flex-1 sm:w-24 px-2 py-2 border-2 border-emerald-500 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={editData.teamB2}
                        onChange={(e) =>
                          setEditData({ ...editData, teamB2: e.target.value })
                        }
                        className="flex-1 sm:w-24 px-2 py-2 border-2 border-emerald-500 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(match.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium"
                    >
                      <FiSave />
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium"
                    >
                      <FiX />
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <div className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {match.teamA[0]}, {match.teamA[1]}
                      </div>
                      <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-cyan-600 text-white font-bold rounded text-xs sm:text-sm self-start">
                        {scoreA} : {scoreB}
                      </div>
                      <div className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {match.teamB[0]}, {match.teamB[1]}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(match.timestamp).toLocaleString('ko-KR')}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(match)}
                      className="text-cyan-600 hover:text-cyan-800 p-1.5 sm:p-2 hover:bg-cyan-50 rounded transition-colors"
                      title="수정"
                    >
                      <FiEdit2 className="text-base sm:text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
                      className="text-red-600 hover:text-red-800 p-1.5 sm:p-2 hover:bg-red-50 rounded transition-colors"
                      title="삭제"
                    >
                      <FiTrash2 className="text-base sm:text-lg" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
