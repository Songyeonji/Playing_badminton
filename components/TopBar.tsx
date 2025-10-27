'use client';

import { useAppStore } from '@/lib/store';
import type { TotalPoints } from '@/types';

export default function TopBar() {
  const { settings, setSettings } = useAppStore();

  const handleTotalPointsChange = (value: TotalPoints) => {
    setSettings({ totalPoints: value });
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              배드민턴 경기 기록
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                총점:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTotalPointsChange(21)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    settings.totalPoints === 21
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  21
                </button>
                <button
                  onClick={() => handleTotalPointsChange(25)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    settings.totalPoints === 25
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  25
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
