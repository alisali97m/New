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
import { ComprehensiveReportModal } from './components/ComprehensiveReportModal';
import { AddExerciseModal } from './components/AddExerciseModal';
import { SwapExerciseModal } from './components/SwapExerciseModal';
import { EditExerciseModal } from './components/EditExerciseModal';
import { StartNextCourseModal } from './components/StartNextCourseModal';
import { CoursesHistoryModal } from './components/CoursesHistoryModal';
import { DayWorkout, ExerciseLog, CourseRecord } from './types';
import { 
  loadAllCoursesData, 
  saveActiveCourse, 
  startNew45DayCourse, 
  switchCourse 
} from './utils/storage';
import { findPreviousExerciseLog, compareExerciseWithPrevious } from './utils/progression';
import { soundManager } from './utils/audio';
import { Dumbbell, Filter, Search, Plus, Award, ChevronRight, Zap } from 'lucide-react';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [activeCourse, setActiveCourse] = useState<CourseRecord | null>(null);
  const [allCourses, setAllCourses] = useState<CourseRecord[]>([]);

  // Navigation & UI state
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [showOverallStats, setShowOverallStats] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportTargetCourse, setReportTargetCourse] = useState<CourseRecord | null>(null);
  const [showCoursesHistory, setShowCoursesHistory] = useState<boolean>(false);
  const [showStartNextCourse, setShowStartNextCourse] = useState<boolean>(false);
  const [activeProgressExercise, setActiveProgressExercise] = useState<{ id: string; name: string } | null>(null);

  // Exercise CRUD Modals
  const [showAddExercise, setShowAddExercise] = useState<boolean>(false);
  const [swappingExercise, setSwappingExercise] = useState<ExerciseLog | null>(null);
  const [editingExercise, setEditingExercise] = useState<ExerciseLog | null>(null);

  // Initial load
  useEffect(() => {
    const { activeCourse: loadedActive, allCourses: loadedAll } = loadAllCoursesData();
    setActiveCourse(loadedActive);
    setAllCourses(loadedAll);
    setCurrentDayNumber(loadedActive.currentDay || 1);
    setDataLoaded(true);
  }, []);

  // Save changes to localStorage whenever activeCourse changes
  const updateActiveCourse = (updatedCourse: CourseRecord) => {
    setActiveCourse(updatedCourse);
    saveActiveCourse(updatedCourse, allCourses);
  };

  const currentDay = useMemo(() => {
    if (!activeCourse) return null;
    return activeCourse.days.find((d) => d.dayNumber === currentDayNumber) || activeCourse.days[0];
  }, [activeCourse, currentDayNumber]);

  const totalCompletedDays = useMemo(() => {
    if (!activeCourse) return 0;
    return activeCourse.days.filter((d) => d.isCompleted).length;
  }, [activeCourse]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
  };

  // Update a specific exercise in the current day
  const handleUpdateExercise = (updatedExercise: ExerciseLog) => {
    if (!activeCourse) return;

    const updatedDays = activeCourse.days.map((d) => {
      if (d.dayNumber === currentDayNumber) {
        const updatedExercises = d.exercises.map((ex) =>
          ex.id === updatedExercise.id ? updatedExercise : ex
        );
        const allCompleted = updatedExercises.length > 0 && updatedExercises.every((ex) => ex.completed);

        return {
          ...d,
          exercises: updatedExercises,
          isCompleted: allCompleted
        };
      }
      return d;
    });

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays
    });
  };

  // Toggle day completion status
  const handleToggleCompleteDay = (dayNum: number) => {
    if (!activeCourse) return;

    const updatedDays = activeCourse.days.map((d) => {
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

    const isFinished = updatedDays.filter((d) => d.isCompleted).length >= 45;

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays,
      isCompleted: isFinished,
      endDate: isFinished ? new Date().toISOString().slice(0, 10) : activeCourse.endDate
    });
  };

  // Add Exercise (for today, and optionally upcoming matching days)
  const handleAddExercise = (newExercise: ExerciseLog, applyToUpcoming: boolean) => {
    if (!activeCourse || !currentDay) return;

    const currentType = currentDay.type;

    const updatedDays = activeCourse.days.map((d) => {
      if (d.dayNumber === currentDayNumber) {
        return {
          ...d,
          exercises: [...d.exercises, newExercise],
          isCompleted: false
        };
      } else if (applyToUpcoming && d.dayNumber > currentDayNumber && d.type === currentType) {
        // Create duplicate exercise with unique IDs for the future day
        const futureEx: ExerciseLog = {
          ...newExercise,
          id: `ex_${d.dayNumber}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sets: newExercise.sets.map((s, i) => ({
            ...s,
            id: `set_${d.dayNumber}_${Date.now()}_${i + 1}`,
            completed: false
          })),
          completed: false
        };
        return {
          ...d,
          exercises: [...d.exercises, futureEx],
          isCompleted: false
        };
      }
      return d;
    });

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays
    });
  };

  // Swap Exercise
  const handleSwapExercise = (replacementEx: ExerciseLog, applyToUpcoming: boolean) => {
    if (!activeCourse || !currentDay || !swappingExercise) return;

    const oldExerciseId = swappingExercise.exerciseId;
    const currentType = currentDay.type;

    const updatedDays = activeCourse.days.map((d) => {
      if (d.dayNumber === currentDayNumber) {
        const exercises = d.exercises.map((ex) =>
          ex.id === swappingExercise.id ? replacementEx : ex
        );
        return { ...d, exercises };
      } else if (applyToUpcoming && d.dayNumber > currentDayNumber && d.type === currentType) {
        const exercises = d.exercises.map((ex) => {
          if (ex.exerciseId === oldExerciseId) {
            return {
              ...replacementEx,
              id: `ex_swap_${d.dayNumber}_${Date.now()}`,
              sets: replacementEx.sets.map((s, i) => ({
                ...s,
                id: `set_${d.dayNumber}_${Date.now()}_${i + 1}`,
                completed: false
              })),
              completed: false
            };
          }
          return ex;
        });
        return { ...d, exercises };
      }
      return d;
    });

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays
    });
  };

  // Edit Exercise Details
  const handleSaveExerciseDetails = (updatedEx: ExerciseLog, applyToUpcoming: boolean) => {
    if (!activeCourse) return;

    const updatedDays = activeCourse.days.map((d) => {
      if (d.dayNumber === currentDayNumber) {
        const exercises = d.exercises.map((ex) => (ex.id === updatedEx.id ? updatedEx : ex));
        return { ...d, exercises };
      } else if (applyToUpcoming && d.dayNumber > currentDayNumber) {
        const exercises = d.exercises.map((ex) => {
          if (ex.exerciseId === updatedEx.exerciseId) {
            return {
              ...ex,
              name: updatedEx.name,
              englishName: updatedEx.englishName,
              muscleGroup: updatedEx.muscleGroup,
              targetRepsText: updatedEx.targetRepsText,
              images: updatedEx.images
            };
          }
          return ex;
        });
        return { ...d, exercises };
      }
      return d;
    });

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays
    });
  };

  // Delete Exercise
  const handleDeleteExercise = (exId: string, applyToUpcoming: boolean) => {
    if (!activeCourse || !currentDay) return;

    const targetEx = currentDay.exercises.find((e) => e.id === exId);
    if (!targetEx) return;

    const targetExerciseId = targetEx.exerciseId;
    const currentType = currentDay.type;

    const updatedDays = activeCourse.days.map((d) => {
      if (d.dayNumber === currentDayNumber) {
        return {
          ...d,
          exercises: d.exercises.filter((ex) => ex.id !== exId)
        };
      } else if (applyToUpcoming && d.dayNumber > currentDayNumber && d.type === currentType) {
        return {
          ...d,
          exercises: d.exercises.filter((ex) => ex.exerciseId !== targetExerciseId)
        };
      }
      return d;
    });

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays
    });
  };

  // Move exercise up or down in the list
  const handleMoveExercise = (idx: number, direction: 'up' | 'down') => {
    if (!activeCourse || !currentDay) return;

    const exercises = [...currentDay.exercises];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= exercises.length) return;

    const temp = exercises[idx];
    exercises[idx] = exercises[targetIdx];
    exercises[targetIdx] = temp;

    const updatedDays = activeCourse.days.map((d) => {
      if (d.dayNumber === currentDayNumber) {
        return { ...d, exercises };
      }
      return d;
    });

    updateActiveCourse({
      ...activeCourse,
      days: updatedDays
    });
  };

  // Start Next Course confirmation
  const handleConfirmStartNewCourse = (carryOverWeights: boolean, title: string) => {
    if (!activeCourse) return;

    const { newCourse, updatedAllCourses } = startNew45DayCourse(
      activeCourse,
      allCourses,
      carryOverWeights
    );

    newCourse.title = title;
    setActiveCourse(newCourse);
    setAllCourses(updatedAllCourses);
    setCurrentDayNumber(1);
    setShowStartNextCourse(false);

    alert(`تهانينا! تم بدء ${title} بنجاح. نتمنى لك كورس مليء بالقوة والتطور المستمر.`);
  };

  // Switch Course
  const handleSelectCourse = (courseId: string) => {
    const selected = switchCourse(courseId, allCourses);
    if (selected) {
      setActiveCourse(selected);
      setCurrentDayNumber(selected.currentDay || 1);
    }
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

  if (!dataLoaded || !activeCourse || !currentDay) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-['Tajawal',sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">جاري تحميل الكورس التدريبي والتمارين...</p>
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
        activeCourse={activeCourse}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenTimer={() => setShowTimer(true)}
        onOpenOverallStats={() => setShowOverallStats(true)}
        onOpenReport={() => {
          setReportTargetCourse(activeCourse);
          setShowReportModal(true);
        }}
        onOpenCoursesHistory={() => setShowCoursesHistory(true)}
        onStartNewCourse={() => setShowStartNextCourse(true)}
      />

      {/* 45-Day Timeline & Calendar Strip */}
      <DayTimeline
        days={activeCourse.days}
        currentDayNumber={currentDayNumber}
        onSelectDay={(num) => {
          setCurrentDayNumber(num);
          setMuscleFilter('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (activeCourse) {
            updateActiveCourse({ ...activeCourse, currentDay: num });
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Banner if all or most of 45 days are completed */}
        {totalCompletedDays >= 40 && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  أنت على وشك إتمام كورس الـ 45 يوماً ({totalCompletedDays} من 45 يوم مكتملة)!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  يمكنك استخراج وطباعة تقرير الكورس الشامل بصيغة PDF، أو بدء الكورس التالي ومواصلة التطور.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setReportTargetCourse(activeCourse);
                  setShowReportModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md"
              >
                طباعة التقرير الشامل (PDF)
              </button>
              <button
                type="button"
                onClick={() => setShowStartNextCourse(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                بدء الكورس التالي (+45 يوم)
              </button>
            </div>
          </div>
        )}

        {isRestDay ? (
          /* Rest Day Screen */
          <RestDayView
            day={currentDay}
            allDays={activeCourse.days}
            onToggleCompleteDay={handleToggleCompleteDay}
            onSelectDay={(num) => {
              setCurrentDayNumber(num);
              if (activeCourse) {
                updateActiveCourse({ ...activeCourse, currentDay: num });
              }
            }}
          />
        ) : (
          /* Workout Day Screen */
          <div className="space-y-6">
            {/* Daily Summary Banner & Finish Workout Button */}
            <DailySummaryBanner
              day={currentDay}
              onToggleCompleteDay={handleToggleCompleteDay}
              onSelectDay={(num) => {
                setCurrentDayNumber(num);
                if (activeCourse) {
                  updateActiveCourse({ ...activeCourse, currentDay: num });
                }
              }}
            />

            {/* Exercise Filter, Search Bar & Add Exercise Button */}
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

              <div className="flex items-center gap-2">
                {/* Search input */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن تمرين..."
                    className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Add Exercise Button */}
                <button
                  id="btn-add-exercise-to-day"
                  type="button"
                  onClick={() => setShowAddExercise(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تمرين</span>
                </button>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              {filteredExercises.map((exercise, idx) => {
                // Find previous log for this exercise
                const prevLogInfo = findPreviousExerciseLog(
                  activeCourse.days,
                  currentDayNumber,
                  exercise.exerciseId
                );
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
                    totalExercisesCount={filteredExercises.length}
                    previousExerciseLog={prevLogInfo?.exerciseLog || null}
                    previousDayNumber={prevLogInfo?.previousDayNumber}
                    comparison={comparison}
                    onUpdateExercise={handleUpdateExercise}
                    onOpenExerciseProgress={(exId, exName) => {
                      setActiveProgressExercise({ id: exId, name: exName });
                    }}
                    onTriggerRestTimer={() => setShowTimer(true)}
                    onOpenSwap={() => setSwappingExercise(exercise)}
                    onOpenEdit={() => setEditingExercise(exercise)}
                    onMoveUp={() => handleMoveExercise(idx, 'up')}
                    onMoveDown={() => handleMoveExercise(idx, 'down')}
                  />
                );
              })}

              {filteredExercises.length === 0 && (
                <div className="text-center py-12 px-4 rounded-3xl bg-slate-900/40 border border-slate-800">
                  <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">لا توجد تمارين مطابقة في هذا اليوم</p>
                  <button
                    type="button"
                    onClick={() => setShowAddExercise(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة تمرين جديد لهذا اليوم
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
          allDays={activeCourse.days}
          onClose={() => setActiveProgressExercise(null)}
        />
      )}

      {/* Overall Course Stats & Backup Modal */}
      {showOverallStats && (
        <OverallCourseModal
          days={activeCourse.days}
          currentDay={currentDayNumber}
          onClose={() => setShowOverallStats(false)}
          onDataRestored={(restoredDays, restoredDay) => {
            updateActiveCourse({
              ...activeCourse,
              days: restoredDays,
              currentDay: restoredDay
            });
            setCurrentDayNumber(restoredDay);
          }}
        />
      )}

      {/* Comprehensive 45-Day Report Modal (Print / PDF) */}
      {showReportModal && reportTargetCourse && (
        <ComprehensiveReportModal
          course={reportTargetCourse}
          onClose={() => setShowReportModal(false)}
          onStartNextCourse={() => {
            setShowReportModal(false);
            setShowStartNextCourse(true);
          }}
        />
      )}

      {/* Add Exercise Modal */}
      {showAddExercise && currentDay && (
        <AddExerciseModal
          currentDayNumber={currentDayNumber}
          dayType={currentDay.type}
          onClose={() => setShowAddExercise(false)}
          onAddExercise={handleAddExercise}
        />
      )}

      {/* Swap Exercise Modal */}
      {swappingExercise && (
        <SwapExerciseModal
          currentExercise={swappingExercise}
          onClose={() => setSwappingExercise(null)}
          onSwapExercise={handleSwapExercise}
        />
      )}

      {/* Edit/Delete Exercise Modal */}
      {editingExercise && (
        <EditExerciseModal
          exercise={editingExercise}
          onClose={() => setEditingExercise(null)}
          onSaveExercise={handleSaveExerciseDetails}
          onDeleteExercise={handleDeleteExercise}
        />
      )}

      {/* Start Next 45-Day Course Modal */}
      {showStartNextCourse && activeCourse && (
        <StartNextCourseModal
          currentCourse={activeCourse}
          nextCourseNumber={activeCourse.courseNumber + 1}
          onClose={() => setShowStartNextCourse(false)}
          onConfirmStartNewCourse={handleConfirmStartNewCourse}
        />
      )}

      {/* All Courses History Modal */}
      {showCoursesHistory && activeCourse && (
        <CoursesHistoryModal
          allCourses={allCourses}
          activeCourseId={activeCourse.id}
          onClose={() => setShowCoursesHistory(false)}
          onSelectCourse={handleSelectCourse}
          onOpenReportForCourse={(target) => {
            setReportTargetCourse(target);
            setShowCoursesHistory(false);
            setShowReportModal(true);
          }}
          onRequestStartNewCourse={() => setShowStartNextCourse(true)}
          onDataRestored={(active, all) => {
            setActiveCourse(active);
            setAllCourses(all);
            setCurrentDayNumber(active.currentDay || 1);
          }}
        />
      )}
    </div>
  );
}
