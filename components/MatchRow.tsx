'use client';

import { useState } from 'react';
import type { MatchInput, SetScore } from '@/types';
import { useAppStore } from '@/lib/store';

interface MatchRowProps {
  match?: MatchInput;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function MatchRow({ match, onSave, onCancel }: MatchRowProps) {
  const { addMatch, updateMatch, deleteMatch, settings } = useAppStore();

  const [teamA1, setTeamA1] = useState(match?.teamA[0] || '');
  const [teamA2, setTeamA2] = useState(match?.teamA[1] || '');
  const [teamB1, setTeamB1] = useState(match?.teamB[0] || '');
  const [teamB2, setTeamB2] = useState(match?.teamB[1] || '');
  const [sets, setSets] = useState<SetScore[]>(
    match?.sets || [{ a: 0, b: 0 }]
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddSet = () => {
    if (sets.length < 5) {
      setSets([...sets, { a: 0, b: 0 }]);
    }
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const handleSetChange = (index: number, team: 'a' | 'b', value: string) => {
    const numValue = parseInt(value) || 0;
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [team]: numValue };
    setSets(newSets);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Validate names
    if (!teamA1.trim()) newErrors.push('팀 A 선수1 이름을 입력해주세요');
    if (!teamA2.trim()) newErrors.push('팀 A 선수2 이름을 입력해주세요');
    if (!teamB1.trim()) newErrors.push('팀 B 선수1 이름을 입력해주세요');
    if (!teamB2.trim()) newErrors.push('팀 B 선수2 이름을 입력해주세요');

    // Validate sets
    sets.forEach((set, index) => {
      if (set.a === set.b) {
        newErrors.push(`세트 ${index + 1}: 동점은 허용되지 않습니다`);
      }
      if (set.a < 0 || set.b < 0) {
        newErrors.push(`세트 ${index + 1}: 점수는 0 이상이어야 합니다`);
      }
      const maxScore = settings.totalPoints + 10;
      if (set.a > maxScore || set.b > maxScore) {
        newErrors.push(`세트 ${index + 1}: 점수가 너무 높습니다`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const matchData: MatchInput = {
      id: match?.id || `match-${Date.now()}`,
      teamA: [teamA1.trim(), teamA2.trim()],
      teamB: [teamB1.trim(), teamB2.trim()],
      sets,
      timestamp: match?.timestamp || Date.now(),
    };

    if (match) {
      updateMatch(match.id, matchData);
    } else {
      addMatch(matchData);
    }

    // Reset form for new entry
    if (!match) {
      setTeamA1('');
      setTeamA2('');
      setTeamB1('');
      setTeamB2('');
      setSets([{ a: 0, b: 0 }]);
    }

    setErrors([]);
    onSave?.();
  };

  const handleDelete = () => {
    if (match && window.confirm('이 경기를 삭제하시겠습니까?')) {
      deleteMatch(match.id);
      onCancel?.();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      {/* Team A */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          팀 A
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={teamA1}
            onChange={(e) => setTeamA1(e.target.value)}
            placeholder="선수 1"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={teamA2}
            onChange={(e) => setTeamA2(e.target.value)}
            placeholder="선수 2"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Team B */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          팀 B
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={teamB1}
            onChange={(e) => setTeamB1(e.target.value)}
            placeholder="선수 1"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={teamB2}
            onChange={(e) => setTeamB2(e.target.value)}
            placeholder="선수 2"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sets */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          세트 점수
        </label>
        <div className="space-y-2">
          {sets.map((set, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 w-16">
                세트 {index + 1}:
              </span>
              <input
                type="number"
                value={set.a}
                onChange={(e) => handleSetChange(index, 'a', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <span className="text-gray-500">:</span>
              <input
                type="number"
                value={set.b}
                onChange={(e) => handleSetChange(index, 'b', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              {sets.length > 1 && (
                <button
                  onClick={() => handleRemoveSet(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
        {sets.length < 5 && (
          <button
            onClick={handleAddSet}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + 세트 추가
          </button>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <ul className="text-sm text-red-600 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          저장
        </button>
        {match && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            삭제
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
}
