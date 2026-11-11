import { DifficultyConfig, DifficultyId } from '../types/puzzle';

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  1: {
    id: 1,
    name: '입문 (3×3)',
    label: '입문',
    gridSize: 3,
    totalTiles: 9,
    threeStarTime: 40, // within 40s = 3 stars
    twoStarTime: 90,  // within 90s = 2 stars
    description: '퍼즐의 기본 원리를 익히는 9조각 입문 단계',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  2: {
    id: 2,
    name: '쉬움 (4×4)',
    label: '쉬움',
    gridSize: 4,
    totalTiles: 16,
    threeStarTime: 90, // within 1m30s
    twoStarTime: 180, // within 3m
    description: '적당한 몰입감과 재미를 주는 16조각 퍼즐',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  },
  3: {
    id: 3,
    name: '보통 (5×5)',
    label: '보통',
    gridSize: 5,
    totalTiles: 25,
    threeStarTime: 180, // within 3m
    twoStarTime: 360, // within 6m
    description: '디테일한 배경과 캐릭터를 관찰하는 25조각 표준 퍼즐',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  4: {
    id: 4,
    name: '어려움 (6×6)',
    label: '어려움',
    gridSize: 6,
    totalTiles: 36,
    threeStarTime: 300, // within 5m
    twoStarTime: 600, // within 10m
    description: '높은 집중력과 테두리 조각 배치가 필요한 36조각 고난도 퍼즐',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  },
  5: {
    id: 5,
    name: '마스터 (7×7)',
    label: '마스터',
    gridSize: 7,
    totalTiles: 49,
    threeStarTime: 480, // within 8m
    twoStarTime: 900, // within 15m
    description: '진정한 퍼즐 마스터만을 위한 49조각 대형 퍼즐 챌린지',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
};

export const DIFFICULTY_LIST: DifficultyConfig[] = [
  DIFFICULTIES[1],
  DIFFICULTIES[2],
  DIFFICULTIES[3],
  DIFFICULTIES[4],
  DIFFICULTIES[5],
];
