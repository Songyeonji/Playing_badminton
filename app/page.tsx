'use client';

import TopBar from '@/components/TopBar';
import MatchList from '@/components/MatchList';
import AggregateTable from '@/components/AggregateTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Aggregate Results Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
      <footer className="bg-white border-t border-gray-200 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>배드민턴 경기 기록 v1.0</p>
            <p className="mt-1">
              데이터는 브라우저에 안전하게 저장됩니다 (IndexedDB)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
