import React, { useState } from 'react';
import { 
  Moon, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Trophy,
  Dumbbell
} from 'lucide-react';
import { DayWorkout } from '../types';
import { WORKOUT_ADVICE } from '../data/workoutProgram';

interface RestDayViewProps {
  day: DayWorkout;
  allDays: DayWorkout[];
  onToggleCompleteDay: (dayNumber: number) => void;
  onSelectDay: (dayNumber: number) => void;
}

export const RestDayView: React.FC<RestDayViewProps> = ({
  day,
  allDays,
  onToggleCompleteDay,
  onSelectDay
}) => {
  const [hydrationChecked, setHydrationChecked] = useState<boolean>(true);
  const [sleepChecked, setSleepChecked] = useState<boolean>(true);
  const [nutritionChecked, setNutritionChecked] = useState<boolean>(true);
  const [mobilityChecked, setMobilityChecked] = useState<boolean>(false);

  // Find the 3 previous workout days in this cycle
  const prevWorkoutDays = [day.dayNumber - 3, day.dayNumber - 2, day.dayNumber - 1]
    .map((num) => allDays.find((d) => d.dayNumber === num))
    .filter((d): d is DayWorkout => Boolean(d));

  // Compute total volume of this cycle so far
  const cycleTotalVolume = prevWorkoutDays.reduce((acc, currDay) => {
    return acc + currDay.exercises.reduce((exAcc, ex) => {
      return exAcc + ex.sets.reduce((sAcc, s) => sAcc + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
    }, 0);
  }, 0);

  const cycleTotalSets = prevWorkoutDays.reduce((acc, currDay) => {
    return acc + currDay.exercises.reduce((exAcc, ex) => {
      return exAcc + ex.sets.filter((s) => s.completed).length;
    }, 0);
  }, 0);

  return (
    <div id="rest-day-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Rest Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>الدورة {day.cycleNumber} - اليوم 4 من الدورة (استراحة تامة)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              {WORKOUT_ADVICE.restDayTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              أتممت بنجاح الأيام الثلاثة التدريبية (الصدر والتراي، الظهر والباي، والكتف والأرجل مع البطن). اليوم هو محطة النمو والبناء العضلي الحقيقية لإعادة شحن طاقتك للأيام القادمة!
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2 bg-slate-950/80 p-5 rounded-2xl border border-indigo-500/20">
            <span className="text-xs text-slate-400 font-medium">حالة يوم الاستراحة</span>
            <button
              id="btn-toggle-rest-day"
              type="button"
              onClick={() => onToggleCompleteDay(day.dayNumber)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
                day.isCompleted
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {day.isCompleted ? 'تمت الاستراحة بنجاح ✓' : 'تأكيد إتمام الاستراحة'}
            </button>
            {day.dayNumber < 45 && (
              <button
                id="btn-next-workout-day"
                type="button"
                onClick={() => onSelectDay(day.dayNumber + 1)}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 mt-1 transition"
              >
                <span>الانتقال لليوم {day.dayNumber + 1} (الصدر والتراي)</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cycle Recap Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">إجمالي الحجم المرفوع بالدورة</span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              {cycleTotalVolume > 1000 ? `${(cycleTotalVolume / 1000).toFixed(1)} طن` : `${cycleTotalVolume} كغم`}
            </span>
            <span className="text-[11px] text-slate-500 block">خلال آخر 3 أيام تدريبية</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">السيتات المنجزة بالدورة</span>
            <span className="text-xl font-mono font-bold text-indigo-400">
              {cycleTotalSets} سيت تمرين
            </span>
            <span className="text-[11px] text-slate-500 block">بكامل الشدة والتكرارات</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">الدورة الحالية</span>
            <span className="text-xl font-mono font-bold text-amber-400">
              دورة {day.cycleNumber} من 12
            </span>
            <span className="text-[11px] text-slate-500 block">اليوم {day.dayNumber} من 45 يوم</span>
          </div>
        </div>
      </div>

      {/* Recovery Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-indigo-400" />
          قائمة الاستشفاء والتعافي العضلي
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          حدد العوامل التي التزمت بها اليوم لضمان أفضل تغذية وبناء للألياف العضلية:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <label 
            className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              hydrationChecked ? 'bg-slate-800/80 border-indigo-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={hydrationChecked}
              onChange={(e) => setHydrationChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-slate-100">شرب 3 - 4 لترات ماء</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                الماء ينقل العناصر الغذائية للأنسجة العضلية ويمنع التشنجات والشد العضلي.
              </p>
            </div>
          </label>

          <label 
            className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              sleepChecked ? 'bg-slate-800/80 border-indigo-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={sleepChecked}
              onChange={(e) => setSleepChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-sm text-slate-100">نوم عميق 7 - 9 ساعات</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                إفراز هرمون النمو (GH) يحدث بأعلى معدلاته في مرحلة النوم العميق.
              </p>
            </div>
          </label>

          <label 
            className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              nutritionChecked ? 'bg-slate-800/80 border-indigo-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={nutritionChecked}
              onChange={(e) => setNutritionChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-slate-100">تغذية بروتينية كافية</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تناول 1.6 - 2.2 غرام بروتين لكل كغم من وزنك لإصلاح الميكروتيمز في العضلات.
              </p>
            </div>
          </label>

          <label 
            className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              mobilityChecked ? 'bg-slate-800/80 border-indigo-500/40' : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={mobilityChecked}
              onChange={(e) => setMobilityChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-slate-100">استشفاء نشط أو إطالات</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                مشي خفيف لمدة 20 دقيقة أو إطالات يوجا لتنشيط الدورة الدموية وتصريف اللاكتيك.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
