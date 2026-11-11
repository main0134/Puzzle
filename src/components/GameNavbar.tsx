import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface GameNavbarProps {
  currentView: 'STAGE_SELECT' | 'PLAYING';
  onNavigateHome: () => void;
  onOpenHowToPlay: () => void;
  onOpenRecords: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const GameNavbar: React.FC<GameNavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenHowToPlay,
  onOpenRecords,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 py-3">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-base md:text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>그림 퍼즐 퀘스트</span>
        </button>

        {/* Zone 2: 4 nav links with single-line labels */}
        <nav className="hidden sm:flex items-center gap-6 text-xs md:text-sm font-medium text-slate-400">
          <button
            onClick={onNavigateHome}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'STAGE_SELECT' ? 'text-white font-semibold' : ''
            }`}
          >
            스테이지
          </button>
          <button
            onClick={onOpenHowToPlay}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            플레이 가이드
          </button>
          <button
            onClick={onOpenRecords}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            기록 & 통계
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title={soundMuted ? '소리 켜기' : '소리 끄기'}
            aria-label={soundMuted ? '소리 켜기' : '소리 끄기'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {currentView === 'PLAYING' && (
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              스테이지 목록
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
