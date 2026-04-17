// src/hooks/useOptimizer.ts

import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Sheet, Piece, OptimizationResult, HeuristicMethod } from '../types/types';
import { calculateOptimization } from '../services/optimizerService';

export function useOptimizer() {
  // Inicializa o estado a tentar ler do LocalStorage, ou usa os valores por defeito
  const [sheet, setSheet] = useState<Sheet>(() => {
    const saved = localStorage.getItem('otimizador_sheet');
    return saved ? JSON.parse(saved) : { width: 2750, height: 1830 };
  });

  const [pieces, setPieces] = useState<Piece[]>(() => {
    const saved = localStorage.getItem('otimizador_pieces');
    return saved ? JSON.parse(saved) : [];
  });

  const [method, setMethod] = useState<HeuristicMethod>('BottomLeftDecreasing');
  const [result, setResult] = useState<OptimizationResult | null>(null);

  // Efeito para guardar automaticamente no LocalStorage sempre que a chapa ou peças mudarem
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
      return alert('Adicione pelo menos uma peça válida com dimensões e quantidade maiores que 0.');
    }

    // Validação: Verificar se alguma peça é estritamente maior que a chapa
    const invalidPieces = valid.filter(p => 
      (p.width > sheet.width || p.height > sheet.height) && 
      (p.width > sheet.height || p.height > sheet.width) // Verifica também a rotação
    );

    if (invalidPieces.length > 0) {
      return alert('Erro: Existem peças maiores que a dimensão da chapa. Corrija as medidas antes de calcular.');
    }

    setResult(calculateOptimization(sheet, valid, method));
  }, [sheet, pieces, method]);

  return { 
    sheet, 
    updateSheet, 
    pieces, 
    addPiece, 
    updatePiece, 
    removePiece, 
    clearAllPieces,
    method, 
    updateMethod, 
    result, 
    calculate 
  };
}