'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import InitialSetupModal from '@/components/InitialSetupModal';
import Toast from '@/components/Toast';
import { FaPlus, FaCalendar, FaTrash, FaInstagram, FaEdit } from 'react-icons/fa';
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
    renameSession,
    completeInitialSetup,
  } = useAppStore();

  const [showSetup, setShowSetup] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingSessionName, setEditingSessionName] = useState('');

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

  const handleEditSessionName = (sessionId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingSessionName(currentName);
  };

  const handleSaveSessionName = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingSessionName.trim()) {
      renameSession(sessionId, editingSessionName.trim());
    }
    setEditingSessionId(null);
    setEditingSessionName('');
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
    setEditingSessionName('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showSetup && <InitialSetupModal onComplete={handleCreateSession} />}
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          message={toastMessage.message}
          onClose={hideToast}
        />
      )}

      {/* Header */}
      <div className="bg-cyan-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <GiShuttlecock className="text-4xl text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                배드민턴 경기 기록
              </h1>
              <p className="text-sm text-cyan-100 mt-1">
                경기별 집계를 관리하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 sm:pb-28">
        {/* New Session Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowSetup(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
          >
            <FaPlus className="text-xl" />
            새로운 집계 시작
          </button>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border-2 border-cyan-200 p-12 text-center">
            <GiShuttlecock className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">
              아직 집계 내역이 없습니다.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
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
                    className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-cyan-500 hover:shadow-lg transition-all cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        {editingSessionId === session.id ? (
                          <div className="flex gap-2 mb-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingSessionName}
                              onChange={(e) => setEditingSessionName(e.target.value)}
                              className="flex-1 px-2 py-1 border-2 border-cyan-500 rounded text-sm font-bold"
                              autoFocus
                            />
                            <button
                              onClick={(e) => handleSaveSessionName(session.id, e)}
                              className="px-2 py-1 bg-cyan-600 text-white rounded text-xs hover:bg-cyan-700"
                            >
                              저장
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {session.name}
                            </h3>
                            <button
                              onClick={(e) => handleEditSessionName(session.id, session.name, e)}
                              className="text-gray-500 hover:text-cyan-600 p-1"
                              title="이름 수정"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaCalendar className="text-xs" />
                          {new Date(session.createdAt).toLocaleString('ko-KR')}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="text-gray-600">총점: </span>
                        <span className="font-bold text-cyan-600">
                          {session.settings.totalPoints}점
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">경기: </span>
                        <span className="font-bold text-cyan-700">
                          {session.matches.length}개
                        </span>
                      </div>
                    </div>

                    {session.stagedMatches.length > 0 && (
                      <div className="mt-2 px-2 py-1 bg-cyan-50 rounded text-xs text-cyan-700 font-medium">
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
