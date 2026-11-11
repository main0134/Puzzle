import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Eye, HelpCircle, RefreshCw, Check, Sparkles, Hash, Layers, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { DifficultyConfig, Stage } from '../types/puzzle';
import { soundManager } from '../utils/sound';
import { generateJigsawEdges, JigsawEdge, createJigsawPath } from '../utils/jigsaw';
import { JigsawPieceView } from './JigsawPieceView';

interface PuzzleBoardProps {
  stage: Stage;
  difficulty: DifficultyConfig;
  onVictory: (clearTime: number, moves: number) => void;
  onOpenArtworkModal: () => void;
  isPaused?: boolean;
}

interface PieceState {
  id: number;
  row: number;
  col: number;
  isPlaced: boolean; // true if placed on the board
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

  // Generate the jigsaw edge topology for this stage and grid size
  const edgeMap: JigsawEdge[][] = useMemo(() => {
    return generateJigsawEdges(gridSize, stage.id * 100 + gridSize);
  }, [gridSize, stage.id]);

  // Game state: which pieces are in tray vs placed on board
  const [pieces, setPieces] = useState<PieceState[]>(() =>
    Array.from({ length: totalTiles }, (_, idx) => ({
      id: idx,
      row: Math.floor(idx / gridSize),
      col: idx % gridSize,
      isPlaced: false,
    }))
  );
  // Board slots: slot[index] = pieceId or null (where index = row * gridSize + col)
  const [boardSlots, setBoardSlots] = useState<(number | null)[]>(() => new Array(totalTiles).fill(null));
  // Tray list: ordered array of piece IDs currently in tray
  const [trayPieceIds, setTrayPieceIds] = useState<number[]>(() => {
    const ids = Array.from({ length: totalTiles }, (_, i) => i);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  });

  // Selection & interaction state
  const [selectedTrayPieceId, setSelectedTrayPieceId] = useState<number | null>(null);
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);

  // Counters
  const [moves, setMoves] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Visual helper toggles
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const [ghostOpacity, setGhostOpacity] = useState<number>(0.2); // slight default ghost guide
  const [filterEdgesOnly, setFilterEdgesOnly] = useState<boolean>(false);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);

  // Refs
  const trayScrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const hasWonRef = useRef<boolean>(false);

  // Initialize Puzzle
  const initializePuzzle = useCallback(() => {
    hasWonRef.current = false;
    setIsCompleted(false);
    setSelectedTrayPieceId(null);
    setDraggedPieceId(null);
    setHoveredSlotIndex(null);
    setMoves(0);
    setElapsedTime(0);

    // Initial pieces list
    const initialPieces: PieceState[] = Array.from({ length: totalTiles }, (_, idx) => ({
      id: idx,
      row: Math.floor(idx / gridSize),
      col: idx % gridSize,
      isPlaced: false,
    }));

    // Randomize tray order
    const shuffledIds = Array.from({ length: totalTiles }, (_, i) => i);
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }

    setPieces(initialPieces);
    setBoardSlots(new Array(totalTiles).fill(null));
    setTrayPieceIds(shuffledIds);
  }, [gridSize, totalTiles]);

  // On mount / stage change
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

  // Placed count & progress
  const placedCount = boardSlots.filter((id) => id !== null).length;
  const progressPercent = Math.round((placedCount / totalTiles) * 100);

  // Helper to check if piece is an edge piece
  const isEdgePiece = useCallback((id: number) => {
    if (typeof id !== 'number' || isNaN(id)) return false;
    const row = Math.floor(id / gridSize);
    const col = id % gridSize;
    return row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1;
  }, [gridSize]);

  // Check victory condition
  const checkVictory = useCallback((newBoardSlots: (number | null)[]) => {
    const allPlaced = newBoardSlots.every((id, slotIndex) => id === slotIndex);
    if (allPlaced && !hasWonRef.current) {
      hasWonRef.current = true;
      setIsCompleted(true);
      soundManager.playVictory();
      setTimeout(() => {
        onVictory(elapsedTime + 1, moves + 1);
      }, 500);
    }
  }, [elapsedTime, moves, onVictory]);

  // Place a piece onto a specific board slot
  const placePieceOnBoard = useCallback((pieceId: number, slotIndex: number) => {
    if (hasWonRef.current) return;

    // Is this the correct destination slot for this piece?
    const isCorrectSlot = pieceId === slotIndex;

    setBoardSlots((prevSlots) => {
      const nextSlots = [...prevSlots];

      // If slot already occupied, move existing piece back to tray
      const existingPieceId = nextSlots[slotIndex];

      nextSlots[slotIndex] = pieceId;

      // Update piece states
      setPieces((prevPieces) =>
        prevPieces.map((p) => {
          if (p.id === pieceId) return { ...p, isPlaced: true };
          if (existingPieceId !== null && p.id === existingPieceId) return { ...p, isPlaced: false };
          return p;
        })
      );

      // Update tray: remove placed pieceId, add back existing if any
      setTrayPieceIds((prevTray) => {
        const nextTray = prevTray.filter((id) => id !== pieceId);
        if (existingPieceId !== null && !nextTray.includes(existingPieceId)) {
          nextTray.push(existingPieceId);
        }
        return nextTray;
      });

      if (isCorrectSlot) {
        soundManager.playSnap();
      } else {
        soundManager.playSwap();
      }

      checkVictory(nextSlots);
      return nextSlots;
    });

    setMoves((m) => m + 1);
    setSelectedTrayPieceId(null);
    setHoveredSlotIndex(null);
  }, [checkVictory]);

  // Move a placed piece back to tray
  const returnPieceToTray = useCallback((slotIndex: number) => {
    if (hasWonRef.current) return;
    const pieceId = boardSlots[slotIndex];
    if (pieceId === null) return;

    setBoardSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });

    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, isPlaced: false } : p))
    );

    setTrayPieceIds((prev) => [pieceId, ...prev]);
    soundManager.playClick();
  }, [boardSlots]);

  // Handle board slot click
  const handleSlotClick = (slotIndex: number) => {
    if (hasWonRef.current) return;

    if (selectedTrayPieceId !== null) {
      // Place the selected piece from tray onto this slot
      placePieceOnBoard(selectedTrayPieceId, slotIndex);
    } else {
      // If slot is occupied, clicking it returns it to tray or allows moving
      const currentInSlot = boardSlots[slotIndex];
      if (currentInSlot !== null) {
        returnPieceToTray(slotIndex);
      }
    }
  };

  // Drag and drop handlers
  const handleTrayDragStart = (e: React.DragEvent, pieceId: number) => {
    if (hasWonRef.current) return;
    setDraggedPieceId(pieceId);
    e.dataTransfer.setData('text/plain', String(pieceId));
    e.dataTransfer.effectAllowed = 'move';
    soundManager.playClick();
  };

  const handleSlotDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoveredSlotIndex !== slotIndex) {
      setHoveredSlotIndex(slotIndex);
    }
  };

  const handleSlotDragLeave = () => {
    setHoveredSlotIndex(null);
  };

  const handleSlotDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setHoveredSlotIndex(null);
    const pieceIdStr = e.dataTransfer.getData('text/plain');
    const pieceId = pieceIdStr ? parseInt(pieceIdStr, 10) : draggedPieceId;

    if (pieceId !== null && !isNaN(pieceId)) {
      placePieceOnBoard(pieceId, slotIndex);
    }
    setDraggedPieceId(null);
  };

  // Hint: automatically place one unplaced piece into its correct slot
  const handleUseHint = () => {
    if (hasWonRef.current || trayPieceIds.length === 0) return;

    // Pick first unplaced piece from tray
    const pieceIdToPlace = trayPieceIds[0];
    soundManager.playHint();
    placePieceOnBoard(pieceIdToPlace, pieceIdToPlace);
  };

  // Scroll tray left/right
  const scrollTray = (direction: 'left' | 'right') => {
    if (!trayScrollRef.current) return;
    const amount = direction === 'left' ? -240 : 240;
    trayScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Spacebar to hold and peek original illustration
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

  // Filtered tray pieces
  const displayedTrayPieceIds = useMemo(() => {
    if (!filterEdgesOnly) return trayPieceIds;
    return trayPieceIds.filter((id) => isEdgePiece(id));
  }, [filterEdgesOnly, trayPieceIds, isEdgePiece]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Top Controls Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl mb-4 backdrop-blur-sm">
        {/* Progress & Stat pill */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>완성도:</span>
            <span className="font-mono text-amber-300 font-bold tabular-nums">
              {progressPercent}%
            </span>
            <span className="text-slate-500">
              ({placedCount}/{totalTiles} 조각 완성)
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
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
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
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
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              showNumbers
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
            }`}
            title="조각 번호 가이드 토글"
            aria-label="조각 번호 가이드"
          >
            <Hash className="w-4 h-4" />
          </button>

          {/* Ghost Guide Toggle */}
          <button
            onClick={() => setGhostOpacity((prev) => (prev > 0 ? 0 : 0.35))}
            className={`px-2 py-1.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              ghostOpacity > 0
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
            }`}
            title="판 배경 밑그림 투명도 토글"
          >
            <span>밑그림</span>
          </button>

          {/* Filter Edges Only */}
          <button
            onClick={() => setFilterEdgesOnly(!filterEdgesOnly)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              filterEdgesOnly
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800 border-slate-700'
            }`}
            title="트레이에서 테두리 조각만 보기"
            aria-label="테두리 조각 필터"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Hint Button */}
          <button
            onClick={handleUseHint}
            disabled={trayPieceIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="힌트: 트레이의 조각 1개를 자동으로 맞춥니다"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">힌트</span>
          </button>

          {/* Reset / Reshuffle Button */}
          <button
            onClick={initializePuzzle}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            title="퍼즐 초기화 (다시 섞기)"
            aria-label="퍼즐 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Board (Top Area) */}
      <div className="relative w-full aspect-square max-w-[580px] max-h-[580px] md:max-w-[620px] md:max-h-[620px] bg-slate-950 border-4 border-slate-800/90 rounded-2xl p-3 shadow-2xl overflow-hidden select-none mb-6">
        {/* Ghost Guide Background Image (Visible when enabled) */}
        {ghostOpacity > 0 && (
          <div
            className="absolute inset-3 rounded-xl pointer-events-none transition-opacity duration-300"
            style={{
              backgroundImage: `url(${stage.imageUrl})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              opacity: ghostOpacity,
            }}
          />
        )}

        {/* Peeking Mode Full Image Overlay */}
        {isPeeking && (
          <div
            className="absolute inset-3 z-50 rounded-xl overflow-hidden transition-all duration-150 animate-in fade-in"
            style={{
              backgroundImage: `url(${stage.imageUrl})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
              완성본 미리보기 중 (손을 떼면 퍼즐로 복귀)
            </div>
          </div>
        )}

        {/* Board Slots Grid */}
        <div
          className="w-full h-full relative z-10 grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: totalTiles }).map((_, slotIndex) => {
            const row = Math.floor(slotIndex / gridSize);
            const col = slotIndex % gridSize;
            const edges = edgeMap[row]?.[col];
            if (!edges) return null;

            const placedPieceId = boardSlots[slotIndex];
            const hasPiece = typeof placedPieceId === 'number' && !isNaN(placedPieceId) && placedPieceId >= 0 && placedPieceId < totalTiles;
            const isHovered = hoveredSlotIndex === slotIndex;

            // Generate SVG path for slot silhouette outline (starts at 28, 28 in a 156x156 box)
            const tabSize = 22;
            const slotPath = createJigsawPath(28, 28, 100, 100, edges, tabSize);

            return (
              <div
                key={slotIndex}
                onClick={() => handleSlotClick(slotIndex)}
                onDragOver={(e) => handleSlotDragOver(e, slotIndex)}
                onDragLeave={handleSlotDragLeave}
                onDrop={(e) => handleSlotDrop(e, slotIndex)}
                className={`relative w-full h-full transition-colors cursor-pointer ${
                  isHovered ? 'bg-indigo-500/20' : ''
                }`}
              >
                {/* Empty slot silhouette outline - exact 1:1 scale with 28% margin */}
                {!hasPiece && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: '-28%',
                      top: '-28%',
                      width: '156%',
                      height: '156%',
                    }}
                  >
                    <svg
                      viewBox="0 0 156 156"
                      className="w-full h-full overflow-visible opacity-35 hover:opacity-60 transition-opacity"
                    >
                      <path
                        d={slotPath}
                        fill="rgba(30, 41, 59, 0.4)"
                        stroke="rgba(148, 163, 184, 0.45)"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      {showNumbers && (
                        <text
                          x="78"
                          y="83"
                          textAnchor="middle"
                          fill="rgba(148, 163, 184, 0.7)"
                          fontSize="14"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {slotIndex + 1}
                        </text>
                      )}
                    </svg>
                  </div>
                )}

                {/* Placed Jigsaw Piece - exact 1:1 seamless interlocking fit with zero gaps */}
                {hasPiece && (
                  <div
                    className="absolute z-20 pointer-events-auto"
                    style={{
                      left: '-28%',
                      top: '-28%',
                      width: '156%',
                      height: '156%',
                    }}
                  >
                    <JigsawPieceView
                      id={placedPieceId}
                      row={Math.floor(placedPieceId / gridSize)}
                      col={placedPieceId % gridSize}
                      gridSize={gridSize}
                      imageUrl={stage.imageUrl}
                      edges={edgeMap[Math.floor(placedPieceId / gridSize)]?.[placedPieceId % gridSize] || edges}
                      showNumber={showNumbers}
                      draggable={false}
                      isPlacedOnBoard={true}
                      onClick={() => returnPieceToTray(slotIndex)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Jigsaw Pieces Tray Section (판 아래에 일렬로 나열) */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
        {/* Tray Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">
              조각 보관함 (아래에서 판으로 끌어와 맞추세요)
            </span>
            <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
              남은 조각: {trayPieceIds.length}개
            </span>
          </div>

          {/* Tray Scroll Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollTray('left')}
              className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="이전 조각 보기"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTray('right')}
              className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="다음 조각 보기"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Pieces Carousel */}
        {trayPieceIds.length > 0 ? (
          <div
            ref={trayScrollRef}
            className="flex items-center gap-4 overflow-x-auto py-3 px-2 scroll-smooth"
            style={{ minHeight: '124px' }}
          >
            {displayedTrayPieceIds.map((pieceId) => {
              if (typeof pieceId !== 'number' || isNaN(pieceId) || pieceId < 0 || pieceId >= totalTiles) return null;
              const row = Math.floor(pieceId / gridSize);
              const col = pieceId % gridSize;
              const edges = edgeMap[row]?.[col];
              if (!edges) return null;
              const isSelected = selectedTrayPieceId === pieceId;

              return (
                <div
                  key={pieceId}
                  className="shrink-0 flex flex-col items-center justify-center p-1"
                  style={{ width: '96px', height: '96px' }}
                >
                  <JigsawPieceView
                    id={pieceId}
                    row={row}
                    col={col}
                    gridSize={gridSize}
                    imageUrl={stage.imageUrl}
                    edges={edges}
                    showNumber={showNumbers}
                    isSelected={isSelected}
                    draggable={true}
                    onDragStart={(e) => handleTrayDragStart(e, pieceId)}
                    onClick={() => {
                      if (selectedTrayPieceId === pieceId) {
                        setSelectedTrayPieceId(null);
                      } else {
                        setSelectedTrayPieceId(pieceId);
                        soundManager.playClick();
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>모든 조각을 판에 맞추었습니다!</span>
          </div>
        )}

        {/* Tray Interaction Tip */}
        <div className="mt-2 text-center text-[11px] text-slate-500">
          💡 <span className="text-slate-400">조각을 마우스로 끌어 판의 알맞은 위치에 놓거나</span>, 조각을 클릭한 뒤 판의 빈자리를 클릭해도 맞춰집니다.
        </div>
      </div>
    </div>
  );
};
