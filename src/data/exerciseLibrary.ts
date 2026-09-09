import { ExerciseDefinition } from '../types';

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // الصدر - Chest
  {
    id: 'lib_chest_flat_smith',
    name: 'بنج مستوي سميث وسط',
    englishName: 'Smith Machine Flat Bench Press (Mid Grip)',
    targetRepsText: '12 - 10 - 8 - 8',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 8],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'قبضة متوسطة، نزول محكوم حتى ملامسة الصدر ودفع انفجاري.'
  },
  {
    id: 'lib_chest_flat_barbell',
    name: 'بنج مستوي بار حر',
    englishName: 'Barbell Flat Bench Press',
    targetRepsText: '12 - 10 - 8 - 8',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 8],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'تثبيت القدمين وعصر لوحي الكتف للخلف أثناء الدفع.'
  },
  {
    id: 'lib_chest_flat_dumbbell',
    name: 'بنج مستوي دمبلز',
    englishName: 'Flat Dumbbell Bench Press',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'مدى حركي أوسع مع تقريب الدمبلز في الأعلى بدون تصادم.'
  },
  {
    id: 'lib_chest_incline_hammer',
    name: 'بنج أعلى همر وسط',
    englishName: 'Incline Hammer Bench Press (Mid Grip)',
    targetRepsText: '12 - 10 - 8 - 6',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 6],
    muscleGroup: 'الصدر العلوي',
    category: 'chest',
    tips: 'استهداف الجزء العلوي مع تركيز القوة في منتصف القبضة.'
  },
  {
    id: 'lib_chest_incline_dumbbell',
    name: 'بنج أعلى دمبلز',
    englishName: 'Incline Dumbbell Press',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الصدر العلوي',
    category: 'chest',
    tips: 'زاوية مقعد 30 إلى 45 درجة لعزل الصدر العلوي.'
  },
  {
    id: 'lib_chest_butterfly',
    name: 'جمع فراشة جهاز',
    englishName: 'Pec Deck / Butterfly Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الصدر (عزل)',
    category: 'chest',
    tips: 'عصر الصدر في ذروة الحركة لمدة ثانية كاملة.'
  },
  {
    id: 'lib_chest_pullover',
    name: 'بلوفر دمبلز مستوي',
    englishName: 'Flat Dumbbell Pullover',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'فتح القفص الصدري مع ثني طفيف بالمرفقين.'
  },
  {
    id: 'lib_chest_decline',
    name: 'بنج أسفل وسط',
    englishName: 'Decline Bench Press',
    targetRepsText: '12 - 10 - 8 - 8',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 8],
    muscleGroup: 'الصدر السفلي',
    category: 'chest',
    tips: 'استهداف الألياف السفلية للصدر مع مسار آمن للبار.'
  },
  {
    id: 'lib_chest_cable_crossover',
    name: 'كروس أوفر كابل عالي',
    englishName: 'High Cable Crossover',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الصدر',
    category: 'chest',
    tips: 'سحب الكابل لأسفل وللأمام مع تقوس خفيف في الصدر.'
  },

  // الترايسبس - Triceps
  {
    id: 'lib_tri_curved_cable',
    name: 'تراي محدبة كابل',
    englishName: 'Curved Bar Triceps Cable Pushdown',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الترايسبس',
    category: 'triceps',
    tips: 'تثبيت المرفقين بجانب الجذع وعزل كامل للترايسبس.'
  },
  {
    id: 'lib_tri_rope',
    name: 'تراي حبل كابل',
    englishName: 'Rope Triceps Pushdown',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الترايسبس',
    category: 'triceps',
    tips: 'فتح الحبل للخارج عند أسفل الحركة لعصر الرأس الجانبي.'
  },
  {
    id: 'lib_tri_dips_machine',
    name: 'تراي جهاز ضيق غطس',
    englishName: 'Narrow Grip Triceps Dips Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الترايسبس',
    category: 'triceps',
    tips: 'الجسم بوضع مستقيم لتركيز الحمل بالكامل على الترايسبس.'
  },
  {
    id: 'lib_tri_overhead_db',
    name: 'تراي دمبلز باليدين واقف',
    englishName: 'Standing Overhead Two-Hand Dumbbell Extension',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الترايسبس (الرأس الطويل)',
    category: 'triceps',
    tips: 'النزول خلف الرأس لتمديد الرأس الطويل للتراي.'
  },
  {
    id: 'lib_tri_french_press',
    name: 'ضغط فرنسي بار زجزاج نائم',
    englishName: 'Lying EZ-Bar Skull Crusher',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الترايسبس',
    category: 'triceps',
    tips: 'نزول البار نحو الجبهة بهدوء ودفع مع تثبيت المرفقين.'
  },

  // الساعد - Forearms
  {
    id: 'lib_forearm_wrist_curl',
    name: 'ساعد بار جالس (ريست)',
    englishName: 'Seated Barbell Wrist Curl',
    targetRepsText: '4 × 15',
    defaultSetsCount: 4,
    defaultTargetReps: [15, 15, 15, 15],
    muscleGroup: 'الساعد',
    category: 'forearms',
    tips: 'حركة معصم كاملة للأعلى مع التحكم في النزول.'
  },
  {
    id: 'lib_forearm_reverse_curl',
    name: 'ساعد بار عكسي واقف',
    englishName: 'Standing Reverse Barbell Curl',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الساعد العضدي',
    category: 'forearms',
    tips: 'قبضة مقلوبة لتقوية ظهر الساعد والبراكيورادياليس.'
  },

  // الظهر - Back
  {
    id: 'lib_back_lat_pulldown_close',
    name: 'سحب بكرة متشابك أمامي',
    englishName: 'Front Close Grip Lat Pulldown',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الظهر (اللاتس)',
    category: 'back',
    tips: 'سحب البار لقمة الصدر وعصر الظهر بدون تأرجح.'
  },
  {
    id: 'lib_back_lat_pulldown_wide',
    name: 'سحب بكرة أمامي واسع',
    englishName: 'Wide Grip Lat Pulldown',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'عرض الظهر (اللاتس)',
    category: 'back',
    tips: 'قبضة أوسع من الكتفين وتركيز على تعريض الظهر.'
  },
  {
    id: 'lib_back_chest_supported_row',
    name: 'سحب جهاز متكئ بصدر متقابل',
    englishName: 'Chest-Supported Machine Row (Neutral Grip)',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'منتصف الظهر',
    category: 'back',
    tips: 'إسناد الصدر بالكامل وعصر لوحي الكتف.'
  },
  {
    id: 'lib_back_tbar',
    name: 'تي بار وسط',
    englishName: 'T-Bar Row (Mid Grip)',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'كثافة الظهر',
    category: 'back',
    tips: 'ثبات الظهر بزاوية 45 درجة وحماية القطنية.'
  },
  {
    id: 'lib_back_seated_cable_row',
    name: 'سحب أرضي كابل ضيق',
    englishName: 'Seated Cable Row (Close Grip)',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'سماكة الظهر',
    category: 'back',
    tips: 'سحب القبضة نحو أسفل البطن وعصر الظهر.'
  },
  {
    id: 'lib_back_hyperextension',
    name: 'باك أرج (Back Arch)',
    englishName: 'Back Arch / Hyperextensions',
    targetRepsText: '4 × 8',
    defaultSetsCount: 4,
    defaultTargetReps: [8, 8, 8, 8],
    muscleGroup: 'أسفل الظهر والقطنية',
    category: 'back',
    tips: 'صعود محكوم بدون مبالغة في التقوس الخلفي.'
  },
  {
    id: 'lib_back_deadlift',
    name: 'ديدليفت بار حر',
    englishName: 'Conventional Barbell Deadlift',
    targetRepsText: '10 - 8 - 6 - 6',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 8, 6, 6],
    muscleGroup: 'كامل عضلات الظهر والجسم',
    category: 'back',
    tips: 'رفع الوزن بدفع الأرض بالقدمين والحفاظ على استقامة العمود الفقري.'
  },

  // البايسبس - Biceps
  {
    id: 'lib_bi_standing_dumbbell',
    name: 'بايسبس دمبلز تبادل واقف',
    englishName: 'Standing Alternating Dumbbell Curl',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'البايسبس',
    category: 'biceps',
    tips: 'تدوير المعصم للخارج في الأعلى لتحقيق أقصى ذروة انقباض.'
  },
  {
    id: 'lib_bi_barbell_curl',
    name: 'بايسبس بار مستقيم واقف',
    englishName: 'Standing Barbell Biceps Curl',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'البايسبس',
    category: 'biceps',
    tips: 'ثبات المرفقين بجانب الجسم وتجنب التأرجح بالظهر.'
  },
  {
    id: 'lib_bi_scott_hammer',
    name: 'همر مقعد سكوت دمبلز',
    englishName: 'Preacher Scott Bench Dumbbell Hammer Curl',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'البايسبس والعضدية',
    category: 'biceps',
    tips: 'قبضة المطرقة على مقعد سكوت لعزل البايسبس وسماكة الذراع.'
  },
  {
    id: 'lib_bi_cable_rope',
    name: 'بايسبس كابل بالحبل',
    englishName: 'Cable Rope Hammer Curl',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'البايسبس والساعد',
    category: 'biceps',
    tips: 'ضغط مستمر على العضلة طوال المدى الحركي.'
  },

  // الأكتاف - Shoulders
  {
    id: 'lib_sh_military_press',
    name: 'ضغط أكتاف بار أمامي جالس',
    englishName: 'Seated Overhead Barbell Press',
    targetRepsText: '12 - 10 - 8 - 8',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 8],
    muscleGroup: 'الأكتاف الأمامية والوسطى',
    category: 'shoulders',
    tips: 'نزول البار حتى مستوى الذقن ودفع مستقيم للأعلى.'
  },
  {
    id: 'lib_sh_dumbbell_press',
    name: 'ضغط أكتاف دمبلز جالس',
    englishName: 'Seated Dumbbell Shoulder Press',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الأكتاف',
    category: 'shoulders',
    tips: 'زاوية مقعد 80 درجة، دفع للأعلى مع التحكم بالنزول.'
  },
  {
    id: 'lib_sh_lateral_raise',
    name: 'رفرفة جانبي دمبلز واقف',
    englishName: 'Standing Dumbbell Lateral Raise',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الكتف الجانبي',
    category: 'shoulders',
    tips: 'رفع المرفقين لمستوى الكتف لتعريض الأكتاف.'
  },
  {
    id: 'lib_sh_cable_lateral',
    name: 'رفرفة جانبي كابل فردي',
    englishName: 'Single-Arm Cable Lateral Raise',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الكتف الجانبي',
    category: 'shoulders',
    tips: 'توتر دائم على الكتف الجانبي طوال الحركة.'
  },
  {
    id: 'lib_sh_rear_delt_fly',
    name: 'نشر خلفي دمبلز / جهاز فراشة مقلوب',
    englishName: 'Rear Delt Fly / Reverse Pec Deck',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الكتف الخلفي',
    category: 'shoulders',
    tips: 'سحب المرفقين للخلف لعزل الكتف الخلفي بالكامل.'
  },
  {
    id: 'lib_sh_shrugs',
    name: 'ترابيس بار / دمبلز (شراجز)',
    englishName: 'Barbell / Dumbbell Shrugs',
    targetRepsText: '4 × 15',
    defaultSetsCount: 4,
    defaultTargetReps: [15, 15, 15, 15],
    muscleGroup: 'الترابيس',
    category: 'shoulders',
    tips: 'رفع الكتفين للأعلى باتجاه الأذنين مع عصر ثانية واحدة.'
  },

  // الأرجل - Legs
  {
    id: 'lib_leg_squat_smith',
    name: 'سكوات سميث',
    englishName: 'Smith Machine Squat',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الأرجل (الفخذ الرباعي)',
    category: 'legs',
    tips: 'نزول متزن بزاوية 90 درجة مع دفع الكعبين للأرض.'
  },
  {
    id: 'lib_leg_squat_free',
    name: 'سكوات بار حر',
    englishName: 'Barbell Back Squat',
    targetRepsText: '12 - 10 - 8 - 6',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 10, 8, 6],
    muscleGroup: 'الأرجل الشاملة',
    category: 'legs',
    tips: 'فتح الصدر وثبات الجذع ونزول عميق آمن.'
  },
  {
    id: 'lib_leg_press',
    name: 'مكبس أرجل (Leg Press)',
    englishName: 'Leg Press Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الأرجل (الفخذ)',
    category: 'legs',
    tips: 'تجنب قفل الركبتين تماماً في أعلى الدفع لحماية المفصل.'
  },
  {
    id: 'lib_leg_extension',
    name: 'رفرفة فخذ أمامي جهاز',
    englishName: 'Leg Extension Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الفخذ الأمامي (عزل)',
    category: 'legs',
    tips: 'فرد الساقين للأعلى مع عصر العضلة الرباعية ثانية كاملة.'
  },
  {
    id: 'lib_leg_curl',
    name: 'سحب فخذ خلفي جهاز',
    englishName: 'Lying Leg Curl Machine',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'الفخذ الخلفي (Hamstrings)',
    category: 'legs',
    tips: 'ثني الساقين حتى ملامسة الوسادة للفخذ الخلفي والنزول البطيء.'
  },
  {
    id: 'lib_leg_rdl',
    name: 'ديدليفت روماني دمبلز (RDL)',
    englishName: 'Dumbbell Romanian Deadlift',
    targetRepsText: '4 × 10',
    defaultSetsCount: 4,
    defaultTargetReps: [10, 10, 10, 10],
    muscleGroup: 'الفخذ الخلفي والأرداف',
    category: 'legs',
    tips: 'دفع الحوض للخلف مع ثني خفيف جداً في الركبة وتمديد عضلات الهامسترينج.'
  },
  {
    id: 'lib_leg_calves',
    name: 'سمانة واقف / جالس (Calves)',
    englishName: 'Standing / Seated Calf Raise',
    targetRepsText: '4 × 15',
    defaultSetsCount: 4,
    defaultTargetReps: [15, 15, 15, 15],
    muscleGroup: 'السمانة (البطات)',
    category: 'legs',
    tips: 'صعود كامل على أطراف الأصابع ونزول ممتد لتفعيل السمانة.'
  },

  // تمارين البطن - Abs & Core
  {
    id: 'lib_abs_decline_crunch',
    name: 'كرسي روماني بطن',
    englishName: 'Roman Chair / Decline Crunch',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'تمارين البطن',
    category: 'abs',
    tips: 'انحناء محكوم للخلف والرفع عبر عضلات البطن الأساسية.'
  },
  {
    id: 'lib_abs_leg_raise',
    name: 'رفع ساقين (بطن سفلي)',
    englishName: 'Hanging / Parallel Bar Leg Raise',
    targetRepsText: '4 × 12',
    defaultSetsCount: 4,
    defaultTargetReps: [12, 12, 12, 12],
    muscleGroup: 'البطن السفلي',
    category: 'abs',
    tips: 'رفع الساقين مع رفع الحوض قليلاً لعصر أسفل البطن.'
  },
  {
    id: 'lib_abs_situps',
    name: 'رفع جذع أرضي',
    englishName: 'Floor Sit-ups / Crunches',
    targetRepsText: '4 × 20',
    defaultSetsCount: 4,
    defaultTargetReps: [20, 20, 20, 20],
    muscleGroup: 'البطن الشاملة',
    category: 'abs',
    tips: 'رفع الجذع بسلاسة بدون شد الرقبة.'
  },
  {
    id: 'lib_abs_plank',
    name: 'بلانك ثابت',
    englishName: 'Plank Hold',
    targetRepsText: '4 × 45 ثانية',
    defaultSetsCount: 4,
    defaultTargetReps: [45, 45, 45, 45],
    muscleGroup: 'عضلات الجذع والبطن',
    category: 'abs',
    tips: 'شد كامل للجسم في خط مستقيم وتنفس هادئ منتظم.'
  }
];

export const MUSCLE_CATEGORIES = [
  { key: 'chest', label: 'الصدر (Chest)' },
  { key: 'back', label: 'الظهر (Back)' },
  { key: 'shoulders', label: 'الأكتاف (Shoulders)' },
  { key: 'legs', label: 'الأرجل (Legs)' },
  { key: 'biceps', label: 'البايسبس (Biceps)' },
  { key: 'triceps', label: 'الترايسبس (Triceps)' },
  { key: 'forearms', label: 'الساعد (Forearms)' },
  { key: 'abs', label: 'تمارين البطن (Abs)' }
];
