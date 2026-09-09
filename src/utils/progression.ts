import { DayWorkout, ExerciseLog, ComparisonResult, ExerciseProgressPoint } from '../types';

/**
 * Finds the most recent previous workout day where this exercise was performed before targetDayNumber
 */
export function findPreviousExerciseLog(
  allDays: DayWorkout[],
  currentDayNumber: number,
  exerciseId: string
): { previousDayNumber: number; exerciseLog: ExerciseLog } | null {
  // Search backward from currentDayNumber - 1 down to 1
  for (let d = currentDayNumber - 1; d >= 1; d--) {
    const day = allDays.find((item) => item.dayNumber === d);
    if (!day) continue;

    const foundEx = day.exercises.find((ex) => ex.exerciseId === exerciseId);
    if (foundEx) {
      // Check if at least one set had weight > 0 or reps > 0 or was marked completed
      const hasLogs = foundEx.sets.some((s) => s.weight > 0 || (s.completed && s.reps > 0));
      if (hasLogs) {
        return { previousDayNumber: d, exerciseLog: foundEx };
      }
    }
  }

  return null;
}

/**
 * Compares current exercise performance with previous exercise performance
 */
export function compareExerciseWithPrevious(
  currentEx: ExerciseLog,
  previousEx: ExerciseLog | null,
  previousDayNumber?: number
): ComparisonResult {
  if (!previousEx) {
    return {
      hasPrevious: false,
      weightDelta: 0,
      weightDeltaPercent: 0,
      repsDelta: 0,
      volumeDelta: 0,
      summaryText: 'هذه أول مرة تؤدي فيها هذا التمرين في الكورس. سيتم اعتماد هذه الأرقام كخط أساس للمقارنة القادمة!',
      status: 'first_time'
    };
  }

  // Calculate maximum weight lifted in current vs previous
  const currentMaxWeight = Math.max(0, ...currentEx.sets.map((s) => Number(s.weight) || 0));
  const previousMaxWeight = Math.max(0, ...previousEx.sets.map((s) => Number(s.weight) || 0));

  // Calculate total volume (weight * reps)
  const currentVolume = currentEx.sets.reduce((sum, s) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
  const previousVolume = previousEx.sets.reduce((sum, s) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);

  // Calculate total reps
  const currentTotalReps = currentEx.sets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
  const previousTotalReps = previousEx.sets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);

  const weightDelta = currentMaxWeight - previousMaxWeight;
  const weightDeltaPercent = previousMaxWeight > 0 ? ((weightDelta / previousMaxWeight) * 100) : 0;
  const repsDelta = currentTotalReps - previousTotalReps;
  const volumeDelta = currentVolume - previousVolume;

  let status: 'increased' | 'maintained' | 'decreased' = 'maintained';
  let summaryText = '';

  if (weightDelta > 0) {
    status = 'increased';
    summaryText = `تطور ممتاز! زاد وزنك الأقصى بمقدار +${weightDelta} كغم (${weightDeltaPercent.toFixed(1)}%+) مقارنة باليوم ${previousDayNumber}`;
  } else if (weightDelta === 0 && repsDelta > 0) {
    status = 'increased';
    summaryText = `تطور بالقوة والتحمل! زادت تكراراتك الإجمالية بمقدار +${repsDelta} عدة بنفس الوزن مقارنة باليوم ${previousDayNumber}`;
  } else if (weightDelta === 0 && repsDelta === 0) {
    status = 'maintained';
    summaryText = `حافظت على نفس أوزان وتكرارات اليوم ${previousDayNumber}. في المرة القادمة حاول زيادة 1-2.5 كغم أو عدة إضافية!`;
  } else if (weightDelta < 0) {
    status = 'decreased';
    summaryText = `الوزن أقل بـ ${Math.abs(weightDelta)} كغم عن اليوم ${previousDayNumber} (${previousMaxWeight} كغم سابقاً). ركز على الراحة والتغذية اليوم!`;
  } else {
    status = 'decreased';
    summaryText = `التكرارات أقل بمقدار ${Math.abs(repsDelta)} عدة عن اليوم ${previousDayNumber}. حافظ على استمرارك وستعود أقوى!`;
  }

  return {
    hasPrevious: true,
    previousDayNumber,
    weightDelta,
    weightDeltaPercent,
    repsDelta,
    volumeDelta,
    summaryText,
    status
  };
}

/**
 * Collects historical data points for a specific exercise across all days for charting
 */
export function getExerciseHistory(allDays: DayWorkout[], exerciseId: string): ExerciseProgressPoint[] {
  const points: ExerciseProgressPoint[] = [];

  allDays.forEach((day) => {
    const ex = day.exercises.find((e) => e.exerciseId === exerciseId);
    if (!ex) return;

    const validSets = ex.sets.filter((s) => (Number(s.weight) > 0 || Number(s.reps) > 0) && s.completed);
    if (validSets.length === 0) return;

    const maxWeight = Math.max(...validSets.map((s) => Number(s.weight) || 0));
    const totalVolume = validSets.reduce((sum, s) => sum + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
    const totalReps = validSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
    const avgWeight = totalReps > 0 ? Math.round(totalVolume / totalReps) : 0;

    points.push({
      dayNumber: day.dayNumber,
      date: day.completedAt,
      maxWeight,
      avgWeight,
      totalVolume,
      totalReps,
      setsCount: validSets.length
    });
  });

  return points;
}
