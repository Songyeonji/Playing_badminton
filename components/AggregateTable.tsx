'use client';

import { useMemo, useRef } from 'react';
import { useCurrentSession } from '@/lib/hooks';
import { aggregateMatches, sortPlayersByRank } from '@/utils/aggregation';
import { exportToExcel, exportToCSV, exportToPNG, generateFilename } from '@/utils/export';
import { FaFileExcel, FaFileCsv, FaFileImage, FaTrophy, FaMedal } from 'react-icons/fa';

export default function AggregateTable() {
  const session = useCurrentSession();
  const tableRef = useRef<HTMLDivElement>(null);

  const sortedPlayers = useMemo(() => {
    if (!session) return [];
    const aggregated = aggregateMatches(session.matches, session.settings.totalPoints);
    return sortPlayersByRank(aggregated);
  }, [session]);

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

  if (!session || session.matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">경기를 추가하여 집계 결과를 확인하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 sm:gap-3 no-print">
        <button onClick={handleExportExcel} className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-xs sm:text-sm font-medium shadow-md hover:shadow-lg">
          <FaFileExcel className="text-base sm:text-lg" />
          엑셀
        </button>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-xs sm:text-sm font-medium shadow-md hover:shadow-lg">
          <FaFileCsv className="text-base sm:text-lg" />
          CSV
        </button>
        <button onClick={handleExportPNG} className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-xs sm:text-sm font-medium shadow-md hover:shadow-lg">
          <FaFileImage className="text-base sm:text-lg" />
          PNG
        </button>
      </div>
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <FaTrophy className="text-yellow-500" />
                    순위
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">선수명</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">승</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">패</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">세트승</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">세트패</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">득점</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">실점</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">득실차</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPlayers.map((player, index) => (
                <tr key={player.name} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-cyan-50 transition-colors`}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {index === 0 && <FaMedal className="text-yellow-400 text-lg" />}
                      {index === 1 && <FaMedal className="text-gray-400 text-lg" />}
                      {index === 2 && <FaMedal className="text-amber-700 text-lg" />}
                      <span className={index < 3 ? 'font-bold text-lg' : ''}>{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{player.matchesWon}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{player.matchesLost}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{player.setsWon}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{player.setsLost}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{player.pointsFor}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{player.pointsAgainst}</td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm text-center font-medium ${player.pointDiff > 0 ? 'text-green-600' : player.pointDiff < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {player.pointDiff > 0 ? '+' : ''}{player.pointDiff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold">{sortedPlayers.length}</span>명의 선수 |{' '}
            <span className="font-semibold">{session.matches.length}</span>개의 경기
          </p>
        </div>
      </div>
    </div>
  );
}
