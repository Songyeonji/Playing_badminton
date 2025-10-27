'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import MatchRow from './MatchRow';
import type { MatchInput } from '@/types';
import { IoAddCircle, IoTrash, IoTrophy } from 'react-icons/io5';
import { MdEdit, MdDeleteSweep } from 'react-icons/md';
import { FaListUl } from 'react-icons/fa';

export default function MatchList() {
  const { matches, clearAllMatches } = useAppStore();
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [showNewMatch, setShowNewMatch] = useState(false);

  const handleClearAll = () => {
    if (window.confirm('모든 경기 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      clearAllMatches();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-purple-700">
          <FaListUl className="text-purple-600" />
          경기 목록
        </h2>
        <div className="flex gap-2">
          {matches.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-lg hover:from-red-200 hover:to-pink-200 transition-all text-sm font-medium no-print border border-red-200"
            >
              <MdDeleteSweep className="text-lg" />
              전체 삭제
            </button>
          )}
          <button
            onClick={() => setShowNewMatch(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all text-sm font-medium no-print shadow-md hover:shadow-lg"
          >
            <IoAddCircle className="text-lg" />
            경기 추가
          </button>
        </div>
      </div>

      {/* New Match Form */}
      {showNewMatch && (
        <MatchRow
          onSave={() => setShowNewMatch(false)}
          onCancel={() => setShowNewMatch(false)}
        />
      )}

      {/* Match List */}
      {matches.length === 0 && !showNewMatch ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">
            아직 등록된 경기가 없습니다.
          </p>
          <button
            onClick={() => setShowNewMatch(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            첫 경기 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) =>
            editingMatchId === match.id ? (
              <MatchRow
                key={match.id}
                match={match}
                onSave={() => setEditingMatchId(null)}
                onCancel={() => setEditingMatchId(null)}
              />
            ) : (
              <MatchCard
                key={match.id}
                match={match}
                onEdit={() => setEditingMatchId(match.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

interface MatchCardProps {
  match: MatchInput;
  onEdit: () => void;
}

function MatchCard({ match, onEdit }: MatchCardProps) {
  const { deleteMatch } = useAppStore();

  const handleDelete = () => {
    if (window.confirm('이 경기를 삭제하시겠습니까?')) {
      deleteMatch(match.id);
    }
  };

  // Calculate match result
  let teamAWins = 0;
  let teamBWins = 0;
  match.sets.forEach((set) => {
    if (set.a > set.b) teamAWins++;
    else if (set.b > set.a) teamBWins++;
  });

  const winner = teamAWins > teamBWins ? 'A' : teamBWins > teamAWins ? 'B' : 'Draw';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded ${
              winner === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {winner === 'A' && <IoTrophy />}
              팀 A
            </span>
            <span className="text-sm text-gray-600">
              {match.teamA[0]} / {match.teamA[1]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded ${
              winner === 'B' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {winner === 'B' && <IoTrophy />}
              팀 B
            </span>
            <span className="text-sm text-gray-600">
              {match.teamB[0]} / {match.teamB[1]}
            </span>
          </div>
        </div>

        <div className="flex gap-2 no-print">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <MdEdit className="text-lg" />
            편집
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            <IoTrash className="text-lg" />
            삭제
          </button>
        </div>
      </div>

      {/* Sets Display */}
      <div className="flex flex-wrap gap-2">
        {match.sets.map((set, index) => (
          <div
            key={index}
            className="px-3 py-1 bg-gray-50 rounded text-sm font-mono"
          >
            세트{index + 1}: {set.a} - {set.b}
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="mt-2 text-xs text-gray-400">
        {new Date(match.timestamp).toLocaleString('ko-KR')}
      </div>
    </div>
  );
}
