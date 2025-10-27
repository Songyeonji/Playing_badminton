'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Toast from '@/components/Toast';
import MatchRow from '@/components/MatchRow';
import StagingList from '@/components/StagingList';
import MatchList from '@/components/MatchList';
import AggregateTable from '@/components/AggregateTable';
import { FaHome, FaPlus, FaInstagram, FaList } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gray-50">
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={hideToast}
        />
      )}

      {/* Header */}
      <div className="bg-cyan-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <GiShuttlecock className="text-2xl sm:text-3xl text-white" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">{session.name}</h1>
                <p className="text-xs sm:text-sm text-cyan-100">
                  총점: {session.settings.totalPoints}점
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium text-xs sm:text-base"
            >
              <FaHome className="text-sm sm:text-base" />
              <span className="hidden sm:inline">메인으로</span>
              <span className="sm:hidden">메인</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-28">
        <div className="space-y-8">
          {/* New Match Entry Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              <FaPlus className="text-base sm:text-xl text-cyan-600" />
              새 경기 추가
            </h2>
            <MatchRow />
          </section>

          {/* Staging List Section */}
          <section>
            <StagingList />
          </section>

          {/* Match List Section */}
          <section>
            <MatchList />
          </section>

          {/* Aggregate Results Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              <IoStatsChart className="text-base sm:text-xl text-cyan-600" />
              집계 결과
            </h2>
            <AggregateTable />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2 text-xs">
              <span>© moon._.kkkok</span>
              <span className="text-gray-400">|</span>
              <span>개발자: songyounji</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs text-center">배드민턴 경기 기록 v2.0 • IndexedDB</span>
              <a
                href="https://www.instagram.com/moon._.kkkok?igsh=MXd6bnNjNXE0bTBoMw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors flex-shrink-0"
                title="Instagram"
              >
                <FaInstagram className="text-lg sm:text-xl" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
