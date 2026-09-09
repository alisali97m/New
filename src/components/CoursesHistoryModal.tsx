import React, { useRef } from 'react';
import { 
  Trophy, 
  X, 
  Plus, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Calendar, 
  Flame, 
  Download, 
  Upload, 
  ArrowLeft,
  Clock
} from 'lucide-react';
import { CourseRecord } from '../types';
import { exportAllCoursesAsJSON, importCoursesFromJSON } from '../utils/storage';

interface CoursesHistoryModalProps {
  allCourses: CourseRecord[];
  activeCourseId: string;
  onClose: () => void;
  onSelectCourse: (courseId: string) => void;
  onOpenReportForCourse: (course: CourseRecord) => void;
  onRequestStartNewCourse: () => void;
  onDataRestored: (active: CourseRecord, all: CourseRecord[]) => void;
}

export const CoursesHistoryModal: React.FC<CoursesHistoryModalProps> = ({
  allCourses,
  activeCourseId,
  onClose,
  onSelectCourse,
  onOpenReportForCourse,
  onRequestStartNewCourse,
  onDataRestored
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportAllCoursesAsJSON(allCourses, activeCourseId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importCoursesFromJSON(content);
        if (result) {
          onDataRestored(result.activeCourse, result.allCourses);
          alert('تم استيراد كافة بيانات الكورسات بنجاح!');
          onClose();
        } else {
          alert('الملف غير صالح أو لا يحتوي على تنسيق الكورسات الصحيح.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                سجل الكورسات التدريبية (دورات الـ 45 يوماً)
              </h3>
              <p className="text-xs text-slate-400">
                عرض الكورسات الحالية والسابقة والتقارير الشاملة
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

        {/* Action button: Start new course */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            أنهيت كورس أو ترغب في بدء مرحلة 45 يوماً جديدة؟
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestStartNewCourse();
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            بدء كورس جديد (+45 يوم)
          </button>
        </div>

        {/* List of courses */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {allCourses.map((c) => {
            const isActive = c.id === activeCourseId;
            const completedDays = c.days.filter((d) => d.isCompleted).length;
            const percent = Math.round((completedDays / 45) * 100);

            // Compute total volume
            let vol = 0;
            c.days.forEach((d) => {
              d.exercises.forEach((ex) => {
                ex.sets.forEach((s) => {
                  if (s.completed && s.weight > 0 && s.reps > 0) {
                    vol += Number(s.weight) * Number(s.reps);
                  }
                });
              });
            });

            return (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-slate-950/90 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                      #{c.courseNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">
                          {c.title}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-slate-950">
                            الكورس النشط حالياً
                          </span>
                        )}
                        {c.isCompleted && !isActive && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            مؤرشف
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>بدأ في: {c.startDate}</span>
                        {c.endDate && <span>• انتهى في: {c.endDate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Progress info */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">الالتزام</div>
                      <div className="font-mono font-bold text-slate-200">
                        {completedDays} / 45 يوم ({percent}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-[11px]">الحجم التدريبي</div>
                      <div className="font-mono font-bold text-amber-400">
                        {vol >= 1000 ? `${(vol / 1000).toFixed(1)} طن` : `${vol} كغم`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Course Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenReportForCourse(c);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    عرض التقرير الشامل (PDF)
                  </button>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCourse(c.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      التبديل ومتابعة هذا الكورس
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Backup actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            يمكنك حفظ نسخة احتياطية لكافة الكورسات أو استعادتها:
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              تصدير الكورسات (JSON)
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              استيراد
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
