'use client';

import { useState } from 'react';
import { GiShuttlecock } from 'react-icons/gi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import type { TotalPoints, SessionSettings } from '@/types';

interface InitialSetupModalProps {
  onComplete: (settings: SessionSettings) => void;
}

export default function InitialSetupModal({ onComplete }: InitialSetupModalProps) {
  const [selectedPoints, setSelectedPoints] = useState<TotalPoints>(21);
  const [teamAName, setTeamAName] = useState('팀 A');
  const [teamBName, setTeamBName] = useState('팀 B');

  const handleConfirm = () => {
    onComplete({
      totalPoints: selectedPoints,
      teamAName: teamAName.trim() || '팀 A',
      teamBName: teamBName.trim() || '팀 B',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-darkTeal rounded-full p-6">
            <GiShuttlecock className="text-6xl text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-darkTeal">
          배드민턴 경기 기록
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          경기 설정을 시작합니다
        </p>

        {/* Total Points Selection */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
            경기 총점을 선택하세요
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedPoints(21)}
              className={`relative p-6 rounded-xl border-4 transition-all ${
                selectedPoints === 21
                  ? 'border-teal bg-lightTeal/20 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-accent hover:shadow-md'
              }`}
            >
              {selectedPoints === 21 && (
                <IoCheckmarkCircle className="absolute top-2 right-2 text-3xl text-teal" />
              )}
              <div className="text-5xl font-bold text-teal mb-2">21</div>
              <div className="text-sm text-gray-700 font-medium">일반 경기</div>
              <div className="text-xs text-gray-500 mt-1">승리 시 11점</div>
            </button>

            <button
              onClick={() => setSelectedPoints(25)}
              className={`relative p-6 rounded-xl border-4 transition-all ${
                selectedPoints === 25
                  ? 'border-accent bg-lightTeal/20 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-accent hover:shadow-md'
              }`}
            >
              {selectedPoints === 25 && (
                <IoCheckmarkCircle className="absolute top-2 right-2 text-3xl text-accent" />
              )}
              <div className="text-5xl font-bold text-accent mb-2">25</div>
              <div className="text-sm text-gray-700 font-medium">특별 경기</div>
              <div className="text-xs text-gray-500 mt-1">승리 시 13점</div>
            </button>
          </div>
        </div>


        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-teal text-white text-lg font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
