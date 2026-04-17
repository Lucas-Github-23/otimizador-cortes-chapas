import type { OptimizationResult } from '../types/types';
import jsPDF from 'jspdf';

export function exportToSVG(result: OptimizationResult) {
  if (!result || result.bins.length === 0) return;

  const spacing = 200;
  const maxWidth = Math.max(...result.bins.map(b => b.width));
  const totalHeight = result.bins.reduce((sum, bin) => sum + bin.height + spacing, 0);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 ${maxWidth + 100} ${totalHeight}" width="100%" height="100%">`;
  let currentY = 0;

  result.bins.forEach((bin, index) => {
    svg += `<rect x="0" y="${currentY}" width="${bin.width}" height="${bin.height}" fill="none" stroke="#333" stroke-width="6" />`;
    svg += `<text x="0" y="${currentY - 20}" fill="#333" font-size="64" font-family="sans-serif" font-weight="bold">Chapa ${index + 1} (${bin.width}x${bin.height}mm)</text>`;

    bin.placedPieces.forEach(p => {
      svg += `<rect x="${p.x}" y="${currentY + p.y}" width="${p.width}" height="${p.height}" fill="#d9d9d9" stroke="#000" stroke-width="2" />`;
      if (p.width > 200 && p.height > 200) {
        svg += `<text x="${p.x + p.width / 2}" y="${currentY + p.y + p.height / 2}" fill="#000" font-size="48" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${p.width}x${p.height}</text>`;
      }
    });
    currentY += bin.height + spacing;
  });

  svg += `</svg>`;
  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'mapa_de_corte.svg');
}

export function exportToPDF(result: OptimizationResult) {
  if (!result || result.bins.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Cabeçalho do Relatório
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Mapa de Corte', margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Data: ${new Date().toLocaleDateString()} | Peças Totais: ${result.totalItemsProcesssed}`, margin, 28);
  
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 32, pageWidth - margin, 32);

  // Resumo Estatístico
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Estatísticas:', margin, 42);
  doc.setFontSize(10);
  doc.text(`- Total de Chapas: ${result.totalBinsUsed}`, margin + 5, 50);
  doc.text(`- Aproveitamento: ${result.averageUtilization}%`, margin + 5, 56);
  doc.text(`- Desperdício: ${result.totalWaste}%`, margin + 5, 62);

  let currentY = 75;

  result.bins.forEach((bin, index) => {
    const scale = contentWidth / bin.width;
    const drawHeight = bin.height * scale;

    if (currentY + drawHeight + 20 > pageHeight) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Chapa ${index + 1} (${bin.width}x${bin.height}mm) - Uso: ${bin.utilizationPercentage.toFixed(2)}%`, margin, currentY);
    currentY += 5;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(margin, currentY, contentWidth, drawHeight);

    bin.placedPieces.forEach(p => {
      const px = margin + (p.x * scale);
      const py = currentY + (p.y * scale);
      const pw = p.width * scale;
      const ph = p.height * scale;

      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.1);
      doc.setFillColor(240, 240, 240);
      doc.rect(px, py, pw, ph, 'FD');

      if (pw > 12 && ph > 6) {
        doc.setFontSize(6);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(`${p.width}x${p.height}`, px + (pw / 2), py + (ph / 2), { align: 'center', baseline: 'middle' });
      }
    });

    currentY += drawHeight + 20;
  });

  doc.save('mapa_de_corte.pdf');
}

export function exportToDXF(result: OptimizationResult) {
  let dxf = `0\nSECTION\n2\nENTITIES\n`;
  result.bins.forEach((bin, i) => {
    const offset = i * (bin.width + 500);
    dxf += `0\nLWPOLYLINE\n90\n4\n70\n1\n10\n${offset}\n20\n0\n10\n${offset+bin.width}\n20\n0\n10\n${offset+bin.width}\n20\n${bin.height}\n10\n${offset}\n20\n${bin.height}\n`;
    bin.placedPieces.forEach(p => {
      dxf += `0\nLWPOLYLINE\n90\n4\n70\n1\n10\n${offset+p.x}\n20\n${p.y}\n10\n${offset+p.x+p.width}\n20\n${p.y}\n10\n${offset+p.x+p.width}\n20\n${p.y+p.height}\n10\n${offset+p.x}\n20\n${p.y+p.height}\n`;
    });
  });
  dxf += `0\nENDSEC\n0\nEOF\n`;
  downloadBlob(new Blob([dxf], { type: 'application/dxf' }), 'mapa_de_corte.dxf');
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}