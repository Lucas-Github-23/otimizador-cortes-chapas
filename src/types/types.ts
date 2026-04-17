export interface Sheet {
  width: number;
  height: number;
}

export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
}

export interface PlacedPiece {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotated: boolean;
}

export interface Bin {
  id: string;
  width: number;
  height: number;
  placedPieces: PlacedPiece[];
  utilizationPercentage: number;
  freeRectangles: { x: number; y: number; width: number; height: number }[];
}

export interface OptimizationResult {
  bins: Bin[];
  totalItemsProcesssed: number;
  totalBinsUsed: number;
  totalPieceArea: number;
  totalSheetArea: number;
  averageUtilization: number;
  totalWaste: number;
}

export type HeuristicMethod = 
  | 'SkylineBottomLeft' 
  | 'MaxRectsSmallestSide' 
  | 'BottomLeftDecreasing';