import { DayWorkout, CourseSummaryReport, ReportExerciseStat } from '../types';

export function generateCourseReport(
  days: DayWorkout[],
  courseNumber: number = 1,
  courseTitle: string = 'كورس الـ 45 يوماً',
  startDate: string = new Date().toISOString().slice(0, 10),
  endDate?: string
): CourseSummaryReport {
  const totalCompletedDays = days.filter((d) => d.isCompleted).length;
  const workoutDays = days.filter((d) => d.type !== 'rest');
  const restDays = days.filter((d) => d.type === 'rest');

  const workoutDaysCompleted = workoutDays.filter((d) => d.isCompleted).length;
  const restDaysCompleted = restDays.filter((d) => d.isCompleted).length;
  const completionRate = Math.round((totalCompletedDays / 45) * 100);

  let grandTotalVolume = 0;
  let grandTotalSets = 0;
  let grandTotalReps = 0;

  // Group by exercise across the 45 days
  const exerciseMap = new Map<
    string,
    {
      exerciseId: string;
      name: string;
      englishName: string;
      muscleGroup: string;
      category: string;
      weightsHistory: number[];
      totalSets: number;
      totalReps: number;
      totalVolume: number;
    }
  >();

  // Muscle group volume
  const muscleMap = new Map<string, { volume: number; sets: number }>();

  days.forEach((day) => {
    day.exercises.forEach((ex) => {
      const muscleKey = ex.muscleGroup || ex.category;
      if (!muscleMap.has(muscleKey)) {
        muscleMap.set(muscleKey, { volume: 0, sets: 0 });
      }

      if (!exerciseMap.has(ex.exerciseId)) {
        exerciseMap.set(ex.exerciseId, {
          exerciseId: ex.exerciseId,
          name: ex.name,
          englishName: ex.englishName,
          muscleGroup: ex.muscleGroup,
          category: ex.category,
          weightsHistory: [],
          totalSets: 0,
          totalReps: 0,
          totalVolume: 0
        });
      }

      const exRecord = exerciseMap.get(ex.exerciseId)!;
      const muscleRecord = muscleMap.get(muscleKey)!;

      ex.sets.forEach((s) => {
        if (s.completed && s.weight > 0 && s.reps > 0) {
          const vol = Number(s.weight) * Number(s.reps);
          grandTotalVolume += vol;
          grandTotalSets += 1;
          grandTotalReps += Number(s.reps);

          exRecord.totalSets += 1;
          exRecord.totalReps += Number(s.reps);
          exRecord.totalVolume += vol;
          exRecord.weightsHistory.push(Number(s.weight));

          muscleRecord.volume += vol;
          muscleRecord.sets += 1;
        }
      });
    });
  });

  // Calculate stats for each exercise
  const exerciseStats: ReportExerciseStat[] = [];
  exerciseMap.forEach((val) => {
    const firstWeight = val.weightsHistory.length > 0 ? val.weightsHistory[0] : 0;
    const highestWeight = val.weightsHistory.length > 0 ? Math.max(...val.weightsHistory) : 0;
    const delta = highestWeight - firstWeight;
    const percent = firstWeight > 0 ? Math.round((delta / firstWeight) * 100) : 0;

    let status: 'increased' | 'maintained' | 'decreased' | 'steady' = 'steady';
    if (delta > 0) status = 'increased';
    else if (delta < 0) status = 'decreased';
    else if (val.weightsHistory.length > 1) status = 'maintained';

    exerciseStats.push({
      exerciseId: val.exerciseId,
      name: val.name,
      englishName: val.englishName,
      muscleGroup: val.muscleGroup,
      category: val.category,
      firstRecordedWeight: firstWeight,
      highestWeight: highestWeight,
      weightDelta: delta,
      weightDeltaPercent: percent,
      totalSets: val.totalSets,
      totalReps: val.totalReps,
      totalVolume: val.totalVolume,
      status
    });
  });

  // Sort exercises by highest volume / improvement
  exerciseStats.sort((a, b) => b.totalVolume - a.totalVolume);

  // Muscle breakdown
  const muscleBreakdown = Array.from(muscleMap.entries()).map(([muscle, data]) => ({
    muscle,
    volume: data.volume,
    sets: data.sets,
    percentage: grandTotalVolume > 0 ? Math.round((data.volume / grandTotalVolume) * 100) : 0
  })).sort((a, b) => b.volume - a.volume);

  return {
    courseNumber,
    courseTitle,
    startDate,
    endDate: endDate || new Date().toISOString().slice(0, 10),
    totalCompletedDays,
    completionRate,
    workoutDaysCompleted,
    restDaysCompleted,
    grandTotalVolume,
    grandTotalSets,
    grandTotalReps,
    exerciseStats,
    muscleBreakdown
  };
}
