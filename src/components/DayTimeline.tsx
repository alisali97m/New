import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Moon, 
  Dumbbell, 
  LayoutGrid
} from 'lucide-react';
import { DayWorkout } from '../types';

interface DayTimelineProps {
  days: DayWorkout[];
  currentDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  days,
  currentDayNumber,
  onSelectDay
}) => {
  const [showFullGrid, setShowFullGrid] = useState<boolean>(false);
  const [selectedCycleFilter, setSelectedCycleFilter] = useState<number | 'all'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected day when it changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-day="${currentDayNumber}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentDayNumber]);

  const currentDay = days.find((d) => d.dayNumber === currentDayNumber) || days[0];

  const filteredDays = selectedCycleFilter === 'all' 
    ? days 
    : days.filter((d) => d.cycleNumber === selectedCycleFilter);

  const totalCycles = 12; // 45 days -> 11 full 4-day cycles + Day 45

  return (
    <div id="day-timeline-section" className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
      {/* Upper Timeline Header: Current Day Details & Quick Jump */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700/60">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-emerald-400 text-sm">
              اليوم {currentDayNumber}
            </span>
            <span className="text-xs text-slate-400">/ 45 يوم</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">
              الدورة {currentDay.cycleNumber} ({currentDay.type === 'rest' ? 'يوم استراحة' : `يوم ${currentDay.cycleDay} تدريبي`}):
            </span>
            <span className="text-xs font-bold text-slate-200">
              {currentDay.title}
            </span>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Cycle filter dropdown */}
          <div className="flex items-center gap-1">
            <label className="text-[11px] text-slate-400 hidden md:inline">الدورة:</label>
            <select
              value={selectedCycleFilter}
              onChange={(e) => setSelectedCycleFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">كافة الدورات (1-12)</option>
              {Array.from({ length: totalCycles }, (_, i) => i + 1).map((cycle) => (
                <option key={cycle} value={cycle}>
                  الدورة {cycle} (أيام {(cycle - 1) * 4 + 1} - {Math.min(45, cycle * 4)})
                </option>
              ))}
            </select>
          </div>

          {/* Full Grid Toggle */}
          <button
            id="btn-toggle-grid-view"
            type="button"
            onClick={() => setShowFullGrid(!showFullGrid)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition border ${
              showFullGrid
                ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="عرض شبكة الـ 45 يوم كاملة"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">شبكة 45 يوم</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Days Strip */}
      <div className="relative border-t border-slate-800/60 max-w-7xl mx-auto px-2 sm:px-4 py-2">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {filteredDays.map((day) => {
            const isSelected = day.dayNumber === currentDayNumber;
            const isRest = day.type === 'rest';
            const isDone = day.isCompleted;

            return (
              <button
                key={day.dayNumber}
                data-day={day.dayNumber}
                id={`timeline-day-btn-${day.dayNumber}`}
                type="button"
                onClick={() => onSelectDay(day.dayNumber)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl border text-right transition-all flex flex-col justify-between min-w-[100px] sm:min-w-[120px] ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                    : isDone
                    ? 'bg-slate-800/90 border-emerald-500/30 text-slate-200 hover:border-slate-600'
                    : isRest
                    ? 'bg-indigo-950/30 border-indigo-500/20 text-indigo-200 hover:border-indigo-500/40'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                    يوم {day.dayNumber}
                  </span>
                  {isDone ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : isRest ? (
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                <div className="truncate text-xs font-bold w-full">
                  {isRest ? (
                    <span className="text-indigo-300 font-semibold">استراحة ⏸️</span>
                  ) : (
                    <span className="truncate block">
                      {day.type === 'chest_triceps' && 'صدر وتراي'}
                      {day.type === 'back_biceps' && 'ظهر وباي'}
                      {day.type === 'legs_shoulders' && 'أرجل وكتف'}
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>دورة {day.cycleNumber}</span>
                  {isDone && <span className="text-emerald-400 font-bold">تم</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full 45-Day Matrix Modal / Drawer */}
      {showFullGrid && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-emerald-400" />
                  خريطة كورس الـ 45 يوماً بالكامل
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  نظام الـ 4 أيام: 3 أيام تدريب متواصلة تليها استراحة في اليوم الرابع وتكرار الدورة.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullGrid(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Cycles breakdown */}
              {Array.from({ length: totalCycles }, (_, cycleIdx) => {
                const cycleNum = cycleIdx + 1;
                const cycleDays = days.filter((d) => d.cycleNumber === cycleNum);

                return (
                  <div key={cycleNum} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-400">
                        الدورة رقم {cycleNum}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        الأيام ({cycleDays[0]?.dayNumber} إلى {cycleDays[cycleDays.length - 1]?.dayNumber})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {cycleDays.map((day) => {
                        const isCurrent = day.dayNumber === currentDayNumber;
                        const isRest = day.type === 'rest';

                        return (
                          <button
                            key={day.dayNumber}
                            type="button"
                            onClick={() => {
                              onSelectDay(day.dayNumber);
                              setShowFullGrid(false);
                            }}
                            className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                              isCurrent
                                ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                                : day.isCompleted
                                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                                : isRest
                                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-mono font-bold">يوم {day.dayNumber}</span>
                              {day.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              {isRest && !day.isCompleted && <Moon className="w-3.5 h-3.5 opacity-60" />}
                            </div>
                            <span className="text-xs truncate block">
                              {day.type === 'chest_triceps' && 'صدر وتراي'}
                              {day.type === 'back_biceps' && 'ظهر وباي'}
                              {day.type === 'legs_shoulders' && 'كتف وأرجل'}
                              {day.type === 'rest' && 'استراحة ⏸️'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
