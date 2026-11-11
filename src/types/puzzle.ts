export type DifficultyId = 1 | 2 | 3 | 4 | 5;

export interface DifficultyConfig {
  id: DifficultyId;
  name: string;
  gridSize: number; // e.g. 3 for 3x3
  totalTiles: number;
  label: string;
  threeStarTime: number; // seconds for 3 stars
  twoStarTime: number; // seconds for 2 stars
  description: string;
  badgeColor: string;
}

export interface Stage {
  id: number; // 1 to 10
  title: string;
  character: string;
  location: string;
  description: string;
  imageUrl: string;
  fallbackSvg?: string;
  tags: string[];
  themeColor: string;
}

export interface StageProgress {
  completed: boolean;
  bestTime: number | null; // in seconds
  lastTime: number | null;
  bestMoves: number | null;
  stars: number; // 0 to 3
  completedAt?: string;
}

export type AllProgress = Record<string, StageProgress>;

export interface PuzzlePiece {
  id: number; // 0 to totalTiles - 1 (the correct destination index)
  currentPos: number; // 0 to totalTiles - 1 (current position on board)
  originalRow: number;
  originalCol: number;
}
