// src/components/PieceList.tsx

import React from 'react';
import { Trash2, XCircle, PlusCircle } from 'lucide-react';
import type { Piece, Sheet } from '../types/types';

interface PieceListProps {
  pieces: Piece[];
  sheetConfig: Sheet;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Piece, value: number) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function PieceList({ pieces, sheetConfig, onAdd, onUpdate, onRemove, onClearAll }: PieceListProps) {
  
  const isPieceTooBig = (width: number, height: number) => {
    if (!width || !height) return false;
    const fitsNormal = width <= sheetConfig.width && height <= sheetConfig.height;
    const fitsRotated = width <= sheetConfig.height && height <= sheetConfig.width;
    return !fitsNormal && !fitsRotated;
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Lista de Peças</h2>
        {pieces.length > 0 && (
          <button 
            onClick={onClearAll}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
          >
            <Trash2 size={16} /> Limpar Tudo
          </button>
        )}
      </div>
      
      {pieces.length === 0 ? (
        <p style={{ color: '#666', marginTop: '16px' }}>Nenhuma peça adicionada. Clique em Adicionar Peça para começar.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '16px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ paddingBottom: '8px', borderBottom: '1px solid #eee' }}>#</th>
                <th style={{ paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Largura (mm)</th>
                <th style={{ paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Altura (mm)</th>
                <th style={{ paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Quantidade</th>
                <th style={{ paddingBottom: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((piece, index) => {
                const hasError = isPieceTooBig(piece.width, piece.height);
                
                return (
                  <tr key={piece.id} style={{ backgroundColor: hasError ? '#fff1f0' : 'transparent' }}>
                    <td style={{ padding: '8px 0', color: '#999', fontSize: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '8px 0' }}>
                      <input
                        type="number"
                        min="1"
                        value={piece.width || ''}
                        onChange={(e) => onUpdate(piece.id, 'width', Number(e.target.value))}
                        style={{ padding: '8px', width: '100px', borderColor: hasError ? '#ff4d4f' : '#ccc', borderRadius: '4px', borderStyle: 'solid', borderWidth: '1px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={piece.height || ''}
                        onChange={(e) => onUpdate(piece.id, 'height', Number(e.target.value))}
                        style={{ padding: '8px', width: '100px', borderColor: hasError ? '#ff4d4f' : '#ccc', borderRadius: '4px', borderStyle: 'solid', borderWidth: '1px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={piece.quantity || ''}
                        onChange={(e) => onUpdate(piece.id, 'quantity', Number(e.target.value))}
                        style={{ padding: '8px', width: '80px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => onRemove(piece.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', backgroundColor: 'transparent', color: '#ff4d4f', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: '0.2s' }}
                        title="Remover peça"
                      >
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button 
        onClick={onAdd}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 16px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        <PlusCircle size={18} /> Adicionar Peça
      </button>
    </div>
  );
}