import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, RotateCcw, ArrowRight, Grid, Star } from 'lucide-react';
import { DifficultyConfig, Stage } from '../types/puzzle';
import { formatTime } from '../utils/storage';

interface VictoryModalProps {
  isOpen: boolean;
  stage: Stage;
  difficulty: DifficultyConfig;
  clearTime: number; // in seconds
  moves: number;
  stars: number;
  isNewRecord: boolean;
  hasNextStage: boolean;
  onNextStage: () => void;
  onReplay: () => void;
  onGoToStageSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stage,
  difficulty,
  clearTime,
  moves,
  stars,
  isNewRecord,
  hasNextStage,
  onNextStage,
  onReplay,
  onGoToStageSelect,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti burst
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 100,
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } catch (err) {
        console.error('Confetti trigger failed:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="스테이지 클리어 완료"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-center">
        {/* Glowing Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
        </div>

        {/* Header Title */}
        <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-1">
          STAGE {stage.id} · {difficulty.name}
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          스테이지 클리어 완료!
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          {stage.title} 완성에 성공하셨습니다.
        </p>

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`p-2 rounded-xl transition-all ${
                starNum <= stars
                  ? 'bg-amber-500/20 text-amber-400 scale-110 shadow-sm'
                  : 'bg-slate-800/60 text-slate-600'
              }`}
            >
              <Star
                className={`w-7 h-7 ${starNum <= stars ? 'fill-amber-400' : 'fill-transparent'}`}
              />
            </div>
          ))}
        </div>

        {/* Clear Stats Card */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl mb-6">
          {/* Clear Time */}
          <div className="flex flex-col items-center justify-center p-2">
            <span className="flex items-center gap-1 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>걸린 시간</span>
            </span>
            <div className="text-2xl font-bold font-mono text-sky-300 tabular-nums">
              {formatTime(clearTime)}
            </div>
            {isNewRecord && (
              <span className="text-[11px] font-semibold text-emerald-400 mt-1">
                ⭐ 최고 기록 갱신!
              </span>
            )}
          </div>

          {/* Moves Count */}
          <div className="flex flex-col items-center justify-center p-2 border-l border-slate-800">
            <span className="flex items-center gap-1 text-xs text-slate-400 mb-1">
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>이동 횟수</span>
            </span>
            <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
              {moves}회
            </div>
            <span className="text-[11px] text-slate-500 mt-1">
              {difficulty.gridSize}×{difficulty.gridSize} 격자
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {hasNextStage ? (
            <button
              onClick={onNextStage}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <span>다음 스테이지 도전</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onGoToStageSelect}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <span>모든 스테이지 완료! 목록으로</span>
              <Trophy className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 플레이</span>
            </button>
            <button
              onClick={onGoToStageSelect}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>스테이지 목록</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
