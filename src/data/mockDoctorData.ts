export interface DoctorProfile {
  name: string
  practice: string
  specialty: string
  patientCount: number
  todaysAppointments: number
  unreadMessages: number
  criticalAlerts: number
  photo: string
}

export interface PatientSummary {
  id: string
  name: string
  age: number
  gender: string
  photo: string
  lastVisit: string
  nextAppointment: string | null
  unreadMessages: number
  criticalLabs: number
  conditions: string[]
  riskScore: number // 0-100
  recentLabs: {
    [key: string]: {
      value: number
      unit: string
      trend: 'rising' | 'falling' | 'stable'
      isAbnormal: boolean
    }
  }
  medications: string[]
}

export interface Message {
  id: string
  patientId: string
  patientName: string
  patientPhoto: string
  preview: string
  fullText: string
  time: string
  timestamp: Date
  isUrgent: boolean
  unread: boolean
  attachments?: { type: 'lab' | 'image' | 'pdf'; url: string; name: string }[]
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientPhoto: string
  time: string
  duration: number // minutes
  type: 'routine' | 'follow-up' | 'urgent' | 'new_patient' | 'lab_review'
  reason: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
}

export interface DoctorData {
  doctor: DoctorProfile
  patients: PatientSummary[]
  messages: Message[]
  appointments: Appointment[]
}

// Generate realistic mock data
export const mockDoctorData: DoctorData = {
  doctor: {
    name: 'Dr. Sarah Chen',
    practice: 'Precision Health Partners',
    specialty: 'Internal Medicine',
    patientCount: 247,
    todaysAppointments: 8,
    unreadMessages: 12,
    criticalAlerts: 3,
    photo: '/avatars/doctor.jpg'
  },

  patients: [
    {
      id: '1',
      name: 'Robert Johnson',
      age: 54,
      gender: 'Male',
      photo: '/avatars/patient1.jpg',
      lastVisit: '2025-11-05',
      nextAppointment: '2025-12-01',
      unreadMessages: 2,
      criticalLabs: 2,
      conditions: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol'],
      riskScore: 72,
      recentLabs: {
        glucose: { value: 142, unit: 'mg/dL', trend: 'rising', isAbnormal: true },
        a1c: { value: 7.2, unit: '%', trend: 'stable', isAbnormal: true },
        ldl: { value: 165, unit: 'mg/dL', trend: 'rising', isAbnormal: true },
        blood_pressure: { value: 145, unit: 'mmHg', trend: 'rising', isAbnormal: true }
      },
      medications: ['Metformin 1000mg', 'Lisinopril 10mg', 'Atorvastatin 20mg']
    },
    {
      id: '2',
      name: 'Maria Garcia',
      age: 62,
      gender: 'Female',
      photo: '/avatars/patient2.jpg',
      lastVisit: '2025-10-28',
      nextAppointment: '2025-11-30',
      unreadMessages: 0,
      criticalLabs: 1,
      conditions: ['Hypothyroidism', 'Osteopenia'],
      riskScore: 45,
      recentLabs: {
        tsh: { value: 4.8, unit: 'mIU/L', trend: 'rising', isAbnormal: true },
        vitamin_d: { value: 22, unit: 'ng/mL', trend: 'stable', isAbnormal: true },
        calcium: { value: 8.9, unit: 'mg/dL', trend: 'stable', isAbnormal: false }
      },
      medications: ['Levothyroxine 75mcg', 'Vitamin D3 5000 IU']
    },
    {
      id: '3',
      name: 'James Thompson',
      age: 48,
      gender: 'Male',
      photo: '/avatars/patient3.jpg',
      lastVisit: '2025-11-18',
      nextAppointment: null,
      unreadMessages: 1,
      criticalLabs: 0,
      conditions: ['Prediabetes'],
      riskScore: 58,
      recentLabs: {
        glucose: { value: 108, unit: 'mg/dL', trend: 'falling', isAbnormal: false },
        a1c: { value: 5.9, unit: '%', trend: 'falling', isAbnormal: false },
        triglycerides: { value: 185, unit: 'mg/dL', trend: 'stable', isAbnormal: true }
      },
      medications: ['Berberine 500mg']
    },
    {
      id: '4',
      name: 'Linda Chen',
      age: 71,
      gender: 'Female',
      photo: '/avatars/patient4.jpg',
      lastVisit: '2025-11-12',
      nextAppointment: '2025-12-10',
      unreadMessages: 0,
      criticalLabs: 3,
      conditions: ['Atrial Fibrillation', 'Heart Failure', 'CKD Stage 3'],
      riskScore: 88,
      recentLabs: {
        creatinine: { value: 1.8, unit: 'mg/dL', trend: 'rising', isAbnormal: true },
        bnp: { value: 450, unit: 'pg/mL', trend: 'rising', isAbnormal: true },
        potassium: { value: 5.3, unit: 'mmol/L', trend: 'rising', isAbnormal: true },
        inr: { value: 2.8, unit: '', trend: 'stable', isAbnormal: false }
      },
      medications: ['Warfarin 5mg', 'Metoprolol 50mg', 'Furosemide 40mg', 'Lisinopril 20mg']
    },
    {
      id: '5',
      name: 'Michael Brown',
      age: 56,
      gender: 'Male',
      photo: '/avatars/patient5.jpg',
      lastVisit: '2025-11-08',
      nextAppointment: '2025-11-28',
      unreadMessages: 3,
      criticalLabs: 1,
      conditions: ['Gout', 'Metabolic Syndrome'],
      riskScore: 65,
      recentLabs: {
        uric_acid: { value: 9.2, unit: 'mg/dL', trend: 'rising', isAbnormal: true },
        triglycerides: { value: 245, unit: 'mg/dL', trend: 'stable', isAbnormal: true },
        glucose: { value: 118, unit: 'mg/dL', trend: 'stable', isAbnormal: true }
      },
      medications: ['Allopurinol 300mg', 'Colchicine 0.6mg PRN']
    },
    {
      id: '6',
      name: 'Jennifer Wilson',
      age: 42,
      gender: 'Female',
      photo: '/avatars/patient6.jpg',
      lastVisit: '2025-11-20',
      nextAppointment: '2026-01-15',
      unreadMessages: 0,
      criticalLabs: 0,
      conditions: ['Iron Deficiency Anemia'],
      riskScore: 28,
      recentLabs: {
        hemoglobin: { value: 11.8, unit: 'g/dL', trend: 'rising', isAbnormal: true },
        ferritin: { value: 18, unit: 'ng/mL', trend: 'rising', isAbnormal: true },
        iron: { value: 45, unit: 'mcg/dL', trend: 'rising', isAbnormal: true }
      },
      medications: ['Ferrous Sulfate 325mg']
    },
    {
      id: '7',
      name: 'David Martinez',
      age: 59,
      gender: 'Male',
      photo: '/avatars/patient7.jpg',
      lastVisit: '2025-11-15',
      nextAppointment: '2025-12-15',
      unreadMessages: 1,
      criticalLabs: 0,
      conditions: ['Hyperlipidemia'],
      riskScore: 42,
      recentLabs: {
        ldl: { value: 125, unit: 'mg/dL', trend: 'falling', isAbnormal: false },
        hdl: { value: 48, unit: 'mg/dL', trend: 'rising', isAbnormal: false },
        triglycerides: { value: 138, unit: 'mg/dL', trend: 'falling', isAbnormal: false }
      },
      medications: ['Atorvastatin 10mg', 'Omega-3 2g']
    },
    {
      id: '8',
      name: 'Patricia Anderson',
      age: 67,
      gender: 'Female',
      photo: '/avatars/patient8.jpg',
      lastVisit: '2025-10-22',
      nextAppointment: '2025-11-25',
      unreadMessages: 2,
      criticalLabs: 1,
      conditions: ['COPD', 'Osteoporosis'],
      riskScore: 68,
      recentLabs: {
        vitamin_d: { value: 18, unit: 'ng/mL', trend: 'stable', isAbnormal: true },
        calcium: { value: 8.6, unit: 'mg/dL', trend: 'stable', isAbnormal: true }
      },
      medications: ['Albuterol Inhaler', 'Advair 250/50', 'Alendronate 70mg weekly']
    },
    {
      id: '9',
      name: 'Thomas Lee',
      age: 45,
      gender: 'Male',
      photo: '/avatars/patient9.jpg',
      lastVisit: '2025-11-19',
      nextAppointment: null,
      unreadMessages: 0,
      criticalLabs: 0,
      conditions: ['Anxiety', 'Sleep Apnea'],
      riskScore: 35,
      recentLabs: {
        tsh: { value: 2.1, unit: 'mIU/L', trend: 'stable', isAbnormal: false },
        vitamin_d: { value: 32, unit: 'ng/mL', trend: 'stable', isAbnormal: false }
      },
      medications: ['CPAP Device', 'Sertraline 50mg']
    },
    {
      id: '10',
      name: 'Susan Davis',
      age: 53,
      gender: 'Female',
      photo: '/avatars/patient10.jpg',
      lastVisit: '2025-11-10',
      nextAppointment: '2025-12-08',
      unreadMessages: 1,
      criticalLabs: 0,
      conditions: ['Hashimoto\'s Thyroiditis', 'Perimenopause'],
      riskScore: 38,
      recentLabs: {
        tsh: { value: 2.8, unit: 'mIU/L', trend: 'stable', isAbnormal: false },
        free_t4: { value: 1.1, unit: 'ng/dL', trend: 'stable', isAbnormal: false }
      },
      medications: ['Levothyroxine 100mcg']
    },
    {
      id: '11',
      name: 'William Taylor',
      age: 72,
      gender: 'Male',
      photo: '/avatars/patient11.jpg',
      lastVisit: '2025-11-03',
      nextAppointment: '2025-12-03',
      unreadMessages: 0,
      criticalLabs: 1,
      conditions: ['Type 2 Diabetes', 'CAD s/p Stent'],
      riskScore: 78,
      recentLabs: {
        a1c: { value: 8.1, unit: '%', trend: 'rising', isAbnormal: true },
        glucose: { value: 185, unit: 'mg/dL', trend: 'rising', isAbnormal: true },
        ldl: { value: 78, unit: 'mg/dL', trend: 'stable', isAbnormal: false }
      },
      medications: ['Metformin 1000mg', 'Glipizide 5mg', 'Aspirin 81mg', 'Atorvastatin 40mg']
    },
    {
      id: '12',
      name: 'Elizabeth Moore',
      age: 38,
      gender: 'Female',
      photo: '/avatars/patient12.jpg',
      lastVisit: '2025-11-17',
      nextAppointment: null,
      unreadMessages: 0,
      criticalLabs: 0,
      conditions: ['PCOS', 'Insulin Resistance'],
      riskScore: 48,
      recentLabs: {
        glucose: { value: 98, unit: 'mg/dL', trend: 'falling', isAbnormal: false },
        testosterone: { value: 68, unit: 'ng/dL', trend: 'stable', isAbnormal: true },
        dhea: { value: 420, unit: 'mcg/dL', trend: 'stable', isAbnormal: true }
      },
      medications: ['Metformin 500mg', 'Spironolactone 50mg']
    }
  ],

  messages: [
    {
      id: 'm1',
      patientId: '1',
      patientName: 'Robert Johnson',
      patientPhoto: '/avatars/patient1.jpg',
      preview: 'I\'ve been feeling dizzy since starting the new medication...',
      fullText: 'Hi Dr. Chen, I\'ve been feeling dizzy and lightheaded since starting the new dose of Lisinopril. It usually happens when I stand up quickly. Should I be concerned? It\'s been happening for about 3 days now.',
      time: '10 mins ago',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isUrgent: true,
      unread: true
    },
    {
      id: 'm2',
      patientId: '5',
      patientName: 'Michael Brown',
      patientPhoto: '/avatars/patient5.jpg',
      preview: 'Had another gout flare-up last night, took colchicine...',
      fullText: 'Dr. Chen, I had another gout flare-up in my left big toe last night. I took one colchicine like you said, and it helped a bit. The pain is about 6/10 now. Should I take another dose or just ice it? Also, I had eaten shrimp earlier that evening - could that have triggered it?',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isUrgent: false,
      unread: true
    },
    {
      id: 'm3',
      patientId: '8',
      patientName: 'Patricia Anderson',
      patientPhoto: '/avatars/patient8.jpg',
      preview: 'Question about my new vitamin D prescription...',
      fullText: 'Hi Doctor, the pharmacy gave me Vitamin D3 50,000 IU capsules. The label says take one weekly. Is this correct? It seems like a very high dose compared to what I see in the store.',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isUrgent: false,
      unread: true
    },
    {
      id: 'm4',
      patientId: '1',
      patientName: 'Robert Johnson',
      patientPhoto: '/avatars/patient1.jpg',
      preview: 'My blood sugar was 185 this morning after breakfast...',
      fullText: 'Good morning Dr. Chen, just wanted to let you know my fasting glucose this morning was 185 mg/dL. That\'s higher than usual. I did eat pasta last night for dinner, which might have affected it. Should I adjust anything?',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isUrgent: false,
      unread: true
    },
    {
      id: 'm5',
      patientId: '3',
      patientName: 'James Thompson',
      patientPhoto: '/avatars/patient3.jpg',
      preview: 'Great news! Lost 8 pounds this month...',
      fullText: 'Dr. Chen, I wanted to share some good news! I\'ve lost 8 pounds this month following your diet recommendations. My energy levels are much better too. I\'ve been walking 30 minutes every day and cutting back on refined carbs like you suggested. Thank you!',
      time: '5 hours ago',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isUrgent: false,
      unread: true
    },
    {
      id: 'm6',
      patientId: '10',
      patientName: 'Susan Davis',
      patientPhoto: '/avatars/patient10.jpg',
      preview: 'Still experiencing fatigue even with thyroid medication...',
      fullText: 'Hi Dr. Chen, I\'ve been on the Levothyroxine 100mcg for 6 weeks now, but I\'m still feeling very tired, especially in the afternoons. My hair is still falling out more than normal too. Do you think we need to adjust my dose?',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isUrgent: false,
      unread: true
    },
    {
      id: 'm7',
      patientId: '12',
      patientName: 'Elizabeth Moore',
      patientPhoto: '/avatars/patient12.jpg',
      preview: 'Side effects from Spironolactone - breast tenderness...',
      fullText: 'Dr. Chen, I\'ve been on Spironolactone for 3 weeks and I\'m experiencing quite a bit of breast tenderness. Is this normal? Will it go away? The medication is helping with my acne though!',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
      isUrgent: false,
      unread: true
    },
    {
      id: 'm8',
      patientId: '7',
      patientName: 'David Martinez',
      patientPhoto: '/avatars/patient7.jpg',
      preview: 'Can I get a refill on my Atorvastatin? Running low...',
      fullText: 'Hi Dr. Chen, I\'m running low on my Atorvastatin (about 5 days left). Could you please send a refill to CVS on Main Street? Thank you!',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      isUrgent: false,
      unread: false
    },
    {
      id: 'm9',
      patientId: '6',
      patientName: 'Jennifer Wilson',
      patientPhoto: '/avatars/patient6.jpg',
      preview: 'Iron supplement is causing constipation...',
      fullText: 'Dr. Chen, the iron supplement is really helping my energy, but it\'s causing pretty bad constipation. Are there any alternatives or should I take something with it? I\'ve been drinking more water but it hasn\'t helped much.',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000),
      isUrgent: false,
      unread: false
    },
    {
      id: 'm10',
      patientId: '9',
      patientName: 'Thomas Lee',
      patientPhoto: '/avatars/patient9.jpg',
      preview: 'CPAP machine update - feeling much better!',
      fullText: 'Hi Dr. Chen, just wanted to let you know the CPAP machine is working great! I\'ve been using it every night for 2 weeks now. My wife says I don\'t snore anymore and I wake up feeling so much more rested. My AHI score on the app is down to 2.3. Thank you for pushing me to try it!',
      time: '3 days ago',
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      isUrgent: false,
      unread: false
    },
    {
      id: 'm11',
      patientId: '4',
      patientName: 'Linda Chen',
      patientPhoto: '/avatars/patient4.jpg',
      preview: 'Ankle swelling has gotten worse this week...',
      fullText: 'Dr. Chen, my ankles have been more swollen than usual this past week. I\'ve been taking my Furosemide every morning like I\'m supposed to. I did eat some salty food at a restaurant a few days ago. Should I come in or is this okay?',
      time: '3 days ago',
      timestamp: new Date(Date.now() - 75 * 60 * 60 * 1000),
      isUrgent: true,
      unread: false,
      attachments: [
        { type: 'image', url: '/attachments/ankle-photo.jpg', name: 'ankle-swelling.jpg' }
      ]
    },
    {
      id: 'm12',
      patientId: '11',
      patientName: 'William Taylor',
      patientPhoto: '/avatars/patient11.jpg',
      preview: 'Lab results portal - need help accessing...',
      fullText: 'Dr. Chen, I got an email saying my lab results are ready, but I can\'t figure out how to log in to the patient portal. Can someone call me to help me set it up? My number is 555-0123.',
      time: '4 days ago',
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
      isUrgent: false,
      unread: false
    }
  ],

  appointments: [
    {
      id: 'a1',
      patientId: '2',
      patientName: 'Maria Garcia',
      patientPhoto: '/avatars/patient2.jpg',
      time: '09:00 AM',
      duration: 30,
      type: 'routine',
      reason: 'Thyroid follow-up, review TSH results',
      status: 'scheduled'
    },
    {
      id: 'a2',
      patientId: '5',
      patientName: 'Michael Brown',
      patientPhoto: '/avatars/patient5.jpg',
      time: '09:45 AM',
      duration: 20,
      type: 'urgent',
      reason: 'Gout flare evaluation',
      status: 'scheduled'
    },
    {
      id: 'a3',
      patientId: '15',
      patientName: 'Karen White',
      patientPhoto: '/avatars/patient15.jpg',
      time: '10:30 AM',
      duration: 45,
      type: 'new_patient',
      reason: 'New patient consultation - fatigue',
      status: 'scheduled'
    },
    {
      id: 'a4',
      patientId: '1',
      patientName: 'Robert Johnson',
      patientPhoto: '/avatars/patient1.jpg',
      time: '11:30 AM',
      duration: 30,
      type: 'lab_review',
      reason: 'Review A1C and adjust diabetes management',
      status: 'scheduled'
    },
    {
      id: 'a5',
      patientId: '7',
      patientName: 'David Martinez',
      patientPhoto: '/avatars/patient7.jpg',
      time: '01:00 PM',
      duration: 20,
      type: 'follow-up',
      reason: 'Lipid panel review',
      status: 'scheduled'
    },
    {
      id: 'a6',
      patientId: '10',
      patientName: 'Susan Davis',
      patientPhoto: '/avatars/patient10.jpg',
      time: '01:30 PM',
      duration: 30,
      type: 'follow-up',
      reason: 'Thyroid medication adjustment discussion',
      status: 'scheduled'
    },
    {
      id: 'a7',
      patientId: '16',
      patientName: 'Daniel Kim',
      patientPhoto: '/avatars/patient16.jpg',
      time: '02:30 PM',
      duration: 30,
      type: 'routine',
      reason: 'Annual physical exam',
      status: 'scheduled'
    },
    {
      id: 'a8',
      patientId: '8',
      patientName: 'Patricia Anderson',
      patientPhoto: '/avatars/patient8.jpg',
      time: '03:30 PM',
      duration: 30,
      type: 'follow-up',
      reason: 'COPD management and osteoporosis review',
      status: 'scheduled'
    }
  ]
}
