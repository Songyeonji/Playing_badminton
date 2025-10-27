'use client';

import { useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { aggregateMatches, sortPlayersByRank } from '@/utils/aggregation';
import { exportToExcel, exportToCSV, exportToPNG, generateFilename } from '@/utils/export';

export default function AggregateTable() {
  const { matches, settings } = useAppStore();
  const tableRef = useRef<HTMLDivElement>(null);

  const sortedPlayers = useMemo(() => {
    const aggregated = aggregateMatches(matches, settings.totalPoints);
    return sortPlayersByRank(aggregated);
  }, [matches, settings.totalPoints]);

  const handleExportExcel = async () => {
    try {
      await exportToExcel(sortedPlayers, generateFilename('badminton_results', 'xlsx'));
    } catch (error) {
      alert('엑셀 파일 생성에 실패했습니다.');
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(sortedPlayers, generateFilename('badminton_results', 'csv'));
    } catch (error) {
      alert('CSV 파일 생성에 실패했습니다.');
      console.error(error);
    }
  };

  const handleExportPNG = async () => {
    if (!tableRef.current) return;
    try {
      await exportToPNG(tableRef.current, generateFilename('badminton_results', 'png'));
    } catch (error) {
      alert('PNG 이미지 생성에 실패했습니다.');
      console.error(error);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">경기를 추가하여 집계 결과를 확인하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 no-print">
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
        >
          📊 엑셀 저장
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          📄 CSV 저장
        </button>
        <button
          onClick={handleExportPNG}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          🖼️ PNG 저장
        </button>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순위
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  선수명
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  승
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  패
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  세트승
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  세트패
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  득점
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  실점
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  득실차
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  승점
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlayers.map((player, index) => (
                <tr
                  key={player.name}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {player.matchesWon}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {player.matchesLost}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {player.setsWon}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {player.setsLost}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {player.pointsFor}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {player.pointsAgainst}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm text-center font-medium ${
                    player.pointDiff > 0 ? 'text-green-600' : player.pointDiff < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {player.pointDiff > 0 ? '+' : ''}{player.pointDiff}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                    {player.winPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold">{sortedPlayers.length}</span>명의 선수 |{' '}
            <span className="font-semibold">{matches.length}</span>개의 경기
          </p>
        </div>
      </div>
    </div>
  );
}
