import { AllProgress, DifficultyConfig, DifficultyId, StageProgress } from '../types/puzzle';

const STORAGE_KEY = 'picture_puzzle_quest_progress_v1';

export function loadAllProgress(): AllProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load puzzle progress:', err);
    return {};
  }
}

export function saveStageClear(
  difficulty: DifficultyConfig,
  stageId: number,
  timeInSeconds: number,
  moves: number
): { progress: StageProgress; isNewRecord: boolean } {
  const current = loadAllProgress();
  const key = `${difficulty.id}_${stageId}`;
  const existing = current[key];

  let stars = 1;
  if (timeInSeconds <= difficulty.threeStarTime) {
    stars = 3;
  } else if (timeInSeconds <= difficulty.twoStarTime) {
    stars = 2;
  }

  const isNewRecord = !existing || existing.bestTime === null || timeInSeconds < existing.bestTime;
  const bestTime = isNewRecord ? timeInSeconds : existing.bestTime;
  const bestMoves = (!existing || existing.bestMoves === null || moves < existing.bestMoves) ? moves : existing.bestMoves;
  const highestStars = existing ? Math.max(existing.stars || 0, stars) : stars;

  const newProgress: StageProgress = {
    completed: true,
    bestTime,
    lastTime: timeInSeconds,
    bestMoves,
    stars: highestStars,
    completedAt: new Date().toISOString(),
  };

  current[key] = newProgress;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save progress:', err);
  }

  return { progress: newProgress, isNewRecord };
}

export function getStageProgress(allProgress: AllProgress, difficultyId: DifficultyId, stageId: number): StageProgress | undefined {
  return allProgress[`${difficultyId}_${stageId}`];
}

export function getDifficultySummary(allProgress: AllProgress, difficultyId: DifficultyId, totalStages: number = 10) {
  let clearedCount = 0;
  let totalStars = 0;
  let totalBestTime = 0;

  for (let s = 1; s <= totalStages; s++) {
    const prog = allProgress[`${difficultyId}_${s}`];
    if (prog && prog.completed) {
      clearedCount++;
      totalStars += prog.stars || 0;
      if (prog.bestTime) totalBestTime += prog.bestTime;
    }
  }

  return {
    clearedCount,
    totalStages,
    totalStars,
    totalBestTime,
    isCompletedAll: clearedCount === totalStages,
  };
}

export function formatTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
