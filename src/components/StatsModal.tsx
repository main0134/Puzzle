import React from 'react';
import { X, Trophy, Star, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { AllProgress } from '../types/puzzle';
import { DIFFICULTY_LIST } from '../data/difficulties';
import { STAGES } from '../data/stages';
import { formatTime, getDifficultySummary } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProgress: AllProgress;
  onResetProgress: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  allProgress,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const totalPossibleStages = DIFFICULTY_LIST.length * STAGES.length; // 5 * 10 = 50
  let totalCleared = 0;
  let totalStars = 0;
  let totalTime = 0;

  DIFFICULTY_LIST.forEach((diff) => {
    const sum = getDifficultySummary(allProgress, diff.id, STAGES.length);
    totalCleared += sum.clearedCount;
    totalStars += sum.totalStars;
    totalTime += sum.totalBestTime;
  });

  const overallPercent = Math.round((totalCleared / totalPossibleStages) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="게임 기록 및 통계"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">나의 퍼즐 모험 기록</h2>
              <p className="text-xs text-slate-400">5단계 난이도 총 50개 스테이지 진행 상황</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Summary KPI strip */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">총 클리어</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {totalCleared} / {totalPossibleStages}
            </span>
            <span className="text-[10px] text-slate-500 block">달성률 {overallPercent}%</span>
          </div>
          <div className="text-center border-x border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">획득한 별점</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              {totalStars} / {totalPossibleStages * 3}
            </span>
            <span className="text-[10px] text-slate-500 block">최대 {totalPossibleStages * 3}개</span>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">누적 최고기록</span>
            <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
              {formatTime(totalTime)}
            </span>
            <span className="text-[10px] text-slate-500 block">클리어 누적</span>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="mt-5 space-y-2.5">
          <span className="text-xs font-semibold text-slate-300 block">난이도별 진행 현황</span>
          {DIFFICULTY_LIST.map((diff) => {
            const sum = getDifficultySummary(allProgress, diff.id, STAGES.length);
            const diffPercent = Math.round((sum.clearedCount / STAGES.length) * 100);
            return (
              <div
                key={diff.id}
                className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{diff.name}</span>
                    <span className="text-[11px] text-slate-500">({diff.totalTiles}조각)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>완료: {sum.clearedCount}/{STAGES.length}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {sum.totalStars}/{STAGES.length * 3}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-indigo-400 tabular-nums">
                    {diffPercent}%
                  </span>
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${diffPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Danger Zone */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('정말 모든 스테이지 클리어 기록과 별점을 초기화하시겠습니까?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>모든 기록 초기화</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
