export type DayType = 'chest_triceps' | 'back_biceps' | 'legs_shoulders' | 'rest';

export interface SetRecord {
  id: string;
  setNumber: number;
  weight: number; // in kg
  reps: number;
  targetReps?: number;
  completed: boolean;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  englishName: string;
  targetRepsText: string;
  defaultSetsCount: number;
  defaultTargetReps: number[];
  muscleGroup: string;
  category: 'chest' | 'triceps' | 'forearms' | 'back' | 'shoulders' | 'biceps' | 'legs' | 'abs';
  tips?: string;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  name: string;
  englishName: string;
  targetRepsText: string;
  muscleGroup: string;
  category: 'chest' | 'triceps' | 'forearms' | 'back' | 'shoulders' | 'biceps' | 'legs' | 'abs';
  sets: SetRecord[];
  notes?: string;
  completed?: boolean;
}

export interface DayWorkout {
  dayNumber: number; // 1 to 45
  cycleNumber: number; // 1 to 12
  cycleDay: number; // 1, 2, 3, or 4 (rest)
  type: DayType;
  title: string;
  subtitle: string;
  exercises: ExerciseLog[];
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface ComparisonResult {
  hasPrevious: boolean;
  previousDayNumber?: number;
  weightDelta: number; // current max weight - previous max weight
  weightDeltaPercent: number;
  repsDelta: number; // total reps delta or max reps delta
  volumeDelta: number; // (weight * reps) delta
  summaryText: string;
  status: 'increased' | 'maintained' | 'decreased' | 'first_time';
}

export interface ExerciseProgressPoint {
  dayNumber: number;
  date?: string;
  maxWeight: number;
  avgWeight: number;
  totalVolume: number;
  totalReps: number;
  setsCount: number;
}
