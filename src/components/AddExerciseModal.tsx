import React, { useState, useRef } from 'react';
import { X, Plus, Search, Dumbbell, Sparkles, Check, Camera, Trash2, UploadCloud } from 'lucide-react';
import { ExerciseDefinition, ExerciseLog, SetRecord } from '../types';
import { EXERCISE_LIBRARY, MUSCLE_CATEGORIES } from '../data/exerciseLibrary';
import { processImageFiles } from '../utils/imageUtils';

interface AddExerciseModalProps {
  currentDayNumber: number;
  dayType: string;
  onClose: () => void;
  onAddExercise: (exercise: ExerciseLog, applyToUpcomingDays: boolean) => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  currentDayNumber,
  dayType,
  onClose,
  onAddExercise
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [applyToUpcoming, setApplyToUpcoming] = useState<boolean>(true);

  // Custom exercise state
  const [customName, setCustomName] = useState<string>('');
  const [customEnglishName, setCustomEnglishName] = useState<string>('');
  const [customMuscleGroup, setCustomMuscleGroup] = useState<string>('الصدر');
  const [customCategory, setCustomCategory] = useState<string>('chest');
  const [customSetsCount, setCustomSetsCount] = useState<number>(4);
  const [customTargetReps, setCustomTargetReps] = useState<string>('4 × 12');
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLibrary = EXERCISE_LIBRARY.filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ex.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectFromLibrary = (def: ExerciseDefinition) => {
    const sets: SetRecord[] = Array.from({ length: def.defaultSetsCount }, (_, i) => ({
      id: `ex_${Date.now()}_s${i + 1}`,
      setNumber: i + 1,
      weight: 0,
      reps: def.defaultTargetReps[i] || 10,
      targetReps: def.defaultTargetReps[i] || 10,
      completed: false
    }));

    const newExercise: ExerciseLog = {
      id: `ex_${Date.now()}`,
      exerciseId: def.id,
      name: def.name,
      englishName: def.englishName,
      targetRepsText: def.targetRepsText,
      muscleGroup: def.muscleGroup,
      category: def.category,
      sets,
      completed: false
    };

    onAddExercise(newExercise, applyToUpcoming);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const count = Math.max(1, Math.min(10, customSetsCount));
    const sets: SetRecord[] = Array.from({ length: count }, (_, i) => ({
      id: `ex_custom_${Date.now()}_s${i + 1}`,
      setNumber: i + 1,
      weight: 0,
      reps: 10,
      targetReps: 10,
      completed: false
    }));

    const newExercise: ExerciseLog = {
      id: `ex_custom_${Date.now()}`,
      exerciseId: `custom_${Date.now()}`,
      name: customName.trim(),
      englishName: customEnglishName.trim() || customName.trim(),
      targetRepsText: customTargetReps.trim() || `${count} × 10`,
      muscleGroup: customMuscleGroup.trim(),
      category: customCategory as any,
      sets,
      completed: false,
      images: customImages
    };

    onAddExercise(newExercise, applyToUpcoming);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                إضافة تمرين جديد للجدول
              </h3>
              <p className="text-xs text-slate-400">
                اختر من مكتبة التمارين الشاملة أو أضف تمريناً مخصصاً
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 p-2 bg-slate-950/60 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'library'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اختيار من مكتبة التمارين ({EXERCISE_LIBRARY.length} تمرين)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'custom'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + كتابة تمرين مخصص جديد
          </button>
        </div>

        {/* Scope Checkbox */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 text-xs">
          <input
            id="checkbox-apply-upcoming"
            type="checkbox"
            checked={applyToUpcoming}
            onChange={(e) => setApplyToUpcoming(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:outline-none cursor-pointer"
          />
          <label htmlFor="checkbox-apply-upcoming" className="text-slate-300 cursor-pointer font-medium">
            إضافة هذا التمرين لليوم الحالي <strong>ولكافة الأيام المتبقية</strong> من هذا الجدول التدريبي في الكورس
          </label>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'library' ? (
            <>
              {/* Category Filter & Search */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن اسم التمرين أو العضلة..."
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

              {/* Library Exercises Grid */}
              <div className="space-y-2">
                {filteredLibrary.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectFromLibrary(item)}
                    className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition">
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
                        الجولات المستهدفة: {item.targetRepsText}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-slate-950 text-xs font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة
                    </button>
                  </div>
                ))}

                {filteredLibrary.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    لم نجد تمريناً يطابق بحثك في المكتبة. يمكنك الانتقال إلى تبويب "تمرين مخصص" لإضافته بالاسم الذي تريده.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Custom Exercise Form */
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم التمرين باللغة العربية *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="مثال: بنج مستوي بالدمبلز، مرجحة كابل..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم التمرين بالإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  value={customEnglishName}
                  onChange={(e) => setCustomEnglishName(e.target.value)}
                  placeholder="مثال: Dumbbell Bench Press"
                  dir="ltr"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    المجموعة العضلية
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      const cat = MUSCLE_CATEGORIES.find((c) => c.key === e.target.value);
                      if (cat) setCustomMuscleGroup(cat.label.split(' ')[0]);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {MUSCLE_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    العضلة بالتفصيل
                  </label>
                  <input
                    type="text"
                    value={customMuscleGroup}
                    onChange={(e) => setCustomMuscleGroup(e.target.value)}
                    placeholder="مثال: الصدر العلوي، اللاتس..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    عدد الجولات (السيتات)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={customSetsCount}
                    onChange={(e) => setCustomSetsCount(parseInt(e.target.value, 10) || 4)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 text-center font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    نظام التكرارات المستهدف
                  </label>
                  <input
                    type="text"
                    value={customTargetReps}
                    onChange={(e) => setCustomTargetReps(e.target.value)}
                    placeholder="مثال: 4 × 12 أو 12 - 10 - 8"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 text-center font-mono"
                  />
                </div>
              </div>

              {/* Photos upload section for custom exercise */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    صور التمرين ({customImages.length})
                  </span>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImages}
                    className="px-2.5 py-1 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    إرفاق صور
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setIsProcessingImages(true);
                      try {
                        const newImgs = await processImageFiles(e.target.files);
                        if (newImgs.length > 0) {
                          setCustomImages((prev) => [...prev, ...newImgs]);
                        }
                      } finally {
                        setIsProcessingImages(false);
                      }
                      e.target.value = '';
                    }
                  }}
                />

                {customImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                    {customImages.map((img, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-square bg-slate-900">
                        <img
                          src={img}
                          alt={`صورة ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setCustomImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl border border-dashed border-slate-800 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-950/40"
                  >
                    <UploadCloud className="w-5 h-5 text-slate-500" />
                    <span className="text-[11px] text-slate-400">انقر لإرفاق صور التكنيك أو ضبط الجهاز</span>
                  </div>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  حفظ وإدراج التمرين في الجدول
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
