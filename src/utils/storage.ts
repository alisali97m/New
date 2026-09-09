import { DayWorkout } from '../types';
import { generate45DaysProgram } from '../data/workoutProgram';

const STORAGE_KEY = 'workout_45_days_data_v1';
const CURRENT_DAY_KEY = 'workout_45_days_current_day';

export function loadWorkoutData(): { days: DayWorkout[]; currentDay: number } {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedCurrentDay = localStorage.getItem(CURRENT_DAY_KEY);

    let days: DayWorkout[];
    if (savedData) {
      days = JSON.parse(savedData);
      // Validate that it has 45 days
      if (!Array.isArray(days) || days.length !== 45) {
        days = generate45DaysProgram();
      }
    } else {
      days = generate45DaysProgram();
    }

    const currentDay = savedCurrentDay ? Math.min(45, Math.max(1, parseInt(savedCurrentDay, 10))) : 1;
    return { days, currentDay };
  } catch (error) {
    console.error('Error loading workout data from localStorage:', error);
    return {
      days: generate45DaysProgram(),
      currentDay: 1
    };
  }
}

export function saveWorkoutData(days: DayWorkout[], currentDay: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
    localStorage.setItem(CURRENT_DAY_KEY, currentDay.toString());
  } catch (error) {
    console.error('Error saving workout data to localStorage:', error);
  }
}

export function exportDataAsJSON(days: DayWorkout[], currentDay: number): void {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    currentDay,
    programName: 'كورس تمارين 45 يوم مع نظام استراحة بعد اليوم الثالث',
    days
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workout_course_45days_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(jsonString: string): { days: DayWorkout[]; currentDay: number } | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.days) && parsed.days.length === 45) {
      const currentDay = parsed.currentDay ? Math.min(45, Math.max(1, parseInt(parsed.currentDay, 10))) : 1;
      saveWorkoutData(parsed.days, currentDay);
      return { days: parsed.days, currentDay };
    }
    return null;
  } catch (err) {
    console.error('Error parsing imported JSON:', err);
    return null;
  }
}

export function resetToDefaultProgram(): { days: DayWorkout[]; currentDay: number } {
  const freshDays = generate45DaysProgram();
  saveWorkoutData(freshDays, 1);
  return { days: freshDays, currentDay: 1 };
}
