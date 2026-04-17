// src/hooks/useOptimizer.ts

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Sheet, Piece, OptimizationResult, HeuristicMethod } from '../types/types';
import { calculateOptimization } from '../services/optimizerService';

export function useOptimizer() {
  const [sheet, setSheet] = useState<Sheet>(() => {
    const saved = localStorage.getItem('otimizador_sheet');
    // MUDANÇA: Valor padrão agora é 5000x1500
    return saved ? JSON.parse(saved) : { width: 5000, height: 1500 };
  });

  const [pieces, setPieces] = useState<Piece[]>(() => {
    const saved = localStorage.getItem('otimizador_pieces');
    return saved ? JSON.parse(saved) : [];
  });

  const [method, setMethod] = useState<HeuristicMethod>('BottomLeftDecreasing');
  const [result, setResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    localStorage.setItem('otimizador_sheet', JSON.stringify(sheet));
  }, [sheet]);

  useEffect(() => {
    localStorage.setItem('otimizador_pieces', JSON.stringify(pieces));
  }, [pieces]);

  const updateSheet = (width: number, height: number) => setSheet({ width, height });
  const updateMethod = (m: HeuristicMethod) => setMethod(m);
  
  const addPiece = () => {
    setPieces(prev => [...prev, { id: uuidv4(), width: 0, height: 0, quantity: 1 }]);
  };
  
  const removePiece = (id: string) => {
    setPieces(prev => prev.filter(p => p.id !== id));
  };
  
  const updatePiece = (id: string, field: keyof Piece, value: number) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const clearAllPieces = () => {
    if (window.confirm('Tem a certeza que deseja limpar todas as peças?')) {
      setPieces([]);
      setResult(null);
    }
  };

  const calculate = useCallback(() => {
    const valid = pieces.filter(p => p.width > 0 && p.height > 0 && p.quantity > 0);
    
    if (valid.length === 0) {
      return alert('Adicione pelo menos uma peça válida.');
    }

    const invalidPieces = valid.filter(p => 
      (p.width > sheet.width || p.height > sheet.height) && 
      (p.width > sheet.height || p.height > sheet.width)
    );

    if (invalidPieces.length > 0) {
      return alert('Erro: Existem peças maiores que a chapa.');
    }

    setResult(calculateOptimization(sheet, valid, method));
  }, [sheet, pieces, method]);

  return { 
    sheet, updateSheet, pieces, addPiece, updatePiece, removePiece, clearAllPieces,
    method, updateMethod, result, calculate 
  };
}