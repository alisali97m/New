import React, { useMemo } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Trophy, 
  Dumbbell, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Award, 
  ArrowUpRight, 
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CourseRecord, DayWorkout } from '../types';
import { generateCourseReport } from '../utils/reportGenerator';

interface ComprehensiveReportModalProps {
  course: CourseRecord;
  onClose: () => void;
  onStartNextCourse?: () => void;
}

export const ComprehensiveReportModal: React.FC<ComprehensiveReportModalProps> = ({
  course,
  onClose,
  onStartNextCourse
}) => {
  const report = useMemo(() => {
    return generateCourseReport(
      course.days,
      course.courseNumber,
      course.title,
      course.startDate,
      course.endDate
    );
  }, [course]);

  const handlePrint = () => {
    window.print();
  };

  // Top improved exercises
  const topProgressed = useMemo(() => {
    return report.exerciseStats
      .filter((e) => e.weightDelta > 0)
      .sort((a, b) => b.weightDelta - a.weightDelta)
      .slice(0, 4);
  }, [report.exerciseStats]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div 
        id="printable-course-report"
        className="bg-slate-900 print:bg-white text-slate-100 print:text-slate-900 border border-slate-800 print:border-none rounded-3xl print:rounded-none max-w-4xl w-full max-h-[94vh] print:max-h-none overflow-hidden flex flex-col shadow-2xl print:shadow-none"
      >
        {/* Top Actions Bar (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-800 print:hidden flex items-center justify-between gap-3 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                التقرير الختامي الشامل لكورس الـ 45 يوماً
              </h2>
              <p className="text-xs text-slate-400">
                {course.title} • جاهز للطباعة أو الحفظ كـ PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-report"
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              طباعة / حفظ PDF
            </button>

            {onStartNextCourse && (
              <button
                type="button"
                onClick={onStartNextCourse}
                className="hidden sm:flex px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold items-center gap-1.5 border border-slate-700 transition"
              >
                <ChevronRight className="w-4 h-4 text-amber-400" />
                بدء الكورس التالي
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable / Printable Report Document */}
        <div className="p-5 sm:p-8 overflow-y-auto print:overflow-visible space-y-6 text-right">
          {/* Document Header (For print and screen) */}
          <div className="border-b border-slate-800 print:border-slate-300 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 print:bg-amber-100 print:text-amber-800 border border-amber-500/30 print:border-amber-300">
                    شهادة إنجاز الكورس التدريبي
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 print:bg-slate-100 text-slate-300 print:text-slate-700">
                    الكورس رقم #{report.courseNumber}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white print:text-slate-900 mt-1">
                  تقرير أداء وتطور كورس الـ 45 يوماً
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 print:text-slate-600 mt-1">
                  نظام التمارين: 3 أيام تدريب متواصلة + 1 يوم راحة واستشفاء دوري (12 دورة تدريبية)
                </p>
              </div>

              {/* Date & Completion Status Badge */}
              <div className="bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 p-3 rounded-2xl min-w-[200px] text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 print:text-slate-600">
                  <span>تاريخ البدء:</span>
                  <span className="font-mono font-bold text-slate-200 print:text-slate-900">{report.startDate}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 print:text-slate-600">
                  <span>تاريخ التقرير:</span>
                  <span className="font-mono font-bold text-slate-200 print:text-slate-900">{report.endDate}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 print:border-slate-200">
                  <span>حالة الكورس:</span>
                  <span className={`font-bold ${report.completionRate >= 80 ? 'text-emerald-400 print:text-emerald-700' : 'text-amber-400 print:text-amber-700'}`}>
                    {report.completionRate >= 100 ? 'مكتمل بنجاح 100% ✓' : `${report.completionRate}% منجز`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core KPIs Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-400 print:text-slate-600 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>أيام الالتزام</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400 print:text-emerald-700">
                {report.totalCompletedDays} <span className="text-xs text-slate-500 font-sans">/ 45 يوم</span>
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                نسبة الإنجاز: {report.completionRate}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-400 print:text-slate-600 mb-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>إجمالي الأوزان المرفوعة</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400 print:text-amber-700">
                {report.grandTotalVolume >= 1000
                  ? `${(report.grandTotalVolume / 1000).toFixed(1)} طن`
                  : `${report.grandTotalVolume} كغم`}
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                {report.grandTotalVolume.toLocaleString()} كغم وزن تراكمي
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-400 print:text-slate-600 mb-1">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>السيتات المكتملة</span>
              </div>
              <div className="text-2xl font-black font-mono text-indigo-300 print:text-indigo-800">
                {report.grandTotalSets}
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                جولة تدريبية مسجلة
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-400 print:text-slate-600 mb-1">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>إجمالي التكرارات</span>
              </div>
              <div className="text-2xl font-black font-mono text-teal-300 print:text-teal-800">
                {report.grandTotalReps.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                عدة تم إنجازها
              </div>
            </div>
          </div>

          {/* Highlights of Strength Progressions */}
          {topProgressed.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400 print:text-emerald-700" />
                <h3 className="text-sm font-bold text-white print:text-emerald-900">
                  أبرز قفزات القوة والتطور في الأوزان (Strength Milestones)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {topProgressed.map((ex) => (
                  <div 
                    key={ex.exerciseId}
                    className="p-3 rounded-xl bg-slate-900/90 print:bg-white border border-emerald-500/20 print:border-emerald-100"
                  >
                    <div className="text-xs font-bold text-slate-200 print:text-slate-900 truncate">
                      {ex.name}
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-slate-600 mb-1">
                      {ex.muscleGroup}
                    </div>
                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-800 print:border-slate-200">
                      <span className="text-xs text-slate-400 font-mono">
                        {ex.firstRecordedWeight} ➔ <strong className="text-emerald-400 print:text-emerald-700 text-sm">{ex.highestWeight} كغم</strong>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 print:text-emerald-700">
                        +{ex.weightDelta} كغم ({ex.weightDeltaPercent > 0 ? `+${ex.weightDeltaPercent}%` : ''})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Exercise Performance Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-white print:text-slate-900 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                جدول تطور كافة تمارين الكورس عبر الـ 45 يوماً
              </h3>
              <span className="text-xs text-slate-400 print:text-slate-600 font-mono">
                {report.exerciseStats.length} تمرين مسجل
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 border-b border-slate-800 print:border-slate-300">
                    <th className="py-3 px-3">التمرين</th>
                    <th className="py-3 px-2">العضلة المستهدفة</th>
                    <th className="py-3 px-2 text-center">أول وزن مسجل</th>
                    <th className="py-3 px-2 text-center">أعلى وزن محقق</th>
                    <th className="py-3 px-2 text-center">مقدار التطور</th>
                    <th className="py-3 px-2 text-center">السيتات</th>
                    <th className="py-3 px-3 text-center">إجمالي الحجم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 font-sans">
                  {report.exerciseStats.map((ex) => (
                    <tr key={ex.exerciseId} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                      <td className="py-2.5 px-3 font-medium text-slate-200 print:text-slate-900">
                        <div>{ex.name}</div>
                        <div className="text-[10px] text-slate-500 font-sans" dir="ltr">{ex.englishName}</div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-300 print:text-slate-700">
                        {ex.muscleGroup}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-400 print:text-slate-700">
                        {ex.firstRecordedWeight > 0 ? `${ex.firstRecordedWeight} كغم` : '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-100 print:text-slate-900">
                        {ex.highestWeight > 0 ? `${ex.highestWeight} كغم` : '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {ex.weightDelta > 0 ? (
                          <span className="text-emerald-400 print:text-emerald-700">
                            +{ex.weightDelta} كغم ({ex.weightDeltaPercent}%)
                          </span>
                        ) : ex.highestWeight > 0 ? (
                          <span className="text-slate-400 print:text-slate-600">ثابت</span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-300 print:text-slate-700">
                        {ex.totalSets}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-amber-400 print:text-amber-800 font-bold">
                        {ex.totalVolume >= 1000 ? `${(ex.totalVolume / 1000).toFixed(1)} طن` : `${ex.totalVolume} كغم`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Muscle Groups Volume Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white print:text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              توزيع الحجم التدريبي حسب المجموعات العضلية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.muscleBreakdown.map((m) => (
                <div 
                  key={m.muscle}
                  className="p-3 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 print:text-slate-900">{m.muscle}</span>
                    <span className="font-mono font-bold text-indigo-400 print:text-indigo-700">
                      {m.volume >= 1000 ? `${(m.volume / 1000).toFixed(1)} طن` : `${m.volume} كغم`} ({m.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 print:bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 print:bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, m.percentage))}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-slate-600">
                    مجموع السيتات المنجزة: {m.sets} جولة
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 45-Day Attendance Grid */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white print:text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              سجل الـ 45 يوماً وجلسات الاستشفاء
            </h3>

            <div className="grid grid-cols-9 sm:grid-cols-15 gap-1.5 text-center text-[10px] font-mono">
              {course.days.map((day) => {
                const isRest = day.type === 'rest';
                return (
                  <div
                    key={day.dayNumber}
                    title={`اليوم ${day.dayNumber}: ${day.title} - ${day.isCompleted ? 'مكتمل' : 'غير مكتمل'}`}
                    className={`py-1.5 rounded-lg border flex flex-col items-center justify-center ${
                      day.isCompleted
                        ? isRest
                          ? 'bg-indigo-950/60 print:bg-indigo-100 text-indigo-300 print:text-indigo-800 border-indigo-500/40'
                          : 'bg-emerald-950/60 print:bg-emerald-100 text-emerald-300 print:text-emerald-800 border-emerald-500/40'
                        : 'bg-slate-950 print:bg-slate-100 text-slate-600 print:text-slate-400 border-slate-800 print:border-slate-300'
                    }`}
                  >
                    <span className="font-bold">ي{day.dayNumber}</span>
                    <span className="text-[9px]">
                      {day.isCompleted ? '✓' : isRest ? 'راحة' : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 print:text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> يوم تمرين منجز
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> يوم راحة واستشفاء
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> غير منجز
              </span>
            </div>
          </div>

          {/* Coach Conclusion & Next Course Recommendations */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 print:text-amber-800 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>تقييم الكورس وتوجيهات الكورس القادم:</span>
            </div>
            <p className="text-slate-300 print:text-slate-700 leading-relaxed">
              أظهرت التزاما متميزا بنظام 3 أيام تدريب + 1 يوم راحة. عند بدء الكورس الجديد (الـ 45 يوماً التالية)، 
              يوصى باعتماد الزيادة التدريجية للأحمال (Progressive Overload) بإضافة 1.25 إلى 2.5 كغم في التمارين المركبة، 
              أو زيادة تكرار إضافي بنفس الوزن مع التركيز على استقرار المفاصل وجودة الحركة.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 print:text-slate-600">
              <span>نظام متابعة التمارين الرياضية الذكي</span>
              <span>توقيع الكابتن / الرياضي: __________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
