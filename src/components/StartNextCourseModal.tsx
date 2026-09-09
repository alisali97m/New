import React, { useState } from 'react';
import { 
  Trophy, 
  X, 
  Sparkles, 
  ArrowRight, 
  Dumbbell, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { CourseRecord } from '../types';

interface StartNextCourseModalProps {
  currentCourse: CourseRecord;
  nextCourseNumber: number;
  onClose: () => void;
  onConfirmStartNewCourse: (carryOverWeights: boolean, title: string) => void;
}

export const StartNextCourseModal: React.FC<StartNextCourseModalProps> = ({
  currentCourse,
  nextCourseNumber,
  onClose,
  onConfirmStartNewCourse
}) => {
  const [carryOverWeights, setCarryOverWeights] = useState<boolean>(true);
  const [courseTitle, setCourseTitle] = useState<string>(`الكورس ${nextCourseNumber} (45 يوماً)`);

  const completedDays = currentCourse.days.filter((d) => d.isCompleted).length;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmStartNewCourse(carryOverWeights, courseTitle.trim() || `الكورس ${nextCourseNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                بدء كورس تدريبي جديد (45 يوماً)
              </h3>
              <p className="text-xs text-slate-400">
                مواصلة التطور وبدء دورة الـ 45 يوماً التالية
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleStart} className="p-5 sm:p-6 space-y-5">
          {/* Previous Course Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">حالة الكورس الحالي ({currentCourse.title}):</span>
              <span className="font-mono font-bold text-emerald-400">
                أتممت {completedDays} من أصل 45 يوماً
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              سيتم أرشفة هذا الكورس تلقائياً في <strong>سجل الكورسات</strong>، لتتمكن من الرجوع إليه، مراجعة تطورك، أو طباعة تقريره الشامل في أي وقت.
            </p>
          </div>

          {/* New Course Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              عنوان الكورس الجديد
            </label>
            <input
              type="text"
              required
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          {/* Carry Over Weights Option */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-start gap-3">
              <input
                id="checkbox-carry-weights"
                type="checkbox"
                checked={carryOverWeights}
                onChange={(e) => setCarryOverWeights(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-500 focus:ring-0 focus:outline-none mt-0.5 cursor-pointer"
              />
              <div>
                <label htmlFor="checkbox-carry-weights" className="text-xs font-bold text-emerald-300 cursor-pointer block">
                  نقل أعلى أوزان محققة كنقطة بداية للكورس الجديد (موصى به)
                </label>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  سيتم وضع أحدث وأعلى أوزان وصلت إليها في الكورس السابق كأوزان أساسية في تمارين اليوم الأول للكورس الجديد، حتى تواصل الزيادة التدريجية للأحمال دون البدء من أوزان فارغة.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              بدء الكورس الجديد الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
