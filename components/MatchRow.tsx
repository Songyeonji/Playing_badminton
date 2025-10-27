'use client';

import { useState } from 'react';
import type { MatchInput, SetScore } from '@/types';
import { useAppStore } from '@/lib/store';
import { IoAddCircle, IoRemoveCircle, IoSave, IoTrash, IoClose } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';

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
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border-2 border-purple-200 p-6 mb-4 hover:shadow-xl transition-all">
      {/* Players Input - One Line */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-3">
          <FaUsers className="text-purple-600" />
          선수 명단
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {/* Team A Players */}
          <div className="flex gap-2">
            <input
              type="text"
              value={teamA1}
              onChange={(e) => setTeamA1(e.target.value)}
              placeholder="선수 1"
              className="w-28 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
            <input
              type="text"
              value={teamA2}
              onChange={(e) => setTeamA2(e.target.value)}
              placeholder="선수 2"
              className="w-28 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>

          {/* VS */}
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-md">
            VS
          </div>

          {/* Team B Players */}
          <div className="flex gap-2">
            <input
              type="text"
              value={teamB1}
              onChange={(e) => setTeamB1(e.target.value)}
              placeholder="선수 3"
              className="w-28 px-3 py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
            />
            <input
              type="text"
              value={teamB2}
              onChange={(e) => setTeamB2(e.target.value)}
              placeholder="선수 4"
              className="w-28 px-3 py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
            />
          </div>
        </div>
      </div>

      {/* Sets - Each Set in One Line */}
      <div className="mb-6">
        <label className="flex items-center justify-between text-sm font-semibold text-purple-700 mb-3">
          <span>세트 점수</span>
          {sets.length < 5 && (
            <button
              onClick={handleAddSet}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <IoAddCircle className="text-lg" />
              세트 추가
            </button>
          )}
        </label>
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/70 p-3 rounded-lg border border-purple-200">
              <span className="text-sm font-bold text-purple-700 w-16">
                세트 {index + 1}
              </span>

              {/* Score Inputs */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={set.a}
                  onChange={(e) => handleSetChange(index, 'a', e.target.value)}
                  className="w-16 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold bg-white"
                  min="0"
                />
                <span className="text-2xl font-bold text-gray-400">:</span>
                <input
                  type="number"
                  value={set.b}
                  onChange={(e) => handleSetChange(index, 'b', e.target.value)}
                  className="w-16 px-3 py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-center font-bold bg-white"
                  min="0"
                />
              </div>

              {sets.length > 1 && (
                <button
                  onClick={() => handleRemoveSet(index)}
                  className="text-red-500 hover:text-red-700 text-2xl ml-auto"
                  title="세트 삭제"
                >
                  <IoRemoveCircle />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <IoSave className="text-lg" />
          저장
        </button>
        {match && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <IoTrash className="text-lg" />
            삭제
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <IoClose className="text-lg" />
            취소
          </button>
        )}
      </div>
    </div>
  );
}
