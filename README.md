# HealthSync AI - Bloodwork Analysis Application

A beautiful and functional front-end application that interprets comprehensive bloodwork data and provides personalized recommendations for supplements, medications, exercise, and daily reminders.

## Features

### 1. Dashboard Overview
- Summary statistics of all health metrics
- Key findings highlighting abnormal results
- Quick view of recommended supplements and exercise plan
- Test date information

### 2. Blood Panel Analysis
- Complete blood count (CBC) results
- Metabolic panel
- Liver function tests
- Lipid panel (cholesterol, triglycerides)
- Thyroid function
- Vitamins and minerals
- Hormones
- Inflammation markers
- Diabetes markers
- Interactive bar chart visualization of abnormal results
- Category-based filtering system
- Color-coded status indicators (Normal, High, Low)

### 3. Supplement Recommendations
- AI-generated supplement plan based on bloodwork
- Detailed dosage and timing information
- Reasons for each recommendation linked to specific lab results
- Schedule summary by time of day

### 4. Medication Plan
- Prescribed medications with dosages
- Detailed information about why each medication was recommended
- Side effects warnings
- Safety guidelines
- Critical notices about doctor review requirements

### 5. Exercise Recommendations
- Personalized cardio exercises (walking, swimming, cycling)
- Strength training exercises with sets and reps
- Frequency and intensity guidelines
- Safety tips and precautions
- Based on specific health markers (glucose, cholesterol, triglycerides)

### 6. Daily Reminders
- Interactive reminder system for medications, supplements, and exercise
- Time-based schedule view
- Check-off functionality to track completion
- Progress tracking with visual progress bar
- Grouped by scheduled time
- Statistics by reminder type

### 7. Doctor Review Status
- Prominent status indicator in the header
- Three states: Pending, In Review, Approved
- Color-coded for quick recognition

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for beautiful, responsive styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

The application is currently running at:
**http://localhost:5173/**

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Sample Data

The application includes comprehensive fake data for "Customer 1" (John Anderson, 45-year-old male):

- **42 bloodwork tests** across 8 categories
- **5 supplement recommendations**
- **2 prescribed medications**
- **9 exercise activities** (3 cardio + 6 strength training)
- **10 daily reminders**

### Abnormal Results in Sample Data:
- Elevated glucose (112 mg/dL)
- High total cholesterol (215 mg/dL)
- High LDL cholesterol (145 mg/dL)
- High triglycerides (165 mg/dL)
- Elevated HbA1c (5.8%)
- Low Vitamin D (28 ng/mL)

## Important Medical Disclaimers

This application displays AI-generated health recommendations that:
- Are for demonstration purposes only
- MUST be reviewed by a licensed physician before implementation
- Do NOT constitute medical advice
- Should never be used to start, stop, or modify treatments without doctor approval

## Project Structure

```
bloodwork-app/
├── src/
│   ├── components/
│   │   ├── DashboardOverview.tsx    # Main overview page
│   │   ├── BloodworkView.tsx        # Blood panel results with charts
│   │   ├── SupplementsView.tsx      # Supplement recommendations
│   │   ├── MedicationsView.tsx      # Medication plan
│   │   ├── ExerciseView.tsx         # Exercise recommendations
│   │   └── RemindersView.tsx        # Daily reminders tracker
│   ├── data/
│   │   └── mockData.ts              # Comprehensive fake bloodwork data
│   ├── App.tsx                      # Main application with navigation
│   └── index.css                    # Tailwind CSS imports
├── package.json
└── tailwind.config.js
```

## Design Highlights

- **Gradient backgrounds** for visual appeal
- **Color-coded status indicators** for easy interpretation
- **Interactive charts** using Recharts library
- **Responsive grid layouts** that work on all screen sizes
- **Hover effects** and smooth transitions
- **Icon-based navigation** for intuitive UX
- **Progress tracking** with visual indicators

## Customization

To modify the sample data, edit `/src/data/mockData.ts`. The data structure includes:
- `BloodworkResult` - Individual test results
- `Supplement` - Supplement recommendations
- `Medication` - Prescribed medications
- `Exercise` - Exercise activities
- `Reminder` - Daily reminders
- `CustomerData` - Complete patient profile

## Future Enhancements (Backend Integration)

When connecting to a real backend, you would:
1. Replace mock data with API calls
2. Add authentication for multiple users
3. Implement real-time doctor review workflow
4. Add notification system for reminders
5. Enable data export (PDF reports)
6. Add historical tracking and trends
7. Implement secure HIPAA-compliant data storage

## License

This is a demonstration project for educational purposes.
