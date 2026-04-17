// src/components/Visualizer.tsx

import React from 'react';
// ADICIONADO O 'type' NA IMPORTAÇÃO
import type { OptimizationResult } from '../types/types';
import { getColorFromString } from '../utils/colorUtils';

export default function Visualizer({ result }: { result: OptimizationResult }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {result.bins.map(bin => (
        <div key={bin.id} style={{ border: '1px solid #333', position: 'relative', width: '100%', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${bin.width} ${bin.height}`} style={{ width: '100%', height: 'auto' }}>
            {bin.placedPieces.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={p.width} height={p.height} fill={getColorFromString(p.id)} stroke="black" strokeWidth="2" />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}