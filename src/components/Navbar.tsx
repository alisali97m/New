import React from 'react';
import { 
  Dumbbell, 
  Timer, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Flame
} from 'lucide-react';

interface NavbarProps {
  currentDay: number;
  totalCompletedDays: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTimer: () => void;
  onOpenOverallStats: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDay,
  totalCompletedDays,
  soundEnabled,
  onToggleSound,
  onOpenTimer,
  onOpenOverallStats
}) => {
  const percent = Math.round((totalCompletedDays / 45) * 100);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                كورس الـ 45 يوماً
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                3 أيام تمرين + 1 يوم راحة
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden xs:block">
              تسجيل الأوزان والعدات ومقارنة التطور اليومي
            </p>
          </div>
        </div>

        {/* Course Progress & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Progress pill */}
          <div 
            onClick={onOpenOverallStats}
            className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer transition"
            title="انقر لعرض الإحصائيات الكاملة"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400">إنجاز الكورس</div>
              <div className="text-xs font-mono font-bold text-slate-200">
                {totalCompletedDays} / 45 يوم ({percent}%)
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex sm:hidden items-center justify-center font-mono font-bold text-xs text-amber-400">
              {percent}%
            </div>
          </div>

          {/* Rest Timer Button */}
          <button
            id="nav-btn-timer"
            type="button"
            onClick={onOpenTimer}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/80 transition flex items-center gap-1.5 text-xs font-medium"
            title="مؤقت الراحة بين السيتات"
          >
            <Timer className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">مؤقت الراحة</span>
          </button>

          {/* Stats and Backup Button */}
          <button
            id="nav-btn-stats"
            type="button"
            onClick={onOpenOverallStats}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/80 transition flex items-center gap-1.5 text-xs font-medium"
            title="إحصائيات الكورس والنسخ الاحتياطي"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">الإحصائيات</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="nav-btn-sound"
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/80 transition"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل المؤثرات الصوتية'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
