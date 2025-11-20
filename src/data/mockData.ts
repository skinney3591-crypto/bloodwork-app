export interface BloodworkResult {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high';
  category: string;
  // Enhanced fields for detailed view
  optimalRange: string;
  riskLevel: 'optimal' | 'borderline' | 'elevated' | 'high' | 'critical';
  percentile?: number; // Where user falls compared to population (0-100)
  historicalValues: Array<{date: string, value: number}>;
  trend: 'improving' | 'worsening' | 'stable';
  changePercent: number; // Change from previous test
  relatedMarkers: string[]; // Names of related markers
  goal?: number; // User's target value
}

export interface MarkerEducation {
  whatItMeasures: string;
  whyItMatters: string;
  symptomsLow?: string[];
  symptomsHigh?: string[];
  dietaryFactors: string[];
  lifestyleFactors: string[];
  medicationEffects: string[];
  improvementStrategies: string[];
  learnMoreUrl?: string;
}

export interface PanelSummary {
  category: string;
  status: 'excellent' | 'good' | 'needs_improvement' | 'concerning';
  abnormalCount: number;
  totalCount: number;
  ratios?: Record<string, {value: number, status: string, description: string}>;
  riskScore?: number; // 0-100
  recommendations: string[];
  interpretation: string;
}

export interface Citation {
  title: string;
  source: string;
  url: string;
  year: number;
  studyType: 'guideline' | 'meta-analysis' | 'rct' | 'observational' | 'review';
  takeaway: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
  timing: string;
  dosageJustification?: string;
  citations?: Citation[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedFor: string;
  sideEffects: string[];
  dosageJustification?: string;
  citations?: Citation[];
}

export interface Exercise {
  type: 'cardio' | 'weights';
  name: string;
  duration?: string;
  sets?: number;
  reps?: string;
  frequency: string;
  intensity: string;
}

export interface Reminder {
  id: string;
  type: 'medication' | 'supplement' | 'exercise';
  name: string;
  time: string;
  completed: boolean;
}

// Device Integration Interfaces
export type DeviceType = 'fitbit' | 'apple_health' | 'oura';

export interface DeviceConnection {
  id: string;
  type: DeviceType;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  permissions: string[];
}

export interface DailyActivity {
  date: string;
  steps: number;
  distance: number; // miles
  activeMinutes: number;
  caloriesBurned: number;
  floors?: number;
  heartRateAvg?: number;
  heartRateResting?: number;
  source: DeviceType;
}

export interface SleepData {
  date: string;
  duration: number; // hours
  sleepScore?: number;
  stages: {
    deep: number; // hours
    light: number;
    rem: number;
    awake: number;
  };
  efficiency: number; // percentage
  restingHeartRate?: number;
  respiratoryRate?: number;
  timeToSleep?: number; // minutes
  source: DeviceType;
}

export interface Workout {
  id: string;
  date: string;
  type: string; // 'running', 'cycling', 'weights', 'walking', 'swimming', etc.
  duration: number; // minutes
  caloriesBurned: number;
  distance?: number; // miles
  averageHeartRate?: number;
  maxHeartRate?: number;
  source: DeviceType | 'manual';
}

export interface HeartRateZone {
  zone: 'resting' | 'fat_burn' | 'cardio' | 'peak';
  minutes: number;
  range: string; // "50-90 bpm"
}

export interface CustomerData {
  id: string;
  name: string;
  age: number;
  gender: string;
  testDate: string;
  bloodwork: BloodworkResult[];
  panelSummaries: PanelSummary[];
  supplements: Supplement[];
  medications: Medication[];
  exercises: Exercise[];
  reminders: Reminder[];
  doctorReviewStatus: 'pending' | 'in_review' | 'approved';
  // Device data
  deviceConnections: DeviceConnection[];
  activityHistory: DailyActivity[];
  sleepHistory: SleepData[];
  workoutHistory: Workout[];
}

export const customer1Data: CustomerData = {
  id: '1',
  name: 'John Anderson',
  age: 45,
  gender: 'Male',
  testDate: '2025-11-10',
  doctorReviewStatus: 'pending',

  bloodwork: [
    // Complete Blood Count (CBC)
    { name: 'White Blood Cell Count', value: 7.2, unit: 'K/uL', referenceRange: '4.5-11.0', status: 'normal', category: 'Complete Blood Count', optimalRange: '4.5-10.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:7.0},{date:'2025-07-10',value:7.1},{date:'2025-09-10',value:7.2},{date:'2025-11-10',value:7.2}], trend: 'stable', changePercent: 2.9, relatedMarkers: [] },
    { name: 'Red Blood Cell Count', value: 4.9, unit: 'M/uL', referenceRange: '4.5-5.9', status: 'normal', category: 'Complete Blood Count', optimalRange: '4.7-5.7', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:4.8},{date:'2025-07-10',value:4.9},{date:'2025-09-10',value:4.9},{date:'2025-11-10',value:4.9}], trend: 'stable', changePercent: 2.1, relatedMarkers: ['Hemoglobin','Hematocrit'] },
    { name: 'Hemoglobin', value: 13.8, unit: 'g/dL', referenceRange: '13.5-17.5', status: 'normal', category: 'Complete Blood Count', optimalRange: '14.0-17.0', riskLevel: 'borderline', historicalValues: [{date:'2025-05-10',value:13.6},{date:'2025-07-10',value:13.7},{date:'2025-09-10',value:13.8},{date:'2025-11-10',value:13.8}], trend: 'stable', changePercent: 1.5, relatedMarkers: ['Red Blood Cell Count','Hematocrit','Iron','Ferritin'] },
    { name: 'Hematocrit', value: 41.5, unit: '%', referenceRange: '38.3-48.6', status: 'normal', category: 'Complete Blood Count', optimalRange: '40.0-50.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:41.0},{date:'2025-07-10',value:41.3},{date:'2025-09-10',value:41.5},{date:'2025-11-10',value:41.5}], trend: 'stable', changePercent: 1.2, relatedMarkers: ['Hemoglobin','Red Blood Cell Count'] },
    { name: 'Platelet Count', value: 245, unit: 'K/uL', referenceRange: '150-400', status: 'normal', category: 'Complete Blood Count', optimalRange: '150-350', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:238},{date:'2025-07-10',value:242},{date:'2025-09-10',value:244},{date:'2025-11-10',value:245}], trend: 'stable', changePercent: 2.9, relatedMarkers: [] },
    { name: 'Mean Corpuscular Volume', value: 88, unit: 'fL', referenceRange: '80-100', status: 'normal', category: 'Complete Blood Count', optimalRange: '82-98', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:87},{date:'2025-07-10',value:88},{date:'2025-09-10',value:88},{date:'2025-11-10',value:88}], trend: 'stable', changePercent: 1.1, relatedMarkers: ['Vitamin B12','Folate'] },

    // Metabolic Panel
    {
      name: 'Glucose (Fasting)', value: 112, unit: 'mg/dL', referenceRange: '70-99', status: 'high', category: 'Metabolic Panel',
      optimalRange: '70-85', riskLevel: 'elevated', percentile: 75,
      historicalValues: [
        { date: '2025-05-10', value: 125 },
        { date: '2025-07-10', value: 118 },
        { date: '2025-09-10', value: 115 },
        { date: '2025-11-10', value: 112 }
      ],
      trend: 'improving', changePercent: -10.4,
      relatedMarkers: ['HbA1c (Hemoglobin A1c)', 'Insulin (Fasting)', 'Triglycerides'],
      goal: 95
    },
    { name: 'Sodium', value: 140, unit: 'mmol/L', referenceRange: '136-145', status: 'normal', category: 'Metabolic Panel', optimalRange: '136-142', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:139},{date:'2025-07-10',value:140},{date:'2025-09-10',value:140},{date:'2025-11-10',value:140}], trend: 'stable', changePercent: 0.7, relatedMarkers: ['Potassium','Chloride'] },
    { name: 'Potassium', value: 4.2, unit: 'mmol/L', referenceRange: '3.5-5.0', status: 'normal', category: 'Metabolic Panel', optimalRange: '4.0-4.6', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:4.1},{date:'2025-07-10',value:4.2},{date:'2025-09-10',value:4.1},{date:'2025-11-10',value:4.2}], trend: 'stable', changePercent: 2.4, relatedMarkers: ['Sodium'] },
    { name: 'Chloride', value: 102, unit: 'mmol/L', referenceRange: '98-107', status: 'normal', category: 'Metabolic Panel', optimalRange: '100-106', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:101},{date:'2025-07-10',value:102},{date:'2025-09-10',value:102},{date:'2025-11-10',value:102}], trend: 'stable', changePercent: 1.0, relatedMarkers: ['Sodium'] },
    { name: 'Carbon Dioxide', value: 25, unit: 'mmol/L', referenceRange: '23-29', status: 'normal', category: 'Metabolic Panel', optimalRange: '24-28', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:26},{date:'2025-07-10',value:25},{date:'2025-09-10',value:25},{date:'2025-11-10',value:25}], trend: 'stable', changePercent: -3.8, relatedMarkers: [] },
    { name: 'BUN (Blood Urea Nitrogen)', value: 18, unit: 'mg/dL', referenceRange: '7-20', status: 'normal', category: 'Metabolic Panel', optimalRange: '10-18', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:17},{date:'2025-07-10',value:18},{date:'2025-09-10',value:18},{date:'2025-11-10',value:18}], trend: 'stable', changePercent: 5.9, relatedMarkers: ['Creatinine'] },
    { name: 'Creatinine', value: 1.1, unit: 'mg/dL', referenceRange: '0.7-1.3', status: 'normal', category: 'Metabolic Panel', optimalRange: '0.8-1.2', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:1.0},{date:'2025-07-10',value:1.1},{date:'2025-09-10',value:1.1},{date:'2025-11-10',value:1.1}], trend: 'stable', changePercent: 10.0, relatedMarkers: ['BUN (Blood Urea Nitrogen)'] },
    { name: 'Calcium', value: 9.5, unit: 'mg/dL', referenceRange: '8.5-10.5', status: 'normal', category: 'Metabolic Panel', optimalRange: '9.0-10.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:9.4},{date:'2025-07-10',value:9.5},{date:'2025-09-10',value:9.5},{date:'2025-11-10',value:9.5}], trend: 'stable', changePercent: 1.1, relatedMarkers: ['Vitamin D (25-OH)','Albumin'] },

    // Liver Function
    { name: 'ALT (Alanine Aminotransferase)', value: 28, unit: 'U/L', referenceRange: '7-56', status: 'normal', category: 'Liver Function', optimalRange: '10-40', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:30},{date:'2025-07-10',value:29},{date:'2025-09-10',value:28},{date:'2025-11-10',value:28}], trend: 'stable', changePercent: -6.7, relatedMarkers: ['AST (Aspartate Aminotransferase)'] },
    { name: 'AST (Aspartate Aminotransferase)', value: 24, unit: 'U/L', referenceRange: '10-40', status: 'normal', category: 'Liver Function', optimalRange: '10-35', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:25},{date:'2025-07-10',value:24},{date:'2025-09-10',value:24},{date:'2025-11-10',value:24}], trend: 'stable', changePercent: -4.0, relatedMarkers: ['ALT (Alanine Aminotransferase)'] },
    { name: 'Alkaline Phosphatase', value: 75, unit: 'U/L', referenceRange: '44-147', status: 'normal', category: 'Liver Function', optimalRange: '50-120', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:74},{date:'2025-07-10',value:75},{date:'2025-09-10',value:75},{date:'2025-11-10',value:75}], trend: 'stable', changePercent: 1.4, relatedMarkers: [] },
    { name: 'Total Bilirubin', value: 0.8, unit: 'mg/dL', referenceRange: '0.1-1.2', status: 'normal', category: 'Liver Function', optimalRange: '0.2-1.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:0.9},{date:'2025-07-10',value:0.8},{date:'2025-09-10',value:0.8},{date:'2025-11-10',value:0.8}], trend: 'stable', changePercent: -11.1, relatedMarkers: [] },
    { name: 'Albumin', value: 4.2, unit: 'g/dL', referenceRange: '3.5-5.5', status: 'normal', category: 'Liver Function', optimalRange: '4.0-5.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:4.1},{date:'2025-07-10',value:4.2},{date:'2025-09-10',value:4.2},{date:'2025-11-10',value:4.2}], trend: 'stable', changePercent: 2.4, relatedMarkers: ['Total Protein'] },
    { name: 'Total Protein', value: 7.1, unit: 'g/dL', referenceRange: '6.0-8.3', status: 'normal', category: 'Liver Function', optimalRange: '6.5-8.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:7.0},{date:'2025-07-10',value:7.1},{date:'2025-09-10',value:7.1},{date:'2025-11-10',value:7.1}], trend: 'stable', changePercent: 1.4, relatedMarkers: ['Albumin'] },

    // Lipid Panel
    {
      name: 'Total Cholesterol', value: 215, unit: 'mg/dL', referenceRange: '<200', status: 'high', category: 'Lipid Panel',
      optimalRange: '<180', riskLevel: 'elevated', percentile: 72,
      historicalValues: [
        { date: '2025-05-10', value: 238 },
        { date: '2025-07-10', value: 228 },
        { date: '2025-09-10', value: 220 },
        { date: '2025-11-10', value: 215 }
      ],
      trend: 'improving', changePercent: -9.7,
      relatedMarkers: ['LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides'],
      goal: 180
    },
    {
      name: 'LDL Cholesterol', value: 145, unit: 'mg/dL', referenceRange: '<100', status: 'high', category: 'Lipid Panel',
      optimalRange: '<70', riskLevel: 'elevated', percentile: 78,
      historicalValues: [
        { date: '2025-05-10', value: 165 },
        { date: '2025-07-10', value: 158 },
        { date: '2025-09-10', value: 150 },
        { date: '2025-11-10', value: 145 }
      ],
      trend: 'improving', changePercent: -12.1,
      relatedMarkers: ['Total Cholesterol', 'HDL Cholesterol', 'Triglycerides', 'Apolipoprotein B'],
      goal: 100
    },
    {
      name: 'HDL Cholesterol', value: 42, unit: 'mg/dL', referenceRange: '>40', status: 'normal', category: 'Lipid Panel',
      optimalRange: '>60', riskLevel: 'borderline', percentile: 35,
      historicalValues: [
        { date: '2025-05-10', value: 38 },
        { date: '2025-07-10', value: 40 },
        { date: '2025-09-10', value: 41 },
        { date: '2025-11-10', value: 42 }
      ],
      trend: 'improving', changePercent: 10.5,
      relatedMarkers: ['Total Cholesterol', 'LDL Cholesterol', 'Triglycerides'],
      goal: 60
    },
    {
      name: 'Triglycerides', value: 165, unit: 'mg/dL', referenceRange: '<150', status: 'high', category: 'Lipid Panel',
      optimalRange: '<100', riskLevel: 'elevated', percentile: 68,
      historicalValues: [
        { date: '2025-05-10', value: 195 },
        { date: '2025-07-10', value: 182 },
        { date: '2025-09-10', value: 172 },
        { date: '2025-11-10', value: 165 }
      ],
      trend: 'improving', changePercent: -15.4,
      relatedMarkers: ['LDL Cholesterol', 'HDL Cholesterol', 'VLDL Cholesterol', 'Glucose (Fasting)'],
      goal: 100
    },
    {
      name: 'VLDL Cholesterol', value: 33, unit: 'mg/dL', referenceRange: '5-40', status: 'normal', category: 'Lipid Panel',
      optimalRange: '5-30', riskLevel: 'borderline', percentile: 55,
      historicalValues: [
        { date: '2025-05-10', value: 39 },
        { date: '2025-07-10', value: 36 },
        { date: '2025-09-10', value: 34 },
        { date: '2025-11-10', value: 33 }
      ],
      trend: 'improving', changePercent: -15.4,
      relatedMarkers: ['Triglycerides', 'LDL Cholesterol'],
      goal: 25
    },

    // Thyroid Function
    { name: 'TSH (Thyroid Stimulating Hormone)', value: 2.8, unit: 'mIU/L', referenceRange: '0.4-4.0', status: 'normal', category: 'Thyroid Function', optimalRange: '1.0-2.5', riskLevel: 'borderline', historicalValues: [{date:'2025-05-10',value:2.9},{date:'2025-07-10',value:2.8},{date:'2025-09-10',value:2.8},{date:'2025-11-10',value:2.8}], trend: 'stable', changePercent: -3.4, relatedMarkers: ['Free T4','Free T3'] },
    { name: 'Free T4', value: 1.2, unit: 'ng/dL', referenceRange: '0.8-1.8', status: 'normal', category: 'Thyroid Function', optimalRange: '1.0-1.5', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:1.2},{date:'2025-07-10',value:1.2},{date:'2025-09-10',value:1.2},{date:'2025-11-10',value:1.2}], trend: 'stable', changePercent: 0.0, relatedMarkers: ['TSH (Thyroid Stimulating Hormone)','Free T3'] },
    { name: 'Free T3', value: 3.1, unit: 'pg/mL', referenceRange: '2.3-4.2', status: 'normal', category: 'Thyroid Function', optimalRange: '2.8-4.0', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:3.0},{date:'2025-07-10',value:3.1},{date:'2025-09-10',value:3.1},{date:'2025-11-10',value:3.1}], trend: 'stable', changePercent: 3.3, relatedMarkers: ['TSH (Thyroid Stimulating Hormone)','Free T4'] },

    // Vitamins and Minerals
    {
      name: 'Vitamin D (25-OH)', value: 28, unit: 'ng/mL', referenceRange: '30-100', status: 'low', category: 'Vitamins & Minerals',
      optimalRange: '40-60', riskLevel: 'elevated', percentile: 25,
      historicalValues: [
        { date: '2025-05-10', value: 22 },
        { date: '2025-07-10', value: 24 },
        { date: '2025-09-10', value: 26 },
        { date: '2025-11-10', value: 28 }
      ],
      trend: 'improving', changePercent: 27.3,
      relatedMarkers: ['Calcium', 'HbA1c (Hemoglobin A1c)', 'Testosterone (Total)'],
      goal: 45
    },
    { name: 'Vitamin B12', value: 380, unit: 'pg/mL', referenceRange: '200-900', status: 'normal', category: 'Vitamins & Minerals', optimalRange: '400-800', riskLevel: 'borderline', historicalValues: [{date:'2025-05-10',value:365},{date:'2025-07-10',value:372},{date:'2025-09-10',value:378},{date:'2025-11-10',value:380}], trend: 'improving', changePercent: 4.1, relatedMarkers: ['Folate','Mean Corpuscular Volume'], goal: 500 },
    { name: 'Folate', value: 12, unit: 'ng/mL', referenceRange: '>5.4', status: 'normal', category: 'Vitamins & Minerals', optimalRange: '10-20', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:11},{date:'2025-07-10',value:12},{date:'2025-09-10',value:12},{date:'2025-11-10',value:12}], trend: 'stable', changePercent: 9.1, relatedMarkers: ['Vitamin B12','Homocysteine'] },
    { name: 'Iron', value: 85, unit: 'mcg/dL', referenceRange: '60-170', status: 'normal', category: 'Vitamins & Minerals', optimalRange: '70-150', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:82},{date:'2025-07-10',value:84},{date:'2025-09-10',value:85},{date:'2025-11-10',value:85}], trend: 'stable', changePercent: 3.7, relatedMarkers: ['Ferritin','Hemoglobin'] },
    { name: 'Ferritin', value: 68, unit: 'ng/mL', referenceRange: '30-400', status: 'normal', category: 'Vitamins & Minerals', optimalRange: '50-200', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:65},{date:'2025-07-10',value:67},{date:'2025-09-10',value:68},{date:'2025-11-10',value:68}], trend: 'stable', changePercent: 4.6, relatedMarkers: ['Iron','Hemoglobin'] },
    { name: 'Magnesium', value: 2.0, unit: 'mg/dL', referenceRange: '1.7-2.2', status: 'normal', category: 'Vitamins & Minerals', optimalRange: '1.8-2.4', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:1.9},{date:'2025-07-10',value:2.0},{date:'2025-09-10',value:2.0},{date:'2025-11-10',value:2.0}], trend: 'stable', changePercent: 5.3, relatedMarkers: ['Calcium'] },

    // Hormones
    { name: 'Testosterone (Total)', value: 520, unit: 'ng/dL', referenceRange: '264-916', status: 'normal', category: 'Hormones', optimalRange: '500-800', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:495},{date:'2025-07-10',value:510},{date:'2025-09-10',value:518},{date:'2025-11-10',value:520}], trend: 'improving', changePercent: 5.1, relatedMarkers: ['Vitamin D (25-OH)'] },
    { name: 'Cortisol (Morning)', value: 14.5, unit: 'mcg/dL', referenceRange: '6.2-19.4', status: 'normal', category: 'Hormones', optimalRange: '10-18', riskLevel: 'optimal', historicalValues: [{date:'2025-05-10',value:15.2},{date:'2025-07-10',value:14.8},{date:'2025-09-10',value:14.6},{date:'2025-11-10',value:14.5}], trend: 'stable', changePercent: -4.6, relatedMarkers: [] },

    // Inflammation Markers
    { name: 'C-Reactive Protein (hs-CRP)', value: 2.8, unit: 'mg/L', referenceRange: '<3.0', status: 'normal', category: 'Inflammation', optimalRange: '<1.0', riskLevel: 'elevated', percentile: 68, historicalValues: [{date:'2025-05-10',value:3.2},{date:'2025-07-10',value:3.0},{date:'2025-09-10',value:2.9},{date:'2025-11-10',value:2.8}], trend: 'improving', changePercent: -12.5, relatedMarkers: ['LDL Cholesterol'], goal: 1.0 },
    { name: 'Homocysteine', value: 9.2, unit: 'umol/L', referenceRange: '5-15', status: 'normal', category: 'Inflammation', optimalRange: '5-9', riskLevel: 'borderline', historicalValues: [{date:'2025-05-10',value:10.1},{date:'2025-07-10',value:9.8},{date:'2025-09-10',value:9.4},{date:'2025-11-10',value:9.2}], trend: 'improving', changePercent: -8.9, relatedMarkers: ['Folate','Vitamin B12'], goal: 8.0 },

    // Diabetes Markers
    {
      name: 'HbA1c (Hemoglobin A1c)', value: 5.8, unit: '%', referenceRange: '<5.7', status: 'high', category: 'Diabetes Markers',
      optimalRange: '<5.4', riskLevel: 'borderline', percentile: 70,
      historicalValues: [
        { date: '2025-05-10', value: 6.1 },
        { date: '2025-07-10', value: 6.0 },
        { date: '2025-09-10', value: 5.9 },
        { date: '2025-11-10', value: 5.8 }
      ],
      trend: 'improving', changePercent: -4.9,
      relatedMarkers: ['Glucose (Fasting)', 'Insulin (Fasting)', 'Vitamin D (25-OH)'],
      goal: 5.4
    },
    { name: 'Insulin (Fasting)', value: 12, unit: 'uIU/mL', referenceRange: '2.6-24.9', status: 'normal', category: 'Diabetes Markers', optimalRange: '2-10', riskLevel: 'borderline', historicalValues: [{date:'2025-05-10',value:14},{date:'2025-07-10',value:13},{date:'2025-09-10',value:12.5},{date:'2025-11-10',value:12}], trend: 'improving', changePercent: -14.3, relatedMarkers: ['Glucose (Fasting)','HbA1c (Hemoglobin A1c)'], goal: 8 },
  ],

  panelSummaries: [
    {
      category: 'Lipid Panel',
      status: 'needs_improvement',
      abnormalCount: 3,
      totalCount: 5,
      ratios: {
        'Total/HDL': {
          value: 5.12,
          status: 'elevated',
          description: 'Total Cholesterol to HDL ratio. Optimal: <5.0, Lower is better'
        },
        'LDL/HDL': {
          value: 3.45,
          status: 'elevated',
          description: 'LDL to HDL ratio. Optimal: <3.0, Lower is better'
        },
        'Triglycerides/HDL': {
          value: 3.93,
          status: 'elevated',
          description: 'Triglycerides to HDL ratio. Optimal: <2.0, Insulin resistance marker'
        }
      },
      riskScore: 68,
      recommendations: [
        'Reduce saturated fat intake to <7% of calories',
        'Add 2g plant sterols daily (fortified spreads, orange juice)',
        'Increase soluble fiber to 10-25g/day (oats, beans, apples)',
        'Exercise 30+ minutes most days (raises HDL, lowers triglycerides)',
        'Consider omega-3 supplement (2-4g EPA/DHA)',
        'Lose 5-10% body weight if overweight'
      ],
      interpretation: 'Your lipid panel shows elevated cardiovascular risk. The good news: all markers are improving with your current treatment plan. Continue atorvastatin and lifestyle modifications. Focus on raising HDL (currently borderline low) through exercise and healthy fats.'
    },
    {
      category: 'Diabetes Markers',
      status: 'needs_improvement',
      abnormalCount: 2,
      totalCount: 2,
      ratios: {
        'HOMA-IR': {
          value: 3.32,
          status: 'elevated',
          description: 'Insulin resistance index. Optimal: <1.0, >2.5 suggests insulin resistance'
        }
      },
      riskScore: 65,
      recommendations: [
        'Limit refined carbohydrates and added sugars',
        'Try intermittent fasting (16:8 or 14:10 schedule)',
        'Exercise after meals (even 10-15 min walks help)',
        'Prioritize strength training to build muscle',
        'Continue berberine 500mg twice daily',
        'Get 7-9 hours of quality sleep',
        'Manage stress through meditation or yoga'
      ],
      interpretation: 'Your glucose and HbA1c are in the prediabetic range, but trending in the right direction. You\'ve achieved a 10% reduction in fasting glucose over 6 months - excellent progress! Continue current approach. Your insulin is borderline elevated, suggesting early insulin resistance. Weight loss of 7-10% can reverse prediabetes.'
    },
    {
      category: 'Metabolic Panel',
      status: 'good',
      abnormalCount: 1,
      totalCount: 8,
      ratios: {},
      riskScore: 25,
      recommendations: [
        'Continue monitoring fasting glucose',
        'Stay well hydrated (8+ glasses water daily)',
        'Maintain kidney health through blood pressure control'
      ],
      interpretation: 'Your metabolic panel is largely normal. Electrolytes, kidney function, and minerals are all in healthy ranges. Only fasting glucose is elevated (covered in Diabetes Markers section).'
    },
    {
      category: 'Complete Blood Count',
      status: 'excellent',
      abnormalCount: 0,
      totalCount: 6,
      ratios: {},
      riskScore: 10,
      recommendations: [
        'Continue current diet and lifestyle',
        'Ensure adequate iron intake',
        'Monitor if fatigue develops'
      ],
      interpretation: 'Excellent! All blood cell counts are in optimal ranges. No signs of anemia or blood disorders. Your hemoglobin is on the lower end of normal - ensure adequate iron and B12 intake.'
    },
    {
      category: 'Liver Function',
      status: 'excellent',
      abnormalCount: 0,
      totalCount: 6,
      ratios: {
        'AST/ALT': {
          value: 0.86,
          status: 'optimal',
          description: 'Liver enzyme ratio. <1.0 is normal, >2.0 may suggest alcohol-related damage'
        }
      },
      riskScore: 15,
      recommendations: [
        'Continue moderate alcohol intake (if any)',
        'Maintain healthy weight',
        'Regular exercise protects liver',
        'Coffee consumption (3+ cups) is liver-protective'
      ],
      interpretation: 'Perfect liver function! Enzymes are in healthy ranges. No signs of fatty liver disease or liver damage. Continue your healthy habits.'
    },
    {
      category: 'Thyroid Function',
      status: 'good',
      abnormalCount: 0,
      totalCount: 3,
      ratios: {},
      riskScore: 30,
      recommendations: [
        'Monitor TSH annually',
        'Ensure adequate iodine (150 mcg/day)',
        'Take selenium 200 mcg daily',
        'Manage stress (affects thyroid function)'
      ],
      interpretation: 'Thyroid function is normal, though TSH is at the higher end of optimal range. This may reflect early thyroid changes or stress. Free T3 and T4 are healthy. Continue selenium supplementation and monitor annually.'
    },
    {
      category: 'Vitamins & Minerals',
      status: 'needs_improvement',
      abnormalCount: 1,
      totalCount: 6,
      ratios: {},
      riskScore: 40,
      recommendations: [
        'Continue Vitamin D3 5000 IU daily',
        'Retest Vitamin D in 8-12 weeks',
        'Take Vitamin D with fat for absorption',
        'Consider increasing B12 to 1000 mcg daily',
        'Ensure adequate magnesium (400mg)'
      ],
      interpretation: 'Vitamin D is low but improving significantly (+27% in 6 months). At current supplementation rate, you should reach optimal levels (40-60 ng/mL) in 2-3 months. B12 is borderline low - consider increasing supplementation, especially if on metformin.'
    },
    {
      category: 'Hormones',
      status: 'excellent',
      abnormalCount: 0,
      totalCount: 2,
      ratios: {},
      riskScore: 20,
      recommendations: [
        'Continue strength training (supports testosterone)',
        'Prioritize sleep (7-9 hours)',
        'Manage stress (reduces cortisol)',
        'Maintain healthy weight'
      ],
      interpretation: 'Hormone levels are healthy. Testosterone is improving as Vitamin D levels rise. Morning cortisol is optimal. Continue current lifestyle approach.'
    },
    {
      category: 'Inflammation',
      status: 'good',
      abnormalCount: 0,
      totalCount: 2,
      ratios: {},
      riskScore: 45,
      recommendations: [
        'Follow anti-inflammatory diet (Mediterranean)',
        'Take omega-3s daily (2-4g EPA/DHA)',
        'Add curcumin supplement (500-1000mg)',
        'Regular exercise (moderate intensity)',
        'Prioritize sleep quality',
        'Manage chronic stress'
      ],
      interpretation: 'hs-CRP is technically normal but at the high end (elevated cardiovascular risk). It\'s improving (-12% in 6 months), which is excellent. Continue anti-inflammatory approach. Goal is <1.0 mg/L for optimal cardiovascular health. Homocysteine is borderline - B vitamins should help.'
    }
  ],

  supplements: [
    {
      name: 'Vitamin D3',
      dosage: '5000 IU',
      frequency: 'Daily',
      reason: 'Low vitamin D levels (28 ng/mL)',
      timing: 'With breakfast',
      dosageJustification: '5000 IU recommended for levels 20-29 ng/mL per Endocrine Society guidelines',
      citations: [
        { title: 'Evaluation, Treatment, and Prevention of Vitamin D Deficiency', source: 'Endocrine Society', url: 'https://pubmed.ncbi.nlm.nih.gov/21646368/', year: 2011, studyType: 'guideline', takeaway: '5000 IU daily for insufficiency, retest in 8-12 weeks' },
        { title: 'Effect of vitamin D supplementation on metabolic parameters', source: 'J Clin Endocrinol Metab', url: 'https://pubmed.ncbi.nlm.nih.gov/29878148/', year: 2018, studyType: 'meta-analysis', takeaway: 'Improved insulin sensitivity in 82% of participants' },
      ]
    },
    {
      name: 'Omega-3 Fish Oil',
      dosage: '2000 mg EPA/DHA',
      frequency: 'Daily',
      reason: 'Support cardiovascular health and reduce triglycerides',
      timing: 'With lunch',
      dosageJustification: '2000mg EPA/DHA shown effective for triglycerides 150-500 mg/dL',
      citations: [
        { title: 'Omega-3 Fatty Acids for Cardiovascular Disease', source: 'Circulation', url: 'https://pubmed.ncbi.nlm.nih.gov/29773586/', year: 2018, studyType: 'guideline', takeaway: 'Reduces triglycerides by 20-30% at therapeutic doses' },
        { title: 'Prescription omega-3 fatty acids for hypertriglyceridemia', source: 'Mayo Clin Proc', url: 'https://pubmed.ncbi.nlm.nih.gov/31060914/', year: 2019, studyType: 'review', takeaway: 'Greatest benefit at 2-4g daily EPA/DHA' },
      ]
    },
    {
      name: 'Magnesium Glycinate',
      dosage: '400 mg',
      frequency: 'Daily',
      reason: 'Support metabolic function and sleep quality',
      timing: 'Before bed',
      dosageJustification: '400mg is RDA for adult males; glycinate form best for sleep',
      citations: [
        { title: 'Magnesium in Prevention and Therapy', source: 'Nutrients', url: 'https://pubmed.ncbi.nlm.nih.gov/26404370/', year: 2015, studyType: 'review', takeaway: 'Improves insulin sensitivity and sleep quality' },
      ]
    },
    {
      name: 'Berberine',
      dosage: '500 mg',
      frequency: 'Twice daily',
      reason: 'Support healthy blood sugar levels (Glucose: 112 mg/dL, HbA1c: 5.8%)',
      timing: 'Before meals',
      dosageJustification: '500mg twice daily shown equivalent to metformin 500mg for glucose control',
      citations: [
        { title: 'Berberine in the Treatment of Type 2 Diabetes Mellitus', source: 'Metabolism', url: 'https://pubmed.ncbi.nlm.nih.gov/18442638/', year: 2008, studyType: 'rct', takeaway: 'Reduced HbA1c by 0.5% and fasting glucose by 21%' },
        { title: 'Efficacy and safety of berberine for glycemic control', source: 'J Ethnopharmacol', url: 'https://pubmed.ncbi.nlm.nih.gov/25176238/', year: 2015, studyType: 'meta-analysis', takeaway: 'Comparable to oral diabetes medications in 14 trials' },
      ]
    },
    {
      name: 'CoQ10',
      dosage: '200 mg',
      frequency: 'Daily',
      reason: 'Support cardiovascular health and energy production',
      timing: 'With breakfast',
      dosageJustification: '200mg recommended when taking statins to offset CoQ10 depletion',
      citations: [
        { title: 'Coenzyme Q10 supplementation in statin-treated patients', source: 'J Am Coll Cardiol', url: 'https://pubmed.ncbi.nlm.nih.gov/17482506/', year: 2007, studyType: 'rct', takeaway: 'Reduced muscle pain in 75% of statin users' },
      ]
    },
  ],

  medications: [
    {
      name: 'Atorvastatin (Lipitor)',
      dosage: '10 mg',
      frequency: 'Once daily',
      prescribedFor: 'High LDL cholesterol (145 mg/dL) and total cholesterol (215 mg/dL)',
      sideEffects: ['Muscle pain', 'Headache', 'Nausea'],
      dosageJustification: '10mg starting dose for LDL 130-189 mg/dL per ACC/AHA guidelines',
      citations: [
        { title: 'ACC/AHA Guideline on the Management of Blood Cholesterol', source: 'Circulation', url: 'https://pubmed.ncbi.nlm.nih.gov/30586774/', year: 2018, studyType: 'guideline', takeaway: 'Moderate-intensity statin reduces LDL by 30-49%' },
        { title: 'Efficacy and safety of atorvastatin', source: 'Am J Cardiol', url: 'https://pubmed.ncbi.nlm.nih.gov/9894438/', year: 1998, studyType: 'rct', takeaway: '10mg reduces LDL by 39% on average in 6 weeks' },
      ]
    },
    {
      name: 'Metformin',
      dosage: '500 mg',
      frequency: 'Twice daily',
      prescribedFor: 'Elevated fasting glucose (112 mg/dL) and HbA1c (5.8%)',
      sideEffects: ['Upset stomach', 'Diarrhea', 'Metallic taste'],
      dosageJustification: '500mg twice daily is standard starting dose for prediabetes/early diabetes',
      citations: [
        { title: 'Standards of Medical Care in Diabetes', source: 'ADA Diabetes Care', url: 'https://pubmed.ncbi.nlm.nih.gov/36507642/', year: 2023, studyType: 'guideline', takeaway: 'First-line pharmacotherapy for type 2 diabetes' },
        { title: 'Metformin for prevention of type 2 diabetes', source: 'Diabetes Prevention Program', url: 'https://pubmed.ncbi.nlm.nih.gov/11832527/', year: 2002, studyType: 'rct', takeaway: 'Reduced diabetes incidence by 31% over 3 years' },
      ]
    },
  ],

  exercises: [
    // Cardio
    {
      type: 'cardio',
      name: 'Brisk Walking',
      duration: '30 minutes',
      frequency: '5 days per week',
      intensity: 'Moderate (60-70% max heart rate)'
    },
    {
      type: 'cardio',
      name: 'Swimming',
      duration: '20 minutes',
      frequency: '2 days per week',
      intensity: 'Moderate to vigorous'
    },
    {
      type: 'cardio',
      name: 'Cycling',
      duration: '25 minutes',
      frequency: '3 days per week',
      intensity: 'Moderate'
    },

    // Weights
    {
      type: 'weights',
      name: 'Squats',
      sets: 3,
      reps: '10-12',
      frequency: '2 days per week',
      intensity: 'Moderate weight'
    },
    {
      type: 'weights',
      name: 'Bench Press',
      sets: 3,
      reps: '8-10',
      frequency: '2 days per week',
      intensity: 'Moderate weight'
    },
    {
      type: 'weights',
      name: 'Deadlifts',
      sets: 3,
      reps: '6-8',
      frequency: '1 day per week',
      intensity: 'Progressive overload'
    },
    {
      type: 'weights',
      name: 'Dumbbell Rows',
      sets: 3,
      reps: '10-12',
      frequency: '2 days per week',
      intensity: 'Moderate weight'
    },
    {
      type: 'weights',
      name: 'Shoulder Press',
      sets: 3,
      reps: '10-12',
      frequency: '2 days per week',
      intensity: 'Moderate weight'
    },
    {
      type: 'weights',
      name: 'Planks',
      sets: 3,
      reps: '30-60 seconds',
      frequency: '3 days per week',
      intensity: 'Bodyweight'
    },
  ],

  reminders: [
    {
      id: 'r1',
      type: 'medication',
      name: 'Atorvastatin',
      time: '08:00 AM',
      completed: true
    },
    {
      id: 'r2',
      type: 'supplement',
      name: 'Vitamin D3',
      time: '08:00 AM',
      completed: true
    },
    {
      id: 'r3',
      type: 'supplement',
      name: 'CoQ10',
      time: '08:00 AM',
      completed: true
    },
    {
      id: 'r4',
      type: 'supplement',
      name: 'Berberine',
      time: '12:00 PM',
      completed: false
    },
    {
      id: 'r5',
      type: 'medication',
      name: 'Metformin',
      time: '12:00 PM',
      completed: false
    },
    {
      id: 'r6',
      type: 'supplement',
      name: 'Omega-3',
      time: '12:00 PM',
      completed: false
    },
    {
      id: 'r7',
      type: 'supplement',
      name: 'Berberine',
      time: '06:00 PM',
      completed: false
    },
    {
      id: 'r8',
      type: 'medication',
      name: 'Metformin',
      time: '06:00 PM',
      completed: false
    },
    {
      id: 'r9',
      type: 'supplement',
      name: 'Magnesium',
      time: '10:00 PM',
      completed: false
    },
    {
      id: 'r10',
      type: 'exercise',
      name: 'Brisk Walking',
      time: '05:00 PM',
      completed: false
    },
  ],

  // Device Connections
  deviceConnections: [
    {
      id: 'dev1',
      type: 'fitbit',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      permissions: ['activity', 'heart_rate', 'sleep', 'exercise']
    }
  ],

  // Activity History - Last 90 days
  activityHistory: generateActivityHistory(),

  // Sleep History - Last 90 days
  sleepHistory: generateSleepHistory(),

  // Workout History - Last 30 days
  workoutHistory: generateWorkoutHistory()
};

// Helper functions to generate realistic mock data
function generateActivityHistory(): DailyActivity[] {
  const history: DailyActivity[] = [];
  const today = new Date('2025-11-20');

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Show progression - steps increase over time
    const baseSteps = 5000 + (90 - i) * 40; // Start at ~5000, end at ~8600
    const variance = Math.random() * 2000 - 1000; // +/- 1000 steps
    const steps = Math.max(3000, Math.floor(baseSteps + variance));

    const distance = +(steps / 2000).toFixed(1); // ~2000 steps per mile
    const activeMinutes = Math.floor(steps / 100) + Math.floor(Math.random() * 20); // Roughly correlated
    const caloriesBurned = 1800 + Math.floor(activeMinutes * 8) + Math.floor(Math.random() * 200);
    const floors = Math.floor(Math.random() * 15) + 5;

    // Resting heart rate improves over time
    const restingHR = 65 - Math.floor((90 - i) / 10) + Math.floor(Math.random() * 3);
    const avgHR = restingHR + 10 + Math.floor(Math.random() * 5);

    history.push({
      date: dateStr,
      steps,
      distance,
      activeMinutes,
      caloriesBurned,
      floors,
      heartRateAvg: avgHR,
      heartRateResting: restingHR,
      source: 'fitbit'
    });
  }

  return history.reverse(); // Return oldest first
}

function generateSleepHistory(): SleepData[] {
  const history: SleepData[] = [];
  const today = new Date('2025-11-20');

  for (let i = 1; i <= 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Sleep quality improves over time
    const baseDuration = 6.5 + (90 - i) * 0.008; // Start at 6.5h, improve to ~7.2h
    const variance = (Math.random() - 0.5) * 1.5;
    const duration = Math.max(5, Math.min(9, baseDuration + variance));

    // Sleep stages (roughly proportional to total duration)
    const deep = +(duration * (0.15 + Math.random() * 0.1)).toFixed(1);
    const rem = +(duration * (0.20 + Math.random() * 0.1)).toFixed(1);
    const awake = +(duration * (0.05 + Math.random() * 0.05)).toFixed(1);
    const light = +(duration - deep - rem - awake).toFixed(1);

    const efficiency = Math.floor(85 + (90 - i) * 0.05 + Math.random() * 5); // Improves 80% → 90%
    const sleepScore = Math.floor(efficiency * 0.9 + Math.random() * 10);
    const restingHR = 58 - Math.floor((90 - i) / 15) + Math.floor(Math.random() * 3);
    const respiratoryRate = 14 + Math.floor(Math.random() * 3);
    const timeToSleep = Math.floor(10 + Math.random() * 15);

    history.push({
      date: dateStr,
      duration: +duration.toFixed(1),
      sleepScore,
      stages: {
        deep,
        light,
        rem,
        awake
      },
      efficiency,
      restingHeartRate: restingHR,
      respiratoryRate,
      timeToSleep,
      source: 'fitbit'
    });
  }

  return history.reverse(); // Return oldest first
}

function generateWorkoutHistory(): Workout[] {
  const workouts: Workout[] = [];
  const today = new Date('2025-11-20');
  const workoutTypes = [
    { type: 'walking', avgDuration: 30, avgCals: 150, hasDistance: true },
    { type: 'running', avgDuration: 25, avgCals: 280, hasDistance: true },
    { type: 'cycling', avgDuration: 35, avgCals: 320, hasDistance: true },
    { type: 'swimming', avgDuration: 20, avgCals: 200, hasDistance: false },
    { type: 'weights', avgDuration: 40, avgCals: 180, hasDistance: false },
    { type: 'yoga', avgDuration: 45, avgCals: 120, hasDistance: false },
  ];

  let workoutId = 1;

  // Generate workouts - more frequent in recent weeks
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Workout probability increases over time (showing commitment building)
    const workoutProbability = 0.25 + (90 - i) * 0.003; // 25% → 52%

    if (Math.random() < workoutProbability) {
      const workout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      const duration = workout.avgDuration + Math.floor(Math.random() * 20 - 10);
      const calories = Math.floor(workout.avgCals * (duration / workout.avgDuration) * (0.9 + Math.random() * 0.2));

      const avgHR = 120 + Math.floor(Math.random() * 40);
      const maxHR = avgHR + 20 + Math.floor(Math.random() * 20);

      workouts.push({
        id: `w${workoutId++}`,
        date: dateStr,
        type: workout.type,
        duration,
        caloriesBurned: calories,
        distance: workout.hasDistance ? +(duration / 20 + Math.random() * 1).toFixed(1) : undefined,
        averageHeartRate: avgHR,
        maxHeartRate: maxHR,
        source: 'fitbit'
      });
    }
  }

  return workouts.reverse(); // Return oldest first
};
