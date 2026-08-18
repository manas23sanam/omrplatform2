import React, { useState } from 'react';
import { Award, Lock, CheckCircle2, X, Sparkles, Shield } from 'lucide-react';
import type { BadgeItem } from '../../types/student';

interface BadgeGalleryProps {
  badges: BadgeItem[];
}

type BadgeTierFilter = 'all' | 'diamond' | 'gold' | 'silver' | 'bronze';

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges }) => {
  const [tierFilter, setTierFilter] = useState<BadgeTierFilter>('all');
  const [inspectedBadge, setInspectedBadge] = useState<BadgeItem | null>(null);

  const filteredBadges = badges.filter((b) => {
    if (tierFilter === 'all') return true;
    return b.tier.toLowerCase() === tierFilter;
  });

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'diamond':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-400 to-blue-600',
        };
      case 'gold':
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          gradient: 'from-slate-400 to-slate-500',
        };
      case 'silver':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-300',
          gradient: 'from-slate-300 to-slate-500',
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-800',
          border: 'border-slate-200',
          gradient: 'from-slate-600 to-slate-800',
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-2xs space-y-6">
      {/* Header & Tier Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-slate-500" size={20} />
            <h3 className="font-black text-slate-900 text-lg">Achievement Badges & Mastery Honors</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Earn badges by conquering weak topics, maintaining study streaks, and acing mock tests
          </p>
        </div>

        {/* Tier Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'diamond', 'gold', 'silver', 'bronze'] as BadgeTierFilter[]).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                tierFilter === tier
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
              }`}
            >
              {tier === 'all' ? `All (${badges.length})` : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const tierStyle = getTierColor(badge.tier);
          const isUnlocked = badge.isUnlocked;

          return (
            <div
              key={badge.id}
              onClick={() => setInspectedBadge(badge)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                  : 'bg-slate-50/70 border-slate-200/70 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Badge Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                    isUnlocked
                      ? `bg-gradient-to-br ${tierStyle.gradient} text-white ring-4 ring-slate-50`
                      : 'bg-slate-200 text-slate-400 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${tierStyle.bg} ${tierStyle.text} border ${tierStyle.border}`}
                    >
                      {badge.tier} Tier
                    </span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-slate-600 flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                        <Lock size={11} /> Locked
                      </span>
                    )}
                  </div>

                  <h5 className="font-black text-xs text-slate-900 line-clamp-1">{badge.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Footer status */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-medium">
                  {isUnlocked && badge.unlockedAt ? `Unlocked ${badge.unlockedAt}` : 'Criteria in progress'}
                </span>
                <span className="font-bold text-blue-600 hover:underline">Inspect Details</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Inspection Modal */}
      {inspectedBadge && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 text-slate-900 relative">
            <button
              type="button"
              onClick={() => setInspectedBadge(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                  inspectedBadge.isUnlocked
                    ? `bg-gradient-to-br ${getTierColor(inspectedBadge.tier).gradient} text-white`
                    : 'bg-slate-200 text-slate-400 grayscale'
                }`}
              >
                {inspectedBadge.icon}
              </div>
              <div>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    getTierColor(inspectedBadge.tier).bg
                  } ${getTierColor(inspectedBadge.tier).text}`}
                >
                  {inspectedBadge.tier} Tier Honor
                </span>
                <h4 className="font-black text-lg text-slate-900 mt-1">{inspectedBadge.title}</h4>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
              <p className="font-bold text-slate-800">Badge Criteria & Description:</p>
              <p className="text-slate-600 leading-relaxed">{inspectedBadge.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500">
                Status: {inspectedBadge.isUnlocked ? 'Unlocked & Active' : 'Locked'}
              </span>
              <button
                type="button"
                onClick={() => setInspectedBadge(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
