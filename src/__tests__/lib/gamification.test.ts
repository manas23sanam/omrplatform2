import { describe, it, expect } from 'vitest';
import {
  getLevelInfo,
  getStreakMultiplier,
  formatXp,
  LEVEL_DEFINITIONS,
} from '../../lib/gamification';

describe('Gamification Library', () => {
  describe('LEVEL_DEFINITIONS', () => {
    it('has 7 progressive levels', () => {
      expect(LEVEL_DEFINITIONS.length).toBe(7);
      expect(LEVEL_DEFINITIONS[0].level).toBe(1);
      expect(LEVEL_DEFINITIONS[6].level).toBe(7);
    });
  });

  describe('getLevelInfo', () => {
    it('returns Level 1 (NEET Rookie) for 0 XP', () => {
      const info = getLevelInfo(0);
      expect(info.level).toBe(1);
      expect(info.title).toBe('NEET Rookie');
      expect(info.currentLevelXp).toBe(0);
      expect(info.progressPercentage).toBe(0);
      expect(info.isMaxLevel).toBe(false);
      expect(info.xpNeededForNext).toBe(350);
    });

    it('returns Level 1 for negative or nullish values safely', () => {
      const info1 = getLevelInfo(-50);
      expect(info1.level).toBe(1);
      expect(info1.currentLevelXp).toBe(0);

      const info2 = getLevelInfo(NaN);
      expect(info2.level).toBe(1);
    });

    it('returns Level 2 (Concept Apprentice) for 400 XP', () => {
      const info = getLevelInfo(400);
      expect(info.level).toBe(2);
      expect(info.title).toBe('Concept Apprentice');
      expect(info.minXp).toBe(350);
      expect(info.maxXp).toBe(750);
      expect(info.currentLevelXp).toBe(50);
      expect(info.progressPercentage).toBe(13);
      expect(info.isMaxLevel).toBe(false);
    });

    it('returns Level 3 (Problem Solver) for 800 XP', () => {
      const info = getLevelInfo(800);
      expect(info.level).toBe(3);
      expect(info.title).toBe('Problem Solver');
      expect(info.minXp).toBe(750);
      expect(info.maxXp).toBe(1200);
    });

    it('returns Level 4 (Formula Wizard) for 1300 XP', () => {
      const info = getLevelInfo(1300);
      expect(info.level).toBe(4);
      expect(info.title).toBe('Formula Wizard');
    });

    it('returns Level 5 (Mock Challenger) for 1800 XP', () => {
      const info = getLevelInfo(1800);
      expect(info.level).toBe(5);
      expect(info.title).toBe('Mock Challenger');
    });

    it('returns Level 6 (AIR Rank Aspirant) for 2500 XP', () => {
      const info = getLevelInfo(2500);
      expect(info.level).toBe(6);
      expect(info.title).toBe('AIR Rank Aspirant');
    });

    it('returns Level 7 (NEET Grandmaster) max level for 3500+ XP', () => {
      const info = getLevelInfo(4000);
      expect(info.level).toBe(7);
      expect(info.title).toBe('NEET Grandmaster');
      expect(info.isMaxLevel).toBe(true);
      expect(info.xpNeededForNext).toBe(0);
      expect(info.progressPercentage).toBe(100);
    });
  });

  describe('getStreakMultiplier', () => {
    it('returns 1.0 for less than 3 days streak', () => {
      expect(getStreakMultiplier(0)).toBe(1.0);
      expect(getStreakMultiplier(1)).toBe(1.0);
      expect(getStreakMultiplier(2)).toBe(1.0);
    });

    it('returns 1.05 for 3 to 6 days streak', () => {
      expect(getStreakMultiplier(3)).toBe(1.05);
      expect(getStreakMultiplier(6)).toBe(1.05);
    });

    it('returns 1.10 for 7 to 13 days streak', () => {
      expect(getStreakMultiplier(7)).toBe(1.10);
      expect(getStreakMultiplier(13)).toBe(1.10);
    });

    it('returns 1.15 for 14 to 29 days streak', () => {
      expect(getStreakMultiplier(14)).toBe(1.15);
      expect(getStreakMultiplier(29)).toBe(1.15);
    });

    it('returns 1.30 for 30+ days streak', () => {
      expect(getStreakMultiplier(30)).toBe(1.30);
      expect(getStreakMultiplier(45)).toBe(1.30);
    });
  });

  describe('formatXp', () => {
    it('formats numbers with Indian locale grouping', () => {
      expect(formatXp(1240)).toBe('1,240');
      expect(formatXp(100000)).toBe('1,00,000');
      expect(formatXp(0)).toBe('0');
    });
  });
});
