import React from 'react';
import { JigsawEdge, createJigsawPath } from '../utils/jigsaw';

interface JigsawPieceViewProps {
  id: number;
  row: number;
  col: number;
  gridSize: number;
  imageUrl: string;
  edges: JigsawEdge;
  size?: number; // rendered pixel size or percentage
  showNumber?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  draggable?: boolean;
  className?: string;
  isPlacedOnBoard?: boolean;
}

export const JigsawPieceView: React.FC<JigsawPieceViewProps> = ({
  id,
  row,
  col,
  gridSize,
  imageUrl,
  edges,
  showNumber = false,
  isSelected = false,
  isDimmed = false,
  onClick,
  onDragStart,
  draggable = true,
  className = '',
  isPlacedOnBoard = false,
}) => {
  // We use a normalized coordinate system:
  // Cell is 100 x 100
  const cellW = 100;
  const cellH = 100;
  const tabSize = 22; // 22% of cell width
  const margin = 28; // margin around cell to fit protruding tabs
  const viewW = cellW + margin * 2;
  const viewH = cellH + margin * 2;

  // The cell within the piece viewBox starts at (margin, margin)
  const cellX = margin;
  const cellY = margin;

  // Generate SVG path for this piece in its local viewBox
  const pathData = React.useMemo(() => {
    return createJigsawPath(cellX, cellY, cellW, cellH, edges, tabSize);
  }, [cellX, cellY, cellW, cellH, edges, tabSize]);

  // Total board image size in this coordinate scale:
  const totalBoardW = cellW * gridSize;
  const totalBoardH = cellH * gridSize;

  // The image offset so that the piece reveals its exact portion:
  // Piece top-left in board coordinates is (col * cellW, row * cellH).
  // In piece viewBox, that top-left is at (margin, margin).
  // So image must be positioned at (margin - col * cellW, margin - row * cellH).
  const imgX = margin - col * cellW;
  const imgY = margin - row * cellH;

  const clipId = `jigsaw-clip-${gridSize}-${id}-${row}-${col}`;

  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className={`relative inline-block select-none transition-transform duration-150 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${isSelected ? 'scale-105 z-30 drop-shadow-2xl' : isPlacedOnBoard ? '' : 'hover:scale-[1.03]'} ${
        isDimmed ? 'opacity-30 grayscale' : 'opacity-100'
      } ${className}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-full overflow-visible"
        style={{
          filter: isSelected
            ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.9)) drop-shadow(0 8px 16px rgba(0,0,0,0.6))'
            : isPlacedOnBoard
            ? 'none'
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={pathData} />
          </clipPath>
        </defs>

        {/* Clipped image displaying the exact sliced character illustration */}
        <image
          href={imageUrl}
          x={imgX}
          y={imgY}
          width={totalBoardW}
          height={totalBoardH}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="none"
        />

        {/* 3D Jigsaw Edge Stroke & Bevel */}
        <path
          d={pathData}
          fill="none"
          stroke={isSelected ? '#fbbf24' : isPlacedOnBoard ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)'}
          strokeWidth={isSelected ? '3' : isPlacedOnBoard ? '1' : '1.8'}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Subtle inner dark contour for depth */}
        {!isPlacedOnBoard && (
          <path
            d={pathData}
            fill="none"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1"
            transform="translate(1, 1)"
          />
        )}

        {/* Optional Piece Number Indicator */}
        {showNumber && (
          <g transform={`translate(${cellX + cellW / 2}, ${cellY + cellH / 2})`}>
            <circle cx="0" cy="0" r="14" fill="rgba(0,0,0,0.75)" stroke="#fbbf24" strokeWidth="1.5" />
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {id + 1}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
