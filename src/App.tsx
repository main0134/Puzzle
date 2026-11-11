import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Eye, Sparkles, Pause, Play, Trophy } from 'lucide-react';
import { AllProgress, DifficultyConfig, Stage } from './types/puzzle';
import { DIFFICULTIES } from './data/difficulties';
import { STAGES } from './data/stages';
import { loadAllProgress, saveStageClear, formatTime } from './utils/storage';
import { soundManager } from './utils/sound';
import { GameNavbar } from './components/GameNavbar';
import { StageSelect } from './components/StageSelect';
import { PuzzleBoard } from './components/PuzzleBoard';
import { ArtworkPreviewModal } from './components/ArtworkPreviewModal';
import { VictoryModal } from './components/VictoryModal';
import { CustomPuzzleModal } from './components/CustomPuzzleModal';
import { GuideModal } from './components/GuideModal';
import { StatsModal } from './components/StatsModal';

export default function App() {
  // Navigation & Game State
  const [view, setView] = useState<'STAGE_SELECT' | 'PLAYING'>('STAGE_SELECT');
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyConfig>(DIFFICULTIES[1]);
  const [currentStage, setCurrentStage] = useState<Stage>(STAGES[0]);
  const [allProgress, setAllProgress] = useState<AllProgress>({});

  // Active Play Session State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playStartTime, setPlayStartTime] = useState<number>(Date.now());
  const [sessionElapsed, setSessionElapsed] = useState<number>(0);

  // Modals
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState<boolean>(false);
  const [previewStage, setPreviewStage] = useState<Stage>(STAGES[0]);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [victoryData, setVictoryData] = useState<{
    clearTime: number;
    moves: number;
    stars: number;
    isNewRecord: boolean;
  } | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Load progress and sound preference on mount
  useEffect(() => {
    setAllProgress(loadAllProgress());
    soundManager.initMuteState();
    setSoundMuted(soundManager.isMuted());
  }, []);

  // Timer in playing mode
  useEffect(() => {
    if (view !== 'PLAYING' || isPaused || isVictoryModalOpen) return;

    const interval = setInterval(() => {
      setSessionElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [view, isPaused, isVictoryModalOpen]);

  // Handle stage start
  const handleStartStage = (stage: Stage) => {
    setCurrentStage(stage);
    setPreviewStage(stage);
    setSessionElapsed(0);
    setIsPaused(false);
    setIsVictoryModalOpen(false);
    setVictoryData(null);
    setView('PLAYING');
  };

  // Handle stage completion
  const handleStageVictory = (clearTime: number, moves: number) => {
    // Save to storage
    const { progress, isNewRecord } = saveStageClear(
      currentDifficulty,
      currentStage.id,
      clearTime,
      moves
    );

    // Refresh stored progress state
    setAllProgress(loadAllProgress());

    // Show victory modal
    setVictoryData({
      clearTime,
      moves,
      stars: progress.stars,
      isNewRecord,
    });
    setIsVictoryModalOpen(true);
  };

  // Next Stage handler
  const handleNextStage = () => {
    const nextIndex = STAGES.findIndex((s) => s.id === currentStage.id) + 1;
    if (nextIndex < STAGES.length) {
      handleStartStage(STAGES[nextIndex]);
    } else {
      setView('STAGE_SELECT');
      setIsVictoryModalOpen(false);
    }
  };

  // Replay handler
  const handleReplay = () => {
    setIsVictoryModalOpen(false);
    setSessionElapsed(0);
    // Triggers PuzzleBoard re-mount/reset
    handleStartStage(currentStage);
  };

  // Preview Artwork handler
  const handleOpenArtworkModal = (stageToPreview?: Stage) => {
    setPreviewStage(stageToPreview || currentStage);
    setIsArtworkModalOpen(true);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = !soundMuted;
    soundManager.setMuted(nextState);
    setSoundMuted(nextState);
  };

  // Reset Progress
  const handleResetProgress = () => {
    try {
      localStorage.removeItem('picture_puzzle_quest_progress_v1');
      setAllProgress({});
    } catch (err) {
      console.error(err);
    }
  };

  // Start custom puzzle
  const handleStartCustomPuzzle = (customStage: Stage, difficulty: DifficultyConfig) => {
    setCurrentDifficulty(difficulty);
    handleStartStage(customStage);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Top Navigation Bar */}
      <GameNavbar
        currentView={view}
        onNavigateHome={() => setView('STAGE_SELECT')}
        onOpenHowToPlay={() => setIsGuideModalOpen(true)}
        onOpenRecords={() => setIsStatsModalOpen(true)}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center">
        {view === 'STAGE_SELECT' ? (
          <StageSelect
            currentDifficulty={currentDifficulty}
            onSelectDifficulty={setCurrentDifficulty}
            onSelectStage={handleStartStage}
            onPreviewArtwork={(stg) => handleOpenArtworkModal(stg)}
            allProgress={allProgress}
            onResetProgress={handleResetProgress}
            onOpenCustomPuzzle={() => setIsCustomModalOpen(true)}
          />
        ) : (
          <div className="w-full max-w-4xl px-4 py-4 md:py-6 flex flex-col items-center">
            {/* Play Mode Header Bar */}
            <div className="w-full flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              {/* Back to Stages */}
              <button
                onClick={() => setView('STAGE_SELECT')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>스테이지 목록</span>
              </button>

              {/* Title & Stage Details */}
              <div className="text-center truncate px-2">
                <div className="text-[11px] font-semibold text-indigo-400 font-mono tracking-wider">
                  STAGE {currentStage.id.toString().padStart(2, '0')} · {currentDifficulty.name}
                </div>
                <h2 className="text-base md:text-lg font-bold text-white truncate">
                  {currentStage.title}
                </h2>
              </div>

              {/* Timer & Pause */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-sky-400 font-mono text-xs font-bold tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>{formatTime(sessionElapsed)}</span>
                </div>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
                  title={isPaused ? '게임 재개' : '일시정지'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Paused Overlay */}
            {isPaused ? (
              <div className="my-16 p-8 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <Pause className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">게임이 일시정지되었습니다</h3>
                  <p className="text-xs text-slate-400 mt-1">준비가 되면 계속하기 버튼을 누르세요.</p>
                </div>
                <button
                  onClick={() => setIsPaused(false)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  퍼즐 계속하기
                </button>
              </div>
            ) : (
              /* Puzzle Board Arena */
              <PuzzleBoard
                key={`${currentDifficulty.id}_${currentStage.id}_${playStartTime}`}
                stage={currentStage}
                difficulty={currentDifficulty}
                onVictory={handleStageVictory}
                onOpenArtworkModal={() => handleOpenArtworkModal(currentStage)}
                isPaused={isPaused}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>일러스트 직소 퍼즐 퀘스트 · 5개 난이도 총 50개 스테이지</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              플레이 가이드
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsStatsModalOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              진행 기록
            </button>
          </div>
        </div>
      </footer>

      {/* Artwork Preview Modal (MANDATORY REQUIREMENT) */}
      <ArtworkPreviewModal
        stage={previewStage}
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
      />

      {/* Victory Celebration Modal (MANDATORY REQUIREMENT: 걸린 시간 & 완료 표시) */}
      {victoryData && (
        <VictoryModal
          isOpen={isVictoryModalOpen}
          stage={currentStage}
          difficulty={currentDifficulty}
          clearTime={victoryData.clearTime}
          moves={victoryData.moves}
          stars={victoryData.stars}
          isNewRecord={victoryData.isNewRecord}
          hasNextStage={STAGES.findIndex((s) => s.id === currentStage.id) < STAGES.length - 1}
          onNextStage={handleNextStage}
          onReplay={handleReplay}
          onGoToStageSelect={() => {
            setIsVictoryModalOpen(false);
            setView('STAGE_SELECT');
          }}
        />
      )}

      {/* Custom Picture Puzzle Upload Modal */}
      <CustomPuzzleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onStartCustomPuzzle={handleStartCustomPuzzle}
      />

      {/* How to Play Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Overall Stats Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        allProgress={allProgress}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
