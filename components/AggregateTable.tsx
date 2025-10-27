'use client';

import { useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { aggregateMatches, sortPlayersByRank } from '@/utils/aggregation';
import { exportToExcel, exportToCSV, exportToPNG, generateFilename } from '@/utils/export';
import { FaFileExcel, FaFileCsv, FaFileImage, FaTrophy, FaMedal } from 'react-icons/fa';
import { IoStatsChart } from 'react-icons/io5';

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
      <div className="flex flex-wrap gap-3 no-print">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
        >
          <FaFileExcel className="text-lg" />
          엑셀 저장
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
        >
          <FaFileCsv className="text-lg" />
          CSV 저장
        </button>
        <button
          onClick={handleExportPNG}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
        >
          <FaFileImage className="text-lg" />
          PNG 저장
        </button>
      </div>

      {/* Table */}
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <FaTrophy className="text-yellow-500" />
                    순위
                  </div>
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
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {index === 0 && <FaMedal className="text-yellow-400 text-lg" />}
                      {index === 1 && <FaMedal className="text-gray-400 text-lg" />}
                      {index === 2 && <FaMedal className="text-amber-700 text-lg" />}
                      <span className={index < 3 ? 'font-bold text-lg' : ''}>{index + 1}</span>
                    </div>
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
