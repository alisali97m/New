import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Trophy, 
  Dumbbell, 
  Moon, 
  Flame, 
  CheckCircle2, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { DayWorkout } from '../types';
import { exportDataAsJSON, importDataFromJSON, resetToDefaultProgram } from '../utils/storage';

interface OverallCourseModalProps {
  days: DayWorkout[];
  currentDay: number;
  onClose: () => void;
  onDataRestored: (restoredDays: DayWorkout[], restoredDay: number) => void;
}

export const OverallCourseModal: React.FC<OverallCourseModalProps> = ({
  days,
  currentDay,
  onClose,
  onDataRestored
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute stats
  const completedWorkoutDays = days.filter((d) => d.type !== 'rest' && d.isCompleted).length;
  const completedRestDays = days.filter((d) => d.type === 'rest' && d.isCompleted).length;
  const totalCompletedDays = days.filter((d) => d.isCompleted).length;
  const courseProgressPercent = Math.round((totalCompletedDays / 45) * 100);

  // Total volume across all 45 days
  let grandTotalVolume = 0;
  let grandTotalSets = 0;

  days.forEach((day) => {
    day.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed && s.weight > 0 && s.reps > 0) {
          grandTotalVolume += Number(s.weight) * Number(s.reps);
          grandTotalSets += 1;
        }
      });
    });
  });

  const handleExport = () => {
    exportDataAsJSON(days, currentDay);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataFromJSON(content);
        if (result) {
          onDataRestored(result.days, result.currentDay);
          alert('تم استيراد بيانات الكورس بنجاح!');
          onClose();
        } else {
          alert('الملف غير صالح أو لا يحتوي على تنسيق الكورس الصحيح.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط الكورس بالكامل؟ سيتم مسح كافة الأوزان والتكرارات المسجلة والعودة لليوم الأول.')) {
      const reset = resetToDefaultProgram();
      onDataRestored(reset.days, reset.currentDay);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                إحصائيات الكورس وإدارة البيانات
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                نظرة شاملة على مسيرة الـ 45 يوماً مع خيارات النسخ الاحتياطي
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Progress Overview Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">نسبة إنجاز الكورس (45 يوم)</span>
              <span className="text-emerald-400 font-mono font-black text-sm">{courseProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${courseProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>أتممت {totalCompletedDays} يوم من أصل 45</span>
              <span>متبقي {45 - totalCompletedDays} يوم</span>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span>أيام التمارين</span>
              </div>
              <span className="text-xl font-mono font-bold text-slate-100">
                {completedWorkoutDays} <span className="text-xs text-slate-500 font-sans">/ 34 يوم</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>أيام الاستراحة</span>
              </div>
              <span className="text-xl font-mono font-bold text-indigo-300">
                {completedRestDays} <span className="text-xs text-slate-500 font-sans">/ 11 يوم</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>إجمالي الأوزان المرفوعة</span>
              </div>
              <span className="text-xl font-mono font-bold text-amber-400">
                {grandTotalVolume >= 1000 ? `${(grandTotalVolume / 1000).toFixed(1)} طن` : `${grandTotalVolume} كغم`}
              </span>
            </div>
          </div>

          {/* Backup and Data Management */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">النسخ الاحتياطي وحفظ بياناتك</h4>
                <p className="text-xs text-slate-400">
                  كافة بياناتك محفوظة تلقائياً في المتصفح. يمكنك تحميل نسخة احتياطية أو نقلها لهاتف آخر.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleExport}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                تصدير نسخة احتياطية (JSON)
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                استيراد نسخة سابقة
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                تريد البدء من الصفر مجدداً؟
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة ضبط الكورس
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
