import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Copy, 
  Info, 
  LineChart, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExerciseLog, SetRecord } from '../types';
import { ComparisonResult } from '../types';
import { soundManager } from '../utils/audio';

interface ExerciseCardProps {
  exercise: ExerciseLog;
  index: number;
  previousExerciseLog: ExerciseLog | null;
  previousDayNumber?: number;
  comparison: ComparisonResult;
  onUpdateExercise: (updated: ExerciseLog) => void;
  onOpenExerciseProgress: (exerciseId: string, exerciseName: string) => void;
  onTriggerRestTimer?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  previousExerciseLog,
  previousDayNumber,
  comparison,
  onUpdateExercise,
  onOpenExerciseProgress,
  onTriggerRestTimer
}) => {
  const [showTips, setShowTips] = useState<boolean>(false);

  // Handle set field update
  const handleSetChange = (setId: string, field: 'weight' | 'reps', value: number) => {
    const updatedSets = exercise.sets.map((set) => {
      if (set.id === setId) {
        return { ...set, [field]: Math.max(0, value) };
      }
      return set;
    });

    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
  };

  // Toggle set completed status
  const handleToggleComplete = (setId: string) => {
    let justCompleted = false;
    const updatedSets = exercise.sets.map((set) => {
      if (set.id === setId) {
        const nextState = !set.completed;
        if (nextState) justCompleted = true;
        return { ...set, completed: nextState };
      }
      return set;
    });

    if (justCompleted) {
      soundManager.playCheckSound();
      if (onTriggerRestTimer) {
        onTriggerRestTimer();
      }
    }

    // Auto mark exercise completed if all sets completed
    const allDone = updatedSets.length > 0 && updatedSets.every((s) => s.completed);

    onUpdateExercise({
      ...exercise,
      sets: updatedSets,
      completed: allDone
    });
  };

  // Add a new set
  const handleAddSet = () => {
    const nextSetNumber = exercise.sets.length + 1;
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: SetRecord = {
      id: `${exercise.id}_s${Date.now()}`,
      setNumber: nextSetNumber,
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 10,
      targetReps: lastSet?.targetReps || 10,
      completed: false
    };

    onUpdateExercise({
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
  };

  // Delete a set
  const handleDeleteSet = (setId: string) => {
    if (exercise.sets.length <= 1) return;
    const filteredSets = exercise.sets
      .filter((s) => s.id !== setId)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    onUpdateExercise({
      ...exercise,
      sets: filteredSets
    });
  };

  // Copy values from previous exercise session
  const handleCopyPreviousSession = () => {
    if (!previousExerciseLog) return;
    const updatedSets = exercise.sets.map((set, i) => {
      const prevSet = previousExerciseLog.sets[i];
      if (prevSet) {
        return {
          ...set,
          weight: prevSet.weight,
          reps: prevSet.reps
        };
      }
      return set;
    });

    onUpdateExercise({
      ...exercise,
      sets: updatedSets
    });
    soundManager.playCheckSound();
  };

  // Update exercise notes
  const handleNotesChange = (notes: string) => {
    onUpdateExercise({
      ...exercise,
      notes
    });
  };

  const completedSetsCount = exercise.sets.filter((s) => s.completed).length;
  const isAllSetsCompleted = exercise.sets.length > 0 && completedSetsCount === exercise.sets.length;

  return (
    <div
      id={`exercise-card-${exercise.id}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isAllSetsCompleted
          ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Exercise Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-slate-700/60">
              #{index + 1}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  {exercise.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {exercise.muscleGroup}
                </span>
                {isAllSetsCompleted && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> مكتمل
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans" dir="ltr">
                {exercise.englishName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id={`btn-progress-${exercise.id}`}
              type="button"
              onClick={() => onOpenExerciseProgress(exercise.exerciseId, exercise.name)}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition flex items-center gap-1 text-xs border border-transparent hover:border-slate-700"
              title="مخطط التطور عبر الأيام"
            >
              <LineChart className="w-4 h-4" />
              <span className="hidden sm:inline">سجل التطور</span>
            </button>
            <button
              id={`btn-toggle-tips-${exercise.id}`}
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition text-xs"
              title="نصائح وتكنيك التمرين"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reps Scheme and Progress Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">الجولات والتكرار المطلوب:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-amber-300 font-mono font-bold text-xs border border-amber-500/20">
              {exercise.targetRepsText}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">
              المنجز: <span className="font-bold text-slate-200">{completedSetsCount}</span> / {exercise.sets.length} جولات
            </span>
          </div>
        </div>

        {/* Coach Tips Expandable */}
        {showTips && (
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-300">تكنيك الكورس:</strong> ركز على المدى الحركي الكامل، الثبات في ذروة الانقباض، وتنظيم التنفس (زفير عند الدفع/السحب، وشهيق عند الرجوع).
            </p>
          </div>
        )}

        {/* Previous Workout Comparison Callout */}
        {previousExerciseLog && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 mt-0.5">
                {comparison.status === 'increased' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : comparison.status === 'decreased' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-300">
                    مقارنة مع اليوم {previousDayNumber}:
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      comparison.status === 'increased'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : comparison.status === 'decreased'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {comparison.status === 'increased' && '🟢 في تقدم مستمر!'}
                    {comparison.status === 'decreased' && '🔴 أقل من السابق'}
                    {comparison.status === 'maintained' && '🟡 نفس المستوى'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {comparison.summaryText}
                </p>
              </div>
            </div>

            <button
              id={`btn-copy-prev-${exercise.id}`}
              type="button"
              onClick={handleCopyPreviousSession}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition shrink-0 self-end sm:self-center"
              title="نسخ أوزان وتكرارات الجلسة السابقة إلى جولات اليوم"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              نسخ أوزان الجلسة السابقة
            </button>
          </div>
        )}
      </div>

      {/* Sets Table */}
      <div className="p-3 sm:p-5 overflow-x-auto">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
              <th className="font-semibold py-2 px-1 text-center w-12">السيت</th>
              <th className="font-semibold py-2 px-1 text-center w-20">المستهدف</th>
              {previousExerciseLog && (
                <th className="font-semibold py-2 px-1 text-center w-24 hidden md:table-cell">السابق</th>
              )}
              <th className="font-semibold py-2 px-1 text-center">الوزن (كغم)</th>
              <th className="font-semibold py-2 px-1 text-center">العدات (تكرار)</th>
              <th className="font-semibold py-2 px-1 text-center w-16">إكمال</th>
              <th className="font-semibold py-2 px-1 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {exercise.sets.map((set, idx) => {
              const prevSet = previousExerciseLog?.sets[idx];
              const weightDiff = prevSet ? Number(set.weight) - Number(prevSet.weight) : null;
              const repsDiff = prevSet ? Number(set.reps) - Number(prevSet.reps) : null;

              return (
                <tr
                  key={set.id}
                  className={`transition-colors ${
                    set.completed ? 'bg-emerald-950/20' : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Set Number */}
                  <td className="py-3 px-1 text-center">
                    <span className="font-mono font-bold text-slate-300 text-xs px-2 py-1 bg-slate-800 rounded-md">
                      {set.setNumber}
                    </span>
                  </td>

                  {/* Target Reps */}
                  <td className="py-3 px-1 text-center">
                    <span className="text-xs text-slate-400 font-mono">
                      {set.targetReps ? `${set.targetReps} عدة` : '-'}
                    </span>
                  </td>

                  {/* Previous Performance */}
                  {previousExerciseLog && (
                    <td className="py-3 px-1 text-center hidden md:table-cell">
                      {prevSet ? (
                        <div className="text-xs text-slate-400 font-mono flex flex-col items-center">
                          <span className="font-semibold text-slate-300">
                            {prevSet.weight} كغم
                          </span>
                          <span className="text-[11px] text-slate-500">
                            × {prevSet.reps} عِدة
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                  )}

                  {/* Weight Input + Steppers */}
                  <td className="py-2.5 px-1">
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden focus-within:border-emerald-500">
                        <input
                          id={`input-weight-${set.id}`}
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weight === 0 ? '' : set.weight}
                          onChange={(e) => handleSetChange(set.id, 'weight', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-16 sm:w-20 text-center py-1.5 px-2 bg-transparent text-slate-100 font-bold font-mono text-sm focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 px-1.5 select-none">كغم</span>
                      </div>

                      {/* Quick Adjust Buttons */}
                      <div className="hidden sm:flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleSetChange(set.id, 'weight', Math.max(0, (set.weight || 0) - 2.5))}
                          className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded font-bold"
                          title="-2.5 كغم"
                        >
                          -2.5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetChange(set.id, 'weight', (set.weight || 0) + 2.5)}
                          className="px-1.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-[10px] font-mono rounded font-bold"
                          title="+2.5 كغم"
                        >
                          +2.5
                        </button>
                      </div>

                      {/* Weight Diff Badge */}
                      {weightDiff !== null && weightDiff !== 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono hidden lg:inline-block ${
                            weightDiff > 0
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-red-400 bg-red-500/10'
                          }`}
                        >
                          {weightDiff > 0 ? `+${weightDiff}` : weightDiff}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Reps Input + Steppers */}
                  <td className="py-2.5 px-1">
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden focus-within:border-emerald-500">
                        <input
                          id={`input-reps-${set.id}`}
                          type="number"
                          step="1"
                          min="0"
                          value={set.reps === 0 ? '' : set.reps}
                          onChange={(e) => handleSetChange(set.id, 'reps', parseInt(e.target.value, 10) || 0)}
                          placeholder="0"
                          className="w-14 sm:w-16 text-center py-1.5 px-2 bg-transparent text-slate-100 font-bold font-mono text-sm focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400 px-1 select-none">عِدة</span>
                      </div>

                      {/* Quick Adjust Buttons */}
                      <div className="hidden sm:flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleSetChange(set.id, 'reps', Math.max(0, (set.reps || 0) - 1))}
                          className="px-1.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded font-bold"
                          title="-1 عدة"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetChange(set.id, 'reps', (set.reps || 0) + 1)}
                          className="px-1.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-[10px] font-mono rounded font-bold"
                          title="+1 عدة"
                        >
                          +1
                        </button>
                      </div>

                      {/* Reps Diff Badge */}
                      {repsDiff !== null && repsDiff !== 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono hidden lg:inline-block ${
                            repsDiff > 0
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-red-400 bg-red-500/10'
                          }`}
                        >
                          {repsDiff > 0 ? `+${repsDiff}` : repsDiff}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Completion Toggle */}
                  <td className="py-2.5 px-1 text-center">
                    <button
                      id={`btn-complete-set-${set.id}`}
                      type="button"
                      onClick={() => handleToggleComplete(set.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all mx-auto ${
                        set.completed
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                      }`}
                      title={set.completed ? 'تمت الجولة (اضغط للإلغاء)' : 'تحديد كمنجزة'}
                    >
                      <Check className={`w-5 h-5 ${set.completed ? 'stroke-[3]' : 'opacity-40'}`} />
                    </button>
                  </td>

                  {/* Delete Set */}
                  <td className="py-2.5 px-1 text-center">
                    {exercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSet(set.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition"
                        title="حذف الجولة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Add Set & Notes controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <button
            id={`btn-add-set-${exercise.id}`}
            type="button"
            onClick={handleAddSet}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            إضافة سيت جديد
          </button>

          <div className="flex-1 sm:max-w-xs">
            <input
              type="text"
              value={exercise.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="ملاحظة عن التمرين (رقم المقعد، زاوية الكابل...)"
              className="w-full text-xs py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
