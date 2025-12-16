import type {
  TrainerProfile,
  ClientSummary,
  WorkoutProgram,
  WorkoutSession,
  WorkoutSet,
  NutritionPlan,
  BodyMeasurement,
  StrengthRecord,
  FormCheck,
  Goal,
  TrainerMessage,
  ScheduledSession,
  DailyNutrition,
  SharingPreferences,
  TrainerData,
  DailyProgram,
  CustomExercise,
  CompletedProgramWorkout,
  PendingWorkoutLink,
} from './trainerData';

// ============================================
// TRAINER PROFILE
// ============================================

export const mockTrainerProfile: TrainerProfile = {
  id: 'trainer-001',
  name: 'Marcus Thompson',
  certifications: ['NASM-CPT', 'CSCS', 'Precision Nutrition Level 1'],
  specializations: ['Strength Training', 'Body Recomposition', 'Powerlifting', 'Sports Performance'],
  gymAffiliation: 'Iron Temple Fitness',
  clientCount: 8,
  activePrograms: 7,
  pendingFormChecks: 3,
  unreadMessages: 5,
};

// ============================================
// CLIENTS
// ============================================

export const mockClients: ClientSummary[] = [
  {
    id: 'client-001',
    patientId: 'patient-001', // Links to Sarah Johnson in patient portal
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    fitnessLevel: 'intermediate',
    primaryGoal: 'weight_loss',
    secondaryGoals: ['strength', 'general_fitness'],
    joinDate: '2024-09-15',
    lastWorkout: '2024-12-12',
    nextSession: '2024-12-15',
    currentProgramId: 'program-001',
    currentNutritionPlanId: 'nutrition-001',
    programAdherence: 87,
    nutritionAdherence: 72,
    unreadMessages: 0,
    pendingFormChecks: 1,
    currentWeight: 168,
    startingWeight: 185,
    targetWeight: 155,
    bodyFatPercent: 28,
    bloodworkConcerns: ['Elevated A1C (6.2%)', 'Low Vitamin D'],
    sharesBloodwork: true,
    sharesMedications: false,
  },
  {
    id: 'client-002',
    name: 'James Chen',
    age: 28,
    gender: 'Male',
    email: 'jchen@email.com',
    fitnessLevel: 'advanced',
    primaryGoal: 'muscle_gain',
    secondaryGoals: ['strength'],
    joinDate: '2024-06-01',
    lastWorkout: '2024-12-13',
    nextSession: '2024-12-14',
    currentProgramId: 'program-002',
    currentNutritionPlanId: 'nutrition-002',
    programAdherence: 95,
    nutritionAdherence: 88,
    unreadMessages: 2,
    pendingFormChecks: 0,
    currentWeight: 182,
    startingWeight: 165,
    targetWeight: 190,
    bodyFatPercent: 14,
    sharesBloodwork: false,
    sharesMedications: false,
  },
  {
    id: 'client-003',
    patientId: 'patient-002', // Links to Michael Davis
    name: 'Michael Davis',
    age: 52,
    gender: 'Male',
    email: 'mdavis@email.com',
    phone: '(555) 234-5678',
    fitnessLevel: 'beginner',
    primaryGoal: 'general_fitness',
    secondaryGoals: ['weight_loss'],
    joinDate: '2024-11-01',
    lastWorkout: '2024-12-11',
    nextSession: '2024-12-16',
    currentProgramId: 'program-003',
    currentNutritionPlanId: 'nutrition-003',
    programAdherence: 65,
    nutritionAdherence: 58,
    unreadMessages: 1,
    pendingFormChecks: 2,
    currentWeight: 228,
    startingWeight: 235,
    targetWeight: 200,
    bodyFatPercent: 32,
    bloodworkConcerns: ['High LDL Cholesterol', 'High Triglycerides', 'Elevated A1C (7.1%)'],
    exerciseRestrictions: ['Avoid high-impact activities', 'Monitor heart rate'],
    sharesBloodwork: true,
    sharesMedications: true,
  },
  {
    id: 'client-004',
    name: 'Emily Rodriguez',
    age: 26,
    gender: 'Female',
    email: 'emily.r@email.com',
    fitnessLevel: 'intermediate',
    primaryGoal: 'body_recomposition',
    secondaryGoals: ['strength', 'endurance'],
    joinDate: '2024-08-20',
    lastWorkout: '2024-12-13',
    nextSession: '2024-12-15',
    currentProgramId: 'program-004',
    currentNutritionPlanId: 'nutrition-004',
    programAdherence: 92,
    nutritionAdherence: 85,
    unreadMessages: 0,
    pendingFormChecks: 0,
    currentWeight: 142,
    startingWeight: 148,
    targetWeight: 138,
    bodyFatPercent: 24,
    sharesBloodwork: false,
    sharesMedications: false,
  },
  {
    id: 'client-005',
    name: 'David Kim',
    age: 31,
    gender: 'Male',
    email: 'dkim@email.com',
    fitnessLevel: 'intermediate',
    primaryGoal: 'strength',
    secondaryGoals: ['muscle_gain'],
    joinDate: '2024-07-15',
    lastWorkout: '2024-12-12',
    nextSession: '2024-12-14',
    currentProgramId: 'program-005',
    currentNutritionPlanId: 'nutrition-005',
    programAdherence: 78,
    nutritionAdherence: 65,
    unreadMessages: 1,
    pendingFormChecks: 0,
    currentWeight: 195,
    startingWeight: 188,
    targetWeight: 200,
    bodyFatPercent: 18,
    sharesBloodwork: false,
    sharesMedications: false,
  },
  {
    id: 'client-006',
    name: 'Amanda Foster',
    age: 38,
    gender: 'Female',
    email: 'afoster@email.com',
    phone: '(555) 345-6789',
    fitnessLevel: 'beginner',
    primaryGoal: 'weight_loss',
    secondaryGoals: ['general_fitness'],
    joinDate: '2024-10-10',
    lastWorkout: '2024-12-10',
    nextSession: '2024-12-17',
    currentProgramId: 'program-006',
    currentNutritionPlanId: 'nutrition-006',
    programAdherence: 55,
    nutritionAdherence: 48,
    unreadMessages: 0,
    pendingFormChecks: 0,
    currentWeight: 195,
    startingWeight: 205,
    targetWeight: 165,
    bodyFatPercent: 35,
    bloodworkConcerns: ['Borderline High Blood Pressure'],
    sharesBloodwork: true,
    sharesMedications: false,
  },
  {
    id: 'client-007',
    name: 'Ryan Martinez',
    age: 24,
    gender: 'Male',
    email: 'rmartinez@email.com',
    fitnessLevel: 'advanced',
    primaryGoal: 'athletic_performance',
    secondaryGoals: ['strength', 'endurance'],
    joinDate: '2024-05-01',
    lastWorkout: '2024-12-13',
    nextSession: '2024-12-14',
    currentProgramId: 'program-007',
    programAdherence: 98,
    nutritionAdherence: 90,
    unreadMessages: 0,
    pendingFormChecks: 0,
    currentWeight: 175,
    startingWeight: 172,
    targetWeight: 175,
    bodyFatPercent: 11,
    sharesBloodwork: false,
    sharesMedications: false,
  },
  {
    id: 'client-008',
    name: 'Lisa Thompson',
    age: 45,
    gender: 'Female',
    email: 'lthompson@email.com',
    fitnessLevel: 'intermediate',
    primaryGoal: 'general_fitness',
    secondaryGoals: ['weight_loss', 'strength'],
    joinDate: '2024-04-01',
    lastWorkout: '2024-12-11',
    nextSession: '2024-12-18',
    currentProgramId: 'program-008',
    currentNutritionPlanId: 'nutrition-007',
    programAdherence: 82,
    nutritionAdherence: 75,
    unreadMessages: 1,
    pendingFormChecks: 0,
    currentWeight: 158,
    startingWeight: 172,
    targetWeight: 150,
    bodyFatPercent: 26,
    sharesBloodwork: true,
    sharesMedications: false,
  },
];

// ============================================
// WORKOUT PROGRAMS
// ============================================

// Helper to create workout sets
function createSets(
  count: number,
  targetReps: string,
  targetWeight: number,
  restPeriod: number = 90,
  setType: WorkoutSet['setType'] = 'working'
): WorkoutSet[] {
  return Array.from({ length: count }, (_, i) => ({
    setNumber: i + 1,
    setType,
    targetReps,
    targetWeight,
    restPeriod,
  }));
}

// Sarah's Weight Loss Program - Upper/Lower Split
const sarahPushDay: WorkoutSession = {
  id: 'session-sarah-push',
  name: 'Upper Body Push',
  type: 'strength',
  estimatedDuration: 55,
  difficulty: 'moderate',
  targetMuscleGroups: ['chest', 'shoulders', 'triceps'],
  warmup: {
    description: '5 min incline walk, arm circles, band pull-aparts',
    duration: 5,
  },
  exercises: [
    {
      id: 'ex-001',
      exerciseId: 'dumbbell-bench-press',
      exerciseName: 'Dumbbell Bench Press',
      order: 1,
      sets: createSets(3, '10-12', 35, 90),
      trainerNotes: 'Control the negative, squeeze at top',
    },
    {
      id: 'ex-002',
      exerciseId: 'incline-dumbbell-press',
      exerciseName: 'Incline Dumbbell Press',
      order: 2,
      sets: createSets(3, '10-12', 25, 90),
    },
    {
      id: 'ex-003',
      exerciseId: 'seated-shoulder-press',
      exerciseName: 'Seated Dumbbell Shoulder Press',
      order: 3,
      sets: createSets(3, '10-12', 20, 90),
    },
    {
      id: 'ex-004',
      exerciseId: 'lateral-raise',
      exerciseName: 'Lateral Raises',
      order: 4,
      sets: createSets(3, '12-15', 10, 60),
    },
    {
      id: 'ex-005',
      exerciseId: 'tricep-pushdown',
      exerciseName: 'Tricep Pushdown',
      order: 5,
      sets: createSets(3, '12-15', 30, 60),
    },
  ],
  cooldown: {
    description: 'Static stretches for chest, shoulders, triceps',
    duration: 5,
  },
  status: 'template',
};

const sarahPullDay: WorkoutSession = {
  id: 'session-sarah-pull',
  name: 'Upper Body Pull',
  type: 'strength',
  estimatedDuration: 55,
  difficulty: 'moderate',
  targetMuscleGroups: ['back', 'biceps', 'core'],
  warmup: {
    description: '5 min row machine, band face pulls',
    duration: 5,
  },
  exercises: [
    {
      id: 'ex-011',
      exerciseId: 'lat-pulldown',
      exerciseName: 'Lat Pulldown',
      order: 1,
      sets: createSets(3, '10-12', 90, 90),
    },
    {
      id: 'ex-012',
      exerciseId: 'seated-cable-row',
      exerciseName: 'Seated Cable Row',
      order: 2,
      sets: createSets(3, '10-12', 80, 90),
    },
    {
      id: 'ex-013',
      exerciseId: 'single-arm-dumbbell-row',
      exerciseName: 'Single Arm Dumbbell Row',
      order: 3,
      sets: createSets(3, '10-12', 30, 60),
    },
    {
      id: 'ex-014',
      exerciseId: 'face-pull',
      exerciseName: 'Face Pulls',
      order: 4,
      sets: createSets(3, '15-20', 25, 60),
    },
    {
      id: 'ex-015',
      exerciseId: 'dumbbell-curl',
      exerciseName: 'Dumbbell Bicep Curls',
      order: 5,
      sets: createSets(3, '12-15', 15, 60),
    },
  ],
  cooldown: {
    description: 'Static stretches for lats, biceps',
    duration: 5,
  },
  status: 'template',
};

const sarahLowerDay: WorkoutSession = {
  id: 'session-sarah-lower',
  name: 'Lower Body',
  type: 'strength',
  estimatedDuration: 60,
  difficulty: 'hard',
  targetMuscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  warmup: {
    description: '5 min bike, hip circles, glute bridges',
    duration: 5,
  },
  exercises: [
    {
      id: 'ex-021',
      exerciseId: 'goblet-squat',
      exerciseName: 'Goblet Squat',
      order: 1,
      sets: createSets(4, '10-12', 45, 90),
      trainerNotes: 'Focus on depth and keeping chest up',
    },
    {
      id: 'ex-022',
      exerciseId: 'romanian-deadlift',
      exerciseName: 'Romanian Deadlift',
      order: 2,
      sets: createSets(3, '10-12', 65, 90),
      trainerNotes: 'Feel the stretch in hamstrings',
    },
    {
      id: 'ex-023',
      exerciseId: 'leg-press',
      exerciseName: 'Leg Press',
      order: 3,
      sets: createSets(3, '12-15', 180, 90),
    },
    {
      id: 'ex-024',
      exerciseId: 'walking-lunge',
      exerciseName: 'Walking Lunges',
      order: 4,
      sets: createSets(3, '12 each leg', 20, 60),
    },
    {
      id: 'ex-025',
      exerciseId: 'calf-raise',
      exerciseName: 'Standing Calf Raises',
      order: 5,
      sets: createSets(3, '15-20', 0, 45),
    },
  ],
  cooldown: {
    description: 'Static stretches for quads, hamstrings, hip flexors',
    duration: 5,
  },
  status: 'template',
};

export const sarahProgram: WorkoutProgram = {
  id: 'program-001',
  trainerId: 'trainer-001',
  clientId: 'client-001',
  name: 'Weight Loss Foundation',
  description: 'Upper/Lower split focused on building lean muscle while in caloric deficit',
  type: 'upper_lower',
  goal: 'weight_loss',
  durationWeeks: 12,
  currentWeek: 8,
  sessionsPerWeek: 4,
  weeklySchedule: [
    { dayOfWeek: 1, dayName: 'Monday', sessionTemplateId: 'session-sarah-push', sessionName: 'Upper Body Push', isRestDay: false },
    { dayOfWeek: 2, dayName: 'Tuesday', sessionTemplateId: 'session-sarah-lower', sessionName: 'Lower Body', isRestDay: false },
    { dayOfWeek: 3, dayName: 'Wednesday', isRestDay: true },
    { dayOfWeek: 4, dayName: 'Thursday', sessionTemplateId: 'session-sarah-pull', sessionName: 'Upper Body Pull', isRestDay: false },
    { dayOfWeek: 5, dayName: 'Friday', sessionTemplateId: 'session-sarah-lower', sessionName: 'Lower Body', isRestDay: false },
    { dayOfWeek: 6, dayName: 'Saturday', isRestDay: true },
    { dayOfWeek: 0, dayName: 'Sunday', isRestDay: true },
  ],
  sessions: [sarahPushDay, sarahPullDay, sarahLowerDay],
  periodizationType: 'linear',
  deloadWeek: 4,
  progressionScheme: 'Add 5 lbs when you can complete all sets at the top of the rep range with good form',
  status: 'active',
  startDate: '2024-10-15',
  completedSessions: 28,
  totalSessions: 48,
  trainerNotes: 'Sarah is responding well. Focus on progressive overload while maintaining deficit adherence.',
};

// James's Hypertrophy Program - Push/Pull/Legs
const jamesPushA: WorkoutSession = {
  id: 'session-james-push-a',
  name: 'Push Day A - Chest Focus',
  type: 'strength',
  estimatedDuration: 70,
  difficulty: 'hard',
  targetMuscleGroups: ['chest', 'shoulders', 'triceps'],
  warmup: {
    description: 'Band pull-aparts, shoulder rotations, light bench',
    duration: 8,
  },
  exercises: [
    {
      id: 'ex-j001',
      exerciseId: 'barbell-bench-press',
      exerciseName: 'Barbell Bench Press',
      order: 1,
      sets: createSets(4, '6-8', 225, 180),
      trainerNotes: 'Primary strength movement - focus on bar path',
    },
    {
      id: 'ex-j002',
      exerciseId: 'incline-dumbbell-press',
      exerciseName: 'Incline Dumbbell Press',
      order: 2,
      sets: createSets(4, '8-10', 75, 120),
    },
    {
      id: 'ex-j003',
      exerciseId: 'cable-fly',
      exerciseName: 'Cable Flyes',
      order: 3,
      sets: createSets(3, '12-15', 30, 60),
    },
    {
      id: 'ex-j004',
      exerciseId: 'overhead-press',
      exerciseName: 'Overhead Press',
      order: 4,
      sets: createSets(4, '8-10', 115, 120),
    },
    {
      id: 'ex-j005',
      exerciseId: 'lateral-raise',
      exerciseName: 'Lateral Raises',
      order: 5,
      sets: createSets(4, '12-15', 20, 45),
    },
    {
      id: 'ex-j006',
      exerciseId: 'tricep-dip',
      exerciseName: 'Weighted Dips',
      order: 6,
      sets: createSets(3, '8-10', 45, 90),
    },
  ],
  status: 'template',
};

export const jamesProgram: WorkoutProgram = {
  id: 'program-002',
  trainerId: 'trainer-001',
  clientId: 'client-002',
  name: 'Advanced Hypertrophy',
  description: 'High volume PPL split for maximum muscle growth',
  type: 'push_pull_legs',
  goal: 'muscle_gain',
  durationWeeks: 16,
  currentWeek: 12,
  sessionsPerWeek: 6,
  weeklySchedule: [
    { dayOfWeek: 1, dayName: 'Monday', sessionName: 'Push A', isRestDay: false },
    { dayOfWeek: 2, dayName: 'Tuesday', sessionName: 'Pull A', isRestDay: false },
    { dayOfWeek: 3, dayName: 'Wednesday', sessionName: 'Legs A', isRestDay: false },
    { dayOfWeek: 4, dayName: 'Thursday', sessionName: 'Push B', isRestDay: false },
    { dayOfWeek: 5, dayName: 'Friday', sessionName: 'Pull B', isRestDay: false },
    { dayOfWeek: 6, dayName: 'Saturday', sessionName: 'Legs B', isRestDay: false },
    { dayOfWeek: 0, dayName: 'Sunday', isRestDay: true },
  ],
  sessions: [jamesPushA],
  periodizationType: 'undulating',
  deloadWeek: 4,
  progressionScheme: 'Double progression - increase reps within range, then increase weight and reset reps',
  status: 'active',
  startDate: '2024-08-01',
  completedSessions: 65,
  totalSessions: 96,
  trainerNotes: 'James is progressing excellently. Bench 1RM up 25 lbs since start.',
};

// Michael's Beginner Program - Full Body
const michaelFullBodyA: WorkoutSession = {
  id: 'session-michael-fb-a',
  name: 'Full Body A',
  type: 'strength',
  estimatedDuration: 45,
  difficulty: 'easy',
  targetMuscleGroups: ['chest', 'back', 'quadriceps', 'core'],
  warmup: {
    description: '10 min walking on treadmill, dynamic stretches',
    duration: 10,
  },
  exercises: [
    {
      id: 'ex-m001',
      exerciseId: 'leg-press',
      exerciseName: 'Leg Press',
      order: 1,
      sets: createSets(3, '12-15', 135, 90),
      trainerNotes: 'Keep lower back pressed against pad',
    },
    {
      id: 'ex-m002',
      exerciseId: 'chest-press-machine',
      exerciseName: 'Chest Press Machine',
      order: 2,
      sets: createSets(3, '12-15', 70, 90),
    },
    {
      id: 'ex-m003',
      exerciseId: 'lat-pulldown',
      exerciseName: 'Lat Pulldown',
      order: 3,
      sets: createSets(3, '12-15', 80, 90),
    },
    {
      id: 'ex-m004',
      exerciseId: 'seated-leg-curl',
      exerciseName: 'Seated Leg Curl',
      order: 4,
      sets: createSets(3, '12-15', 60, 60),
    },
    {
      id: 'ex-m005',
      exerciseId: 'plank',
      exerciseName: 'Plank',
      order: 5,
      sets: [
        { setNumber: 1, setType: 'working', targetDuration: 30, restPeriod: 60 },
        { setNumber: 2, setType: 'working', targetDuration: 30, restPeriod: 60 },
        { setNumber: 3, setType: 'working', targetDuration: 30, restPeriod: 60 },
      ],
    },
  ],
  cooldown: {
    description: '5 min walking, light stretching',
    duration: 5,
  },
  status: 'template',
};

export const michaelProgram: WorkoutProgram = {
  id: 'program-003',
  trainerId: 'trainer-001',
  clientId: 'client-003',
  name: 'Beginner Foundation',
  description: 'Full body program focused on building baseline strength and movement patterns. Heart rate monitored.',
  type: 'full_body',
  goal: 'general_fitness',
  durationWeeks: 8,
  currentWeek: 4,
  sessionsPerWeek: 3,
  weeklySchedule: [
    { dayOfWeek: 1, dayName: 'Monday', sessionName: 'Full Body A', isRestDay: false },
    { dayOfWeek: 2, dayName: 'Tuesday', isRestDay: true },
    { dayOfWeek: 3, dayName: 'Wednesday', sessionName: 'Full Body B', isRestDay: false },
    { dayOfWeek: 4, dayName: 'Thursday', isRestDay: true },
    { dayOfWeek: 5, dayName: 'Friday', sessionName: 'Full Body C', isRestDay: false },
    { dayOfWeek: 6, dayName: 'Saturday', isRestDay: true },
    { dayOfWeek: 0, dayName: 'Sunday', isRestDay: true },
  ],
  sessions: [michaelFullBodyA],
  periodizationType: 'none',
  progressionScheme: 'Focus on form first. Add 5-10 lbs when 15 reps becomes easy with good form.',
  status: 'active',
  startDate: '2024-11-01',
  completedSessions: 9,
  totalSessions: 24,
  trainerNotes: 'Go slow with Michael. Medical clearance obtained. Monitor HR - keep below 140 during sets.',
};

// All programs array
export const mockPrograms: WorkoutProgram[] = [
  sarahProgram,
  jamesProgram,
  michaelProgram,
];

// ============================================
// NUTRITION PLANS
// ============================================

export const mockNutritionPlans: NutritionPlan[] = [
  {
    id: 'nutrition-001',
    trainerId: 'trainer-001',
    clientId: 'client-001',
    name: 'Moderate Deficit',
    description: 'Sustainable fat loss with high protein to preserve muscle',
    goal: 'deficit',
    calculatedTDEE: 2100,
    activityMultiplier: 1.55,
    calorieAdjustment: -500,
    targetCalories: 1600,
    macroSplit: {
      proteinPercent: 35,
      carbsPercent: 35,
      fatPercent: 30,
    },
    macroTargets: {
      calories: 1600,
      protein: 140,
      carbs: 140,
      fat: 53,
      fiber: 25,
    },
    proteinPerLb: 0.85,
    mealTiming: {
      mealCount: 4,
      preworkoutTiming: '1-2 hours before',
      postworkoutTiming: 'Within 2 hours',
      notes: 'Prioritize protein at each meal',
    },
    dietaryRestrictions: [],
    allergies: ['Shellfish'],
    preferredFoods: ['Chicken', 'Greek yogurt', 'Rice', 'Eggs'],
    avoidFoods: [],
    status: 'active',
    startDate: '2024-10-15',
    trainerNotes: 'Adjust by 100 cal every 3 weeks based on progress. A1C is elevated - emphasize complex carbs.',
  },
  {
    id: 'nutrition-002',
    trainerId: 'trainer-001',
    clientId: 'client-002',
    name: 'Lean Bulk',
    description: 'Moderate surplus for muscle gain with minimal fat',
    goal: 'surplus',
    calculatedTDEE: 2800,
    activityMultiplier: 1.725,
    calorieAdjustment: 300,
    targetCalories: 3100,
    macroSplit: {
      proteinPercent: 30,
      carbsPercent: 45,
      fatPercent: 25,
    },
    macroTargets: {
      calories: 3100,
      protein: 233,
      carbs: 349,
      fat: 86,
    },
    proteinPerLb: 1.2,
    mealTiming: {
      mealCount: 5,
      preworkoutTiming: '1.5 hours before - high carb meal',
      postworkoutTiming: 'Protein shake immediately, meal within 1 hour',
    },
    status: 'active',
    startDate: '2024-08-01',
    trainerNotes: 'James handles carbs well. Can push surplus higher if weight stalls.',
  },
  {
    id: 'nutrition-003',
    trainerId: 'trainer-001',
    clientId: 'client-003',
    name: 'Metabolic Health Focus',
    description: 'Moderate deficit with focus on blood sugar management',
    goal: 'deficit',
    calculatedTDEE: 2400,
    activityMultiplier: 1.375,
    calorieAdjustment: -600,
    targetCalories: 1800,
    macroSplit: {
      proteinPercent: 30,
      carbsPercent: 35,
      fatPercent: 35,
    },
    macroTargets: {
      calories: 1800,
      protein: 135,
      carbs: 158,
      fat: 70,
      fiber: 35,
      sugar: 40,
    },
    mealTiming: {
      mealCount: 4,
      notes: 'Spread carbs evenly throughout day. Avoid large carb meals. Always pair carbs with protein.',
    },
    dietaryRestrictions: [],
    allergies: [],
    preferredFoods: ['Salmon', 'Vegetables', 'Nuts'],
    avoidFoods: ['White bread', 'Sugary drinks', 'Processed foods'],
    status: 'active',
    startDate: '2024-11-01',
    trainerNotes: 'A1C is 7.1 - prioritize low glycemic foods. Work with his doctor on medication timing.',
  },
];

// ============================================
// BODY MEASUREMENTS
// ============================================

export const mockBodyMeasurements: BodyMeasurement[] = [
  // Sarah's measurements over time
  {
    id: 'bm-001',
    clientId: 'client-001',
    date: '2024-09-15',
    weight: 185,
    bodyFatPercent: 32,
    waist: 34,
    hips: 42,
    measurementMethod: 'tape',
  },
  {
    id: 'bm-002',
    clientId: 'client-001',
    date: '2024-10-15',
    weight: 178,
    bodyFatPercent: 30,
    waist: 33,
    hips: 41,
    measurementMethod: 'tape',
  },
  {
    id: 'bm-003',
    clientId: 'client-001',
    date: '2024-11-15',
    weight: 172,
    bodyFatPercent: 29,
    waist: 32,
    hips: 40.5,
    measurementMethod: 'tape',
  },
  {
    id: 'bm-004',
    clientId: 'client-001',
    date: '2024-12-12',
    weight: 168,
    bodyFatPercent: 28,
    waist: 31.5,
    hips: 40,
    measurementMethod: 'tape',
    notes: 'Great progress! Down 17 lbs total.',
  },
  // James's measurements
  {
    id: 'bm-005',
    clientId: 'client-002',
    date: '2024-06-01',
    weight: 165,
    bodyFatPercent: 12,
    chest: 40,
    leftBicep: 14.5,
    rightBicep: 14.5,
    measurementMethod: 'tape',
  },
  {
    id: 'bm-006',
    clientId: 'client-002',
    date: '2024-12-13',
    weight: 182,
    bodyFatPercent: 14,
    chest: 43,
    leftBicep: 15.75,
    rightBicep: 16,
    measurementMethod: 'tape',
    notes: 'Excellent lean mass gain. +17 lbs with only 2% body fat increase.',
  },
  // Michael's measurements
  {
    id: 'bm-007',
    clientId: 'client-003',
    date: '2024-11-01',
    weight: 235,
    bodyFatPercent: 34,
    waist: 42,
    measurementMethod: 'scale',
  },
  {
    id: 'bm-008',
    clientId: 'client-003',
    date: '2024-12-11',
    weight: 228,
    bodyFatPercent: 32,
    waist: 41,
    measurementMethod: 'scale',
    notes: 'Down 7 lbs in 6 weeks. Doctor happy with progress.',
  },
];

// ============================================
// STRENGTH RECORDS
// ============================================

export const mockStrengthRecords: StrengthRecord[] = [
  // James's PRs
  {
    id: 'sr-001',
    clientId: 'client-002',
    exerciseId: 'barbell-bench-press',
    exerciseName: 'Barbell Bench Press',
    date: '2024-12-10',
    weight: 275,
    reps: 3,
    estimated1RM: 302,
    isPersonalRecord: true,
    previousRecord: 285,
    notes: 'Clean reps, no spot needed',
  },
  {
    id: 'sr-002',
    clientId: 'client-002',
    exerciseId: 'barbell-squat',
    exerciseName: 'Barbell Back Squat',
    date: '2024-12-08',
    weight: 365,
    reps: 5,
    estimated1RM: 426,
    isPersonalRecord: true,
    previousRecord: 405,
  },
  {
    id: 'sr-003',
    clientId: 'client-002',
    exerciseId: 'deadlift',
    exerciseName: 'Conventional Deadlift',
    date: '2024-11-28',
    weight: 455,
    reps: 2,
    estimated1RM: 486,
    isPersonalRecord: true,
    previousRecord: 475,
  },
  // Sarah's PRs
  {
    id: 'sr-004',
    clientId: 'client-001',
    exerciseId: 'dumbbell-bench-press',
    exerciseName: 'Dumbbell Bench Press',
    date: '2024-12-05',
    weight: 40,
    reps: 8,
    estimated1RM: 51,
    isPersonalRecord: true,
    previousRecord: 45,
  },
  {
    id: 'sr-005',
    clientId: 'client-001',
    exerciseId: 'romanian-deadlift',
    exerciseName: 'Romanian Deadlift',
    date: '2024-12-10',
    weight: 95,
    reps: 10,
    estimated1RM: 127,
    isPersonalRecord: true,
    previousRecord: 115,
  },
  // David's PRs
  {
    id: 'sr-006',
    clientId: 'client-005',
    exerciseId: 'barbell-squat',
    exerciseName: 'Barbell Back Squat',
    date: '2024-12-12',
    weight: 315,
    reps: 3,
    estimated1RM: 347,
    isPersonalRecord: true,
    previousRecord: 335,
    notes: 'Hit depth on all reps',
  },
];

// ============================================
// FORM CHECKS
// ============================================

export const mockFormChecks: FormCheck[] = [
  {
    id: 'fc-001',
    clientId: 'client-001',
    clientName: 'Sarah Johnson',
    trainerId: 'trainer-001',
    exerciseId: 'romanian-deadlift',
    exerciseName: 'Romanian Deadlift',
    videoUrl: '/videos/sarah-rdl.mp4',
    durationSeconds: 32,
    recordedDate: '2024-12-12',
    clientQuestion: 'Am I going deep enough? I feel like I round my back at the bottom.',
    weight: 85,
    reps: 8,
    concernAreas: ['lower_back', 'depth'],
    status: 'pending',
    submittedAt: '2024-12-12T18:30:00Z',
  },
  {
    id: 'fc-002',
    clientId: 'client-003',
    clientName: 'Michael Davis',
    trainerId: 'trainer-001',
    exerciseId: 'leg-press',
    exerciseName: 'Leg Press',
    videoUrl: '/videos/michael-legpress.mp4',
    durationSeconds: 28,
    recordedDate: '2024-12-11',
    clientQuestion: 'Is my depth okay? Knees feel a bit off.',
    weight: 180,
    reps: 12,
    concernAreas: ['knee_tracking', 'depth'],
    status: 'pending',
    submittedAt: '2024-12-11T19:15:00Z',
  },
  {
    id: 'fc-003',
    clientId: 'client-003',
    clientName: 'Michael Davis',
    trainerId: 'trainer-001',
    exerciseId: 'lat-pulldown',
    exerciseName: 'Lat Pulldown',
    videoUrl: '/videos/michael-pulldown.mp4',
    durationSeconds: 24,
    recordedDate: '2024-12-11',
    weight: 90,
    reps: 10,
    status: 'pending',
    submittedAt: '2024-12-11T19:20:00Z',
  },
  {
    id: 'fc-004',
    clientId: 'client-005',
    clientName: 'David Kim',
    trainerId: 'trainer-001',
    exerciseId: 'barbell-squat',
    exerciseName: 'Barbell Back Squat',
    videoUrl: '/videos/david-squat.mp4',
    durationSeconds: 45,
    recordedDate: '2024-12-10',
    clientQuestion: 'Checking if my depth is competition legal',
    weight: 315,
    reps: 3,
    concernAreas: ['depth'],
    status: 'reviewed',
    submittedAt: '2024-12-10T20:00:00Z',
    reviewedAt: '2024-12-11T09:30:00Z',
    overallRating: 4,
    feedback: 'Depth is good - parallel on all reps. Watch your knee cave on the 3rd rep. Think about pushing knees out as you drive up.',
    timestampNotes: [
      { timeSeconds: 8, note: 'Good depth here', type: 'positive' },
      { timeSeconds: 26, note: 'Slight knee cave - focus on driving knees out', type: 'correction' },
      { timeSeconds: 38, note: 'Strong lockout', type: 'positive' },
    ],
    correctionPriority: 'minor',
    suggestedDrills: ['Banded squats for knee cave', 'Pause squats'],
  },
];

// ============================================
// GOALS
// ============================================

export const mockGoals: Goal[] = [
  // Sarah's goals
  {
    id: 'goal-001',
    clientId: 'client-001',
    type: 'weight_loss',
    title: 'Reach 155 lbs',
    description: 'Get to goal weight of 155 lbs',
    targetValue: 155,
    targetUnit: 'lbs',
    startDate: '2024-09-15',
    targetDate: '2025-03-15',
    startingValue: 185,
    currentValue: 168,
    progressPercent: 57,
    status: 'in_progress',
    milestones: [
      { value: 180, description: 'First 5 lbs', isAchieved: true, achievedDate: '2024-09-28' },
      { value: 175, description: 'Down 10 lbs', isAchieved: true, achievedDate: '2024-10-20' },
      { value: 170, description: 'Down 15 lbs', isAchieved: true, achievedDate: '2024-11-18' },
      { value: 165, description: 'Down 20 lbs', isAchieved: false },
      { value: 160, description: 'Down 25 lbs', isAchieved: false },
      { value: 155, description: 'Goal achieved!', isAchieved: false },
    ],
    trainerNotes: 'On track! Averaging 1.5 lbs/week. May reach goal early.',
  },
  {
    id: 'goal-002',
    clientId: 'client-001',
    type: 'strength_reps',
    title: 'Do 5 unassisted pull-ups',
    description: 'Achieve 5 strict pull-ups without band assistance',
    targetValue: 5,
    targetUnit: 'reps',
    exerciseId: 'pull-up',
    exerciseName: 'Pull-Up',
    startDate: '2024-09-15',
    targetDate: '2025-01-15',
    startingValue: 0,
    currentValue: 2,
    progressPercent: 40,
    status: 'in_progress',
    trainerNotes: 'Started on green band, now doing 2 strict. Add negatives to speed up progress.',
  },
  // James's goals
  {
    id: 'goal-003',
    clientId: 'client-002',
    type: 'strength_1rm',
    title: '315 lb Bench Press',
    description: 'Achieve a 315 lb 1RM bench press',
    targetValue: 315,
    targetUnit: 'lbs',
    exerciseId: 'barbell-bench-press',
    exerciseName: 'Barbell Bench Press',
    startDate: '2024-06-01',
    targetDate: '2025-06-01',
    startingValue: 245,
    currentValue: 302,
    progressPercent: 81,
    status: 'in_progress',
    milestones: [
      { value: 255, description: '255 lbs', isAchieved: true, achievedDate: '2024-07-15' },
      { value: 275, description: '275 lbs', isAchieved: true, achievedDate: '2024-09-20' },
      { value: 295, description: '295 lbs', isAchieved: true, achievedDate: '2024-11-10' },
      { value: 315, description: '3 plates!', isAchieved: false },
    ],
    trainerNotes: 'Excellent progress. 315 is within reach by February at this rate.',
  },
  {
    id: 'goal-004',
    clientId: 'client-002',
    type: 'weight_gain',
    title: 'Reach 190 lbs lean',
    description: 'Hit 190 lbs while staying under 15% body fat',
    targetValue: 190,
    targetUnit: 'lbs',
    startDate: '2024-06-01',
    targetDate: '2025-06-01',
    startingValue: 165,
    currentValue: 182,
    progressPercent: 68,
    status: 'in_progress',
  },
  // Michael's goals
  {
    id: 'goal-005',
    clientId: 'client-003',
    type: 'weight_loss',
    title: 'Reach 200 lbs',
    description: 'Doctor recommended losing 35 lbs',
    targetValue: 200,
    targetUnit: 'lbs',
    startDate: '2024-11-01',
    targetDate: '2025-06-01',
    startingValue: 235,
    currentValue: 228,
    progressPercent: 20,
    status: 'in_progress',
    trainerNotes: 'Good start. Focus on consistency and building exercise habit.',
  },
  {
    id: 'goal-006',
    clientId: 'client-003',
    type: 'habit',
    title: 'Complete 3 workouts per week',
    description: 'Build consistent workout habit - 12 sessions per month',
    targetValue: 12,
    targetUnit: 'sessions/month',
    startDate: '2024-11-01',
    targetDate: '2025-02-01',
    startingValue: 0,
    currentValue: 9,
    progressPercent: 75,
    status: 'in_progress',
    trainerNotes: 'December looking better. Missed some in November but improving.',
  },
];

// ============================================
// MESSAGES
// ============================================

export const mockTrainerMessages: TrainerMessage[] = [
  {
    id: 'msg-001',
    clientId: 'client-002',
    clientName: 'James Chen',
    preview: 'Hit 275x3 on bench today! Check out...',
    fullText: 'Hit 275x3 on bench today! Check out this video. I think form was solid but wanted your take on rep 2.',
    time: '2h ago',
    timestamp: '2024-12-14T10:30:00Z',
    isUrgent: false,
    unread: true,
    category: 'workout',
    attachments: [{ type: 'video', url: '/videos/james-bench.mp4', name: 'bench-pr.mp4' }],
  },
  {
    id: 'msg-002',
    clientId: 'client-002',
    clientName: 'James Chen',
    preview: 'Also wanted to ask about adding more...',
    fullText: 'Also wanted to ask about adding more arm volume. My biceps seem to be lagging behind. What do you think about adding a dedicated arm day?',
    time: '1h ago',
    timestamp: '2024-12-14T11:30:00Z',
    isUrgent: false,
    unread: true,
    category: 'workout',
  },
  {
    id: 'msg-003',
    clientId: 'client-003',
    clientName: 'Michael Davis',
    preview: 'Feeling dizzy during leg press...',
    fullText: 'Feeling dizzy during leg press yesterday. Happened on the last 2 sets. Should I be concerned? I had lunch about 2 hours before.',
    time: '4h ago',
    timestamp: '2024-12-14T08:15:00Z',
    isUrgent: true,
    unread: true,
    category: 'workout',
  },
  {
    id: 'msg-004',
    clientId: 'client-005',
    clientName: 'David Kim',
    preview: 'Thanks for the feedback on my squat...',
    fullText: 'Thanks for the feedback on my squat form check! I\'ll work on those banded squats you suggested. Should I do them as part of warmup or separate?',
    time: '6h ago',
    timestamp: '2024-12-14T06:00:00Z',
    isUrgent: false,
    unread: true,
    category: 'form_check',
  },
  {
    id: 'msg-005',
    clientId: 'client-008',
    clientName: 'Lisa Thompson',
    preview: 'Need to reschedule Thursday...',
    fullText: 'Need to reschedule Thursday\'s session - work meeting came up. Can we do Friday morning instead?',
    time: '1d ago',
    timestamp: '2024-12-13T14:00:00Z',
    isUrgent: false,
    unread: true,
    category: 'scheduling',
  },
  {
    id: 'msg-006',
    clientId: 'client-001',
    clientName: 'Sarah Johnson',
    preview: 'Down another 2 lbs this week!...',
    fullText: 'Down another 2 lbs this week! That\'s 17 total now. I\'m so happy with the progress. Also hit 40s on DB bench press - felt strong!',
    time: '1d ago',
    timestamp: '2024-12-13T19:30:00Z',
    isUrgent: false,
    unread: false,
    category: 'progress',
  },
  {
    id: 'msg-007',
    clientId: 'client-004',
    clientName: 'Emily Rodriguez',
    preview: 'Great session today! Quick question...',
    fullText: 'Great session today! Quick question - for the hip thrusts, is it normal to feel it more in my quads than glutes? Might be doing something wrong.',
    time: '2d ago',
    timestamp: '2024-12-12T17:45:00Z',
    isUrgent: false,
    unread: false,
    category: 'workout',
  },
];

// ============================================
// SCHEDULED SESSIONS
// ============================================

export const mockScheduledSessions: ScheduledSession[] = [
  {
    id: 'sched-001',
    clientId: 'client-002',
    clientName: 'James Chen',
    date: '2024-12-14',
    time: '06:00',
    duration: 75,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    notes: 'Push Day A - testing bench 1RM today',
    status: 'confirmed',
  },
  {
    id: 'sched-002',
    clientId: 'client-007',
    clientName: 'Ryan Martinez',
    date: '2024-12-14',
    time: '08:00',
    duration: 60,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    notes: 'Athletic performance - speed work',
    status: 'confirmed',
  },
  {
    id: 'sched-003',
    clientId: 'client-005',
    clientName: 'David Kim',
    date: '2024-12-14',
    time: '17:00',
    duration: 60,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    status: 'scheduled',
  },
  {
    id: 'sched-004',
    clientId: 'client-001',
    clientName: 'Sarah Johnson',
    date: '2024-12-15',
    time: '09:00',
    duration: 60,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    notes: 'Upper Body Push',
    status: 'scheduled',
  },
  {
    id: 'sched-005',
    clientId: 'client-004',
    clientName: 'Emily Rodriguez',
    date: '2024-12-15',
    time: '11:00',
    duration: 60,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    status: 'scheduled',
  },
  {
    id: 'sched-006',
    clientId: 'client-003',
    clientName: 'Michael Davis',
    date: '2024-12-16',
    time: '10:00',
    duration: 45,
    type: 'check_in',
    location: 'virtual',
    locationDetails: 'Zoom',
    notes: 'Bi-weekly check-in - review progress, discuss dizziness concern',
    status: 'scheduled',
  },
  {
    id: 'sched-007',
    clientId: 'client-006',
    clientName: 'Amanda Foster',
    date: '2024-12-17',
    time: '18:00',
    duration: 45,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    notes: 'Full Body - focus on form',
    status: 'scheduled',
  },
  {
    id: 'sched-008',
    clientId: 'client-008',
    clientName: 'Lisa Thompson',
    date: '2024-12-18',
    time: '07:00',
    duration: 60,
    type: 'training',
    location: 'in_person',
    locationDetails: 'Iron Temple Fitness - Main Floor',
    status: 'scheduled',
  },
];

// ============================================
// DAILY NUTRITION (Sample for Sarah)
// ============================================

export const mockDailyNutrition: DailyNutrition[] = [
  {
    clientId: 'client-001',
    date: '2024-12-13',
    caloriesConsumed: 1580,
    proteinConsumed: 145,
    carbsConsumed: 132,
    fatConsumed: 52,
    fiberConsumed: 28,
    waterIntake: 80,
    targets: {
      calories: 1600,
      protein: 140,
      carbs: 140,
      fat: 53,
      fiber: 25,
    },
    caloriesAdherence: 99,
    proteinAdherence: 104,
    carbsAdherence: 94,
    fatAdherence: 98,
    meals: [],
    isComplete: true,
  },
  {
    clientId: 'client-001',
    date: '2024-12-12',
    caloriesConsumed: 1720,
    proteinConsumed: 138,
    carbsConsumed: 165,
    fatConsumed: 58,
    fiberConsumed: 22,
    waterIntake: 64,
    targets: {
      calories: 1600,
      protein: 140,
      carbs: 140,
      fat: 53,
      fiber: 25,
    },
    caloriesAdherence: 108,
    proteinAdherence: 99,
    carbsAdherence: 118,
    fatAdherence: 109,
    meals: [],
    isComplete: true,
    trainerNote: 'Slightly over on carbs and calories - just stay mindful. One day won\'t hurt!',
  },
];

// ============================================
// SHARING PREFERENCES
// ============================================

export const mockSharingPreferences: SharingPreferences[] = [
  {
    id: 'share-001',
    userId: 'client-001',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    connectedToTrainer: true,
    trainerSharing: {
      workouts: true,
      nutrition: true,
      bodyMetrics: true,
      progressPhotos: true,
      formChecks: true,
      goals: true,
      bloodwork: true,
      medications: false,
      supplements: true,
      activity: true,
      sleep: true,
    },
    doctorId: 'doctor-001',
    doctorName: 'Dr. James Wilson',
    connectedToDoctor: true,
    doctorSharing: {
      workouts: false,
      nutrition: true,
      bodyMetrics: true,
      progressPhotos: false,
      goals: true,
      supplements: true,
      activity: true,
      sleep: true,
    },
  },
  {
    id: 'share-002',
    userId: 'client-002',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    connectedToTrainer: true,
    trainerSharing: {
      workouts: true,
      nutrition: true,
      bodyMetrics: true,
      progressPhotos: true,
      formChecks: true,
      goals: true,
      bloodwork: false,
      medications: false,
      supplements: true,
      activity: true,
      sleep: false,
    },
    connectedToDoctor: false,
    doctorSharing: {
      workouts: false,
      nutrition: false,
      bodyMetrics: false,
      progressPhotos: false,
      goals: false,
      supplements: false,
      activity: false,
      sleep: false,
    },
  },
  {
    id: 'share-003',
    userId: 'client-003',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    connectedToTrainer: true,
    trainerSharing: {
      workouts: true,
      nutrition: true,
      bodyMetrics: true,
      progressPhotos: false,
      formChecks: true,
      goals: true,
      bloodwork: true,
      medications: true,
      supplements: true,
      activity: true,
      sleep: true,
    },
    doctorId: 'doctor-001',
    doctorName: 'Dr. James Wilson',
    connectedToDoctor: true,
    doctorSharing: {
      workouts: true,
      nutrition: true,
      bodyMetrics: true,
      progressPhotos: false,
      goals: true,
      supplements: true,
      activity: true,
      sleep: true,
    },
  },
];

// ============================================
// DAILY PROGRAMS (Today's Program feature)
// ============================================

// Get today's date in ISO format
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const mockDailyPrograms: DailyProgram[] = [
  {
    id: 'dp-001',
    trainerId: 'trainer-001',
    name: 'HIIT Cardio',
    description: 'High intensity interval training - get your heart pumping!',
    date: today,
    exercises: [
      {
        id: 'de-001',
        exerciseId: 'jumping-jacks',
        name: 'Jumping Jacks',
        order: 1,
        duration: 30,
        sets: 3,
        restPeriod: 15,
        notes: 'Warm up, get the blood flowing',
      },
      {
        id: 'de-002',
        exerciseId: 'burpees',
        name: 'Burpees',
        order: 2,
        reps: '10',
        sets: 4,
        restPeriod: 45,
        notes: 'Full range of motion, chest to ground',
      },
      {
        id: 'de-003',
        exerciseId: 'mountain-climbers',
        name: 'Mountain Climbers',
        order: 3,
        duration: 30,
        sets: 3,
        restPeriod: 30,
      },
      {
        id: 'de-004',
        exerciseId: 'squat-jumps',
        name: 'Squat Jumps',
        order: 4,
        reps: '15',
        sets: 3,
        restPeriod: 45,
        notes: 'Explode up, soft landing',
      },
      {
        id: 'de-005',
        exerciseId: 'high-knees',
        name: 'High Knees',
        order: 5,
        duration: 30,
        sets: 3,
        restPeriod: 20,
      },
      {
        id: 'de-006',
        exerciseId: 'plank',
        name: 'Plank Hold',
        order: 6,
        duration: 45,
        sets: 3,
        restPeriod: 30,
        notes: 'Keep core tight, don\'t let hips sag',
      },
    ],
    assignedClientIds: ['client-001', 'client-004', 'client-007'],
    selfJoinedClientIds: ['client-002'],
    isPublic: true,
    maxParticipants: 12,
    status: 'published',
    createdAt: '2024-12-13T20:00:00Z',
  },
  {
    id: 'dp-002',
    trainerId: 'trainer-001',
    name: 'Upper Body Push',
    description: 'Focus on chest, shoulders, and triceps - exercises grouped into supersets',
    date: today,
    exercises: [
      // Group A - Chest compound
      {
        id: 'de-011',
        exerciseId: 'barbell-bench-press',
        name: 'Barbell Bench Press',
        order: 1,
        group: 'A',
        sets: 4,
        reps: '6-8',
        weight: 'heavy',
        restPeriod: 90,
        notes: 'Primary compound - focus on form',
      },
      {
        id: 'de-012',
        exerciseId: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        order: 2,
        group: 'A',
        sets: 4,
        reps: '8-10',
        weight: 'moderate',
        restPeriod: 90,
        notes: 'Superset with bench press',
      },
      // Group B - Shoulders
      {
        id: 'de-013',
        exerciseId: 'overhead-press',
        name: 'Overhead Press',
        order: 3,
        group: 'B',
        sets: 3,
        reps: '8-10',
        weight: 'moderate',
        restPeriod: 60,
      },
      {
        id: 'de-014',
        exerciseId: 'lateral-raise',
        name: 'Lateral Raises',
        order: 4,
        group: 'B',
        sets: 3,
        reps: '12-15',
        weight: 'light',
        restPeriod: 60,
        notes: 'Control the negative',
      },
      {
        id: 'de-017',
        exerciseId: 'front-raise',
        name: 'Front Raises',
        order: 5,
        group: 'B',
        sets: 3,
        reps: '12-15',
        weight: 'light',
        restPeriod: 60,
      },
      // Group C - Triceps finisher
      {
        id: 'de-015',
        exerciseId: 'tricep-pushdown',
        name: 'Tricep Pushdowns',
        order: 6,
        group: 'C',
        sets: 3,
        reps: '12-15',
        restPeriod: 45,
      },
      {
        id: 'de-016',
        exerciseId: 'tricep-dip',
        name: 'Dips',
        order: 7,
        group: 'C',
        sets: 3,
        reps: 'AMRAP',
        restPeriod: 45,
        notes: 'Assisted if needed',
      },
    ],
    assignedClientIds: ['client-002', 'client-005'],
    selfJoinedClientIds: [],
    isPublic: false,
    status: 'published',
    createdAt: '2024-12-13T20:30:00Z',
  },
  {
    id: 'dp-003',
    trainerId: 'trainer-001',
    name: 'Beginner Full Body',
    description: 'Intro workout for newer clients - machine focused',
    date: today,
    exercises: [
      {
        id: 'de-021',
        exerciseId: 'leg-press',
        name: 'Leg Press',
        order: 1,
        sets: 3,
        reps: '12-15',
        restPeriod: 90,
        notes: 'Keep lower back against pad',
      },
      {
        id: 'de-022',
        exerciseId: 'chest-press-machine',
        name: 'Chest Press Machine',
        order: 2,
        sets: 3,
        reps: '12-15',
        restPeriod: 90,
      },
      {
        id: 'de-023',
        exerciseId: 'lat-pulldown',
        name: 'Lat Pulldown',
        order: 3,
        sets: 3,
        reps: '12-15',
        restPeriod: 90,
      },
      {
        id: 'de-024',
        exerciseId: 'seated-leg-curl',
        name: 'Seated Leg Curl',
        order: 4,
        sets: 3,
        reps: '12-15',
        restPeriod: 60,
      },
      {
        id: 'de-025',
        exerciseId: 'plank',
        name: 'Plank',
        order: 5,
        duration: 30,
        sets: 3,
        restPeriod: 60,
      },
    ],
    assignedClientIds: ['client-003', 'client-006'],
    selfJoinedClientIds: [],
    isPublic: true,
    maxParticipants: 6,
    status: 'published',
    createdAt: '2024-12-13T21:00:00Z',
  },
  {
    id: 'dp-004',
    trainerId: 'trainer-001',
    name: 'Lower Body',
    description: 'Leg day - quads, hamstrings, glutes',
    date: today,
    exercises: [
      {
        id: 'de-031',
        exerciseId: 'barbell-squat',
        name: 'Barbell Back Squat',
        order: 1,
        sets: 4,
        reps: '6-8',
        weight: 'heavy',
        restPeriod: 180,
        notes: 'Hit depth, drive through heels',
      },
      {
        id: 'de-032',
        exerciseId: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        order: 2,
        sets: 4,
        reps: '8-10',
        weight: 'moderate',
        restPeriod: 120,
        notes: 'Feel the stretch in hamstrings',
      },
      {
        id: 'de-033',
        exerciseId: 'walking-lunge',
        name: 'Walking Lunges',
        order: 3,
        sets: 3,
        reps: '12 each leg',
        restPeriod: 90,
      },
      {
        id: 'de-034',
        exerciseId: 'leg-extension',
        name: 'Leg Extension',
        order: 4,
        sets: 3,
        reps: '12-15',
        restPeriod: 60,
      },
      {
        id: 'de-035',
        exerciseId: 'seated-leg-curl',
        name: 'Leg Curl',
        order: 5,
        sets: 3,
        reps: '12-15',
        restPeriod: 60,
      },
      {
        id: 'de-036',
        exerciseId: 'calf-raise',
        name: 'Standing Calf Raises',
        order: 6,
        sets: 4,
        reps: '15-20',
        restPeriod: 45,
      },
    ],
    assignedClientIds: ['client-001', 'client-004', 'client-008'],
    selfJoinedClientIds: ['client-005'],
    isPublic: true,
    maxParticipants: 10,
    status: 'published',
    createdAt: '2024-12-13T21:30:00Z',
  },
  {
    id: 'dp-005',
    trainerId: 'trainer-001',
    name: 'Core & Conditioning',
    description: 'Active recovery day focusing on conditioning',
    date: tomorrow,
    exercises: [
      {
        id: 'de-041',
        name: 'Treadmill Warm-up',
        order: 1,
        duration: 300,
        notes: 'Light jog or incline walk',
      },
      {
        id: 'de-042',
        exerciseId: 'bicycle-crunch',
        name: 'Bicycle Crunches',
        order: 2,
        sets: 3,
        reps: '20 each side',
        restPeriod: 30,
      },
      {
        id: 'de-043',
        exerciseId: 'russian-twist',
        name: 'Russian Twists',
        order: 3,
        sets: 3,
        reps: '20',
        restPeriod: 30,
      },
      {
        id: 'de-044',
        exerciseId: 'plank',
        name: 'Plank',
        order: 4,
        duration: 60,
        sets: 3,
        restPeriod: 30,
      },
      {
        id: 'de-045',
        name: 'Rowing Machine',
        order: 5,
        duration: 600,
        notes: '10 min steady state cardio',
      },
    ],
    assignedClientIds: [],
    selfJoinedClientIds: [],
    isPublic: true,
    maxParticipants: 15,
    status: 'draft',
    createdAt: '2024-12-14T08:00:00Z',
  },
];

// ============================================
// CUSTOM EXERCISES (Trainer-created)
// ============================================

export const mockCustomExercises: CustomExercise[] = [
  {
    id: 'custom-001',
    trainerId: 'trainer-001',
    name: 'Band Pull-Aparts',
    description: 'Shoulder warm-up with resistance band',
    muscleGroups: ['shoulders', 'back'],
    equipment: ['resistance_bands'],
    createdAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'custom-002',
    trainerId: 'trainer-001',
    name: 'Banded Squats',
    description: 'Squats with resistance band above knees for glute activation',
    muscleGroups: ['glutes', 'quadriceps'],
    equipment: ['resistance_bands', 'bodyweight'],
    createdAt: '2024-11-20T14:30:00Z',
  },
  {
    id: 'custom-003',
    trainerId: 'trainer-001',
    name: 'Farmer Carry',
    description: 'Walk with heavy dumbbells at sides',
    muscleGroups: ['forearms', 'core', 'traps'],
    equipment: ['dumbbell'],
    createdAt: '2024-12-01T09:00:00Z',
  },
  {
    id: 'custom-004',
    trainerId: 'trainer-001',
    name: 'Pause Squats',
    description: '3-second pause at bottom of squat',
    muscleGroups: ['quadriceps', 'glutes'],
    equipment: ['barbell', 'squat_rack'],
    createdAt: '2024-12-05T11:00:00Z',
  },
];

// ============================================
// AGGREGATE EXPORT
// ============================================

export const mockTrainerData: TrainerData = {
  trainer: mockTrainerProfile,
  clients: mockClients,
  messages: mockTrainerMessages,
  sessions: mockScheduledSessions,
};

// Helper function to get client by ID
export function getClientById(clientId: string): ClientSummary | undefined {
  return mockClients.find(c => c.id === clientId);
}

// Helper function to get program by ID
export function getProgramById(programId: string): WorkoutProgram | undefined {
  return mockPrograms.find(p => p.id === programId);
}

// Helper function to get client's program
export function getClientProgram(clientId: string): WorkoutProgram | undefined {
  const client = getClientById(clientId);
  if (!client?.currentProgramId) return undefined;
  return getProgramById(client.currentProgramId);
}

// Helper function to get client's nutrition plan
export function getClientNutritionPlan(clientId: string): NutritionPlan | undefined {
  const client = getClientById(clientId);
  if (!client?.currentNutritionPlanId) return undefined;
  return mockNutritionPlans.find(p => p.id === client.currentNutritionPlanId);
}

// Helper function to get client's body measurements
export function getClientMeasurements(clientId: string): BodyMeasurement[] {
  return mockBodyMeasurements.filter(m => m.clientId === clientId);
}

// Helper function to get client's strength records
export function getClientStrengthRecords(clientId: string): StrengthRecord[] {
  return mockStrengthRecords.filter(r => r.clientId === clientId);
}

// Helper function to get client's form checks
export function getClientFormChecks(clientId: string): FormCheck[] {
  return mockFormChecks.filter(f => f.clientId === clientId);
}

// Helper function to get client's goals
export function getClientGoals(clientId: string): Goal[] {
  return mockGoals.filter(g => g.clientId === clientId);
}

// Helper function to get pending form checks
export function getPendingFormChecks(): FormCheck[] {
  return mockFormChecks.filter(f => f.status === 'pending');
}

// Helper function to get unread messages
export function getUnreadMessages(): TrainerMessage[] {
  return mockTrainerMessages.filter(m => m.unread);
}

// Helper function to get today's sessions
export function getTodaySessions(): ScheduledSession[] {
  const today = new Date().toISOString().split('T')[0];
  return mockScheduledSessions.filter(s => s.date === today);
}

// Helper function to get clients needing attention (low adherence or pending items)
export function getClientsNeedingAttention(): ClientSummary[] {
  return mockClients.filter(c =>
    c.programAdherence < 70 ||
    c.nutritionAdherence < 60 ||
    c.pendingFormChecks > 0 ||
    c.unreadMessages > 0
  );
}

// ============================================
// DAILY PROGRAM HELPERS
// ============================================

// Helper function to get today's daily programs
export function getTodaysDailyPrograms(): DailyProgram[] {
  const todayDate = new Date().toISOString().split('T')[0];
  return mockDailyPrograms.filter(p => p.date === todayDate);
}

// Helper function to get a daily program by ID
export function getDailyProgramById(programId: string): DailyProgram | undefined {
  return mockDailyPrograms.find(p => p.id === programId);
}

// Helper function to get daily programs for a specific date
export function getDailyProgramsByDate(date: string): DailyProgram[] {
  return mockDailyPrograms.filter(p => p.date === date);
}

// Helper function to get all participants of a program
export function getProgramParticipants(programId: string): ClientSummary[] {
  const program = getDailyProgramById(programId);
  if (!program) return [];

  const allClientIds = [...program.assignedClientIds, ...program.selfJoinedClientIds];
  return mockClients.filter(c => allClientIds.includes(c.id));
}

// Helper function to check if a client is in a program
export function isClientInProgram(clientId: string, programId: string): boolean {
  const program = getDailyProgramById(programId);
  if (!program) return false;

  return program.assignedClientIds.includes(clientId) ||
         program.selfJoinedClientIds.includes(clientId);
}

// Helper function to get programs a client is participating in
export function getClientDailyPrograms(clientId: string, date?: string): DailyProgram[] {
  const programs = date ? getDailyProgramsByDate(date) : mockDailyPrograms;
  return programs.filter(p =>
    p.assignedClientIds.includes(clientId) ||
    p.selfJoinedClientIds.includes(clientId)
  );
}

// Helper function to get public programs a client can join
export function getAvailablePrograms(clientId: string, date?: string): DailyProgram[] {
  const todayDate = date || new Date().toISOString().split('T')[0];
  return mockDailyPrograms.filter(p =>
    p.date === todayDate &&
    p.isPublic &&
    p.status === 'published' &&
    !p.assignedClientIds.includes(clientId) &&
    !p.selfJoinedClientIds.includes(clientId) &&
    (p.maxParticipants === undefined ||
     (p.assignedClientIds.length + p.selfJoinedClientIds.length) < p.maxParticipants)
  );
}

// Helper function to get custom exercises for a trainer
export function getCustomExercises(trainerId: string): CustomExercise[] {
  return mockCustomExercises.filter(e => e.trainerId === trainerId);
}

// ============================================
// COMPLETED PROGRAM WORKOUTS (Device Linking)
// ============================================

export const mockCompletedProgramWorkouts: CompletedProgramWorkout[] = [
  // Sarah's completed workouts - linked to programs
  {
    id: 'cpw-001',
    clientId: 'client-001',
    dailyProgramId: 'dp-001',
    dailyProgramName: 'HIIT Cardio',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    deviceWorkoutId: 'w-s-001',
    date: '2024-12-13',
    startTime: '07:15',
    endTime: '08:02',
    duration: 47,
    caloriesBurned: 380,
    averageHeartRate: 145,
    maxHeartRate: 172,
    source: 'device',
    deviceType: 'apple_health',
    status: 'linked',
    linkedAt: '2024-12-13T08:05:00Z',
    rating: 4,
    notes: 'Felt great! Burpees were tough but pushed through.',
  },
  {
    id: 'cpw-002',
    clientId: 'client-001',
    dailyProgramId: 'dp-004',
    dailyProgramName: 'Lower Body',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    deviceWorkoutId: 'w-s-002',
    date: '2024-12-12',
    startTime: '18:30',
    endTime: '19:25',
    duration: 55,
    caloriesBurned: 320,
    averageHeartRate: 128,
    maxHeartRate: 155,
    source: 'device',
    deviceType: 'apple_health',
    status: 'linked',
    linkedAt: '2024-12-12T19:30:00Z',
    rating: 5,
    notes: 'Hit a PR on RDL!',
  },
  {
    id: 'cpw-003',
    clientId: 'client-001',
    deviceWorkoutId: 'w-s-003',
    date: '2024-12-11',
    startTime: '06:45',
    endTime: '07:20',
    duration: 35,
    caloriesBurned: 220,
    averageHeartRate: 138,
    source: 'device',
    deviceType: 'apple_health',
    status: 'skipped',
    notes: 'Just a morning walk, not a program workout',
  },
  // James's completed workouts
  {
    id: 'cpw-004',
    clientId: 'client-002',
    dailyProgramId: 'dp-002',
    dailyProgramName: 'Upper Body Push',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    deviceWorkoutId: 'w-j-001',
    date: '2024-12-13',
    startTime: '06:00',
    endTime: '07:15',
    duration: 75,
    caloriesBurned: 420,
    averageHeartRate: 135,
    maxHeartRate: 168,
    source: 'device',
    deviceType: 'fitbit',
    status: 'linked',
    linkedAt: '2024-12-13T07:20:00Z',
    rating: 5,
    notes: 'Great session - bench felt strong',
  },
  {
    id: 'cpw-005',
    clientId: 'client-002',
    dailyProgramId: 'dp-001',
    dailyProgramName: 'HIIT Cardio',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    deviceWorkoutId: 'w-j-002',
    date: '2024-12-12',
    startTime: '17:30',
    endTime: '18:15',
    duration: 45,
    caloriesBurned: 350,
    averageHeartRate: 152,
    maxHeartRate: 178,
    source: 'device',
    deviceType: 'fitbit',
    status: 'linked',
    linkedAt: '2024-12-12T18:20:00Z',
    rating: 4,
  },
  // Michael's completed workouts - fewer linked ones (lower adherence)
  {
    id: 'cpw-006',
    clientId: 'client-003',
    dailyProgramId: 'dp-003',
    dailyProgramName: 'Beginner Full Body',
    trainerId: 'trainer-001',
    trainerName: 'Marcus Thompson',
    deviceWorkoutId: 'w-m-001',
    date: '2024-12-11',
    startTime: '10:00',
    endTime: '10:42',
    duration: 42,
    caloriesBurned: 185,
    averageHeartRate: 118,
    maxHeartRate: 138,
    source: 'device',
    deviceType: 'fitbit',
    status: 'linked',
    linkedAt: '2024-12-11T10:45:00Z',
    rating: 3,
    notes: 'Felt a bit tired but finished it',
  },
  {
    id: 'cpw-007',
    clientId: 'client-003',
    deviceWorkoutId: 'w-m-002',
    date: '2024-12-10',
    startTime: '08:15',
    endTime: '08:45',
    duration: 30,
    caloriesBurned: 150,
    averageHeartRate: 105,
    source: 'device',
    deviceType: 'fitbit',
    status: 'skipped',
  },
];

// Pending workout links - workouts detected but not yet linked
export const mockPendingWorkoutLinks: PendingWorkoutLink[] = [
  // Sarah has a workout from today that needs linking
  {
    id: 'pwl-001',
    clientId: 'client-001',
    workout: {
      id: 'w-pending-001',
      date: new Date().toISOString().split('T')[0], // Today
      type: 'Strength Training',
      duration: 52,
      caloriesBurned: 340,
      averageHeartRate: 142,
      maxHeartRate: 165,
      source: 'apple_health',
    },
    suggestedProgramIds: ['dp-001', 'dp-004'], // HIIT Cardio and Lower Body
    detectedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    dismissed: false,
  },
  // Emily has a workout that needs linking
  {
    id: 'pwl-002',
    clientId: 'client-004',
    workout: {
      id: 'w-pending-002',
      date: new Date().toISOString().split('T')[0], // Today
      type: 'HIIT',
      duration: 38,
      caloriesBurned: 285,
      averageHeartRate: 155,
      maxHeartRate: 178,
      source: 'apple_health',
    },
    suggestedProgramIds: ['dp-001'], // HIIT Cardio
    detectedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    dismissed: false,
  },
];

// ============================================
// COMPLETED PROGRAM WORKOUT HELPERS
// ============================================

// Get completed workouts for a client
export function getClientCompletedWorkouts(clientId: string): CompletedProgramWorkout[] {
  return mockCompletedProgramWorkouts.filter(w => w.clientId === clientId);
}

// Get linked workouts for a client (excludes skipped)
export function getClientLinkedWorkouts(clientId: string): CompletedProgramWorkout[] {
  return mockCompletedProgramWorkouts.filter(
    w => w.clientId === clientId && w.status === 'linked'
  );
}

// Get completed workouts for a specific program
export function getProgramCompletedWorkouts(programId: string): CompletedProgramWorkout[] {
  return mockCompletedProgramWorkouts.filter(w => w.dailyProgramId === programId);
}

// Get pending workout links for a client
export function getClientPendingWorkoutLinks(clientId: string): PendingWorkoutLink[] {
  return mockPendingWorkoutLinks.filter(
    w => w.clientId === clientId && !w.dismissed
  );
}

// Check if a workout has already been linked
export function isWorkoutLinked(deviceWorkoutId: string): boolean {
  return mockCompletedProgramWorkouts.some(
    w => w.deviceWorkoutId === deviceWorkoutId && w.status === 'linked'
  );
}

// Get all pending links (for trainer dashboard)
export function getAllPendingWorkoutLinks(): PendingWorkoutLink[] {
  return mockPendingWorkoutLinks.filter(w => !w.dismissed);
}

// Get completed workout stats for a client in date range
export function getClientWorkoutStats(
  clientId: string,
  startDate: string,
  endDate: string
): { totalWorkouts: number; linkedWorkouts: number; totalMinutes: number; avgHeartRate: number } {
  const workouts = mockCompletedProgramWorkouts.filter(
    w => w.clientId === clientId && w.date >= startDate && w.date <= endDate
  );

  const linkedWorkouts = workouts.filter(w => w.status === 'linked');
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const avgHeartRate = workouts.length > 0
    ? Math.round(workouts.reduce((sum, w) => sum + (w.averageHeartRate || 0), 0) / workouts.length)
    : 0;

  return {
    totalWorkouts: workouts.length,
    linkedWorkouts: linkedWorkouts.length,
    totalMinutes,
    avgHeartRate,
  };
}

// Helper function to estimate program duration in minutes
export function estimateProgramDuration(program: DailyProgram): number {
  let totalSeconds = 0;

  for (const exercise of program.exercises) {
    const sets = exercise.sets || 1;
    const restSeconds = exercise.restPeriod || 60;

    if (exercise.duration) {
      // Timed exercise
      totalSeconds += (exercise.duration * sets) + (restSeconds * (sets - 1));
    } else {
      // Rep-based exercise - estimate 3 seconds per rep
      const reps = parseInt(exercise.reps?.split('-')[0] || '10');
      totalSeconds += (reps * 3 * sets) + (restSeconds * (sets - 1));
    }
  }

  return Math.round(totalSeconds / 60);
}
