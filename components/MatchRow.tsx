'use client';

import { useState } from 'react';
import type { MatchInput } from '@/types';
import { useAppStore } from '@/lib/store';
import { useCurrentSession } from '@/lib/hooks';
import { IoAddCircle } from 'react-icons/io5';
import { nanoid } from 'nanoid';

export default function MatchRow() {
  const { addStagedMatch, showToast } = useAppStore();
  const session = useCurrentSession();

  const [teamA1, setTeamA1] = useState('');
  const [teamA2, setTeamA2] = useState('');
  const [teamB1, setTeamB1] = useState('');
  const [teamB2, setTeamB2] = useState('');
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  if (!session) return null;

  const settings = session.settings;

  const validateOnBlur = () => {
    const newErrors: string[] = [];
    const maxWinPoints = settings.totalPoints === 21 ? 11 : 13;
    const valA = parseInt(scoreA) || 0;
    const valB = parseInt(scoreB) || 0;

    if (valA > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamAName} 점수는 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamAName} 점수는 ${maxWinPoints}점을 초과할 수 없습니다`);
    }
    if (valB > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamBName} 점수는 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamBName} 점수는 ${maxWinPoints}점을 초과할 수 없습니다`);
    }

    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!teamA1.trim()) newErrors.push(`${settings.teamAName} 선수1 이름을 입력해주세요`);
    if (!teamA2.trim()) newErrors.push(`${settings.teamAName} 선수2 이름을 입력해주세요`);
    if (!teamB1.trim()) newErrors.push(`${settings.teamBName} 선수1 이름을 입력해주세요`);
    if (!teamB2.trim()) newErrors.push(`${settings.teamBName} 선수2 이름을 입력해주세요`);

    const valA = parseInt(scoreA) || 0;
    const valB = parseInt(scoreB) || 0;

    if (valA === valB) {
      newErrors.push('동점은 허용되지 않습니다');
    }
    if (valA < 0 || valB < 0) {
      newErrors.push('점수는 0 이상이어야 합니다');
    }

    const maxWinPoints = settings.totalPoints === 21 ? 11 : 13;

    if (valA > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamAName} 점수는 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamAName} 점수는 ${maxWinPoints}점을 초과할 수 없습니다`);
    }
    if (valB > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamBName} 점수는 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamBName} 점수는 ${maxWinPoints}점을 초과할 수 없습니다`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleAddMatch = () => {
    if (!validateForm()) return;

    const valA = parseInt(scoreA) || 0;
    const valB = parseInt(scoreB) || 0;

    const matchData: MatchInput = {
      id: nanoid(),
      teamA: [teamA1.trim(), teamA2.trim()],
      teamB: [teamB1.trim(), teamB2.trim()],
      sets: [{ a: valA, b: valB }], // 한 세트로만 구성
      totalScoreA: valA,
      totalScoreB: valB,
      timestamp: Date.now(),
    };

    addStagedMatch(matchData);

    setTeamA1('');
    setTeamA2('');
    setTeamB1('');
    setTeamB2('');
    setScoreA('');
    setScoreB('');
    setErrors([]);

    showToast('경기가 추가되었습니다. "한번에 집계하기"를 눌러주세요.');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={teamA1}
            onChange={(e) => setTeamA1(e.target.value)}
            placeholder="선수1"
            className="flex-1 sm:w-28 px-3 py-3 border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400"
          />
          <input
            type="text"
            value={teamA2}
            onChange={(e) => setTeamA2(e.target.value)}
            placeholder="선수2"
            className="flex-1 sm:w-28 px-3 py-3 border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            onBlur={validateOnBlur}
            placeholder="0"
            className="w-16 px-2 py-3 border-2 border-cyan-500 rounded-lg text-center font-bold bg-white text-gray-900 text-lg focus:outline-none focus:border-cyan-600"
          />
          <span className="text-2xl font-bold text-gray-600">:</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            onBlur={validateOnBlur}
            placeholder="0"
            className="w-16 px-2 py-3 border-2 border-emerald-500 rounded-lg text-center font-bold bg-white text-gray-900 text-lg focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={teamB1}
            onChange={(e) => setTeamB1(e.target.value)}
            placeholder="선수3"
            className="flex-1 sm:w-28 px-3 py-3 border-2 border-emerald-500 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400"
          />
          <input
            type="text"
            value={teamB2}
            onChange={(e) => setTeamB2(e.target.value)}
            placeholder="선수4"
            className="flex-1 sm:w-28 px-3 py-3 border-2 border-emerald-500 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400"
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border-2 border-red-400 rounded-lg">
          <ul className="text-sm text-red-800 font-medium list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={handleAddMatch}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg font-bold text-base"
        >
          <IoAddCircle className="text-xl" />
          경기 추가
        </button>
      </div>
    </div>
  );
}
