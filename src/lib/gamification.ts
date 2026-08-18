export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  currentLevelXp: number;
  xpNeededForNext: number;
  progressPercentage: number;
  isMaxLevel: boolean;
  perks: string;
}

export const LEVEL_DEFINITIONS: Array<{
  level: number;
  title: string;
  min: number;
  max: number;
  perks: string;
}> = [
  { level: 1, title: 'NEET Rookie', min: 0, max: 350, perks: 'Starter badge & fundamental diagnostic unlocked' },
  { level: 2, title: 'Concept Apprentice', min: 350, max: 750, perks: 'Targeted micro-remediation drills unlocked' },
  { level: 3, title: 'Problem Solver', min: 750, max: 1200, perks: 'AI Concept Maps & Step-by-Step solutions unlocked' },
  { level: 4, title: 'Formula Wizard', min: 1200, max: 1750, perks: 'Speed-challenge mode & Weak-Topic auto-analyzer unlocked' },
  { level: 5, title: 'Mock Challenger', min: 1750, max: 2400, perks: 'Batch Leaderboard podium contender & Advanced mock packs' },
  { level: 6, title: 'AIR Rank Aspirant', min: 2400, max: 3200, perks: 'NEET Advanced Grand Mock packs & Hall of Fame eligibility' },
  { level: 7, title: 'NEET Grandmaster', min: 3200, max: 5000, perks: 'Elite Master Tier & Coaching Batch Mentor status' },
];

export function getLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, totalXp || 0);

  for (let i = 0; i < LEVEL_DEFINITIONS.length; i++) {
    const l = LEVEL_DEFINITIONS[i];
    if (xp >= l.min && xp < l.max) {
      if (i === LEVEL_DEFINITIONS.length - 1) {
        return {
          level: l.level,
          title: l.title,
          minXp: l.min,
          maxXp: l.max,
          currentLevelXp: xp - l.min,
          xpNeededForNext: 0,
          progressPercentage: 100,
          isMaxLevel: true,
          perks: l.perks,
        };
      }
      const currentLevelXp = xp - l.min;
      const span = l.max - l.min;
      const progressPercentage = Math.min(100, Math.max(0, Math.round((currentLevelXp / span) * 100)));
      return {
        level: l.level,
        title: l.title,
        minXp: l.min,
        maxXp: l.max,
        currentLevelXp,
        xpNeededForNext: l.max - xp,
        progressPercentage,
        isMaxLevel: false,
        perks: l.perks,
      };
    }
  }

  // Level 7 (Grandmaster)
  const grandmaster = LEVEL_DEFINITIONS[LEVEL_DEFINITIONS.length - 1];
  return {
    level: 7,
    title: grandmaster.title,
    minXp: grandmaster.min,
    maxXp: grandmaster.max,
    currentLevelXp: xp - grandmaster.min,
    xpNeededForNext: 0,
    progressPercentage: 100,
    isMaxLevel: true,
    perks: grandmaster.perks,
  };
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 1.30;
  if (streakDays >= 14) return 1.15;
  if (streakDays >= 7) return 1.10;
  if (streakDays >= 3) return 1.05;
  return 1.0;
}

export function formatXp(amount: number): string {
  return Number(amount || 0).toLocaleString('en-IN');
}
