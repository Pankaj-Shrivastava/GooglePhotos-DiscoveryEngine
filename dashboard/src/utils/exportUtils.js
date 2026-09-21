import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPdf(elementId, filename = 'discovery_engine_export.pdf') {
  // Use the native browser print dialog, which is vastly superior to html2canvas.
  // It supports modern CSS (like display-p3 colors used by Tailwind v4),
  // generates selectable vector text instead of blurry images, and handles pagination natively.
  
  // We've set up @media print CSS in index.css to hide the sidebar and navigation.
  
  // Small delay to ensure any dropdowns are closed before printing
  setTimeout(() => {
    window.print();
  }, 100);
  
  return true;
}

export function exportToCsv(data, filename = 'discovery_engine_data.csv') {
  if (!data || !data.length) return false;

  // Get all unique keys across all objects to form headers
  const headers = Array.from(
    new Set(data.flatMap(obj => Object.keys(obj)))
  );

  // Escape function for CSV cells
  const escapeCell = (cell) => {
    if (cell === null || cell === undefined) return '';
    if (typeof cell === 'object') return `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build CSV string
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(header => escapeCell(row[header])).join(','))
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return true;
}
