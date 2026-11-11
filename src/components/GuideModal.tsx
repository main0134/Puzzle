import React from 'react';
import { X, Sparkles, Eye, Layers, Hash, HelpCircle, Trophy } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="퍼즐 플레이 가이드"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">그림 퍼즐 플레이 가이드</h2>
              <p className="text-xs text-slate-400">규칙 및 보조 기능 설명</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs text-slate-300">
          {/* Rule 1: Moving Pieces */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>조각 위치 바꾸기 (클릭 & 드래그)</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6.5">
              원하는 조각을 먼저 클릭한 뒤 바꿀 대상 조각을 클릭하면 두 조각의 위치가 서로 교환됩니다. PC에서는 마우스 드래그 앤 드롭으로도 직관적으로 이동할 수 있습니다.
            </p>
          </div>

          {/* Rule 2: Viewing Completed Artwork */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <Eye className="w-4 h-4 text-sky-400" />
              <span>완성본 일러스트 확인하기</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6.5">
              게임 중 상단의 <strong className="text-indigo-400">완성본 일러스트</strong> 버튼을 누르면 원본 그림과 캐릭터 스토리, 배경 설정을 고화질로 확대 감상할 수 있습니다. 키보드 스페이스바를 누르고 있으면 화면 상에서 즉시 원본 그림을 엿볼 수 있습니다.
            </p>
          </div>

          {/* Rule 3: Assistive features */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <Layers className="w-4 h-4 text-amber-400" />
              <span>편리한 보조 기능 (밑그림, 번호, 테두리, 힌트)</span>
            </div>
            <ul className="text-slate-400 space-y-1 pl-6.5 list-disc list-inside">
              <li><strong className="text-slate-200">밑그림:</strong> 퍼즐 판 뒤에 반투명 원본 가이드를 투영합니다.</li>
              <li><strong className="text-slate-200">테두리 조각:</strong> 테두리 바깥쪽 조각만 밝게 남겨 먼저 틀을 잡을 수 있게 돕습니다.</li>
              <li><strong className="text-slate-200">조각 번호:</strong> 각 조각에 원래 번호(1~N)를 표시합니다.</li>
              <li><strong className="text-slate-200">힌트:</strong> 제자리가 아닌 조각 1개를 즉시 올바른 자리로 자동 이동합니다.</li>
            </ul>
          </div>

          {/* Rule 4: Stars & Records */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>클리어 시간 및 별점 시스템</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6.5">
              모든 조각을 완성하면 걸린 시간과 이동 횟수가 측정되며, 클리어 완료 표시와 최고 기록이 자동 저장됩니다. 기준 시간 이내에 클리어하여 별 3개를 달성해보세요!
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
