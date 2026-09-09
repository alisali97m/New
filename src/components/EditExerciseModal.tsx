import React, { useState, useRef } from 'react';
import { X, Edit3, Trash2, Check, Camera, Eye, Plus, UploadCloud } from 'lucide-react';
import { ExerciseLog } from '../types';
import { processImageFiles } from '../utils/imageUtils';
import { ExerciseImageModal } from './ExerciseImageModal';

interface EditExerciseModalProps {
  exercise: ExerciseLog;
  onClose: () => void;
  onSaveExercise: (updated: ExerciseLog, applyToUpcomingDays: boolean) => void;
  onDeleteExercise: (exerciseId: string, applyToUpcomingDays: boolean) => void;
}

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  exercise,
  onClose,
  onSaveExercise,
  onDeleteExercise
}) => {
  const [name, setName] = useState<string>(exercise.name);
  const [englishName, setEnglishName] = useState<string>(exercise.englishName);
  const [muscleGroup, setMuscleGroup] = useState<string>(exercise.muscleGroup);
  const [targetRepsText, setTargetRepsText] = useState<string>(exercise.targetRepsText);
  const [images, setImages] = useState<string[]>(exercise.images || []);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [applyToUpcoming, setApplyToUpcoming] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveExercise(
      {
        ...exercise,
        name: name.trim(),
        englishName: englishName.trim(),
        muscleGroup: muscleGroup.trim(),
        targetRepsText: targetRepsText.trim(),
        images
      },
      applyToUpcoming
    );
    onClose();
  };

  const handleFilesAdded = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const newImages = await processImageFiles(files);
      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error('Error in EditExerciseModal handleFilesAdded:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    const msg = applyToUpcoming
      ? `هل أنت متأكد من حذف تمرين "${exercise.name}" من هذا اليوم وكافة الأيام المشابهة في الكورس؟`
      : `هل أنت متأكد من حذف تمرين "${exercise.name}" من جدول هذا اليوم فقط؟`;

    if (window.confirm(msg)) {
      onDeleteExercise(exercise.id, applyToUpcoming);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl text-right max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                تعديل بيانات التمرين
              </h3>
              <p className="text-xs text-slate-400">
                تعديل الاسم أو التكرارات وصور التكنيك
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
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              اسم التمرين
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              الاسم باللغة الإنجليزية
            </label>
            <input
              type="text"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              dir="ltr"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 text-left font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                المجموعة العضلية
              </label>
              <input
                type="text"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نظام التكرارات
              </label>
              <input
                type="text"
                value={targetRepsText}
                onChange={(e) => setTargetRepsText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-center"
              />
            </div>
          </div>

          {/* Exercise Photos Management Section */}
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                صور التمرين المرفقة ({images.length})
              </span>

              <div className="flex items-center gap-2">
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(0);
                      setShowImageModal(true);
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    معاينة
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-2.5 py-1 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  إضافة صورة
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFilesAdded(e.target.files);
                  e.target.value = '';
                }
              }}
            />

            {images.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-square bg-slate-900">
                    <img
                      src={imgUrl}
                      alt={`صورة ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageIndex(idx);
                          setShowImageModal(true);
                        }}
                        className="p-1 rounded bg-slate-800 text-emerald-400 hover:bg-slate-700"
                        title="معاينة"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 rounded bg-slate-800 text-red-400 hover:bg-red-900/50"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border border-dashed border-slate-800 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition bg-slate-950/40"
              >
                <UploadCloud className="w-6 h-6 text-slate-500" />
                <span className="text-xs text-slate-400">انقر لرفع صور التكنيك أو المقعد لهذا التمرين</span>
                <span className="text-[10px] text-slate-500">يدعم PNG, JPG, WEBP (ضغط تلقائي آمن)</span>
              </div>
            )}
          </div>

          {/* Scope Checkbox */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <input
              id="checkbox-edit-upcoming"
              type="checkbox"
              checked={applyToUpcoming}
              onChange={(e) => setApplyToUpcoming(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:outline-none cursor-pointer"
            />
            <label htmlFor="checkbox-edit-upcoming" className="text-slate-300 cursor-pointer font-medium">
              تطبيق التعديل لكافة الأيام المشابهة في الكورس
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف التمرين
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                حفظ التعديلات
              </button>
            </div>
          </div>
        </form>

        {/* Modal for previewing inside Edit */}
        {showImageModal && (
          <ExerciseImageModal
            exercise={{ ...exercise, images }}
            initialIndex={selectedImageIndex}
            onClose={() => setShowImageModal(false)}
            onUpdateImages={(updated) => setImages(updated)}
          />
        )}
      </div>
    </div>
  );
};
