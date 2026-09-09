/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DayTimeline } from './components/DayTimeline';
import { ExerciseCard } from './components/ExerciseCard';
import { DailySummaryBanner } from './components/DailySummaryBanner';
import { RestDayView } from './components/RestDayView';
import { RestTimer } from './components/RestTimer';
import { ExerciseProgressModal } from './components/ExerciseProgressModal';
import { OverallCourseModal } from './components/OverallCourseModal';
import { DayWorkout, ExerciseLog } from './types';
import { loadWorkoutData, saveWorkoutData } from './utils/storage';
import { findPreviousExerciseLog, compareExerciseWithPrevious } from './utils/progression';
import { soundManager } from './utils/audio';
import { Dumbbell, Filter, Search } from 'lucide-react';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [days, setDays] = useState<DayWorkout[]>([]);
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [showOverallStats, setShowOverallStats] = useState<boolean>(false);
  const [activeProgressExercise, setActiveProgressExercise] = useState<{ id: string; name: string } | null>(null);
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial load
  useEffect(() => {
    const { days: loadedDays, currentDay: loadedCurrentDay } = loadWorkoutData();
    setDays(loadedDays);
    setCurrentDayNumber(loadedCurrentDay);
    setDataLoaded(true);
  }, []);

  // Save changes to localStorage whenever days or currentDayNumber changes
  useEffect(() => {
    if (dataLoaded && days.length === 45) {
      saveWorkoutData(days, currentDayNumber);
    }
  }, [days, currentDayNumber, dataLoaded]);

  const currentDay = useMemo(() => {
    return days.find((d) => d.dayNumber === currentDayNumber) || days[0];
  }, [days, currentDayNumber]);

  const totalCompletedDays = useMemo(() => {
    return days.filter((d) => d.isCompleted).length;
  }, [days]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
  };

  // Update a specific exercise in the current day
  const handleUpdateExercise = (updatedExercise: ExerciseLog) => {
    setDays((prevDays) => {
      return prevDays.map((d) => {
        if (d.dayNumber === currentDayNumber) {
          const updatedExercises = d.exercises.map((ex) =>
            ex.id === updatedExercise.id ? updatedExercise : ex
          );

          // Check if all exercises are now completed
          const allCompleted = updatedExercises.length > 0 && updatedExercises.every((ex) => ex.completed);

          return {
            ...d,
            exercises: updatedExercises,
            isCompleted: allCompleted
          };
        }
        return d;
      });
    });
  };

  // Toggle day completion status
  const handleToggleCompleteDay = (dayNum: number) => {
    setDays((prevDays) => {
      return prevDays.map((d) => {
        if (d.dayNumber === dayNum) {
          const nextState = !d.isCompleted;
          return {
            ...d,
            isCompleted: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined
          };
        }
        return d;
      });
    });
  };

  // Restore imported data
  const handleDataRestored = (restoredDays: DayWorkout[], restoredDay: number) => {
    setDays(restoredDays);
    setCurrentDayNumber(restoredDay);
  };

  // Filter exercises for current day
  const filteredExercises = useMemo(() => {
    if (!currentDay || currentDay.type === 'rest') return [];

    return currentDay.exercises.filter((ex) => {
      const matchesMuscle = muscleFilter === 'all' || ex.muscleGroup.includes(muscleFilter) || ex.category === muscleFilter;
      const matchesSearch = !searchQuery.trim() || 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ex.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesMuscle && matchesSearch;
    });
  }, [currentDay, muscleFilter, searchQuery]);

  // Unique muscle categories for today's workout
  const availableMuscleGroups = useMemo(() => {
    if (!currentDay || currentDay.type === 'rest') return [];
    const groups = new Set<string>();
    currentDay.exercises.forEach((ex) => groups.add(ex.muscleGroup));
    return Array.from(groups);
  }, [currentDay]);

  if (!dataLoaded || !currentDay) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">جاري تحميل كورس التمارين الـ 45 يوم...</p>
        </div>
      </div>
    );
  }

  const isRestDay = currentDay.type === 'rest';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Tajawal',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentDay={currentDayNumber}
        totalCompletedDays={totalCompletedDays}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenTimer={() => setShowTimer(true)}
        onOpenOverallStats={() => setShowOverallStats(true)}
      />

      {/* 45-Day Timeline & Calendar Strip */}
      <DayTimeline
        days={days}
        currentDayNumber={currentDayNumber}
        onSelectDay={(num) => {
          setCurrentDayNumber(num);
          setMuscleFilter('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {isRestDay ? (
          /* Rest Day Screen */
          <RestDayView
            day={currentDay}
            allDays={days}
            onToggleCompleteDay={handleToggleCompleteDay}
            onSelectDay={setCurrentDayNumber}
          />
        ) : (
          /* Workout Day Screen */
          <div className="space-y-6">
            {/* Daily Summary Banner & Finish Workout Button */}
            <DailySummaryBanner
              day={currentDay}
              onToggleCompleteDay={handleToggleCompleteDay}
              onSelectDay={setCurrentDayNumber}
            />

            {/* Exercise Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => setMuscleFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    muscleFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  كافة التمارين ({currentDay.exercises.length})
                </button>
                {availableMuscleGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setMuscleFilter(group)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      muscleFilter === group
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن تمرين..."
                  className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              {filteredExercises.map((exercise, idx) => {
                // Find previous log for this exercise
                const prevLogInfo = findPreviousExerciseLog(days, currentDayNumber, exercise.exerciseId);
                const comparison = compareExerciseWithPrevious(
                  exercise,
                  prevLogInfo?.exerciseLog || null,
                  prevLogInfo?.previousDayNumber
                );

                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={idx}
                    previousExerciseLog={prevLogInfo?.exerciseLog || null}
                    previousDayNumber={prevLogInfo?.previousDayNumber}
                    comparison={comparison}
                    onUpdateExercise={handleUpdateExercise}
                    onOpenExerciseProgress={(exId, exName) => {
                      setActiveProgressExercise({ id: exId, name: exName });
                    }}
                    onTriggerRestTimer={() => setShowTimer(true)}
                  />
                );
              })}

              {filteredExercises.length === 0 && (
                <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/40 border border-slate-800">
                  <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">لا توجد تمارين تطابق خيارات التصفية الحالية</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMuscleFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 text-xs text-emerald-400 underline"
                  >
                    إلغاء التصفية وعرض كل تمارين اليوم
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Rest Stopwatch / Timer */}
      {showTimer && (
        <RestTimer
          onClose={() => setShowTimer(false)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      {/* Exercise Progression Analytics Modal */}
      {activeProgressExercise && (
        <ExerciseProgressModal
          exerciseId={activeProgressExercise.id}
          exerciseName={activeProgressExercise.name}
          allDays={days}
          onClose={() => setActiveProgressExercise(null)}
        />
      )}

      {/* Overall Course Stats & Backup Modal */}
      {showOverallStats && (
        <OverallCourseModal
          days={days}
          currentDay={currentDayNumber}
          onClose={() => setShowOverallStats(false)}
          onDataRestored={handleDataRestored}
        />
      )}
    </div>
  );
}
