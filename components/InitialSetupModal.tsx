'use client';

import { useState } from 'react';
import { GiShuttlecock } from 'react-icons/gi';
import { IoCheckmarkCircle } from 'react-icons/io5';
import type { TotalPoints } from '@/types';

interface InitialSetupModalProps {
  onComplete: (totalPoints: TotalPoints) => void;
}

export default function InitialSetupModal({ onComplete }: InitialSetupModalProps) {
  const [selectedPoints, setSelectedPoints] = useState<TotalPoints>(21);

  const handleConfirm = () => {
    onComplete(selectedPoints);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6">
            <GiShuttlecock className="text-6xl text-white animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          배드민턴 경기 기록
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          경기 설정을 시작합니다
        </p>

        {/* Total Points Selection */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
            경기 총점을 선택하세요
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedPoints(21)}
              className={`relative p-6 rounded-xl border-4 transition-all ${
                selectedPoints === 21
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              {selectedPoints === 21 && (
                <IoCheckmarkCircle className="absolute top-2 right-2 text-3xl text-purple-600" />
              )}
              <div className="text-5xl font-bold text-purple-600 mb-2">21</div>
              <div className="text-sm text-gray-700 font-medium">일반 경기</div>
              <div className="text-xs text-gray-500 mt-1">승리 시 11점</div>
            </button>

            <button
              onClick={() => setSelectedPoints(25)}
              className={`relative p-6 rounded-xl border-4 transition-all ${
                selectedPoints === 25
                  ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
              }`}
            >
              {selectedPoints === 25 && (
                <IoCheckmarkCircle className="absolute top-2 right-2 text-3xl text-pink-600" />
              )}
              <div className="text-5xl font-bold text-pink-600 mb-2">25</div>
              <div className="text-sm text-gray-700 font-medium">특별 경기</div>
              <div className="text-xs text-gray-500 mt-1">승리 시 13점</div>
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          시작하기
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          언제든지 상단에서 변경할 수 있습니다
        </p>
      </div>
    </div>
  );
}
