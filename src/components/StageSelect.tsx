import React, { useState } from 'react';
import { Trophy, Clock, Play, CheckCircle2, Star, Sparkles, Eye, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { AllProgress, DifficultyConfig, DifficultyId, Stage } from '../types/puzzle';
import { DIFFICULTY_LIST } from '../data/difficulties';
import { STAGES } from '../data/stages';
import { formatTime, getDifficultySummary, getStageProgress } from '../utils/storage';

interface StageSelectProps {
  currentDifficulty: DifficultyConfig;
  onSelectDifficulty: (difficulty: DifficultyConfig) => void;
  onSelectStage: (stage: Stage) => void;
  onPreviewArtwork: (stage: Stage) => void;
  allProgress: AllProgress;
  onResetProgress: () => void;
  onOpenCustomPuzzle: () => void;
}

export const StageSelect: React.FC<StageSelectProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  onSelectStage,
  onPreviewArtwork,
  allProgress,
  onResetProgress,
  onOpenCustomPuzzle,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('전체');

  // Summary for current difficulty
  const summary = getDifficultySummary(allProgress, currentDifficulty.id, STAGES.length);

  // Filter stages if tag selected
  const allTags = ['전체', ...Array.from(new Set(STAGES.flatMap((s) => s.tags)))];
  const filteredStages = selectedTag === '전체'
    ? STAGES
    : STAGES.filter((s) => s.tags.includes(selectedTag));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>5단계 난이도 & 10개 캐릭터 일러스트 스테이지</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            일러스트 직소 퍼즐 스테이지 선택
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            풍부한 배경의 캐릭터 일러스트를 퍼즐로 맞추고 최고 기록에 도전하세요.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCustomPuzzle}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-colors cursor-pointer"
            title="원하는 캐릭터나 사진을 업로드하여 퍼즐 플레이"
          >
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>내 사진 퍼즐</span>
          </button>

          <button
            onClick={onResetProgress}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 rounded-xl transition-colors cursor-pointer"
            title="모든 스테이지 기록 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기록 초기화</span>
          </button>
        </div>
      </div>

      {/* 5 Difficulty Tabs */}
      <div className="mt-6 mb-6">
        <span className="text-xs font-medium text-slate-400 block mb-2.5">
          난이도 선택 (5단계)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          {DIFFICULTY_LIST.map((diff) => {
            const isSelected = diff.id === currentDifficulty.id;
            const diffSummary = getDifficultySummary(allProgress, diff.id, STAGES.length);
            return (
              <button
                key={diff.id}
                onClick={() => onSelectDifficulty(diff)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-sm font-bold tracking-tight">{diff.name}</span>
                <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {diff.totalTiles}조각 · {diffSummary.clearedCount}/{STAGES.length} 완료
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Difficulty Overview Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${currentDifficulty.badgeColor}`}>
              {currentDifficulty.name}
            </span>
            <span className="text-sm font-medium text-slate-300">
              {currentDifficulty.description}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
            <span>3성 기준: {currentDifficulty.threeStarTime}초 이내</span>
            <span aria-hidden="true">·</span>
            <span>2성 기준: {currentDifficulty.twoStarTime}초 이내</span>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 text-xs shrink-0 bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800/80">
          <div className="text-center">
            <span className="text-slate-500 block">완료 스테이지</span>
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {summary.clearedCount} / {summary.totalStages}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <span className="text-slate-500 block">획득한 별</span>
            <span className="text-base font-bold text-amber-400 font-mono tabular-nums flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {summary.totalStars} / {summary.totalStages * 3}
            </span>
          </div>
        </div>
      </div>

      {/* Tag Filters (Segmented Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {allTags.slice(0, 8).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedTag === tag
                ? 'bg-slate-200 text-slate-900 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tag === '전체' ? '전체 보기' : `#${tag}`}
          </button>
        ))}
      </div>

      {/* 10 Stage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredStages.map((stage) => {
          const prog = getStageProgress(allProgress, currentDifficulty.id, stage.id);
          const isCompleted = prog?.completed;

          return (
            <div
              key={stage.id}
              className={`group flex flex-col bg-slate-900/90 border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                isCompleted
                  ? 'border-emerald-500/30 hover:border-emerald-500/60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={stage.imageUrl}
                  alt={stage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Top Badge: Stage Index & Clear Mark */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-950/80 backdrop-blur-xs text-white rounded-md border border-white/10 font-mono">
                    STAGE {stage.id.toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Completed Badge (MANDATORY REQUIREMENT) */}
                {isCompleted ? (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/60 text-emerald-400 text-[11px] font-bold shadow-sm backdrop-blur-xs">
                    <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    <span>클리어</span>
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700 text-slate-400 text-[10px] font-medium backdrop-blur-xs">
                    미완료
                  </div>
                )}

                {/* Preview Artwork Floating Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewArtwork(stage);
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="완성본 일러스트 미리보기"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Stage Card Body */}
              <div className="p-3.5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {stage.character}
                  </p>
                </div>

                {/* Clear Time & Stars Record Section */}
                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80">
                  {isCompleted ? (
                    <div className="flex items-center justify-between text-xs">
                      {/* Clear Time */}
                      <div className="flex items-center gap-1 text-sky-400 font-mono font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(prog.bestTime)}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-3.5 h-3.5 ${
                              starNum <= (prog.stars || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-transparent text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>최고 기록 없음</span>
                      <span className="font-mono text-[11px]">{currentDifficulty.gridSize}×{currentDifficulty.gridSize}</span>
                    </div>
                  )}

                  {/* Play Button */}
                  <button
                    onClick={() => onSelectStage(stage)}
                    className={`mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isCompleted
                        ? 'text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60'
                        : 'text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? '다시 맞추기' : '퍼즐 시작'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
