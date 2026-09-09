import { DayType, ExerciseDefinition, DayWorkout, ExerciseLog } from '../types';

export const EXERCISE_DEFINITIONS_DAY1: ExerciseDefinition[] = [
  {
    id: 'd1_e1',
    name: 'بنج مستوي سميث وسط',
    englishName: 'Smith Machine Flat Bench Press (Mid Grip)',
    targetRepsText: '12 - 10 - 8 - 8',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 8],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'قبضة متوسطة، نزول محكوم حتى ملامسة الصدر ودفع انفجاري مع المحافظة على ثبات الكتفين.'
  },
  {
    id: 'd1_e2',
    name: 'بلوفر دمبلز مستوي',
    englishName: 'Flat Dumbbell Pullover',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'تمديد الصدر وفتح القفص الصدري مع ثني طفيف في الكوعين، تركيز على عضلة الصدر.'
  },
  {
    id: 'd1_e3',
    name: 'بنج أعلى همر وسط',
    englishName: 'Incline Hammer Bench Press (Mid Grip)',
    targetRepsText: '12 - 10 - 8 - 6',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 6],
    muscleGroup: 'الصدر العلوي',
    category: 'chest',
    tips: 'استهداف الجزء العلوي من الصدر مع زيادة تدريجية في الوزن مع انخفاض التكرارات.'
  },
  {
    id: 'd1_e4',
    name: 'جمع فراشة',
    englishName: 'Pec Deck / Butterfly Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الصدر (عزل)',
    category: 'chest',
    tips: 'عصر الصدر في ذروة الحركة لمدة ثانية كاملة والتحكم في مرحلة الرجوع السلبي.'
  },
  {
    id: 'd1_e5',
    name: 'بنج أسفل وسط',
    englishName: 'Decline Bench Press (Mid Grip)',
    targetRepsText: '12 - 10 - 8 - 8',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 8],
    muscleGroup: 'الصدر السفلي',
    category: 'chest',
    tips: 'تركيز على الزاوية السفلية من الصدر مع الحفاظ على مسار بار مستقر.'
  },
  {
    id: 'd1_e6',
    name: 'تراي محدبة',
    englishName: 'Curved Bar Triceps Cable Pushdown',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الترايسبس',
    category: 'triceps',
    tips: 'تثبيت المرفقين بجانب الجذع تماماً وعزل الترايسبس في الجزء السفلي.'
  },
  {
    id: 'd1_e7',
    name: 'تراي جهاز ضيق غطس',
    englishName: 'Narrow Grip Triceps Dips Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الترايسبس',
    category: 'triceps',
    tips: 'الجسم بوضع مستقيم لتركيز الضغط على التراي بدلاً من الصدر، نزول كامل ودفع قوي.'
  },
  {
    id: 'd1_e8',
    name: 'تراي دمبلز باليدين واقف',
    englishName: 'Standing Overhead Two-Hand Dumbbell Extension',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الترايسبس (الرأس الطويل)',
    category: 'triceps',
    tips: 'الحفاظ على ثبات المرفقين للأعلى والنزول خلف الرأس لتمديد الرأس الطويل للتراي.'
  },
  {
    id: 'd1_e9',
    name: 'ساعد',
    englishName: 'Forearms / Wrist Curls',
    targetRepsText: '4 × 15',
    defaultSetsCount: 4,
    defaultTargetReps: [15, 15, 15, 15],
    muscleGroup: 'الساعد',
    category: 'forearms',
    tips: 'حركة كاملة للمعصم لتقوية قبضة اليد وسواعد متناسقة.'
  }
];

export const EXERCISE_DEFINITIONS_DAY2: ExerciseDefinition[] = [
  {
    id: 'd2_e1',
    name: 'سحب بكرة متشابك أمامي',
    englishName: 'Front Close Grip Lat Pulldown',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الظهر (اللاتس)',
    category: 'back',
    tips: 'سحب البار باتجاه أعلى الصدر مع عصر عضلات الظهر للخلف وعدم التأرجح.'
  },
  {
    id: 'd2_e2',
    name: 'سحب جهاز متكئ بصدر متقابل',
    englishName: 'Chest-Supported Machine Row (Neutral Grip)',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'منتصف الظهر',
    category: 'back',
    tips: 'إسناد الصدر بالكامل على الوسادة وعصر لوحي الكتف مع كل سحبة.'
  },
  {
    id: 'd2_e3',
    name: 'تي بار وسط',
    englishName: 'T-Bar Row (Mid Grip)',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'كثافة الظهر',
    category: 'back',
    tips: 'انحناء الظهر بزاوية 45 درجة مع الحفاظ على استقامة العمود الفقري وثبات الحوض.'
  },
  {
    id: 'd2_e4',
    name: 'باك أرج (Back Arch)',
    englishName: 'Back Arch / Hyperextensions',
    targetRepsText: '4 × 8',
    defaultSetsCount: 4,
    defaultTargetReps: [8, 8, 8, 8],
    muscleGroup: 'أسفل الظهر والقطنية',
    category: 'back',
    tips: 'صعود محكوم بدون إفراط في تقوس الظهر لحماية الفقرات القطنية.'
  },
  {
    id: 'd2_e5',
    name: 'شولدر دمبلز واقف',
    englishName: 'Standing Dumbbell Shoulder Press',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الأكتاف',
    category: 'shoulders',
    tips: 'شد عضلات البطن لثبات الجذع ودفع الدمبلز للأعلى فوق الرأس بمسار مقوس طبيعي.'
  },
  {
    id: 'd2_e6',
    name: 'كيبل بكرة وسط واقف',
    englishName: 'Standing Mid Cable Lateral / Face Pull',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الأكتاف الجانبية والخلفية',
    category: 'shoulders',
    tips: 'توتر مستمر من الكيبل طوال مدى الحركة، التركيز على رفع المرفقين.'
  },
  {
    id: 'd2_e7',
    name: 'كيل دمبل جالس مترادف',
    englishName: 'Seated Alternating Dumbbell Curl',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'البايسبس',
    category: 'biceps',
    tips: 'تدوير المعصم للخارج (Supination) في أعلى الحركة لتعظيم انقباض البايسبس.'
  },
  {
    id: 'd2_e8',
    name: 'كيل جهاز لاري وسط',
    englishName: 'Larry Scott Preacher Curl Machine',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'البايسبس (عزل)',
    category: 'biceps',
    tips: 'تثبيت الذراعين بالكامل على مسند لاري سكوت لعزل الباي ومنع الغش بالحركة.'
  },
  {
    id: 'd2_e9',
    name: 'كيبل ساعد مقلوب',
    englishName: 'Reverse Cable Curl (Forearms & Brachialis)',
    targetRepsText: '3 × 15',
    defaultSetsCount: 3,
    defaultTargetReps: [15, 15, 15],
    muscleGroup: 'الساعد والعضلة العضدية',
    category: 'forearms',
    tips: 'قبضة مقلوبة (راحة اليد للأسفل) لبناء العضلة العضدية والجزء العلوي من الساعد.'
  }
];

export const EXERCISE_DEFINITIONS_DAY3: ExerciseDefinition[] = [
  {
    id: 'd3_e1',
    name: 'ضغط جهاز متقابل',
    englishName: 'Neutral Grip Shoulder Machine Press',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الأكتاف (الكتف الأمامي والوسط)',
    category: 'shoulders',
    tips: 'القبضة المتقابلة تريح مفصل الكتف وتعطي قوة دفع ممتازة لكتف عريض.'
  },
  {
    id: 'd3_e2',
    name: 'نشر دمبلز للجانب واقف',
    englishName: 'Standing Dumbbell Lateral Raises',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الكتف الجانبي',
    category: 'shoulders',
    tips: 'رفع المرفقين للأعلى قليلاً، والتوقف عند مستوى الكتف دون أرجحة الجسد.'
  },
  {
    id: 'd3_e3',
    name: 'فراشة خلفي',
    englishName: 'Reverse Pec Deck / Rear Delt Fly',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الكتف الخلفي',
    category: 'shoulders',
    tips: 'عزل ممتاز للكتف الخلفي، ثبات الصدر على المسند وفتح الذراعين للخلف.'
  },
  {
    id: 'd3_e4',
    name: 'سيقان أمامي',
    englishName: 'Leg Extension (Quads)',
    targetRepsText: '4 × 15',
    defaultSetsCount: 4,
    defaultTargetReps: [15, 15, 15, 15],
    muscleGroup: 'الأفخاذ الأمامية',
    category: 'legs',
    tips: 'تمديد الساقين بالكامل مع عصر الكوادز في الأعلى لمدة ثانية والنزول ببطء.'
  },
  {
    id: 'd3_e5',
    name: 'دفع ماكنة جهاز (Leg Press)',
    englishName: 'Leg Press Machine',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الأرجل الشاملة',
    category: 'legs',
    tips: 'وضع القدمين بمسافة الكتفين على المنصة، تجنب قفل الركبتين بالكامل في أعلى الدفع.'
  },
  {
    id: 'd3_e6',
    name: 'سيقان خلفي',
    englishName: 'Leg Curl (Hamstrings)',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الأفخاذ الخلفية',
    category: 'legs',
    tips: 'سحب الكعب باتجاه المؤخرة بتركيز عالٍ للتحكم في العضلات الخلفية للفخذ.'
  },
  {
    id: 'd3_e7',
    name: 'كولف جالس (Calves)',
    englishName: 'Seated Calf Raise',
    targetRepsText: '4 × 15',
    defaultSetsCount: 4,
    defaultTargetReps: [15, 15, 15, 15],
    muscleGroup: 'بطات الأرجل (السمانة)',
    category: 'legs',
    tips: 'نزول كامل لإطالة وتر العرقوب ثم صعود كامل على أطراف الأصابع لعصر السمانة.'
  },
  // Abdominals Routine
  {
    id: 'd3_e8',
    name: 'طحن جهاز',
    englishName: 'Abdominal Crunch Machine',
    targetRepsText: '4 × 25',
    defaultSetsCount: 4,
    defaultTargetReps: [25, 25, 25, 25],
    muscleGroup: 'تمارين البطن',
    category: 'abs',
    tips: 'تقويس العمود الفقري للداخل لعصر عضلات البطن مع الزفير، وعدم السحب باليدين.'
  },
  {
    id: 'd3_e9',
    name: 'طحن روماني',
    englishName: 'Roman Chair / Decline Crunch',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'تمارين البطن',
    category: 'abs',
    tips: 'تثبيت القدمين، انحناء محكوم للخلف والرفع عبر عضلات البطن الأساسية.'
  },
  {
    id: 'd3_e10',
    name: 'رفع ساق',
    englishName: 'Leg Raise (Lower Abs)',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'البطن السفلي',
    category: 'abs',
    tips: 'رفع الساقين للأعلى ورفع الحوض قليلاً في نهاية الحركة لتفعيل أسفل البطن.'
  },
  {
    id: 'd3_e11',
    name: 'رفع جذع',
    englishName: 'Torso / Sit-ups Raise',
    targetRepsText: '4 × 20',
    defaultSetsCount: 4,
    defaultTargetReps: [20, 20, 20, 20],
    muscleGroup: 'تمارين البطن الشاملة',
    category: 'abs',
    tips: 'رفع الجذع بسلاسة وبدون شد الرقبة، تركيز كامل على انقباض جدار البطن.'
  }
];

export const WORKOUT_ADVICE = {
  header: 'نصيحة الكورس الرياضي',
  content: 'احرص على الإحماء الكافي قبل البدء وشرب الماء بكميات مناسبة أثناء التمرين لضمان أعلى أداء واستشفاء.',
  restDayTitle: 'يوم استراحة واستشفاء عضلي',
  restDayAdvice: 'الاستراحة هي الجزء الذي تنمو فيه العضلات! احرص على: شرب ما لا يقل عن 3 لترات ماء، تناول وجبات غنية بالبروتين، والحصول على 7-8 ساعات نوم عميق.'
};

export function createInitialExerciseLog(def: ExerciseDefinition): ExerciseLog {
  const sets = Array.from({ length: def.defaultSetsCount }, (_, i) => ({
    id: `${def.id}_s${i + 1}`,
    setNumber: i + 1,
    weight: 0,
    reps: def.defaultTargetReps[i] || 10,
    targetReps: def.defaultTargetReps[i] || 10,
    completed: false
  }));

  return {
    id: def.id,
    exerciseId: def.id,
    name: def.name,
    englishName: def.englishName,
    targetRepsText: def.targetRepsText,
    muscleGroup: def.muscleGroup,
    category: def.category,
    sets,
    completed: false
  };
}

export function generate45DaysProgram(): DayWorkout[] {
  const days: DayWorkout[] = [];

  for (let day = 1; day <= 45; day++) {
    const cycleDay = ((day - 1) % 4) + 1; // 1, 2, 3, or 4
    const cycleNumber = Math.floor((day - 1) / 4) + 1;

    if (cycleDay === 1) {
      days.push({
        dayNumber: day,
        cycleNumber,
        cycleDay: 1,
        type: 'chest_triceps',
        title: 'الصدر + الترايسبس + الساعد',
        subtitle: 'Chest & Triceps & Forearms',
        exercises: EXERCISE_DEFINITIONS_DAY1.map(createInitialExerciseLog),
        isCompleted: false
      });
    } else if (cycleDay === 2) {
      days.push({
        dayNumber: day,
        cycleNumber,
        cycleDay: 2,
        type: 'back_biceps',
        title: 'الظهر + الأكتاف + البايسبس',
        subtitle: 'Back & Shoulders & Biceps',
        exercises: EXERCISE_DEFINITIONS_DAY2.map(createInitialExerciseLog),
        isCompleted: false
      });
    } else if (cycleDay === 3) {
      days.push({
        dayNumber: day,
        cycleNumber,
        cycleDay: 3,
        type: 'legs_shoulders',
        title: 'الكتف + الأرجل + تمارين البطن',
        subtitle: 'Shoulders & Legs + Abdominals',
        exercises: EXERCISE_DEFINITIONS_DAY3.map(createInitialExerciseLog),
        isCompleted: false
      });
    } else {
      // cycleDay === 4 -> Rest Day
      days.push({
        dayNumber: day,
        cycleNumber,
        cycleDay: 4,
        type: 'rest',
        title: 'يوم استراحة واستشفاء',
        subtitle: 'Rest & Recovery Day',
        exercises: [],
        isCompleted: false
      });
    }
  }

  return days;
}
