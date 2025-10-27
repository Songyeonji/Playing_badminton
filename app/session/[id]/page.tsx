'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Toast from '@/components/Toast';
import MatchRow from '@/components/MatchRow';
import StagingList from '@/components/StagingList';
import AggregateTable from '@/components/AggregateTable';
import { FaHome, FaPlus } from 'react-icons/fa';
import { IoStatsChart } from 'react-icons/io5';
import { GiShuttlecock } from 'react-icons/gi';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const {
    sessions,
    currentSessionId,
    setCurrentSession,
    toastMessage,
    hideToast,
  } = useAppStore();

  const session = useMemo(
    () => sessions.find((s) => s.id === sessionId),
    [sessions, sessionId]
  );

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }
    setCurrentSession(sessionId);
  }, [session, sessionId, setCurrentSession, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bgCustom">
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          message={toastMessage.message}
          onClose={hideToast}
        />
      )}

      {/* Header */}
      <div className="bg-darkTeal shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GiShuttlecock className="text-3xl text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">{session.name}</h1>
                <p className="text-sm text-lightTeal">
                  {session.settings.teamAName} vs {session.settings.teamBName} | {session.settings.totalPoints}점
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
            >
              <FaHome />
              메인으로
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* New Match Entry Section */}
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
              <FaPlus className="text-teal" />
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
              <IoStatsChart className="text-teal" />
              집계 결과
            </h2>
            <AggregateTable />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cream border-t-2 border-accent mt-12">
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
