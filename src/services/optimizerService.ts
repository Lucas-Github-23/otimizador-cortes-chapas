// src/services/optimizerService.ts

// ADICIONADO O 'type' NA IMPORTAÇÃO
import type { Sheet, Piece, PlacedPiece, Bin, OptimizationResult, HeuristicMethod } from '../types/types';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

class BinPacker {
  public width: number;
  public height: number;
  public placedPieces: PlacedPiece[] = [];
  public freeRectangles: Rect[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.freeRectangles.push({ x: 0, y: 0, width, height });
  }

  public insert(pieceId: string, pieceWidth: number, pieceHeight: number, method: HeuristicMethod): boolean {
    let bestNode: Rect = { x: this.width + 1, y: this.height + 1, width: 0, height: 0 };
    let bestFreeRectIndex = -1;
    let rotated = false;
    let bestScore1 = Number.MAX_VALUE;
    let bestScore2 = Number.MAX_VALUE;

    for (let i = 0; i < this.freeRectangles.length; i++) {
      const freeRect = this.freeRectangles[i];

      // Tenta posição normal
      if (freeRect.width >= pieceWidth && freeRect.height >= pieceHeight) {
        const { score1, score2 } = this.calculateScore(freeRect, pieceWidth, pieceHeight, method);
        if (score1 < bestScore1 || (score1 === bestScore1 && score2 < bestScore2)) {
          bestNode = { x: freeRect.x, y: freeRect.y, width: pieceWidth, height: pieceHeight };
          bestScore1 = score1;
          bestScore2 = score2;
          bestFreeRectIndex = i;
          rotated = false;
        }
      }

      // Tenta posição rotacionada
      if (freeRect.width >= pieceHeight && freeRect.height >= pieceWidth) {
        const { score1, score2 } = this.calculateScore(freeRect, pieceHeight, pieceWidth, method);
        if (score1 < bestScore1 || (score1 === bestScore1 && score2 < bestScore2)) {
          bestNode = { x: freeRect.x, y: freeRect.y, width: pieceHeight, height: pieceWidth };
          bestScore1 = score1;
          bestScore2 = score2;
          bestFreeRectIndex = i;
          rotated = true;
        }
      }
    }

    if (bestFreeRectIndex === -1) return false;

    this.placedPieces.push({
      id: pieceId, width: bestNode.width, height: bestNode.height,
      x: bestNode.x, y: bestNode.y, rotated
    });

    this.splitFreeRectangles(bestNode);
    this.pruneFreeRectangles();
    return true;
  }

  private calculateScore(freeRect: Rect, pWidth: number, pHeight: number, method: HeuristicMethod) {
    let score1 = 0, score2 = 0;
    switch (method) {
      case 'BottomLeftDecreasing':
        score1 = freeRect.y + pHeight;
        score2 = freeRect.x;
        break;
      case 'MaxRectsSmallestSide':
        score1 = Math.min(freeRect.width - pWidth, freeRect.height - pHeight);
        score2 = Math.max(freeRect.width - pWidth, freeRect.height - pHeight);
        break;
      case 'SkylineBottomLeft':
        score1 = freeRect.y;
        score2 = freeRect.x + pWidth;
        break;
    }
    return { score1, score2 };
  }

  private splitFreeRectangles(placedRect: Rect): void {
    const newFreeRects: Rect[] = [];
    for (const freeRect of this.freeRectangles) {
      if (placedRect.x >= freeRect.x + freeRect.width || placedRect.x + placedRect.width <= freeRect.x ||
          placedRect.y >= freeRect.y + freeRect.height || placedRect.y + placedRect.height <= freeRect.y) {
        newFreeRects.push(freeRect);
        continue;
      }
      if (placedRect.x + placedRect.width < freeRect.x + freeRect.width) 
        newFreeRects.push({ x: placedRect.x + placedRect.width, y: freeRect.y, width: freeRect.x + freeRect.width - (placedRect.x + placedRect.width), height: freeRect.height });
      if (placedRect.x > freeRect.x) 
        newFreeRects.push({ x: freeRect.x, y: freeRect.y, width: placedRect.x - freeRect.x, height: freeRect.height });
      if (placedRect.y + placedRect.height < freeRect.y + freeRect.height) 
        newFreeRects.push({ x: freeRect.x, y: placedRect.y + placedRect.height, width: freeRect.width, height: freeRect.y + freeRect.height - (placedRect.y + placedRect.height) });
      if (placedRect.y > freeRect.y) 
        newFreeRects.push({ x: freeRect.x, y: freeRect.y, width: freeRect.width, height: placedRect.y - freeRect.y });
    }
    this.freeRectangles = newFreeRects;
  }

  private pruneFreeRectangles(): void {
    for (let i = 0; i < this.freeRectangles.length; i++) {
      for (let j = 0; j < this.freeRectangles.length; j++) {
        if (i !== j) {
          const r1 = this.freeRectangles[i], r2 = this.freeRectangles[j];
          if (r1.x >= r2.x && r1.y >= r2.y && r1.x + r1.width <= r2.x + r2.width && r1.y + r1.height <= r2.y + r2.height) {
            this.freeRectangles.splice(i, 1);
            i--; break;
          }
        }
      }
    }
  }

  public getUtilization(): number {
    const usedArea = this.placedPieces.reduce((acc, p) => acc + (p.width * p.height), 0);
    return (usedArea / (this.width * this.height)) * 100;
  }
}

export function calculateOptimization(sheet: Sheet, pieces: Piece[], method: HeuristicMethod): OptimizationResult {
  const flattened: (Piece & { area: number })[] = [];
  pieces.forEach(p => { for (let i = 0; i < p.quantity; i++) flattened.push({ ...p, area: p.width * p.height }); });
  flattened.sort((a, b) => b.area - a.area);

  const packers: BinPacker[] = [];
  for (const piece of flattened) {
    let placed = false;
    for (const packer of packers) { if (packer.insert(piece.id, piece.width, piece.height, method)) { placed = true; break; } }
    if (!placed) {
      const newPacker = new BinPacker(sheet.width, sheet.height);
      newPacker.insert(piece.id, piece.width, piece.height, method);
      packers.push(newPacker);
    }
  }

  const bins: Bin[] = packers.map((p, i) => ({
    id: `Chapa-${String(i + 1).padStart(2, '0')}`,
    width: p.width, height: p.height,
    placedPieces: p.placedPieces, freeRectangles: p.freeRectangles,
    utilizationPercentage: p.getUtilization()
  }));

  const totalPieceArea = flattened.reduce((acc, p) => acc + p.area, 0);
  const totalSheetArea = bins.length * (sheet.width * sheet.height);
  const averageUtilization = totalSheetArea > 0 ? (totalPieceArea / totalSheetArea) * 100 : 0;

  return {
    bins, totalItemsProcesssed: flattened.length, totalBinsUsed: bins.length,
    totalPieceArea, totalSheetArea,
    averageUtilization: Number(averageUtilization.toFixed(2)),
    totalWaste: Number((100 - averageUtilization).toFixed(2))
  };
}