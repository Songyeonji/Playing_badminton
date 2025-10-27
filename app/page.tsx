'use client';

import { useEffect, useState } from 'react';
import TopBar from '@/components/TopBar';
import MatchList from '@/components/MatchList';
import AggregateTable from '@/components/AggregateTable';
import InitialSetupModal from '@/components/InitialSetupModal';
import { IoStatsChart } from 'react-icons/io5';
import { useAppStore } from '@/lib/store';
import type { TotalPoints } from '@/types';

export default function Home() {
  const { settings, setSettings } = useAppStore();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Check if initial setup is done
    if (!settings.initialSetupDone) {
      setShowSetup(true);
    }
  }, [settings.initialSetupDone]);

  const handleSetupComplete = (totalPoints: TotalPoints) => {
    setSettings({
      totalPoints,
      initialSetupDone: true
    });
    setShowSetup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {showSetup && <InitialSetupModal onComplete={handleSetupComplete} />}

      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Aggregate Results Section */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-purple-700 mb-4">
              <IoStatsChart className="text-purple-600" />
              집계 결과
            </h2>
            <AggregateTable />
          </section>

          {/* Match List Section */}
          <section>
            <MatchList />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-100 to-pink-100 border-t-2 border-purple-200 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-purple-700">
            <p className="font-semibold">배드민턴 경기 기록 v1.0</p>
            <p className="mt-1">
              데이터는 브라우저에 안전하게 저장됩니다 (IndexedDB)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
