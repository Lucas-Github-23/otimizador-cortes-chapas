// src/App.tsx

import React from 'react';
import { useOptimizer } from './hooks/useOptimizer';
import SheetConfig from './components/SheetConfig';
import PieceList from './components/PieceList';
import Visualizer from './components/Visualizer';
import { exportToPDF, exportToSVG, exportToDXF } from './services/exportService';
import { FileText, PenTool, Image as ImageIcon, LayoutDashboard } from 'lucide-react';
import type { HeuristicMethod } from './types/types';

export default function App() {
  const { 
    sheet, updateSheet, 
    pieces, addPiece, updatePiece, removePiece, clearAllPieces,
    method, updateMethod, 
    result, calculate 
  } = useOptimizer();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>
        <LayoutDashboard size={32} color="#1890ff" />
        <h1 style={{ margin: 0, color: '#333' }}>Otimizador de Corte de Chapas</h1>
      </div>
      
      <SheetConfig width={sheet.width} height={sheet.height} onChange={updateSheet} />
      
      <PieceList 
        pieces={pieces} 
        sheetConfig={sheet}
        onAdd={addPiece} 
        onUpdate={updatePiece} 
        onRemove={removePiece} 
        onClearAll={clearAllPieces}
      />

      <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fafafa' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>Algoritmo de Otimização (Heurística):</label>
        <select value={method} onChange={(e) => updateMethod(e.target.value as HeuristicMethod)} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}>
          <option value="BottomLeftDecreasing">Bottom-left Decreasing (Padrão e Rápido)</option>
          <option value="MaxRectsSmallestSide">MaxRects Smallest-Side-Fit (Melhor Aproveitamento)</option>
          <option value="SkylineBottomLeft">Skyline Bottom-left (Bom para madeiras)</option>
        </select>
        
        <button onClick={calculate} style={{ width: '100%', padding: '16px', backgroundColor: '#52c41a', color: 'white', fontWeight: 'bold', fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>
          Processar Plano de Corte
        </button>
      </div>

      {result && (
        <>
          <div style={{ padding: '24px', backgroundColor: '#f0f5ff', borderRadius: '8px', border: '1px solid #adc6ff', marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1d39c4' }}>Resumo da Operação</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', fontSize: '16px' }}>
                <li><strong>Chapas Necessárias:</strong> {result.totalBinsUsed} un</li>
                <li><strong>Peças Processadas:</strong> {result.totalItemsProcesssed} un</li>
                <li><strong>Aproveitamento Médio:</strong> <span style={{ color: result.averageUtilization > 80 ? '#52c41a' : '#faad14', fontWeight: 'bold' }}>{result.averageUtilization}%</span></li>
                <li><strong>Desperdício Total:</strong> {result.totalWaste}%</li>
              </ul>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => exportToPDF(result)} style={btnStyle('#ff4d4f')}>
                  <FileText size={18} /> Exportar PDF
                </button>
                <button onClick={() => exportToDXF(result)} style={btnStyle('#1890ff')}>
                  <PenTool size={18} /> Exportar DXF (CAD)
                </button>
                <button onClick={() => exportToSVG(result)} style={btnStyle('#faad14')}>
                  <ImageIcon size={18} /> Exportar SVG
                </button>
              </div>
            </div>
          </div>
          <Visualizer result={result} />
        </>
      )}
    </div>
  );
}

const btnStyle = (color: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px', 
  backgroundColor: color, 
  color: 'white',
  border: 'none', 
  borderRadius: '4px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  fontSize: '14px'
});