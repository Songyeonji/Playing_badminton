'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import type { TotalPoints } from '@/types';
import { GiShuttlecock } from 'react-icons/gi';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

export default function TopBar() {
  const { settings, setSettings } = useAppStore();
  const [editingTeam, setEditingTeam] = useState<'A' | 'B' | null>(null);
  const [tempTeamName, setTempTeamName] = useState('');

  const handleTotalPointsChange = (value: TotalPoints) => {
    setSettings({ totalPoints: value });
  };

  const startEditing = (team: 'A' | 'B') => {
    setEditingTeam(team);
    setTempTeamName(team === 'A' ? settings.teamAName : settings.teamBName);
  };

  const handleTeamNameSave = () => {
    if (tempTeamName.trim()) {
      if (editingTeam === 'A') {
        setSettings({ teamAName: tempTeamName.trim() });
      } else if (editingTeam === 'B') {
        setSettings({ teamBName: tempTeamName.trim() });
      }
    }
    setEditingTeam(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTeamNameSave();
    } else if (e.key === 'Escape') {
      setEditingTeam(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <GiShuttlecock className="text-3xl text-white animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              배드민턴 경기 기록
            </h1>
          </div>

          {/* Team Names */}
          <div className="flex items-center gap-2 text-sm">
            {editingTeam === 'A' ? (
              <input
                type="text"
                value={tempTeamName}
                onChange={(e) => setTempTeamName(e.target.value)}
                onBlur={handleTeamNameSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="px-2 py-1 rounded bg-white/90 text-purple-700 font-medium w-20"
              />
            ) : (
              <button
                onClick={() => startEditing('A')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
              >
                <span>{settings.teamAName}</span>
                <MdEdit className="text-xs" />
              </button>
            )}
            <span className="text-white font-bold">vs</span>
            {editingTeam === 'B' ? (
              <input
                type="text"
                value={tempTeamName}
                onChange={(e) => setTempTeamName(e.target.value)}
                onBlur={handleTeamNameSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="px-2 py-1 rounded bg-white/90 text-pink-700 font-medium w-20"
              />
            ) : (
              <button
                onClick={() => startEditing('B')}
                className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
              >
                <span>{settings.teamBName}</span>
                <MdEdit className="text-xs" />
              </button>
            )}
          </div>

          {/* Total Points */}
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
            <IoSettingsSharp className="text-white text-lg" />
            <span className="text-sm font-medium text-white hidden sm:inline">
              총점:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleTotalPointsChange(21)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  settings.totalPoints === 21
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                21
              </button>
              <button
                onClick={() => handleTotalPointsChange(25)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  settings.totalPoints === 25
                    ? 'bg-white text-purple-600 shadow-md'
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
  );
}
