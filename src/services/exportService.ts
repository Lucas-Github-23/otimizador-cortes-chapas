// src/services/exportService.ts

import type { OptimizationResult } from '../types/types';
import jsPDF from 'jspdf';

export function exportToSVG(result: OptimizationResult) {
  if (!result || result.bins.length === 0) return;

  const spacing = 200; // Espaçamento entre as chapas (em mm)
  // Calcula a largura máxima necessária e a altura total de todas as chapas somadas
  const maxWidth = Math.max(...result.bins.map(b => b.width));
  const totalHeight = result.bins.reduce((sum, bin) => sum + bin.height + spacing, 0);

  // O viewBox garante que o desenho escala perfeitamente sem nunca cortar nada
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 ${maxWidth + 100} ${totalHeight}" width="100%" height="100%">`;
  
  let currentY = 0;

  result.bins.forEach((bin, index) => {
    // Desenha a chapa
    svg += `<rect x="0" y="${currentY}" width="${bin.width}" height="${bin.height}" fill="none" stroke="#333" stroke-width="6" />`;
    
    // Título da Chapa
    svg += `<text x="0" y="${currentY - 20}" fill="#333" font-size="64" font-family="sans-serif" font-weight="bold">Chapa ${index + 1} (${bin.width}x${bin.height}mm)</text>`;

    // Desenha as peças
    bin.placedPieces.forEach(p => {
      svg += `<rect x="${p.x}" y="${currentY + p.y}" width="${p.width}" height="${p.height}" fill="#d9d9d9" stroke="#000" stroke-width="2" />`;
      
      // Adiciona o texto com as medidas (só se a peça tiver tamanho suficiente para o texto caber)
      if (p.width > 200 && p.height > 200) {
        svg += `<text x="${p.x + p.width / 2}" y="${currentY + p.y + p.height / 2}" fill="#000" font-size="48" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${p.width}x${p.height}</text>`;
      }
    });
    
    currentY += bin.height + spacing;
  });

  svg += `</svg>`;
  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'plano_de_corte.svg');
}

export function exportToPDF(result: OptimizationResult) {
  const doc = new jsPDF();
  doc.text('Relatório de Corte', 10, 10);
  doc.text(`Chapas Utilizadas: ${result.totalBinsUsed}`, 10, 20);
  doc.text(`Aproveitamento Medio: ${result.averageUtilization}%`, 10, 30);
  doc.text(`Desperdicio: ${result.totalWaste}%`, 10, 40);
  
  let yOffset = 50;
  result.bins.forEach((bin, i) => {
    if (yOffset > 270) {
      doc.addPage();
      yOffset = 20;
    }
    doc.text(`Chapa ${i + 1} - Uso: ${bin.utilizationPercentage.toFixed(2)}%`, 10, yOffset);
    yOffset += 10;
  });

  doc.save('relatorio_corte.pdf');
}

export function exportToDXF(result: OptimizationResult) {
  let dxf = `0\nSECTION\n2\nENTITIES\n`;
  
  result.bins.forEach((bin, i) => {
    // Coloca as chapas lado a lado no CAD, com 500mm de espaço entre elas
    const offset = i * (bin.width + 500);
    
    // Contorno da Chapa
    dxf += `0\nLWPOLYLINE\n90\n4\n70\n1\n10\n${offset}\n20\n0\n10\n${offset+bin.width}\n20\n0\n10\n${offset+bin.width}\n20\n${bin.height}\n10\n${offset}\n20\n${bin.height}\n`;
    
    // Peças
    bin.placedPieces.forEach(p => {
      dxf += `0\nLWPOLYLINE\n90\n4\n70\n1\n10\n${offset+p.x}\n20\n${p.y}\n10\n${offset+p.x+p.width}\n20\n${p.y}\n10\n${offset+p.x+p.width}\n20\n${p.y+p.height}\n10\n${offset+p.x}\n20\n${p.y+p.height}\n`;
    });
  });
  
  dxf += `0\nENDSEC\n0\nEOF\n`;
  downloadBlob(new Blob([dxf], { type: 'application/dxf' }), 'plano_de_corte.dxf');
}

function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}