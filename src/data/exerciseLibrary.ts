import type { ExerciseDefinition } from './trainerData';

/**
 * Comprehensive exercise library with 60+ exercises
 * Organized by movement pattern and muscle group
 */

export const exerciseLibrary: ExerciseDefinition[] = [
  // ============================================
  // CHEST - PUSH HORIZONTAL
  // ============================================
  {
    id: 'bench-press-barbell',
    name: 'Barbell Bench Press',
    muscleGroups: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'push_horizontal',
    formCues: [
      'Retract and depress shoulder blades',
      'Arch upper back slightly, maintain flat lower back',
      'Grip slightly wider than shoulder width',
      'Lower bar to mid-chest with elbows at 45 degrees',
      'Drive feet into floor for leg drive',
      'Press bar up and slightly back toward face'
    ],
    commonMistakes: [
      'Flaring elbows too wide',
      'Bouncing bar off chest',
      'Lifting hips off bench',
      'Not maintaining shoulder blade retraction'
    ],
    alternatives: ['bench-press-dumbbell', 'machine-chest-press']
  },
  {
    id: 'bench-press-dumbbell',
    name: 'Dumbbell Bench Press',
    muscleGroups: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['dumbbell', 'bench'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'push_horizontal',
    formCues: [
      'Start with dumbbells at chest level',
      'Keep wrists stacked over elbows',
      'Press up and slightly together',
      'Lower with control, feel stretch at bottom',
      'Maintain shoulder blade retraction throughout'
    ],
    commonMistakes: [
      'Dumbbells drifting too far apart',
      'Not controlling the descent',
      'Losing shoulder blade position'
    ],
    alternatives: ['bench-press-barbell', 'machine-chest-press']
  },
  {
    id: 'incline-bench-press-barbell',
    name: 'Incline Barbell Bench Press',
    muscleGroups: ['chest', 'shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['barbell', 'bench'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'push_horizontal',
    formCues: [
      'Set bench to 30-45 degree incline',
      'Lower bar to upper chest/clavicle area',
      'Keep elbows at approximately 45 degrees',
      'Press up in a slight arc'
    ],
    commonMistakes: [
      'Bench angle too steep (becomes shoulder press)',
      'Lowering to wrong part of chest',
      'Excessive arch in lower back'
    ],
    alternatives: ['incline-bench-press-dumbbell']
  },
  {
    id: 'incline-bench-press-dumbbell',
    name: 'Incline Dumbbell Bench Press',
    muscleGroups: ['chest', 'shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['dumbbell', 'bench'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'push_horizontal',
    formCues: [
      'Set bench to 30-45 degree incline',
      'Start with dumbbells at shoulder level',
      'Press up and slightly together',
      'Lower to upper chest with control'
    ],
    commonMistakes: [
      'Using momentum to start the press',
      'Bench angle too steep'
    ],
    alternatives: ['incline-bench-press-barbell']
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    muscleGroups: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    equipment: ['bodyweight'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'push_horizontal',
    formCues: [
      'Hands slightly wider than shoulder width',
      'Body in straight line from head to heels',
      'Lower chest to just above floor',
      'Keep elbows at 45 degrees, not flared',
      'Engage core throughout'
    ],
    commonMistakes: [
      'Sagging hips',
      'Flaring elbows to 90 degrees',
      'Not going through full range of motion',
      'Head dropping forward'
    ],
    alternatives: ['bench-press-dumbbell', 'machine-chest-press']
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    muscleGroups: ['chest'],
    equipment: ['dumbbell', 'bench'],
    category: 'isolation',
    difficulty: 'intermediate',
    movementPattern: 'push_horizontal',
    formCues: [
      'Start with dumbbells above chest, slight bend in elbows',
      'Lower in wide arc until stretch in chest',
      'Keep slight elbow bend constant throughout',
      'Squeeze chest to bring dumbbells back together'
    ],
    commonMistakes: [
      'Going too heavy and bending elbows excessively',
      'Not feeling the stretch at the bottom',
      'Using momentum'
    ],
    alternatives: ['cable-fly', 'pec-deck-machine']
  },
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    muscleGroups: ['chest'],
    equipment: ['cable'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'push_horizontal',
    formCues: [
      'Set cables at chest height',
      'Step forward for slight stretch',
      'Bring handles together in hugging motion',
      'Squeeze chest at the top',
      'Control the return'
    ],
    commonMistakes: [
      'Using too much weight',
      'Not squeezing at contraction'
    ],
    alternatives: ['dumbbell-fly', 'pec-deck-machine']
  },
  {
    id: 'machine-chest-press',
    name: 'Machine Chest Press',
    muscleGroups: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['machine'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'push_horizontal',
    formCues: [
      'Adjust seat so handles are at mid-chest',
      'Grip handles with neutral or pronated grip',
      'Press forward until arms extended',
      'Control the return, feel the stretch'
    ],
    commonMistakes: [
      'Seat height incorrect',
      'Not using full range of motion'
    ],
    alternatives: ['bench-press-dumbbell', 'bench-press-barbell']
  },
  {
    id: 'dip-chest',
    name: 'Chest Dip',
    muscleGroups: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: ['bodyweight'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'push_horizontal',
    formCues: [
      'Lean torso forward 30-45 degrees',
      'Lower until upper arms parallel to floor',
      'Keep elbows flared slightly',
      'Push up through chest, not triceps'
    ],
    commonMistakes: [
      'Staying too upright (shifts to triceps)',
      'Not going deep enough',
      'Excessive forward lean'
    ],
    alternatives: ['bench-press-dumbbell', 'push-up']
  },

  // ============================================
  // SHOULDERS - PUSH VERTICAL
  // ============================================
  {
    id: 'overhead-press-barbell',
    name: 'Barbell Overhead Press',
    muscleGroups: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: ['barbell'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'push_vertical',
    formCues: [
      'Start with bar at collarbone level',
      'Grip slightly wider than shoulders',
      'Press straight up, moving head back then forward',
      'Lock out directly over mid-foot',
      'Keep core braced throughout'
    ],
    commonMistakes: [
      'Excessive lower back arch',
      'Pressing bar forward instead of straight up',
      'Not locking out fully'
    ],
    alternatives: ['overhead-press-dumbbell', 'machine-shoulder-press']
  },
  {
    id: 'overhead-press-dumbbell',
    name: 'Dumbbell Shoulder Press',
    muscleGroups: ['shoulders'],
    secondaryMuscles: ['triceps'],
    equipment: ['dumbbell', 'bench'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'push_vertical',
    formCues: [
      'Start with dumbbells at shoulder height',
      'Press up and slightly together',
      'Lower with control to starting position',
      'Keep core engaged'
    ],
    commonMistakes: [
      'Using leg drive/momentum',
      'Pressing too far forward'
    ],
    alternatives: ['overhead-press-barbell', 'machine-shoulder-press']
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'push_vertical',
    formCues: [
      'Start with dumbbells at sides',
      'Raise arms out to sides until parallel to floor',
      'Lead with elbows, slight bend maintained',
      'Control the lowering phase',
      'Pinky slightly higher than thumb at top'
    ],
    commonMistakes: [
      'Using momentum/swinging',
      'Going too heavy',
      'Shrugging shoulders'
    ],
    alternatives: ['cable-lateral-raise']
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'push_vertical',
    formCues: [
      'Start with dumbbells in front of thighs',
      'Raise one or both arms to shoulder height',
      'Keep slight bend in elbows',
      'Control the descent'
    ],
    commonMistakes: [
      'Swinging the weight',
      'Raising too high',
      'Leaning back'
    ],
    alternatives: ['cable-front-raise']
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Fly',
    muscleGroups: ['shoulders', 'back'],
    equipment: ['dumbbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'pull_horizontal',
    formCues: [
      'Bend forward at hips, back flat',
      'Let dumbbells hang below chest',
      'Raise arms out to sides, squeezing rear delts',
      'Keep slight bend in elbows',
      'Control the descent'
    ],
    commonMistakes: [
      'Using too much back/momentum',
      'Not going through full range',
      'Rounding the back'
    ],
    alternatives: ['face-pull', 'reverse-pec-deck']
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    muscleGroups: ['shoulders', 'back'],
    secondaryMuscles: ['traps'],
    equipment: ['cable'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'pull_horizontal',
    formCues: [
      'Set cable at face height',
      'Pull rope to face, separating hands',
      'Externally rotate shoulders at end',
      'Squeeze rear delts and upper back',
      'Control the return'
    ],
    commonMistakes: [
      'Not separating the rope',
      'Using too much weight',
      'Not externally rotating'
    ],
    alternatives: ['rear-delt-fly', 'band-pull-apart']
  },

  // ============================================
  // BACK - PULL HORIZONTAL
  // ============================================
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    muscleGroups: ['back', 'lats'],
    secondaryMuscles: ['biceps', 'lower_back'],
    equipment: ['barbell'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'pull_horizontal',
    formCues: [
      'Hinge at hips, back at 45-degree angle',
      'Pull bar to lower chest/upper abs',
      'Drive elbows back, squeeze shoulder blades',
      'Lower with control',
      'Keep core braced, no rounding'
    ],
    commonMistakes: [
      'Using momentum/jerking',
      'Rounding lower back',
      'Pulling to wrong position',
      'Not squeezing at top'
    ],
    alternatives: ['dumbbell-row', 'cable-row']
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    muscleGroups: ['back', 'lats'],
    secondaryMuscles: ['biceps'],
    equipment: ['dumbbell', 'bench'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'pull_horizontal',
    formCues: [
      'One hand and knee on bench',
      'Keep back flat and parallel to floor',
      'Pull dumbbell to hip/lower ribs',
      'Drive elbow toward ceiling',
      'Squeeze at top, control descent'
    ],
    commonMistakes: [
      'Rotating torso',
      'Pulling to chest instead of hip',
      'Using momentum'
    ],
    alternatives: ['barbell-row', 'cable-row']
  },
  {
    id: 'cable-row',
    name: 'Seated Cable Row',
    muscleGroups: ['back', 'lats'],
    secondaryMuscles: ['biceps'],
    equipment: ['cable'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'pull_horizontal',
    formCues: [
      'Sit with slight knee bend',
      'Pull handle to lower chest/upper abs',
      'Drive elbows back, squeeze shoulder blades',
      'Maintain upright torso',
      'Control the return, feel the stretch'
    ],
    commonMistakes: [
      'Leaning too far back',
      'Using momentum',
      'Not squeezing at contraction'
    ],
    alternatives: ['barbell-row', 'dumbbell-row']
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row',
    muscleGroups: ['back', 'lats'],
    secondaryMuscles: ['biceps', 'lower_back'],
    equipment: ['barbell'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'pull_horizontal',
    formCues: [
      'Straddle the bar or use landmine attachment',
      'Hinge at hips, chest up',
      'Pull to chest, squeeze shoulder blades',
      'Lower with control'
    ],
    commonMistakes: [
      'Rounding back',
      'Standing too upright',
      'Using momentum'
    ],
    alternatives: ['barbell-row', 'dumbbell-row']
  },

  // ============================================
  // BACK - PULL VERTICAL
  // ============================================
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscleGroups: ['lats', 'back'],
    secondaryMuscles: ['biceps', 'core'],
    equipment: ['pull_up_bar', 'bodyweight'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'pull_vertical',
    formCues: [
      'Grip bar slightly wider than shoulders',
      'Start from dead hang, shoulders engaged',
      'Pull chest to bar, driving elbows down',
      'Squeeze lats at top',
      'Lower with control to full extension'
    ],
    commonMistakes: [
      'Kipping/using momentum',
      'Not going through full range',
      'Chin barely over bar instead of chest to bar'
    ],
    alternatives: ['lat-pulldown', 'assisted-pull-up']
  },
  {
    id: 'chin-up',
    name: 'Chin-Up',
    muscleGroups: ['lats', 'back'],
    secondaryMuscles: ['biceps'],
    equipment: ['pull_up_bar', 'bodyweight'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'pull_vertical',
    formCues: [
      'Grip bar with palms facing you, shoulder width',
      'Pull chest to bar',
      'Emphasize bicep and lat engagement',
      'Control the descent'
    ],
    commonMistakes: [
      'Relying too much on biceps',
      'Partial range of motion'
    ],
    alternatives: ['pull-up', 'lat-pulldown']
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroups: ['lats', 'back'],
    secondaryMuscles: ['biceps'],
    equipment: ['cable'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'pull_vertical',
    formCues: [
      'Grip bar wider than shoulders',
      'Lean back slightly',
      'Pull bar to upper chest',
      'Drive elbows down and back',
      'Squeeze lats, control the return'
    ],
    commonMistakes: [
      'Pulling behind neck',
      'Leaning back too much',
      'Using momentum'
    ],
    alternatives: ['pull-up', 'chin-up']
  },

  // ============================================
  // LEGS - SQUAT PATTERN
  // ============================================
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    muscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core', 'lower_back'],
    equipment: ['barbell', 'squat_rack'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'squat',
    formCues: [
      'Bar on upper traps or rear delts (high/low bar)',
      'Feet shoulder width or slightly wider',
      'Brace core, take a big breath',
      'Break at hips and knees simultaneously',
      'Descend until hip crease below knee',
      'Drive through whole foot to stand'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Excessive forward lean',
      'Not hitting depth',
      'Butt wink at bottom'
    ],
    alternatives: ['goblet-squat', 'leg-press']
  },
  {
    id: 'front-squat',
    name: 'Front Squat',
    muscleGroups: ['quadriceps'],
    secondaryMuscles: ['glutes', 'core'],
    equipment: ['barbell', 'squat_rack'],
    category: 'compound',
    difficulty: 'advanced',
    movementPattern: 'squat',
    formCues: [
      'Bar rests on front delts, elbows high',
      'Use clean grip or crossed arms',
      'Keep torso very upright throughout',
      'Descend to full depth',
      'Drive up, maintaining elbow position'
    ],
    commonMistakes: [
      'Elbows dropping',
      'Excessive forward lean',
      'Wrist pain from grip'
    ],
    alternatives: ['barbell-squat', 'goblet-squat']
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    muscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscles: ['core'],
    equipment: ['dumbbell', 'kettlebell'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'squat',
    formCues: [
      'Hold dumbbell or kettlebell at chest',
      'Feet shoulder width, toes slightly out',
      'Squat between your legs',
      'Keep chest up and core tight',
      'Drive through heels to stand'
    ],
    commonMistakes: [
      'Leaning forward',
      'Knees caving in',
      'Not going deep enough'
    ],
    alternatives: ['barbell-squat', 'leg-press']
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['machine'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'squat',
    formCues: [
      'Feet shoulder width on platform',
      'Lower back stays pressed into pad',
      'Lower weight until knees at 90 degrees',
      'Press through whole foot',
      'Do not lock out knees completely'
    ],
    commonMistakes: [
      'Lower back coming off pad',
      'Knees caving in',
      'Locking out knees'
    ],
    alternatives: ['barbell-squat', 'goblet-squat']
  },
  {
    id: 'hack-squat',
    name: 'Hack Squat',
    muscleGroups: ['quadriceps'],
    secondaryMuscles: ['glutes'],
    equipment: ['machine'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'squat',
    formCues: [
      'Position shoulders under pads',
      'Feet shoulder width, slightly forward on platform',
      'Release safeties, descend with control',
      'Go to at least 90 degrees',
      'Press through heels'
    ],
    commonMistakes: [
      'Feet too far back',
      'Not using full range of motion'
    ],
    alternatives: ['leg-press', 'barbell-squat']
  },

  // ============================================
  // LEGS - HINGE PATTERN
  // ============================================
  {
    id: 'deadlift-conventional',
    name: 'Conventional Deadlift',
    muscleGroups: ['hamstrings', 'glutes', 'lower_back'],
    secondaryMuscles: ['quadriceps', 'traps', 'forearms'],
    equipment: ['barbell'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'hinge',
    formCues: [
      'Feet hip width, bar over mid-foot',
      'Grip just outside knees',
      'Hips back, chest up, lats engaged',
      'Take slack out of bar',
      'Drive through floor, keep bar close',
      'Lock out hips and knees together',
      'Lower by hinging hips back first'
    ],
    commonMistakes: [
      'Rounding lower back',
      'Bar drifting away from body',
      'Hips shooting up first',
      'Hyperextending at top'
    ],
    alternatives: ['deadlift-romanian', 'deadlift-sumo']
  },
  {
    id: 'deadlift-romanian',
    name: 'Romanian Deadlift (RDL)',
    muscleGroups: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lower_back'],
    equipment: ['barbell', 'dumbbell'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'hinge',
    formCues: [
      'Start standing with bar/dumbbells',
      'Slight knee bend, maintained throughout',
      'Hinge at hips, push them back',
      'Lower until hamstring stretch (mid-shin to knee)',
      'Keep back flat, shoulders retracted',
      'Drive hips forward to stand'
    ],
    commonMistakes: [
      'Bending knees too much (becomes deadlift)',
      'Rounding back',
      'Not feeling hamstring stretch'
    ],
    alternatives: ['deadlift-conventional', 'good-morning']
  },
  {
    id: 'good-morning',
    name: 'Good Morning',
    muscleGroups: ['hamstrings', 'glutes', 'lower_back'],
    equipment: ['barbell'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'hinge',
    formCues: [
      'Bar on upper back like squat',
      'Slight knee bend',
      'Hinge at hips, keeping back flat',
      'Descend until parallel or hamstring stretch',
      'Drive hips forward to stand'
    ],
    commonMistakes: [
      'Going too heavy',
      'Rounding back',
      'Bending knees too much'
    ],
    alternatives: ['deadlift-romanian', 'back-extension']
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    muscleGroups: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['barbell', 'bench'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'hinge',
    formCues: [
      'Upper back against bench',
      'Bar in hip crease with pad',
      'Feet flat, knees at 90 degrees at top',
      'Drive through heels, squeeze glutes',
      'Chin tucked, do not hyperextend spine',
      'Lower with control'
    ],
    commonMistakes: [
      'Hyperextending lower back',
      'Feet too close or far',
      'Not squeezing glutes at top'
    ],
    alternatives: ['glute-bridge', 'cable-pull-through']
  },
  {
    id: 'back-extension',
    name: 'Back Extension',
    muscleGroups: ['lower_back', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['bodyweight', 'machine'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'hinge',
    formCues: [
      'Pad at hip level',
      'Cross arms or hold weight at chest',
      'Hinge at hips, lower with control',
      'Extend back up, squeeze glutes',
      'Do not hyperextend'
    ],
    commonMistakes: [
      'Using momentum',
      'Hyperextending at top',
      'Pad position too low'
    ],
    alternatives: ['good-morning', 'deadlift-romanian']
  },

  // ============================================
  // LEGS - LUNGE PATTERN
  // ============================================
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    muscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: ['bodyweight', 'dumbbell'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'lunge',
    formCues: [
      'Take a large step forward',
      'Lower back knee toward floor',
      'Front knee tracks over toes',
      'Drive through front heel',
      'Step forward into next lunge'
    ],
    commonMistakes: [
      'Front knee going past toes excessively',
      'Torso leaning forward',
      'Steps too short'
    ],
    alternatives: ['reverse-lunge', 'split-squat']
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    muscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['bodyweight', 'dumbbell', 'barbell'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'lunge',
    formCues: [
      'Step backward with one leg',
      'Lower back knee toward floor',
      'Keep torso upright',
      'Drive through front heel to stand',
      'Return to starting position'
    ],
    commonMistakes: [
      'Leaning forward',
      'Front knee caving in',
      'Not going deep enough'
    ],
    alternatives: ['walking-lunge', 'split-squat']
  },
  {
    id: 'split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroups: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['bodyweight', 'dumbbell', 'bench'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'lunge',
    formCues: [
      'Rear foot elevated on bench',
      'Front foot 2-3 feet forward',
      'Lower until back knee near floor',
      'Keep torso upright',
      'Drive through front heel'
    ],
    commonMistakes: [
      'Front foot too close to bench',
      'Knee caving in',
      'Leaning forward excessively'
    ],
    alternatives: ['reverse-lunge', 'walking-lunge']
  },
  {
    id: 'step-up',
    name: 'Step-Up',
    muscleGroups: ['quadriceps', 'glutes'],
    equipment: ['bench', 'dumbbell'],
    category: 'compound',
    difficulty: 'beginner',
    movementPattern: 'lunge',
    formCues: [
      'Step onto box/bench with one foot',
      'Drive through heel, fully extend',
      'Control the descent',
      'Do not push off back foot'
    ],
    commonMistakes: [
      'Pushing off back foot',
      'Not fully extending at top',
      'Box too low'
    ],
    alternatives: ['walking-lunge', 'reverse-lunge']
  },

  // ============================================
  // LEGS - ISOLATION
  // ============================================
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    muscleGroups: ['quadriceps'],
    equipment: ['machine'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'squat',
    formCues: [
      'Adjust pad to sit at lower shin',
      'Extend legs fully, squeeze quads',
      'Control the descent',
      'Keep back against pad'
    ],
    commonMistakes: [
      'Using momentum',
      'Partial range of motion',
      'Lifting hips off seat'
    ],
    alternatives: ['sissy-squat']
  },
  {
    id: 'leg-curl-lying',
    name: 'Lying Leg Curl',
    muscleGroups: ['hamstrings'],
    equipment: ['machine'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'hinge',
    formCues: [
      'Lie face down, pad above heels',
      'Curl heels toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control'
    ],
    commonMistakes: [
      'Lifting hips off pad',
      'Not getting full contraction',
      'Using momentum'
    ],
    alternatives: ['leg-curl-seated', 'nordic-curl']
  },
  {
    id: 'calf-raise-standing',
    name: 'Standing Calf Raise',
    muscleGroups: ['calves'],
    equipment: ['machine', 'dumbbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'squat',
    formCues: [
      'Stand on edge of platform',
      'Lower heels for full stretch',
      'Rise onto balls of feet',
      'Squeeze calves at top',
      'Control the descent'
    ],
    commonMistakes: [
      'Not using full range of motion',
      'Bouncing at bottom',
      'Bending knees'
    ],
    alternatives: ['calf-raise-seated']
  },

  // ============================================
  // ARMS - BICEPS
  // ============================================
  {
    id: 'barbell-curl',
    name: 'Barbell Curl',
    muscleGroups: ['biceps'],
    equipment: ['barbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'pull_vertical',
    formCues: [
      'Stand with bar at hip level',
      'Keep elbows pinned to sides',
      'Curl bar up, squeezing biceps',
      'Lower with control',
      'Do not swing or use momentum'
    ],
    commonMistakes: [
      'Swinging the weight',
      'Elbows moving forward',
      'Leaning back'
    ],
    alternatives: ['dumbbell-curl', 'ez-bar-curl']
  },
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    muscleGroups: ['biceps'],
    equipment: ['dumbbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'pull_vertical',
    formCues: [
      'Stand or sit with dumbbells at sides',
      'Curl with supinated grip',
      'Keep elbows stationary',
      'Squeeze at top, lower with control'
    ],
    commonMistakes: [
      'Swinging',
      'Using shoulder to lift',
      'Partial reps'
    ],
    alternatives: ['barbell-curl', 'hammer-curl']
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    muscleGroups: ['biceps', 'forearms'],
    equipment: ['dumbbell'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'pull_vertical',
    formCues: [
      'Hold dumbbells with neutral grip (palms in)',
      'Keep elbows pinned',
      'Curl up, squeeze at top',
      'Lower with control'
    ],
    commonMistakes: [
      'Swinging',
      'Rotating wrists during movement'
    ],
    alternatives: ['dumbbell-curl', 'cable-curl']
  },

  // ============================================
  // ARMS - TRICEPS
  // ============================================
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    muscleGroups: ['triceps'],
    equipment: ['cable'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'push_vertical',
    formCues: [
      'Stand facing cable, elbows at sides',
      'Push rope/bar down until arms extended',
      'Squeeze triceps at bottom',
      'Control return, keep elbows stationary'
    ],
    commonMistakes: [
      'Elbows moving',
      'Leaning over the weight',
      'Using momentum'
    ],
    alternatives: ['skull-crusher', 'dip-tricep']
  },
  {
    id: 'skull-crusher',
    name: 'Skull Crusher',
    muscleGroups: ['triceps'],
    equipment: ['barbell', 'dumbbell'],
    category: 'isolation',
    difficulty: 'intermediate',
    movementPattern: 'push_vertical',
    formCues: [
      'Lie on bench, arms extended above chest',
      'Lower weight toward forehead',
      'Keep upper arms stationary',
      'Extend arms, squeeze triceps'
    ],
    commonMistakes: [
      'Elbows flaring',
      'Upper arms moving',
      'Going too heavy'
    ],
    alternatives: ['tricep-pushdown', 'overhead-tricep-extension']
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    muscleGroups: ['triceps'],
    equipment: ['dumbbell', 'cable'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'push_vertical',
    formCues: [
      'Hold dumbbell overhead with both hands',
      'Lower behind head, keeping elbows up',
      'Extend arms, squeeze triceps',
      'Control throughout'
    ],
    commonMistakes: [
      'Elbows flaring wide',
      'Arching back',
      'Using momentum'
    ],
    alternatives: ['skull-crusher', 'tricep-pushdown']
  },
  {
    id: 'dip-tricep',
    name: 'Tricep Dip',
    muscleGroups: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: ['bodyweight'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'push_vertical',
    formCues: [
      'Keep torso upright (vs chest dip which leans forward)',
      'Lower until arms at 90 degrees',
      'Keep elbows tucked close',
      'Press up, squeezing triceps'
    ],
    commonMistakes: [
      'Leaning too far forward',
      'Not going deep enough',
      'Flaring elbows'
    ],
    alternatives: ['tricep-pushdown', 'bench-dip']
  },

  // ============================================
  // CORE
  // ============================================
  {
    id: 'plank',
    name: 'Plank',
    muscleGroups: ['core', 'abs'],
    equipment: ['bodyweight'],
    category: 'isometric',
    difficulty: 'beginner',
    movementPattern: 'core_stability',
    formCues: [
      'Forearms on ground, elbows under shoulders',
      'Body in straight line from head to heels',
      'Squeeze glutes and brace core',
      'Do not let hips sag or pike up',
      'Breathe steadily'
    ],
    commonMistakes: [
      'Hips too high or too low',
      'Not engaging glutes',
      'Holding breath'
    ],
    alternatives: ['dead-bug', 'ab-wheel']
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroups: ['core', 'abs'],
    equipment: ['bodyweight'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'core_stability',
    formCues: [
      'Lie on back, arms pointing up',
      'Knees bent 90 degrees above hips',
      'Press lower back into floor',
      'Extend opposite arm and leg',
      'Return and switch sides'
    ],
    commonMistakes: [
      'Lower back arching off floor',
      'Moving too fast',
      'Not maintaining core tension'
    ],
    alternatives: ['plank', 'bird-dog']
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroups: ['abs', 'core'],
    equipment: ['pull_up_bar'],
    category: 'isolation',
    difficulty: 'intermediate',
    movementPattern: 'core_stability',
    formCues: [
      'Hang from bar with straight arms',
      'Raise legs until parallel or higher',
      'Keep legs straight',
      'Lower with control',
      'Avoid swinging'
    ],
    commonMistakes: [
      'Using momentum/swinging',
      'Bending knees',
      'Not controlling descent'
    ],
    alternatives: ['knee-raise', 'leg-raise-lying']
  },
  {
    id: 'cable-crunch',
    name: 'Cable Crunch',
    muscleGroups: ['abs'],
    equipment: ['cable'],
    category: 'isolation',
    difficulty: 'beginner',
    movementPattern: 'core_stability',
    formCues: [
      'Kneel facing cable, rope behind head',
      'Crunch down, bringing elbows to thighs',
      'Focus on curling spine, not hip hinge',
      'Squeeze abs at bottom',
      'Return with control'
    ],
    commonMistakes: [
      'Using hip flexors instead of abs',
      'Pulling with arms',
      'Not curling spine'
    ],
    alternatives: ['crunch', 'hanging-leg-raise']
  },
  {
    id: 'ab-wheel',
    name: 'Ab Wheel Rollout',
    muscleGroups: ['abs', 'core'],
    equipment: ['medicine_ball'],
    category: 'compound',
    difficulty: 'intermediate',
    movementPattern: 'core_stability',
    formCues: [
      'Kneel with wheel in front',
      'Roll out slowly, keeping core tight',
      'Extend as far as possible with control',
      'Do not let hips sag',
      'Roll back to starting position'
    ],
    commonMistakes: [
      'Going too far and losing form',
      'Hips sagging',
      'Using arms to pull back'
    ],
    alternatives: ['plank', 'hanging-leg-raise']
  },

  // ============================================
  // CARDIO
  // ============================================
  {
    id: 'treadmill-run',
    name: 'Treadmill Running',
    muscleGroups: ['full_body'],
    equipment: ['cardio_machine'],
    category: 'cardio',
    difficulty: 'beginner',
    movementPattern: 'cardio',
    formCues: [
      'Land midfoot, not heel',
      'Keep cadence high (170-180 spm)',
      'Slight forward lean from ankles',
      'Arms swing naturally at 90 degrees',
      'Look forward, not down'
    ],
    commonMistakes: [
      'Overstriding',
      'Holding onto handles',
      'Looking down'
    ],
    alternatives: ['elliptical', 'rowing-machine']
  },
  {
    id: 'rowing-machine',
    name: 'Rowing Machine',
    muscleGroups: ['full_body', 'back'],
    secondaryMuscles: ['quadriceps', 'core'],
    equipment: ['cardio_machine'],
    category: 'cardio',
    difficulty: 'beginner',
    movementPattern: 'cardio',
    formCues: [
      'Start with arms extended, knees bent',
      'Drive with legs first',
      'Then lean back and pull to chest',
      'Return in reverse: arms, body, legs',
      'Keep core engaged throughout'
    ],
    commonMistakes: [
      'Pulling before leg drive',
      'Rounding back',
      'Rushing the recovery'
    ],
    alternatives: ['treadmill-run', 'bike']
  },
  {
    id: 'bike',
    name: 'Stationary Bike',
    muscleGroups: ['quadriceps'],
    secondaryMuscles: ['hamstrings', 'glutes'],
    equipment: ['cardio_machine'],
    category: 'cardio',
    difficulty: 'beginner',
    movementPattern: 'cardio',
    formCues: [
      'Adjust seat height - slight knee bend at bottom',
      'Keep core engaged',
      'Push and pull through full pedal stroke',
      'Maintain steady cadence'
    ],
    commonMistakes: [
      'Seat too low',
      'Bouncing in saddle',
      'Only pushing down'
    ],
    alternatives: ['treadmill-run', 'elliptical']
  }
];

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return exerciseLibrary.find(ex => ex.id === id);
}

/**
 * Get exercises by muscle group
 */
export function getExercisesByMuscleGroup(muscleGroup: string): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex =>
    ex.muscleGroups.includes(muscleGroup as any) ||
    ex.secondaryMuscles?.includes(muscleGroup as any)
  );
}

/**
 * Get exercises by equipment
 */
export function getExercisesByEquipment(equipment: string): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => ex.equipment.includes(equipment as any));
}

/**
 * Get exercises by category
 */
export function getExercisesByCategory(category: string): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => ex.category === category);
}

/**
 * Get exercises by difficulty
 */
export function getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ExerciseDefinition[] {
  return exerciseLibrary.filter(ex => ex.difficulty === difficulty);
}

/**
 * Search exercises by name
 */
export function searchExercises(query: string): ExerciseDefinition[] {
  const lowerQuery = query.toLowerCase();
  return exerciseLibrary.filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.muscleGroups.some(mg => mg.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get exercise count by category
 */
export function getExerciseCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  exerciseLibrary.forEach(ex => {
    counts[ex.category] = (counts[ex.category] || 0) + 1;
  });
  return counts;
}

export default exerciseLibrary;
