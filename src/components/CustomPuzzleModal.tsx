import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Play, Sparkles } from 'lucide-react';
import { DifficultyConfig, Stage } from '../types/puzzle';
import { DIFFICULTY_LIST } from '../data/difficulties';

interface CustomPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomPuzzle: (customStage: Stage, difficulty: DifficultyConfig) => void;
}

export const CustomPuzzleModal: React.FC<CustomPuzzleModalProps> = ({
  isOpen,
  onClose,
  onStartCustomPuzzle,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyConfig>(DIFFICULTY_LIST[0]);
  const [customTitle, setCustomTitle] = useState<string>('나만의 캐릭터 일러스트');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStart = () => {
    if (!imagePreview) return;

    const customStage: Stage = {
      id: 99,
      title: customTitle || '나만의 캐릭터 일러스트',
      character: '사용자 지정 캐릭터',
      location: '나만의 공간',
      description: '직접 업로드한 사진으로 제작된 커스텀 그림 퍼즐입니다.',
      imageUrl: imagePreview,
      tags: ['커스텀', '사용자 사진'],
      themeColor: '#6366f1',
    };

    onStartCustomPuzzle(customStage, selectedDifficulty);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="내 사진으로 퍼즐 만들기"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">내 사진으로 퍼즐 맞추기</h2>
              <p className="text-xs text-slate-400">보관함의 캐릭터 그림이나 사진으로 퍼즐을 생성합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="mt-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {imagePreview ? (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700 group bg-slate-950">
              <img
                src={imagePreview}
                alt="미리보기"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-semibold transition-opacity cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>다른 이미지 선택</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-950/40 hover:bg-indigo-950/20 flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-400" />
              <span className="text-sm font-semibold text-slate-200">
                캐릭터 일러스트 또는 사진 파일 업로드
              </span>
              <span className="text-xs text-slate-500 mt-1">
                PNG, JPG, WEBP 이미지 지원 (정사각형 권장)
              </span>
            </button>
          )}
        </div>

        {/* Puzzle Name Input */}
        <div className="mt-4">
          <label className="text-xs font-medium text-slate-400 block mb-1">
            퍼즐 제목
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="퍼즐 제목을 입력하세요"
            className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Difficulty Selection */}
        <div className="mt-4">
          <label className="text-xs font-medium text-slate-400 block mb-1.5">
            도전할 난이도 선택
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {DIFFICULTY_LIST.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff)}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedDifficulty.id === diff.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{diff.label}</div>
                <div className="text-[10px] opacity-75">{diff.gridSize}×{diff.gridSize}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleStart}
            disabled={!imagePreview}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>퍼즐 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
