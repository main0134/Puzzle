import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, HelpCircle, RefreshCw, Check, Sparkles, Hash, Layers } from 'lucide-react';
import { DifficultyConfig, PuzzlePiece, Stage } from '../types/puzzle';
import { soundManager } from '../utils/sound';

interface PuzzleBoardProps {
  stage: Stage;
  difficulty: DifficultyConfig;
  onVictory: (clearTime: number, moves: number) => void;
  onOpenArtworkModal: () => void;
  isPaused?: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  stage,
  difficulty,
  onVictory,
  onOpenArtworkModal,
  isPaused = false,
}) => {
  const gridSize = difficulty.gridSize;
  const totalTiles = difficulty.totalTiles;

  // Puzzle State
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Assistive Helpers
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [ghostOpacity, setGhostOpacity] = useState<number>(0); // 0 to 0.4
  const [highlightBorders, setHighlightBorders] = useState<boolean>(false);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [draggedPos, setDraggedPos] = useState<number | null>(null);

  // Timer ref
  const timerRef = useRef<number | null>(null);
  const hasWonRef = useRef<boolean>(false);

  // Initialize and shuffle board
  const initializePuzzle = useCallback(() => {
    hasWonRef.current = false;
    setIsCompleted(false);
    setSelectedPieceIndex(null);
    setMoves(0);
    setElapsedTime(0);

    // Create sorted pieces
    const initialPieces: PuzzlePiece[] = Array.from({ length: totalTiles }, (_, idx) => ({
      id: idx,
      currentPos: idx,
      originalRow: Math.floor(idx / gridSize),
      originalCol: idx % gridSize,
    }));

    // Perform non-trivial shuffle
    let shuffled = [...initialPieces];
    let correctCount = totalTiles;

    // Ensure at least 80% is scrambled
    while (correctCount > Math.ceil(totalTiles * 0.2)) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      correctCount = shuffled.filter((p, pos) => p.id === pos).length;
    }

    // Assign currentPos according to shuffled array order
    shuffled = shuffled.map((p, pos) => ({
      ...p,
      currentPos: pos,
    }));

    setPieces(shuffled);
  }, [gridSize, totalTiles]);

  // Restart / Initial load
  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  // Timer loop
  useEffect(() => {
    if (isCompleted || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted, isPaused]);

  // Calculate correct pieces count
  const correctPiecesCount = pieces.filter((p) => p.id === p.currentPos).length;
  const progressPercent = Math.round((correctPiecesCount / totalTiles) * 100);

  // Swap pieces logic
  const swapPieces = useCallback((posA: number, posB: number) => {
    if (posA === posB || hasWonRef.current) return;

    setPieces((prev) => {
      const next = [...prev];
      const pieceAIndex = next.findIndex((p) => p.currentPos === posA);
      const pieceBIndex = next.findIndex((p) => p.currentPos === posB);

      if (pieceAIndex === -1 || pieceBIndex === -1) return prev;

      const pieceA = { ...next[pieceAIndex], currentPos: posB };
      const pieceB = { ...next[pieceBIndex], currentPos: posA };

      next[pieceAIndex] = pieceB;
      next[pieceBIndex] = pieceA;

      // Check if either piece snapped into its correct spot
      const aNowCorrect = pieceA.id === posB;
      const bNowCorrect = pieceB.id === posA;
      if (aNowCorrect || bNowCorrect) {
        soundManager.playSnap();
      } else {
        soundManager.playSwap();
      }

      // Check victory
      const allCorrect = next.every((p) => p.id === p.currentPos);
      if (allCorrect && !hasWonRef.current) {
        hasWonRef.current = true;
        setIsCompleted(true);
        soundManager.playVictory();
        setTimeout(() => {
          onVictory(elapsedTime + 1, moves + 1);
        }, 500);
      }

      return next;
    });

    setMoves((m) => m + 1);
    setSelectedPieceIndex(null);
  }, [elapsedTime, moves, onVictory]);

  // Handle tile click (Click-to-Swap)
  const handleTileClick = (pos: number) => {
    if (hasWonRef.current) return;

    soundManager.playClick();

    if (selectedPieceIndex === null) {
      // First selection
      setSelectedPieceIndex(pos);
    } else {
      // Second selection -> Swap
      swapPieces(selectedPieceIndex, pos);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, pos: number) => {
    if (hasWonRef.current) return;
    setDraggedPos(pos);
    e.dataTransfer.setData('text/plain', String(pos));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPos: number) => {
    e.preventDefault();
    if (draggedPos !== null && draggedPos !== targetPos) {
      swapPieces(draggedPos, targetPos);
    }
    setDraggedPos(null);
  };

  // Hint button: Put one misplaced tile into its correct spot
  const handleUseHint = () => {
    if (hasWonRef.current) return;

    // Find pieces not in correct position
    const misplaced = pieces.filter((p) => p.id !== p.currentPos);
    if (misplaced.length === 0) return;

    // Pick a random misplaced piece
    const chosen = misplaced[Math.floor(Math.random() * misplaced.length)];
    const targetPos = chosen.id; // its true destination

    soundManager.playHint();
    swapPieces(chosen.currentPos, targetPos);
  };

  // Helper to check if a piece is a border/edge piece
  const isBorderPiece = (id: number) => {
    const row = Math.floor(id / gridSize);
    const col = id % gridSize;
    return row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1;
  };

  // Spacebar hotkey to hold and peek original illustration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPeeking(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPeeking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Top Puzzle Board Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 backdrop-blur-sm">
        {/* Progress & Stat pill */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>완성도:</span>
            <span className="font-mono text-amber-300 font-bold tabular-nums">
              {progressPercent}%
            </span>
            <span className="text-slate-500">
              ({correctPiecesCount}/{totalTiles} 조각)
            </span>
          </div>

          <span aria-hidden="true" className="text-slate-700 hidden sm:inline">|</span>

          {/* Moves */}
          <div className="text-slate-400 hidden sm:block">
            <span>이동: </span>
            <span className="font-mono font-semibold text-slate-200 tabular-nums">{moves}회</span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* View Artwork Modal Button (MANDATORY REQUIREMENT) */}
          <button
            onClick={onOpenArtworkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            title="완성본 일러스트 전체 확인 (V)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>완성본 일러스트</span>
          </button>

          {/* Hold to Peek button */}
          <button
            onMouseDown={() => setIsPeeking(true)}
            onMouseUp={() => setIsPeeking(false)}
            onTouchStart={() => setIsPeeking(true)}
            onTouchEnd={() => setIsPeeking(false)}
            onMouseLeave={() => setIsPeeking(false)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              isPeeking
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'text-slate-300 hover:text-white bg-slate-800 border-slate-700 hover:bg-slate-750'
            }`}
            title="누르고 있는 동안 완성본 원본 그림 표시 (스페이스바)"
          >
            <span>엿보기</span>
          </button>

          {/* Toggle Numbers Guide */}
          <button
            onClick={() => setShowNumbers(!showNumbers)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showNumbers
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
            }`}
            title="조각 번호 가이드 토글"
            aria-label="조각 번호 가이드"
          >
            <Hash className="w-4 h-4" />
          </button>

          {/* Border Pieces Highlight Filter */}
          <button
            onClick={() => setHighlightBorders(!highlightBorders)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              highlightBorders
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
            }`}
            title="테두리 조각 강조 토글"
            aria-label="테두리 조각 강조"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Ghost Guide Toggle */}
          <button
            onClick={() => setGhostOpacity((prev) => (prev > 0 ? 0 : 0.28))}
            className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              ghostOpacity > 0
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
            }`}
            title="투명 밑그림 가이드"
          >
            <span>밑그림</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={handleUseHint}
            disabled={correctPiecesCount === totalTiles}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="힌트: 틀린 조각 1개를 자동으로 맞춥니다"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">힌트</span>
          </button>

          {/* Reshuffle Button */}
          <button
            onClick={initializePuzzle}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="퍼즐 다시 섞기"
            aria-label="퍼즐 다시 섞기"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Interactive Arena */}
      <div className="relative w-full aspect-square max-w-[560px] max-h-[560px] bg-slate-950 border-2 border-slate-800 rounded-2xl p-2.5 shadow-2xl overflow-hidden select-none">
        {/* Ghost Guide Background Image (when enabled) */}
        {ghostOpacity > 0 && (
          <div
            className="absolute inset-2.5 rounded-xl pointer-events-none transition-opacity duration-300"
            style={{
              backgroundImage: `url(${stage.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: ghostOpacity,
            }}
          />
        )}

        {/* Peeking Mode Full Image Preview */}
        {isPeeking && (
          <div
            className="absolute inset-2.5 z-40 rounded-xl overflow-hidden transition-all duration-150 animate-in fade-in"
            style={{
              backgroundImage: `url(${stage.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/75 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
              완성본 미리보기 중 (손을 떼면 퍼즐로 복귀)
            </div>
          </div>
        )}

        {/* Puzzle Tiles Grid */}
        <div
          className="w-full h-full grid gap-1 relative z-10"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalTiles }).map((_, slotIndex) => {
            const piece = pieces.find((p) => p.currentPos === slotIndex);
            if (!piece) return <div key={slotIndex} className="bg-slate-900/50 rounded-lg" />;

            const isCorrect = piece.id === piece.currentPos;
            const isSelected = selectedPieceIndex === slotIndex;
            const isBorder = isBorderPiece(piece.id);
            const isDimmed = highlightBorders && !isBorder;

            // Compute background position mapping
            // row: 0 .. gridSize - 1
            // col: 0 .. gridSize - 1
            const bgPosX = gridSize > 1 ? (piece.originalCol / (gridSize - 1)) * 100 : 0;
            const bgPosY = gridSize > 1 ? (piece.originalRow / (gridSize - 1)) * 100 : 0;

            return (
              <div
                key={piece.id}
                role="button"
                tabIndex={0}
                draggable={!isCompleted}
                onDragStart={(e) => handleDragStart(e, slotIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slotIndex)}
                onClick={() => handleTileClick(slotIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTileClick(slotIndex);
                  }
                }}
                className={`relative group rounded-lg overflow-hidden transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-[0.98] shadow-lg z-20'
                    : 'hover:brightness-105 active:scale-95'
                } ${
                  isCorrect
                    ? 'border-emerald-500/40 shadow-sm'
                    : 'border-slate-700/60'
                } ${isDimmed ? 'opacity-25 grayscale' : 'opacity-100'}`}
                style={{
                  backgroundImage: `url(${stage.imageUrl})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                }}
              >
                {/* Subtle Inner Border */}
                <div
                  className={`absolute inset-0 border transition-colors ${
                    isCorrect
                      ? 'border-emerald-500/30'
                      : 'border-white/10 group-hover:border-white/30'
                  }`}
                />

                {/* Correct piece corner badge */}
                {isCorrect && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500/80 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Number Guide Badge */}
                {showNumbers && (
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono font-bold text-white leading-none backdrop-blur-xs">
                    {piece.id + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Play Instructions Footer */}
      <div className="mt-3 text-center text-xs text-slate-500 space-x-2">
        <span>조각을 클릭하여 위치를 교환하거나 드래그하여 이동할 수 있습니다.</span>
        <span aria-hidden="true">·</span>
        <span className="text-slate-400">스페이스바를 길게 누르면 원래 그림을 즉시 엿볼 수 있습니다.</span>
      </div>
    </div>
  );
};
