'use client';

import { useEffect, useState } from 'react';
import TopBar from '@/components/TopBar';
import MatchRow from '@/components/MatchRow';
import StagingList from '@/components/StagingList';
import AggregateTable from '@/components/AggregateTable';
import InitialSetupModal from '@/components/InitialSetupModal';
import Toast from '@/components/Toast';
import { IoStatsChart } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { useAppStore } from '@/lib/store';
import type { TotalPoints } from '@/types';

export default function Home() {
  const { settings, setSettings, toastMessage, hideToast } = useAppStore();
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
    <div className="min-h-screen bg-bgCustom">
      {showSetup && <InitialSetupModal onComplete={handleSetupComplete} />}
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          message={toastMessage.message}
          onClose={hideToast}
        />
      )}

      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* New Match Entry Section */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
              <FaPlus className="text-primary" />
              새 경기 추가
            </h2>
            <MatchRow />
          </section>

          {/* Staging List Section */}
          <section>
            <StagingList />
          </section>

          {/* Aggregate Results Section */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
              <IoStatsChart className="text-primary" />
              집계 결과
            </h2>
            <AggregateTable />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t-2 border-accent mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-700">
            <p className="font-semibold">배드민턴 경기 기록 v2.0</p>
            <p className="mt-1">
              데이터는 브라우저에 안전하게 저장됩니다 (IndexedDB)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
