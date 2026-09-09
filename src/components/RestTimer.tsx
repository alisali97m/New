import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Minimize2, Maximize2, Timer } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RestTimerProps {
  onClose?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ onClose, soundEnabled, onToggleSound }) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(90);
  const [secondsLeft, setSecondsLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      soundManager.playTimerAlert();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch {
          // Ignore
        }
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  const setTimerPreset = (secs: number) => {
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(true);
  };

  const togglePlay = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  if (isMinimized) {
    return (
      <div 
        id="rest-timer-minimized"
        className="fixed bottom-5 left-5 z-50 bg-slate-900/95 border border-emerald-500/30 text-slate-100 rounded-2xl shadow-2xl p-3 flex items-center gap-3 backdrop-blur-md cursor-pointer hover:border-emerald-500 transition-all"
        onClick={() => setIsMinimized(false)}
      >
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" className="stroke-slate-700" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className={secondsLeft === 0 ? 'stroke-amber-400' : 'stroke-emerald-500'}
              strokeWidth="3"
              strokeDasharray="94.2"
              strokeDashoffset={94.2 - (94.2 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>
          <Timer className="w-4 h-4 text-emerald-400 absolute" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium">مؤقت الراحة</span>
          <span className={`text-base font-bold font-mono ${secondsLeft === 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
            {formatTime(secondsLeft)}
          </span>
        </div>
        <button
          id="btn-timer-maximize"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(false);
          }}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          title="تكبير المؤقت"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="rest-timer-floating"
      className="fixed bottom-5 left-5 z-50 bg-slate-900/95 border border-slate-700/80 text-slate-100 rounded-2xl shadow-2xl p-4 w-72 backdrop-blur-lg transition-all"
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-slate-200">مؤقت الراحة بين السيتات</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            id="btn-timer-toggle-sound"
            type="button"
            onClick={onToggleSound}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
            title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            id="btn-timer-minimize"
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
            title="تصغير"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              id="btn-timer-close"
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800 transition"
              title="إغلاق المؤقت"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="flex flex-col items-center my-2">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" className="stroke-slate-800" strokeWidth="2.5" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              className={secondsLeft === 0 ? 'stroke-amber-400 transition-all duration-300' : 'stroke-emerald-500 transition-all duration-300'}
              strokeWidth="2.5"
              strokeDasharray="94.2"
              strokeDashoffset={94.2 - (94.2 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl font-black font-mono tracking-tight ${secondsLeft === 0 ? 'text-amber-400 animate-bounce' : 'text-slate-100'}`}>
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {secondsLeft === 0 ? 'انتهت الراحة!' : isRunning ? 'استراحة...' : 'متوقف'}
            </span>
          </div>
        </div>

        {/* Play/Pause/Reset Controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            id="btn-timer-play-pause"
            type="button"
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isRunning ? 'إيقاف مؤقت' : secondsLeft === 0 ? 'إعادة تشغيل' : 'بدء الراحة'}
          </button>
          <button
            id="btn-timer-reset"
            type="button"
            onClick={resetTimer}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            title="إعادة تعيين"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-slate-800 text-center">
        {[45, 60, 90, 120].map((secs) => (
          <button
            key={secs}
            id={`btn-preset-${secs}s`}
            type="button"
            onClick={() => setTimerPreset(secs)}
            className={`py-1 px-1 text-xs rounded-lg font-semibold transition ${
              totalSeconds === secs
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {secs >= 60 ? `${secs / 60} د` : `${secs} ث`}
          </button>
        ))}
      </div>
    </div>
  );
};
