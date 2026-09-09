import React, { useState } from 'react';
import { X, RefreshCw, Search, Dumbbell } from 'lucide-react';
import { ExerciseDefinition, ExerciseLog, SetRecord } from '../types';
import { EXERCISE_LIBRARY, MUSCLE_CATEGORIES } from '../data/exerciseLibrary';

interface SwapExerciseModalProps {
  currentExercise: ExerciseLog;
  onClose: () => void;
  onSwapExercise: (newExercise: ExerciseLog, applyToUpcomingDays: boolean) => void;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  currentExercise,
  onClose,
  onSwapExercise
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(currentExercise.category || 'all');
  const [applyToUpcoming, setApplyToUpcoming] = useState<boolean>(true);

  const filteredLibrary = EXERCISE_LIBRARY.filter((ex) => {
    // don't show the exact same exercise definition
    if (ex.id === currentExercise.exerciseId) return false;
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ex.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectReplacement = (def: ExerciseDefinition) => {
    // Preserve existing sets count if possible or use definition count
    const setsCount = currentExercise.sets.length || def.defaultSetsCount;
    const sets: SetRecord[] = Array.from({ length: setsCount }, (_, i) => ({
      id: `ex_swap_${Date.now()}_s${i + 1}`,
      setNumber: i + 1,
      weight: 0,
      reps: def.defaultTargetReps[i] || currentExercise.sets[i]?.reps || 10,
      targetReps: def.defaultTargetReps[i] || 10,
      completed: false
    }));

    const replacement: ExerciseLog = {
      id: currentExercise.id,
      exerciseId: def.id,
      name: def.name,
      englishName: def.englishName,
      targetRepsText: def.targetRepsText,
      muscleGroup: def.muscleGroup,
      category: def.category,
      sets,
      notes: currentExercise.notes,
      completed: false
    };

    onSwapExercise(replacement, applyToUpcoming);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                تبديل التمرين: {currentExercise.name}
              </h3>
              <p className="text-xs text-slate-400">
                اختر تمريناً بديلاً مناسباً من مكتبة التمارين
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

        {/* Scope Checkbox */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 text-xs">
          <input
            id="checkbox-swap-upcoming"
            type="checkbox"
            checked={applyToUpcoming}
            onChange={(e) => setApplyToUpcoming(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:outline-none cursor-pointer"
          />
          <label htmlFor="checkbox-swap-upcoming" className="text-slate-300 cursor-pointer font-medium">
            تطبيق هذا التبديل لليوم الحالي <strong>ولكافة الأيام القادمة</strong> في الكورس (تغيير دائم)
          </label>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-800/80 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن تمرين بديل..."
              className="w-full pr-9 pl-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            {MUSCLE_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of replacement choices */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2">
          {filteredLibrary.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectReplacement(item)}
              className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                    {item.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400">
                    {item.muscleGroup}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans" dir="ltr">
                  {item.englishName}
                </p>
                <div className="text-[11px] text-amber-400 font-mono">
                  الجولات المقترحة: {item.targetRepsText}
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                استبدال
              </button>
            </div>
          ))}

          {filteredLibrary.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              لا توجد تمارين مطابقة في هذه الفئة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
