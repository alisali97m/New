import React from 'react';
import { 
  Dumbbell, 
  Timer, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Flame,
  FileText,
  Layers,
  Plus
} from 'lucide-react';
import { CourseRecord } from '../types';

interface NavbarProps {
  currentDay: number;
  totalCompletedDays: number;
  activeCourse?: CourseRecord;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTimer: () => void;
  onOpenOverallStats: () => void;
  onOpenReport: () => void;
  onOpenCoursesHistory: () => void;
  onStartNewCourse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDay,
  totalCompletedDays,
  activeCourse,
  soundEnabled,
  onToggleSound,
  onOpenTimer,
  onOpenOverallStats,
  onOpenReport,
  onOpenCoursesHistory,
  onStartNewCourse
}) => {
  const percent = Math.round((totalCompletedDays / 45) * 100);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Active Course Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 shrink-0">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                {activeCourse?.title || 'كورس الـ 45 يوماً'}
              </h1>
              <button
                type="button"
                onClick={onOpenCoursesHistory}
                className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition cursor-pointer"
                title="عرض وتغيير الكورسات التدريبية"
              >
                <Layers className="w-3 h-3" />
                <span>الكورس #{activeCourse?.courseNumber || 1}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              نظام 3 أيام تمرين + 1 يوم راحة • متابعة الأوزان والعدات
            </p>
          </div>
        </div>

        {/* Action Buttons & Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Printable Report Button */}
          <button
            id="nav-btn-report"
            type="button"
            onClick={onOpenReport}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5 text-xs font-bold shadow-sm"
            title="تقرير الـ 45 يوماً الشامل القابل للطباعة أو الحفظ كـ PDF"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">تقرير الكورس (PDF)</span>
          </button>

          {/* Progress pill */}
          <div 
            onClick={onOpenOverallStats}
            className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer transition"
            title="انقر لعرض الإحصائيات الشاملة"
          >
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400">الإنجاز</div>
              <div className="text-xs font-mono font-bold text-slate-200">
                {totalCompletedDays} / 45 ({percent}%)
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-800 flex sm:hidden items-center justify-center font-mono font-bold text-[11px] text-amber-400">
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

          {/* Courses & History Button */}
          <button
            id="nav-btn-courses"
            type="button"
            onClick={onOpenCoursesHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 border border-slate-700/80 transition flex items-center gap-1.5 text-xs font-medium"
            title="سجل الكورسات والتبديل بينها"
          >
            <Trophy className="w-4 h-4 text-indigo-400" />
            <span className="hidden lg:inline">الكورسات</span>
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

