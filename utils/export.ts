import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import type { PlayerAggregate } from '@/types';

/**
 * Exports player aggregates to Excel format
 */
export async function exportToExcel(
  players: PlayerAggregate[],
  filename: string = 'badminton_results.xlsx'
): Promise<void> {
  // Prepare data for Excel with Korean headers
  const data = players.map((player, index) => ({
    '순위': index + 1,
    '선수명': player.name,
    '승': player.matchesWon,
    '패': player.matchesLost,
    '세트승': player.setsWon,
    '세트패': player.setsLost,
    '득점': player.pointsFor,
    '실점': player.pointsAgainst,
    '득실차': player.pointDiff,
    '승점': player.winPoints,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wch: 6 },  // 순위
    { wch: 15 }, // 선수명
    { wch: 6 },  // 승
    { wch: 6 },  // 패
    { wch: 8 },  // 세트승
    { wch: 8 },  // 세트패
    { wch: 8 },  // 득점
    { wch: 8 },  // 실점
    { wch: 8 },  // 득실차
    { wch: 8 },  // 승점
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '집계결과');

  // Save file
  XLSX.writeFile(workbook, filename);
}

/**
 * Exports player aggregates to CSV format
 */
export function exportToCSV(
  players: PlayerAggregate[],
  filename: string = 'badminton_results.csv'
): void {
  // Prepare CSV content with Korean headers
  const headers = ['순위', '선수명', '승', '패', '세트승', '세트패', '득점', '실점', '득실차', '승점'];
  const rows = players.map((player, index) => [
    index + 1,
    player.name,
    player.matchesWon,
    player.matchesLost,
    player.setsWon,
    player.setsLost,
    player.pointsFor,
    player.pointsAgainst,
    player.pointDiff,
    player.winPoints,
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports an HTML element to PNG image
 */
export async function exportToPNG(
  element: HTMLElement,
  filename: string = 'badminton_results.png'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('PNG 내보내기에 실패했습니다');
  }
}

/**
 * Generates a timestamp-based filename
 */
export function generateFilename(prefix: string, extension: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}_${timestamp}.${extension}`;
}
