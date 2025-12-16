// ============================================
// TRAINER PROFILE & CLIENT RELATIONSHIPS
// ============================================

export interface TrainerProfile {
  id: string;
  name: string;
  certifications: string[];  // 'NASM-CPT', 'ACE', 'CSCS', etc.
  specializations: string[]; // 'Weight Loss', 'Strength', 'Rehabilitation', etc.
  gymAffiliation?: string;
  clientCount: number;
  activePrograms: number;
  pendingFormChecks: number;
  unreadMessages: number;
  photo?: string;
}

export interface ClientSummary {
  id: string;
  patientId?: string;  // Link to existing patient data if available
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  photo?: string;
  // Fitness profile
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal: GoalType;
  secondaryGoals?: GoalType[];
  // Status
  joinDate: string;
  lastWorkout?: string;  // ISO date
  nextSession?: string;  // ISO date
  currentProgramId?: string;
  currentNutritionPlanId?: string;
  programAdherence: number; // 0-100 percentage
  nutritionAdherence: number; // 0-100 percentage
  unreadMessages: number;
  pendingFormChecks: number;
  // Quick metrics
  currentWeight?: number;
  startingWeight?: number;
  targetWeight?: number;
  bodyFatPercent?: number;
  // Bloodwork integration (if shared)
  bloodworkConcerns?: string[]; // From linked patient data
  exerciseRestrictions?: string[];
  // Sharing preferences
  sharesBloodwork: boolean;
  sharesMedications: boolean;
}

export type GoalType =
  | 'weight_loss'
  | 'muscle_gain'
  | 'strength'
  | 'endurance'
  | 'general_fitness'
  | 'rehabilitation'
  | 'body_recomposition'
  | 'athletic_performance';

// ============================================
// EXERCISE DEFINITIONS
// ============================================

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment[];
  category: ExerciseCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  movementPattern: MovementPattern;
  videoUrl?: string;
  thumbnailUrl?: string;
  formCues: string[];
  commonMistakes?: string[];
  alternatives?: string[]; // IDs of alternative exercises
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'traps'
  | 'lats'
  | 'full_body';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'resistance_bands'
  | 'medicine_ball'
  | 'pull_up_bar'
  | 'bench'
  | 'squat_rack'
  | 'cardio_machine'
  | 'foam_roller'
  | 'none';

export type ExerciseCategory =
  | 'compound'
  | 'isolation'
  | 'cardio'
  | 'hiit'
  | 'mobility'
  | 'plyometric'
  | 'isometric'
  | 'stretching';

export type MovementPattern =
  | 'push_horizontal'
  | 'push_vertical'
  | 'pull_horizontal'
  | 'pull_vertical'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'carry'
  | 'rotation'
  | 'core_stability'
  | 'cardio';

// ============================================
// WORKOUT PROGRAMMING
// ============================================

export interface WorkoutSet {
  setNumber: number;
  setType: 'warmup' | 'working' | 'dropset' | 'amrap' | 'rest_pause';
  targetReps?: string;  // '8-10' or '12' or 'AMRAP'
  targetWeight?: number;  // in lbs
  targetRPE?: number;  // Rate of Perceived Exertion 1-10
  targetDuration?: number;  // in seconds (for planks, cardio, etc.)
  restPeriod: number;  // in seconds
  tempo?: string; // e.g., "3-1-2-0" (eccentric-pause-concentric-pause)
  // Logged data (filled by client)
  actualReps?: number;
  actualWeight?: number;
  actualRPE?: number;
  actualDuration?: number;
  notes?: string;
  completedAt?: string;  // ISO timestamp
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  order: number;
  sets: WorkoutSet[];
  trainerNotes?: string;  // e.g., "Focus on mind-muscle connection"
  supersetWith?: string;  // ID of another exercise for supersets
  circuitGroup?: string;  // For circuit training
  // Video reference
  demoVideoUrl?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;  // 'Push Day A', 'Full Body 1', 'HIIT Cardio'
  description?: string;
  type: 'strength' | 'cardio' | 'hiit' | 'mobility' | 'mixed';
  estimatedDuration: number;  // minutes
  difficulty: 'easy' | 'moderate' | 'hard' | 'very_hard';
  exercises: WorkoutExercise[];
  targetMuscleGroups: MuscleGroup[];
  warmup?: {
    description: string;
    duration: number;
    exercises?: string[];
  };
  cooldown?: {
    description: string;
    duration: number;
    exercises?: string[];
  };
  // Session execution status
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  status: 'template' | 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  // Client feedback (after completion)
  overallRating?: number;  // 1-5
  energyLevel?: number;  // 1-10
  perceivedDifficulty?: number;  // 1-10 (perceived)
  soreness?: number;  // 1-10
  clientNotes?: string;
  // Calculated stats
  totalVolume?: number;  // total lbs lifted
  totalSets?: number;
  totalReps?: number;
}

export interface WorkoutProgram {
  id: string;
  trainerId: string;
  clientId: string;
  name: string;  // 'Beginner Strength Program', '12-Week Cut'
  description?: string;
  type: ProgramType;
  goal: GoalType;
  durationWeeks: number;
  currentWeek: number;
  sessionsPerWeek: number;
  // Program structure
  weeklySchedule: WeekDay[];
  sessions: WorkoutSession[];  // Template sessions
  // Periodization
  periodizationType?: 'linear' | 'undulating' | 'block' | 'none';
  deloadWeek?: number;  // Which week is deload (e.g., 4 means every 4th week)
  progressionScheme?: string;  // Description of how to progress
  // Status
  status: 'draft' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  // Progress tracking
  completedSessions: number;
  totalSessions: number;
  // Notes
  trainerNotes?: string;
}

export type ProgramType =
  | 'full_body'
  | 'upper_lower'
  | 'push_pull_legs'
  | 'bro_split'
  | 'strength_focused'
  | 'hypertrophy'
  | 'powerbuilding'
  | 'cardio_focused'
  | 'custom';

export interface WeekDay {
  dayOfWeek: number;  // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  sessionTemplateId?: string;  // Reference to a session template
  sessionName?: string;
  isRestDay: boolean;
  isFlexible?: boolean;  // Client can move this day
}

// ============================================
// BODY METRICS & PROGRESS TRACKING
// ============================================

export interface BodyMeasurement {
  id: string;
  clientId: string;
  date: string;
  // Core measurements
  weight: number;  // lbs
  bodyFatPercent?: number;
  // Circumference measurements (inches)
  neck?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftBicep?: number;
  rightBicep?: number;
  leftForearm?: number;
  rightForearm?: number;
  leftThigh?: number;
  rightThigh?: number;
  leftCalf?: number;
  rightCalf?: number;
  // Calculated metrics
  bmi?: number;
  leanBodyMass?: number;
  fatMass?: number;
  waistToHipRatio?: number;
  // Source
  measurementMethod?: 'scale' | 'calipers' | 'dexa' | 'bioimpedance' | 'tape' | 'estimated';
  notes?: string;
}

export interface StrengthRecord {
  id: string;
  clientId: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  // Record details
  weight: number;
  reps: number;
  estimated1RM: number;  // Calculated from weight/reps using Epley formula
  isPersonalRecord: boolean;
  previousRecord?: number;  // Previous 1RM for comparison
  // Video proof
  videoUrl?: string;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  clientId: string;
  date: string;
  photoUrl: string;
  thumbnailUrl?: string;
  pose: PhotoPose;
  lighting?: string;
  notes?: string;
  isPrivate: boolean;  // Visible only to client unless explicitly shared
  sharedWithTrainer: boolean;
}

export type PhotoPose =
  | 'front_relaxed'
  | 'front_flexed'
  | 'back_relaxed'
  | 'back_flexed'
  | 'side_left'
  | 'side_right'
  | 'legs_front'
  | 'legs_back';

// ============================================
// NUTRITION TRACKING
// ============================================

export interface MacroTargets {
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber?: number;   // grams
  sugar?: number;   // grams (max)
  sodium?: number;  // mg (max)
}

export interface NutritionPlan {
  id: string;
  trainerId: string;
  clientId: string;
  name: string;
  description?: string;
  goal: 'deficit' | 'maintenance' | 'surplus' | 'recomp';
  // Calorie calculation
  calculatedTDEE?: number;
  activityMultiplier?: number;
  calorieAdjustment: number;  // e.g., -500 for deficit
  targetCalories: number;
  // Macro split
  macroSplit: {
    proteinPercent: number;  // e.g., 30
    carbsPercent: number;    // e.g., 40
    fatPercent: number;      // e.g., 30
  };
  macroTargets: MacroTargets;
  // Protein per lb of bodyweight
  proteinPerLb?: number;  // e.g., 1.0 g/lb
  // Timing (optional)
  mealTiming?: {
    mealCount: number;
    preworkoutTiming?: string;  // e.g., "1-2 hours before"
    postworkoutTiming?: string; // e.g., "within 1 hour"
    notes?: string;
  };
  // Dietary preferences
  dietaryRestrictions?: string[];
  allergies?: string[];
  preferredFoods?: string[];
  avoidFoods?: string[];
  // Status
  status: 'draft' | 'active' | 'paused';
  startDate: string;
  // Adjustment history
  adjustmentHistory?: NutritionAdjustment[];
  // Notes
  trainerNotes?: string;
}

export interface NutritionAdjustment {
  date: string;
  previousCalories: number;
  newCalories: number;
  previousMacros: MacroTargets;
  newMacros: MacroTargets;
  reason: string;
  weight?: number;  // Weight at time of adjustment
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  isCustom?: boolean;  // User-created food
}

export interface MealLog {
  id: string;
  clientId: string;
  date: string;
  mealType: MealType;
  time: string;  // e.g., "08:30"
  // Food details
  foods: LoggedFood[];
  // Totals
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  // Meta
  photoUrl?: string;
  notes?: string;
  verified?: boolean;  // Trainer verified accuracy
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'preworkout'
  | 'postworkout'
  | 'other';

export interface LoggedFood {
  foodId?: string;  // Reference to FoodItem if from database
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface DailyNutrition {
  clientId: string;
  date: string;
  // Logged totals
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  fiberConsumed?: number;
  waterIntake?: number;  // oz or ml
  // Targets for the day
  targets: MacroTargets;
  // Adherence percentages
  caloriesAdherence: number;
  proteinAdherence: number;
  carbsAdherence: number;
  fatAdherence: number;
  // Meals logged
  meals: MealLog[];
  // Meta
  isComplete: boolean;  // All meals logged
  trainerNote?: string;
}

// ============================================
// FORM CHECKS & VIDEO REVIEW
// ============================================

export interface FormCheck {
  id: string;
  clientId: string;
  clientName: string;
  trainerId: string;
  exerciseId: string;
  exerciseName: string;
  // Video details
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  recordedDate: string;
  // Request details
  clientQuestion?: string;
  weight?: number;
  reps?: number;
  concernAreas?: string[];  // 'lower_back', 'knee_tracking', 'depth', etc.
  // Review status
  status: 'pending' | 'in_review' | 'reviewed' | 'needs_resubmission';
  submittedAt: string;
  reviewedAt?: string;
  // Trainer feedback
  overallRating?: number;  // 1-5 stars
  feedback?: string;
  timestampNotes?: TimestampNote[];
  correctionPriority?: 'minor' | 'moderate' | 'critical';
  suggestedDrills?: string[];
  // Follow-up
  followUpRequested?: boolean;
  followUpDeadline?: string;
}

export interface TimestampNote {
  timeSeconds: number;
  note: string;
  type: 'positive' | 'correction' | 'info';
}

// ============================================
// GOAL TRACKING
// ============================================

export interface Goal {
  id: string;
  clientId: string;
  type: GoalTrackingType;
  title: string;
  description?: string;
  // Target
  targetValue: number;
  targetUnit: string;
  exerciseId?: string;  // For strength goals
  exerciseName?: string;
  // Timeline
  startDate: string;
  targetDate: string;
  // Progress
  startingValue: number;
  currentValue: number;
  progressPercent: number;
  // Status
  status: 'in_progress' | 'achieved' | 'missed' | 'paused' | 'abandoned';
  achievedDate?: string;
  // Milestones
  milestones?: Milestone[];
  // Notes
  notes?: string;
  trainerNotes?: string;
}

export type GoalTrackingType =
  | 'weight_loss'
  | 'weight_gain'
  | 'body_fat'
  | 'strength_1rm'
  | 'strength_reps'
  | 'measurement'
  | 'habit'
  | 'endurance'
  | 'custom';

export interface Milestone {
  value: number;
  description: string;
  targetDate?: string;
  achievedDate?: string;
  isAchieved: boolean;
}

// ============================================
// MESSAGING & SCHEDULING
// ============================================

export interface TrainerMessage {
  id: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  // Message content
  preview: string;
  fullText: string;
  // Timing
  time: string;  // Display format
  timestamp: string;  // ISO string
  // Status
  isUrgent: boolean;
  unread: boolean;
  category: MessageCategory;
  // Attachments
  attachments?: MessageAttachment[];
}

export type MessageCategory =
  | 'workout'
  | 'nutrition'
  | 'form_check'
  | 'scheduling'
  | 'progress'
  | 'general';

export interface MessageAttachment {
  type: 'video' | 'image' | 'document' | 'workout' | 'meal_log';
  url: string;
  name: string;
  thumbnailUrl?: string;
}

export interface ScheduledSession {
  id: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  // Timing
  date: string;
  time: string;
  duration: number;  // minutes
  // Session details
  type: 'training' | 'assessment' | 'check_in' | 'program_review' | 'nutrition_review';
  location: 'in_person' | 'virtual' | 'hybrid';
  locationDetails?: string;  // Gym name or video link
  notes?: string;
  // Status
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  workoutSessionId?: string;  // If linked to a specific workout
  // Reminders
  reminderSent?: boolean;
}

// ============================================
// SHARING PREFERENCES
// ============================================

export interface SharingPreferences {
  id: string;
  userId: string;  // The client/patient

  // Trainer connection
  trainerId?: string;
  trainerName?: string;
  connectedToTrainer: boolean;
  trainerSharing: {
    workouts: boolean;
    nutrition: boolean;
    bodyMetrics: boolean;
    progressPhotos: boolean;
    formChecks: boolean;
    goals: boolean;
    bloodwork: boolean;      // Opt-in, sensitive
    medications: boolean;    // Opt-in, sensitive
    supplements: boolean;
    activity: boolean;
    sleep: boolean;
  };

  // Doctor connection
  doctorId?: string;
  doctorName?: string;
  connectedToDoctor: boolean;
  doctorSharing: {
    workouts: boolean;
    nutrition: boolean;
    bodyMetrics: boolean;
    progressPhotos: boolean;
    goals: boolean;
    supplements: boolean;
    activity: boolean;
    sleep: boolean;
    // Note: bloodwork and medications always shared with doctor
  };
}

// ============================================
// AGGREGATE DATA TYPES
// ============================================

export interface TrainerData {
  trainer: TrainerProfile;
  clients: ClientSummary[];
  messages: TrainerMessage[];
  sessions: ScheduledSession[];
}

export interface ClientFullData {
  summary: ClientSummary;
  currentProgram?: WorkoutProgram;
  workoutHistory: WorkoutSession[];
  nutritionPlan?: NutritionPlan;
  nutritionHistory: DailyNutrition[];
  bodyMeasurements: BodyMeasurement[];
  strengthRecords: StrengthRecord[];
  progressPhotos: ProgressPhoto[];
  formChecks: FormCheck[];
  goals: Goal[];
  sharingPreferences: SharingPreferences;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate estimated 1RM using Epley formula
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps > 10) reps = 10; // Formula less accurate above 10 reps
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Calculate TDEE based on stats and activity level
 */
export function calculateTDEE(
  weight: number, // lbs
  height: number, // inches
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number {
  // Convert to metric for Mifflin-St Jeor
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;

  // BMR calculation
  let bmr: number;
  if (gender === 'male') {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  }

  // Activity multipliers
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  return Math.round(bmr * multipliers[activityLevel]);
}

/**
 * Calculate macro targets from calories and percentages
 */
export function calculateMacros(
  calories: number,
  proteinPercent: number,
  carbsPercent: number,
  fatPercent: number
): MacroTargets {
  return {
    calories,
    protein: Math.round((calories * (proteinPercent / 100)) / 4),
    carbs: Math.round((calories * (carbsPercent / 100)) / 4),
    fat: Math.round((calories * (fatPercent / 100)) / 9),
  };
}

/**
 * Calculate BMI
 */
export function calculateBMI(weight: number, heightInches: number): number {
  return Math.round((weight / (heightInches * heightInches)) * 703 * 10) / 10;
}

/**
 * Get adherence color class based on percentage
 */
export function getAdherenceColor(adherence: number): string {
  if (adherence >= 80) return 'text-green-600 bg-green-100';
  if (adherence >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

/**
 * Get goal status color
 */
export function getGoalStatusColor(status: Goal['status']): string {
  switch (status) {
    case 'achieved': return 'text-green-600 bg-green-100';
    case 'in_progress': return 'text-blue-600 bg-blue-100';
    case 'missed': return 'text-red-600 bg-red-100';
    case 'paused': return 'text-gray-600 bg-gray-100';
    case 'abandoned': return 'text-gray-400 bg-gray-50';
    default: return 'text-gray-600 bg-gray-100';
  }
}

// ============================================
// DAILY PROGRAMS (Today's Program feature)
// ============================================

/**
 * A daily workout program - lighter weight than full WorkoutProgram
 * Trainers create these for specific days, clients can be assigned or self-join
 */
export interface DailyProgram {
  id: string;
  trainerId: string;
  name: string;                    // "Morning HIIT", "Strength A"
  description?: string;
  date: string;                    // ISO date - which day this is for
  scheduledTime?: string;          // Optional time "06:00"
  exercises: DailyExercise[];
  // Assignment
  assignedClientIds: string[];     // Trainer-assigned clients
  selfJoinedClientIds: string[];   // Clients who joined themselves
  isPublic: boolean;               // Can clients self-join?
  maxParticipants?: number;        // Optional cap
  // Status
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

/**
 * A simplified exercise entry for daily programs
 * Supports both library exercises and custom exercises
 */
export interface DailyExercise {
  id: string;
  exerciseId?: string;             // Reference to library (optional for custom)
  name: string;                    // Exercise name
  order: number;
  // Grouping for supersets/circuits
  group?: string;                  // e.g., "A", "B", "C" - exercises with same group are done together in rotation
  // Prescription (one or more of these)
  sets?: number;
  reps?: string;                   // "10-12" or "AMRAP"
  duration?: number;               // seconds (for timed exercises)
  // Optional details
  weight?: string;                 // "bodyweight", "light", "moderate", "heavy", or specific "135lbs"
  restPeriod?: number;             // seconds
  notes?: string;                  // Trainer notes for this exercise
}

/**
 * Exercise group type for organizing exercises into supersets/circuits
 */
export type ExerciseGroup = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

/**
 * A custom exercise created by a trainer (not in the main library)
 */
export interface CustomExercise {
  id: string;
  trainerId: string;
  name: string;
  description?: string;
  muscleGroups?: MuscleGroup[];
  equipment?: Equipment[];
  createdAt: string;
}

export type DailyProgramStatus = DailyProgram['status'];

// ============================================
// COMPLETED PROGRAM WORKOUTS (Device Linking)
// ============================================

/**
 * Links device-detected workouts to trainer-created programs
 * Allows clients to confirm "Yes, this workout was for [Program Name]"
 */
export interface CompletedProgramWorkout {
  id: string;
  clientId: string;

  // Link to trainer program (optional - can be unlinked workout)
  dailyProgramId?: string;
  dailyProgramName?: string;
  trainerId?: string;
  trainerName?: string;

  // Link to device workout
  deviceWorkoutId?: string;

  // Workout data (from device or manual entry)
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number;              // minutes
  caloriesBurned?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;

  // Source tracking
  source: 'device' | 'manual';
  deviceType?: 'fitbit' | 'apple_health' | 'oura';

  // Status
  status: 'pending_link' | 'linked' | 'skipped';
  linkedAt?: string;

  // Optional feedback from client
  notes?: string;
  rating?: number;               // 1-5 how did it feel
}

/**
 * Represents a device workout that hasn't been linked to a program yet
 */
export interface PendingWorkoutLink {
  id: string;
  clientId: string;
  workout: {
    id: string;
    date: string;
    type: string;
    duration: number;
    caloriesBurned: number;
    averageHeartRate?: number;
    maxHeartRate?: number;
    source: 'fitbit' | 'apple_health' | 'oura' | 'manual';
  };
  suggestedProgramIds: string[];  // Programs available for that day
  detectedAt: string;
  dismissed: boolean;
}
