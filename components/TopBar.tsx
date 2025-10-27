'use client';

import { useAppStore } from '@/lib/store';
import type { TotalPoints } from '@/types';
import { GiShuttlecock } from 'react-icons/gi';
import { IoSettingsSharp } from 'react-icons/io5';

export default function TopBar() {
  const { settings, setSettings } = useAppStore();

  const handleTotalPointsChange = (value: TotalPoints) => {
    setSettings({ totalPoints: value });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <GiShuttlecock className="text-3xl text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              배드민턴 경기 기록
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <IoSettingsSharp className="text-white text-lg" />
              <span className="text-sm font-medium text-white hidden sm:inline">
                총점:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTotalPointsChange(21)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    settings.totalPoints === 21
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  21
                </button>
                <button
                  onClick={() => handleTotalPointsChange(25)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    settings.totalPoints === 25
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
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
