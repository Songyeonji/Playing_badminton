'use client';

import { useState } from 'react';
import type { MatchInput, SetScore } from '@/types';
import { useAppStore } from '@/lib/store';
import { useCurrentSession } from '@/lib/hooks';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import { FaUsers } from 'react-icons/fa';
import { nanoid } from 'nanoid';

export default function MatchRow() {
  const { addStagedMatch, showToast } = useAppStore();
  const session = useCurrentSession();

  const [teamA1, setTeamA1] = useState('');
  const [teamA2, setTeamA2] = useState('');
  const [teamB1, setTeamB1] = useState('');
  const [teamB2, setTeamB2] = useState('');
  const [totalScoreA, setTotalScoreA] = useState('');
  const [totalScoreB, setTotalScoreB] = useState('');
  const [sets, setSets] = useState<SetScore[]>([{ a: 0, b: 0 }]);
  const [errors, setErrors] = useState<string[]>([]);

  if (!session) return null;

  const settings = session.settings;

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

  const validateOnBlur = () => {
    const newErrors: string[] = [];
    const maxWinPoints = settings.totalPoints === 21 ? 11 : 13;
    const scoreA = parseInt(totalScoreA) || 0;
    const scoreB = parseInt(totalScoreB) || 0;

    if (scoreA > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamAName} 승점은 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamAName} 승점은 ${maxWinPoints}점을 초과할 수 없습니다`);
    }
    if (scoreB > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamBName} 승점은 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamBName} 승점은 ${maxWinPoints}점을 초과할 수 없습니다`);
    }

    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!teamA1.trim()) newErrors.push(`${settings.teamAName} 선수1 이름을 입력해주세요`);
    if (!teamA2.trim()) newErrors.push(`${settings.teamAName} 선수2 이름을 입력해주세요`);
    if (!teamB1.trim()) newErrors.push(`${settings.teamBName} 선수1 이름을 입력해주세요`);
    if (!teamB2.trim()) newErrors.push(`${settings.teamBName} 선수2 이름을 입력해주세요`);

    sets.forEach((set, index) => {
      if (set.a === set.b) {
        newErrors.push(`세트 ${index + 1}: 동점은 허용되지 않습니다`);
      }
      if (set.a < 0 || set.b < 0) {
        newErrors.push(`세트 ${index + 1}: 점수는 0 이상이어야 합니다`);
      }
    });

    const maxWinPoints = settings.totalPoints === 21 ? 11 : 13;
    const scoreA = parseInt(totalScoreA) || 0;
    const scoreB = parseInt(totalScoreB) || 0;

    if (scoreA > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamAName} 승점은 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamAName} 승점은 ${maxWinPoints}점을 초과할 수 없습니다`);
    }
    if (scoreB > maxWinPoints) {
      showToast(`총점 ${settings.totalPoints} 규칙: ${settings.teamBName} 승점은 ${maxWinPoints}점을 넘을 수 없습니다.`);
      newErrors.push(`${settings.teamBName} 승점은 ${maxWinPoints}점을 초과할 수 없습니다`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleAddMatch = () => {
    if (!validateForm()) return;

    const matchData: MatchInput = {
      id: nanoid(),
      teamA: [teamA1.trim(), teamA2.trim()],
      teamB: [teamB1.trim(), teamB2.trim()],
      sets,
      totalScoreA: parseInt(totalScoreA) || undefined,
      totalScoreB: parseInt(totalScoreB) || undefined,
      timestamp: Date.now(),
    };

    addStagedMatch(matchData);

    setTeamA1('');
    setTeamA2('');
    setTeamB1('');
    setTeamB2('');
    setTotalScoreA('');
    setTotalScoreB('');
    setSets([{ a: 0, b: 0 }]);
    setErrors([]);

    showToast('경기가 추가되었습니다. "한번에 집계하기"를 눌러주세요.');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-4">
      <div className="mb-6">
        <label className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
          <FaUsers className="text-cyan-600 text-xl" />
          선수 명단
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">{settings.teamAName}</label>
            <div className="flex gap-2">
              <input type="text" value={teamA1} onChange={(e) => setTeamA1(e.target.value)} placeholder="선수 1" className="w-28 px-3 py-3 border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400" />
              <input type="text" value={teamA2} onChange={(e) => setTeamA2(e.target.value)} placeholder="선수 2" className="w-28 px-3 py-3 border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="px-5 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md text-lg">VS</div>
            <div className="flex items-center gap-2">
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={totalScoreA} onChange={(e) => setTotalScoreA(e.target.value)} onBlur={validateOnBlur} placeholder="0" className="w-16 px-2 py-2 border-2 border-cyan-500 rounded text-center font-bold bg-white text-gray-900 text-base" />
              <span className="text-xl font-bold text-gray-600">:</span>
              <input type="text" inputMode="numeric" pattern="[0-9]*" value={totalScoreB} onChange={(e) => setTotalScoreB(e.target.value)} onBlur={validateOnBlur} placeholder="0" className="w-16 px-2 py-2 border-2 border-emerald-500 rounded text-center font-bold bg-white text-gray-900 text-base" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">{settings.teamBName}</label>
            <div className="flex gap-2">
              <input type="text" value={teamB1} onChange={(e) => setTeamB1(e.target.value)} placeholder="선수 3" className="w-28 px-3 py-3 border-2 border-emerald-500 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400" />
              <input type="text" value={teamB2} onChange={(e) => setTeamB2(e.target.value)} placeholder="선수 4" className="w-28 px-3 py-3 border-2 border-emerald-500 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-gray-900 font-medium text-base placeholder-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label className="flex items-center justify-between text-base font-bold text-gray-900 mb-3">
          <span>세트 점수</span>
          {sets.length < 5 && (
            <div className="flex flex-col items-end gap-1">
              <button onClick={handleAddSet} className="flex items-center gap-1 text-sm text-white hover:text-white font-bold bg-emerald-500 px-3 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                <IoAddCircle className="text-lg" />
                세트 추가
              </button>
              <span className="text-xs text-gray-600 max-w-[200px] text-right">세트 추가는 같은 팀 구성으로 점수만 입력할 때 사용</span>
            </div>
          )}
        </label>
        <div className="space-y-3">
          {sets.map((set, index) => (
            <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-200 shadow-sm">
              <span className="text-base font-bold text-gray-900 w-20">세트 {index + 1}</span>
              <div className="flex items-center gap-3">
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={set.a} onChange={(e) => handleSetChange(index, 'a', e.target.value)} className="w-20 px-4 py-3 border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 text-center font-bold bg-white text-gray-900 text-lg" />
                <span className="text-3xl font-bold text-gray-600">:</span>
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={set.b} onChange={(e) => handleSetChange(index, 'b', e.target.value)} className="w-20 px-4 py-3 border-2 border-emerald-500 rounded-lg focus:outline-none focus:border-emerald-600 text-center font-bold bg-white text-gray-900 text-lg" />
              </div>
              {sets.length > 1 && (
                <button onClick={() => handleRemoveSet(index)} className="text-red-600 hover:text-red-800 text-3xl ml-auto" title="세트 삭제">
                  <IoRemoveCircle />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-400 rounded-lg">
          <ul className="text-sm text-red-800 font-medium list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={handleAddMatch} className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-md hover:shadow-lg font-bold text-base">
          <IoAddCircle className="text-xl" />
          경기 추가
        </button>
      </div>
    </div>
  );
}
