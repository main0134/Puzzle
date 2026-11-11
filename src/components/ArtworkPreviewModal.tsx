import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Compass, Sparkles, MapPin } from 'lucide-react';
import { Stage } from '../types/puzzle';

interface ArtworkPreviewModalProps {
  stage: Stage;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtworkPreviewModal: React.FC<ArtworkPreviewModalProps> = ({
  stage,
  isOpen,
  onClose,
}) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'v' || e.key === 'V') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="완성본 일러스트 미리보기"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded-full transition-colors cursor-pointer"
          title="닫기 (ESC)"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Artwork Image Column */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center min-h-[320px] md:min-h-[460px] overflow-hidden group">
          <img
            src={stage.imageUrl}
            alt={stage.title}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-contain max-h-[70vh] transition-transform duration-300 ${
              isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Zoom toggle floating button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {isZoomed ? (
              <>
                <ZoomOut className="w-3.5 h-3.5 text-sky-400" />
                <span>축소 보기</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                <span>확대 보기</span>
              </>
            )}
          </button>
        </div>

        {/* Artwork Lore & Information Column */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-slate-900/95 border-t md:border-t-0 md:border-l border-slate-800 overflow-y-auto">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STAGE {stage.id} 완성본 일러스트</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {stage.title}
              </h2>
            </div>

            {/* Character & Location */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-sm">
              <div className="flex items-start gap-2 text-slate-300">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">등장 캐릭터</span>
                  <span className="font-medium text-slate-200">{stage.character}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">배경 장소</span>
                  <span className="font-medium text-slate-200">{stage.location}</span>
                </div>
              </div>
            </div>

            {/* Description / Story */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1.5">일러스트 배경 스토리</span>
              <p className="text-xs leading-relaxed text-slate-400">
                {stage.description}
              </p>
            </div>

            {/* Tags with clean unboxed metadata */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              {stage.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>#{tag}</span>
                  {idx < stage.tags.length - 1 && <span aria-hidden="true" className="text-slate-600">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              퍼즐로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
