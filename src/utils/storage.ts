import { DayWorkout, CourseRecord } from '../types';
import { generate45DaysProgram } from '../data/workoutProgram';

const STORAGE_KEY_LEGACY = 'workout_45_days_data_v1';
const CURRENT_DAY_KEY_LEGACY = 'workout_45_days_current_day';

const ACTIVE_COURSE_ID_KEY = 'workout_active_course_id_v2';
const COURSES_STORAGE_KEY = 'workout_all_courses_v2';

export interface StorageState {
  activeCourse: CourseRecord;
  allCourses: CourseRecord[];
}

/**
 * Loads workout data with support for multiple courses (Course 1, Course 2, etc.)
 * Fully backward-compatible with legacy single-course storage.
 */
export function loadAllCoursesData(): StorageState {
  try {
    const rawCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    const rawActiveId = localStorage.getItem(ACTIVE_COURSE_ID_KEY);

    if (rawCourses) {
      const parsedCourses: CourseRecord[] = JSON.parse(rawCourses);
      if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
        let active = parsedCourses.find((c) => c.id === rawActiveId) || parsedCourses[0];
        // Ensure 45 days exist
        if (!active.days || active.days.length !== 45) {
          active.days = generate45DaysProgram();
        }
        return {
          activeCourse: active,
          allCourses: parsedCourses
        };
      }
    }

    // Check for legacy single-course data
    const legacyData = localStorage.getItem(STORAGE_KEY_LEGACY);
    const legacyCurrentDay = localStorage.getItem(CURRENT_DAY_KEY_LEGACY);

    let days: DayWorkout[];
    if (legacyData) {
      const parsed = JSON.parse(legacyData);
      if (Array.isArray(parsed) && parsed.length === 45) {
        days = parsed;
      } else {
        days = generate45DaysProgram();
      }
    } else {
      days = generate45DaysProgram();
    }

    const currentDay = legacyCurrentDay ? Math.min(45, Math.max(1, parseInt(legacyCurrentDay, 10))) : 1;

    const initialCourse: CourseRecord = {
      id: 'course_1',
      courseNumber: 1,
      title: 'الكورس الأول (45 يوماً)',
      startDate: new Date().toISOString().slice(0, 10),
      isCompleted: days.filter((d) => d.isCompleted).length >= 45,
      days,
      currentDay
    };

    const initialCourses = [initialCourse];
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
    localStorage.setItem(ACTIVE_COURSE_ID_KEY, initialCourse.id);

    return {
      activeCourse: initialCourse,
      allCourses: initialCourses
    };
  } catch (error) {
    console.error('Error loading course data from localStorage:', error);
    const fallbackDays = generate45DaysProgram();
    const fallbackCourse: CourseRecord = {
      id: 'course_1',
      courseNumber: 1,
      title: 'الكورس الأول (45 يوماً)',
      startDate: new Date().toISOString().slice(0, 10),
      isCompleted: false,
      days: fallbackDays,
      currentDay: 1
    };
    return {
      activeCourse: fallbackCourse,
      allCourses: [fallbackCourse]
    };
  }
}

/**
 * Saves changes to the active course and syncs with allCourses in localStorage.
 */
export function saveActiveCourse(course: CourseRecord, allCourses: CourseRecord[]): void {
  try {
    const updatedCourses = allCourses.map((c) => (c.id === course.id ? course : c));
    if (!updatedCourses.some((c) => c.id === course.id)) {
      updatedCourses.push(course);
    }

    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
    localStorage.setItem(ACTIVE_COURSE_ID_KEY, course.id);

    // Keep legacy keys updated for maximum compatibility
    localStorage.setItem(STORAGE_KEY_LEGACY, JSON.stringify(course.days));
    localStorage.setItem(CURRENT_DAY_KEY_LEGACY, course.currentDay.toString());
  } catch (error) {
    console.error('Error saving course data to localStorage:', error);
  }
}

/**
 * Creates a brand new 45-day course (e.g. Course 2, Course 3, etc.)
 * Can carry over previous highest/latest weights as baseline.
 */
export function startNew45DayCourse(
  currentCourse: CourseRecord,
  allCourses: CourseRecord[],
  carryOverWeights: boolean = true
): { newCourse: CourseRecord; updatedAllCourses: CourseRecord[] } {
  const nextCourseNumber = allCourses.reduce((max, c) => Math.max(max, c.courseNumber), 0) + 1;
  const newCourseId = `course_${nextCourseNumber}_${Date.now()}`;

  // Generate base program based on current custom exercises or default
  const baseProgram = generate45DaysProgram();

  // If carrying over weights: find latest weights for each exercise
  if (carryOverWeights && currentCourse) {
    const latestWeightsMap = new Map<string, number[]>();
    const latestImagesMap = new Map<string, string[]>();

    // Scan previous course to get latest weight per set and any uploaded technique images
    for (let d = currentCourse.days.length - 1; d >= 0; d--) {
      const day = currentCourse.days[d];
      for (const ex of day.exercises) {
        if (!latestWeightsMap.has(ex.exerciseId)) {
          const weights = ex.sets.map((s) => Number(s.weight) || 0);
          if (weights.some((w) => w > 0)) {
            latestWeightsMap.set(ex.exerciseId, weights);
          }
        }
        if (ex.images && ex.images.length > 0 && !latestImagesMap.has(ex.exerciseId)) {
          latestImagesMap.set(ex.exerciseId, ex.images);
        }
      }
    }

    // Apply baseline weights and images to the new course
    baseProgram.forEach((day) => {
      day.exercises.forEach((ex) => {
        const carriedWeights = latestWeightsMap.get(ex.exerciseId);
        if (carriedWeights) {
          ex.sets.forEach((set, idx) => {
            if (carriedWeights[idx] !== undefined) {
              set.weight = carriedWeights[idx];
            } else if (carriedWeights.length > 0) {
              set.weight = carriedWeights[carriedWeights.length - 1];
            }
            set.completed = false;
          });
        }
        const carriedImages = latestImagesMap.get(ex.exerciseId);
        if (carriedImages && carriedImages.length > 0) {
          ex.images = carriedImages;
        }
      });
    });
  }

  // Mark current course as finished if all 45 or user started new
  const archivedCurrent: CourseRecord = {
    ...currentCourse,
    endDate: currentCourse.endDate || new Date().toISOString().slice(0, 10),
    isCompleted: true
  };

  const newCourse: CourseRecord = {
    id: newCourseId,
    courseNumber: nextCourseNumber,
    title: `الكورس ${nextCourseNumber} (45 يوماً)`,
    startDate: new Date().toISOString().slice(0, 10),
    isCompleted: false,
    days: baseProgram,
    currentDay: 1
  };

  const updatedAllCourses = allCourses.map((c) => (c.id === archivedCurrent.id ? archivedCurrent : c));
  updatedAllCourses.push(newCourse);

  saveActiveCourse(newCourse, updatedAllCourses);

  return { newCourse, updatedAllCourses };
}

/**
 * Switch active course to another one in history.
 */
export function switchCourse(courseId: string, allCourses: CourseRecord[]): CourseRecord | null {
  const target = allCourses.find((c) => c.id === courseId);
  if (target) {
    localStorage.setItem(ACTIVE_COURSE_ID_KEY, target.id);
    return target;
  }
  return null;
}

/**
 * Delete a course from history.
 */
export function deleteCourse(courseId: string, allCourses: CourseRecord[]): CourseRecord[] {
  const filtered = allCourses.filter((c) => c.id !== courseId);
  if (filtered.length === 0) {
    // Re-create default if empty
    const fresh = generate45DaysProgram();
    const freshCourse: CourseRecord = {
      id: 'course_1',
      courseNumber: 1,
      title: 'الكورس الأول (45 يوماً)',
      startDate: new Date().toISOString().slice(0, 10),
      isCompleted: false,
      days: fresh,
      currentDay: 1
    };
    filtered.push(freshCourse);
  }
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Export full courses backup as JSON.
 */
export function exportAllCoursesAsJSON(allCourses: CourseRecord[], activeCourseId: string): void {
  const exportPayload = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    activeCourseId,
    courses: allCourses
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym_courses_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import courses data from JSON string.
 */
export function importCoursesFromJSON(jsonString: string): { activeCourse: CourseRecord; allCourses: CourseRecord[] } | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed) return null;

    // Check v2 multi-course format
    if (Array.isArray(parsed.courses) && parsed.courses.length > 0) {
      const all = parsed.courses as CourseRecord[];
      const active = all.find((c) => c.id === parsed.activeCourseId) || all[0];
      saveActiveCourse(active, all);
      return { activeCourse: active, allCourses: all };
    }

    // Check v1 single-course format
    if (Array.isArray(parsed.days) && parsed.days.length === 45) {
      const days = parsed.days as DayWorkout[];
      const currentDay = parsed.currentDay ? Math.min(45, Math.max(1, parseInt(parsed.currentDay, 10))) : 1;
      const singleCourse: CourseRecord = {
        id: `course_imported_${Date.now()}`,
        courseNumber: 1,
        title: 'الكورس المستورد (45 يوماً)',
        startDate: new Date().toISOString().slice(0, 10),
        isCompleted: days.filter((d) => d.isCompleted).length >= 45,
        days,
        currentDay
      };
      saveActiveCourse(singleCourse, [singleCourse]);
      return { activeCourse: singleCourse, allCourses: [singleCourse] };
    }

    return null;
  } catch (err) {
    console.error('Error parsing imported courses JSON:', err);
    return null;
  }
}

/**
 * Legacy compatibility functions for single course view/modal
 */
export function exportDataAsJSON(days: DayWorkout[], currentDay: number): void {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    currentDay,
    days
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workout_45_days_backup_${new Date().toISOString().slice(0, 10)}.json`;
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
      return { days: parsed.days, currentDay };
    }
    return null;
  } catch {
    return null;
  }
}

export function resetToDefaultProgram(): { days: DayWorkout[]; currentDay: number } {
  const defaultDays = generate45DaysProgram();
  localStorage.removeItem(STORAGE_KEY_LEGACY);
  localStorage.removeItem(CURRENT_DAY_KEY_LEGACY);
  return { days: defaultDays, currentDay: 1 };
}


