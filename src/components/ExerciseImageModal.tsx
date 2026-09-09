import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  UploadCloud, 
  Image as ImageIcon, 
  Plus, 
  ZoomIn, 
  Download,
  AlertCircle
} from 'lucide-react';
import { ExerciseLog } from '../types';
import { processImageFiles } from '../utils/imageUtils';

interface ExerciseImageModalProps {
  exercise: ExerciseLog;
  initialIndex?: number;
  onClose: () => void;
  onUpdateImages: (updatedImages: string[]) => void;
}

export const ExerciseImageModal: React.FC<ExerciseImageModalProps> = ({
  exercise,
  initialIndex = 0,
  onClose,
  onUpdateImages
}) => {
  const images = exercise.images || [];
  const [currentIndex, setCurrentIndex] = useState<number>(
    Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1))
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep index within bounds if images change
  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= images.length) {
      setCurrentIndex(images.length - 1);
    }
  }, [images.length, currentIndex]);

  // Keyboard navigation (Esc to close, Left/Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        // In RTL, ArrowRight usually means next or prev, let's navigate:
        handlePrev();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, currentIndex]);

  const handleNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFilesAdded = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const newImages = await processImageFiles(files);
      if (newImages.length > 0) {
        const combined = [...images, ...newImages];
        onUpdateImages(combined);
        // Switch to the newly added image
        setCurrentIndex(images.length);
      }
    } catch (err) {
      console.error('Error processing uploaded images:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDeleteCurrentImage = () => {
    if (images.length === 0) return;
    const confirmDelete = window.confirm('هل تريد بالتأكيد حذف هذه الصورة من التمرين؟');
    if (!confirmDelete) return;

    const updated = images.filter((_, idx) => idx !== currentIndex);
    onUpdateImages(updated);
    if (currentIndex > 0 && currentIndex >= updated.length) {
      setCurrentIndex(updated.length - 1);
    }
  };

  const handleDownload = () => {
    if (!images[currentIndex]) return;
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `${exercise.name.replace(/\s+/g, '_')}_photo_${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  معاينة صور التمرين: {exercise.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {exercise.muscleGroup}
                </span>
                {images.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {currentIndex + 1} من {images.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                صور التكنيك، وضعية الجهاز، أو الأوزان لمقارنتها والرجوع إليها دائماً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-500/20"
              title="إضافة صور إضافية لهذا التمرين"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">إضافة صور</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {images.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              {/* Main Image Viewer Stage */}
              <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[56vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
                <img
                  src={images[currentIndex]}
                  alt={`${exercise.name} - صورة ${currentIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
                />

                {/* Left & Right Carousel Controls (if more than 1 image) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/60 backdrop-blur-sm flex items-center justify-center shadow-lg transition opacity-80 hover:opacity-100"
                      title="الصورة السابقة"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/60 backdrop-blur-sm flex items-center justify-center shadow-lg transition opacity-80 hover:opacity-100"
                      title="الصورة التالية"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Bottom Image Actions Bar */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-slate-200 pointer-events-auto shadow-md">
                    {currentIndex + 1} / {images.length}
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="p-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition shadow-md"
                      title="تحميل الصورة بجودة عالية"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteCurrentImage}
                      className="p-2 rounded-xl bg-slate-900/85 hover:bg-red-500/20 backdrop-blur-md border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-400 transition shadow-md"
                      title="حذف هذه الصورة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnails Strip */}
              <div className="w-full flex items-center gap-2.5 overflow-x-auto py-1 px-1 no-scrollbar justify-center">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      idx === currentIndex
                        ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-slate-950/80 text-[10px] font-mono text-white">
                      #{idx + 1}
                    </span>
                  </button>
                ))}

                {/* Add more button in thumbnails strip */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 flex flex-col items-center justify-center gap-1 transition shrink-0 bg-slate-900/50"
                  title="إضافة المزيد من الصور"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-bold">إضافة</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State / Drag and drop zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center gap-3 cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700/80 bg-slate-950/50 hover:border-slate-600'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-800 text-emerald-400 flex items-center justify-center shadow-lg border border-slate-700">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  اسحب الصور وأفلتها هنا أو انقر للاختيار
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  يمكنك تحميل صورة واحدة أو عدة صور لتسجيل وضعية الجهاز، مقعد التمرين، أو تكنيك الأداء
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                اختيار صور من الجهاز
              </button>
            </div>
          )}

          {/* Quick upload dropzone below viewer if there are already images */}
          {images.length > 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-3.5 rounded-xl border border-dashed transition flex items-center justify-center gap-2 text-xs cursor-pointer ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>
                اسحب صوراً إضافية وأفلتها هنا، أو <span className="text-emerald-400 font-bold underline">انقر للتصفح</span>
              </span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 py-2">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>جاري تحسين وضغط الصور المرفوعة...</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>يتم حفظ الصور تلقائياً مع بيانات تمرينك في الكورس.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
