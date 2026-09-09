import React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Dumbbell, 
  Sparkles,
  Droplets,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayWorkout } from '../types';
import { soundManager } from '../utils/audio';
import { WORKOUT_ADVICE } from '../data/workoutProgram';

interface DailySummaryBannerProps {
  day: DayWorkout;
  onToggleCompleteDay: (dayNumber: number) => void;
  onSelectDay: (dayNumber: number) => void;
}

export const DailySummaryBanner: React.FC<DailySummaryBannerProps> = ({
  day,
  onToggleCompleteDay,
  onSelectDay
}) => {
  const totalExercises = day.exercises.length;
  const completedExercises = day.exercises.filter((ex) => ex.completed).length;

  const totalSets = day.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = day.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);

  const totalVolume = day.exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => sAcc + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
  }, 0);

  const handleCompleteClick = () => {
    const nextState = !day.isCompleted;
    onToggleCompleteDay(day.dayNumber);

    if (nextState) {
      soundManager.playCelebrationSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div id="daily-summary-banner" className="space-y-4">
      {/* Day Navigation & Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Day Title & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl font-mono font-bold text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                اليوم {day.dayNumber} من 45
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                الدورة {day.cycleNumber} (اليوم {day.cycleDay} تدريبي)
              </span>
              {day.isCompleted && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل بالكامل
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {day.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans" dir="ltr">
              {day.subtitle}
            </p>
          </div>

          {/* Quick Stats Grid for today */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center min-w-[95px]">
              <span className="text-[11px] text-slate-400 block mb-0.5">التمارين</span>
              <span className="text-base font-bold font-mono text-slate-100">
                {completedExercises} / {totalExercises}
              </span>
            </div>

            <div className="px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center min-w-[95px]">
              <span className="text-[11px] text-slate-400 block mb-0.5">الجولات</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {completedSets} / {totalSets}
              </span>
            </div>

            <div className="px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center min-w-[110px]">
              <span className="text-[11px] text-slate-400 block mb-0.5">الحجم التدريبي</span>
              <span className="text-base font-bold font-mono text-amber-400">
                {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(2)} طن` : `${totalVolume} كغم`}
              </span>
            </div>
          </div>

          {/* Complete Today Workout Button & Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              id="btn-complete-workout-day"
              type="button"
              onClick={handleCompleteClick}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                day.isCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 shadow-emerald-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {day.isCompleted ? 'تم إكمال تمرين اليوم ✓' : 'تأكيد إكمال تمرين اليوم'}
            </button>

            {/* Prev / Next Day navigation */}
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                disabled={day.dayNumber <= 1}
                onClick={() => onSelectDay(day.dayNumber - 1)}
                className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-2xl transition border border-slate-700"
                title="اليوم السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={day.dayNumber >= 45}
                onClick={() => onSelectDay(day.dayNumber + 1)}
                className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-2xl transition border border-slate-700"
                title="اليوم التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Advice Banner directly from PDF */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
          <Droplets className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-cyan-300">{WORKOUT_ADVICE.header}:</strong> {WORKOUT_ADVICE.content}
          </p>
        </div>
      </div>
    </div>
  );
};
