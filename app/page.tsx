'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import InitialSetupModal from '@/components/InitialSetupModal';
import Toast from '@/components/Toast';
import { FaPlus, FaCalendar, FaTrash } from 'react-icons/fa';
import { GiShuttlecock } from 'react-icons/gi';
import type { SessionSettings } from '@/types';

export default function Home() {
  const router = useRouter();
  const {
    sessions,
    initialSetupDone,
    toastMessage,
    hideToast,
    createSession,
    deleteSession,
    completeInitialSetup,
  } = useAppStore();

  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!initialSetupDone) {
      setShowSetup(true);
    }
  }, [initialSetupDone]);

  const handleCreateSession = (settings: SessionSettings) => {
    const sessionName = `경기 ${new Date().toLocaleDateString('ko-KR')} ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    const sessionId = createSession(sessionName, settings);
    completeInitialSetup();
    setShowSetup(false);
    router.push(`/session/${sessionId}`);
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/session/${sessionId}`);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('이 집계를 삭제하시겠습니까?')) {
      deleteSession(sessionId);
    }
  };

  return (
    <div className="min-h-screen bg-bgCustom">
      {showSetup && <InitialSetupModal onComplete={handleCreateSession} />}
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          message={toastMessage.message}
          onClose={hideToast}
        />
      )}

      {/* Header */}
      <div className="bg-darkTeal shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <GiShuttlecock className="text-4xl text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                배드민턴 경기 기록
              </h1>
              <p className="text-sm text-lightTeal mt-1">
                경기별 집계를 관리하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Session Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowSetup(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-teal text-white rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
          >
            <FaPlus className="text-xl" />
            새로운 집계 시작
          </button>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border-2 border-accent p-12 text-center">
            <GiShuttlecock className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">
              아직 집계 내역이 없습니다.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              첫 집계 시작하기
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              집계 내역
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session.id)}
                    className="bg-white rounded-xl shadow-md border-2 border-surface hover:border-teal hover:shadow-lg transition-all cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {session.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendar className="text-xs" />
                          {new Date(session.createdAt).toLocaleString('ko-KR')}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="text-gray-600">총점: </span>
                        <span className="font-bold text-teal">
                          {session.settings.totalPoints}점
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">경기: </span>
                        <span className="font-bold text-darkTeal">
                          {session.matches.length}개
                        </span>
                      </div>
                    </div>

                    {session.stagedMatches.length > 0 && (
                      <div className="mt-2 px-2 py-1 bg-accent/20 rounded text-xs text-teal font-medium">
                        대기 중: {session.stagedMatches.length}개
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
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
