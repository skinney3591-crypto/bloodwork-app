import { Dumbbell, Heart, Timer, Zap, Info, Flame, Calendar, CheckCircle, Activity } from 'lucide-react'
import type { Exercise, Workout } from '../data/mockData'
import DeviceBadge from './DeviceBadge'

interface ExerciseViewProps {
  exercises: Exercise[]
  workoutHistory?: Workout[]
}

// Estimated calories burned per exercise
const calorieEstimates: Record<string, number> = {
  'Brisk Walking': 150,
  'Swimming': 250,
  'Cycling': 200,
  'Squats': 100,
  'Bench Press': 90,
  'Deadlifts': 120,
  'Dumbbell Rows': 80,
  'Shoulder Press': 70,
  'Planks': 50,
}

// Weekly schedule (simplified - which days exercises are planned)
const weeklySchedule = [
  { day: 'Mon', exercises: ['Brisk Walking', 'Squats', 'Bench Press'] },
  { day: 'Tue', exercises: ['Swimming', 'Planks'] },
  { day: 'Wed', exercises: ['Brisk Walking', 'Cycling'] },
  { day: 'Thu', exercises: ['Dumbbell Rows', 'Shoulder Press', 'Planks'] },
  { day: 'Fri', exercises: ['Brisk Walking', 'Deadlifts'] },
  { day: 'Sat', exercises: ['Cycling', 'Squats', 'Bench Press'] },
  { day: 'Sun', exercises: ['Brisk Walking', 'Planks'] },
]

export default function ExerciseView({ exercises, workoutHistory = [] }: ExerciseViewProps) {
  const cardioExercises = exercises.filter(e => e.type === 'cardio')
  const weightExercises = exercises.filter(e => e.type === 'weights')

  // Get this week's workouts (last 7 days)
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  const thisWeekWorkouts = workoutHistory.filter(w => {
    const workoutDate = new Date(w.date)
    return workoutDate >= sevenDaysAgo && workoutDate <= today
  })

  // Map workout types to exercise names
  const workoutTypeToExercise: Record<string, string[]> = {
    'walking': ['Brisk Walking'],
    'running': ['Brisk Walking'], // Running counts as cardio
    'swimming': ['Swimming'],
    'cycling': ['Cycling'],
    'weights': ['Squats', 'Bench Press', 'Deadlifts', 'Dumbbell Rows', 'Shoulder Press'],
    'yoga': ['Planks'] // Yoga can count for core work
  }

  // Check if an exercise was completed via device this week
  const isExerciseCompleted = (exerciseName: string): { completed: boolean, workout?: Workout } => {
    for (const workout of thisWeekWorkouts) {
      const matchingExercises = workoutTypeToExercise[workout.type] || []
      if (matchingExercises.includes(exerciseName)) {
        // Also check if workout was long enough (at least 15 minutes)
        if (workout.duration >= 15) {
          return { completed: true, workout }
        }
      }
    }
    return { completed: false }
  }

  // Calculate completion stats
  const totalPlannedExercises = exercises.length
  const completedExercises = exercises.filter(e => isExerciseCompleted(e.name).completed).length
  const completionRate = totalPlannedExercises > 0 ? Math.round((completedExercises / totalPlannedExercises) * 100) : 0

  // Calculate total weekly calories
  const totalWeeklyCalories = weeklySchedule.reduce((total, day) => {
    return total + day.exercises.reduce((dayTotal, exercise) => {
      return dayTotal + (calorieEstimates[exercise] || 100)
    }, 0)
  }, 0)

  // Calculate per-exercise calorie info
  const getExerciseCalories = (name: string) => calorieEstimates[name] || 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Dumbbell className="h-7 w-7 mr-3 text-green-600" />
              Exercise Recommendations
            </h2>
            <p className="text-sm text-gray-600 mt-1">Personalized plan based on your health profile</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Activities</p>
            <p className="text-3xl font-bold text-green-600">{exercises.length}</p>
          </div>
        </div>
      </div>

      {/* This Week's Progress */}
      {workoutHistory.length > 0 && (
        <div className={`rounded-xl shadow-md p-6 border-2 ${completionRate >= 70 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' : completionRate >= 40 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                This Week's Progress
              </h3>
              <p className="text-sm text-gray-600 mt-1">Auto-tracked from your connected devices</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${completionRate >= 70 ? 'text-green-600' : completionRate >= 40 ? 'text-yellow-600' : 'text-orange-600'}`}>
                {completionRate}%
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Planned Exercises</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlannedExercises}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedExercises}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Device Workouts</p>
              <p className="text-2xl font-bold text-blue-600">{thisWeekWorkouts.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Exercise Benefits for Your Health Profile</p>
            <p className="text-sm text-green-800 mt-1">
              Based on your bloodwork (elevated glucose, cholesterol, and triglycerides), regular exercise will help improve insulin sensitivity,
              cardiovascular health, and overall metabolic function. Start slowly and consult your doctor before beginning any new exercise program.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Summary with Calories */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Exercise Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cardio Sessions</p>
                <p className="text-3xl font-bold text-blue-600">{cardioExercises.length}</p>
                <p className="text-xs text-gray-500 mt-1">Activities per week</p>
              </div>
              <Heart className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Strength Training</p>
                <p className="text-3xl font-bold text-purple-600">{weightExercises.length}</p>
                <p className="text-xs text-gray-500 mt-1">Exercises per week</p>
              </div>
              <Dumbbell className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Est. Weekly Burn</p>
                <p className="text-3xl font-bold text-orange-600">{totalWeeklyCalories}</p>
                <p className="text-xs text-gray-500 mt-1">Calories</p>
              </div>
              <Flame className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-600" />
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklySchedule.map((day, index) => (
            <div key={index} className="text-center">
              <div className="bg-green-600 text-white font-bold py-2 rounded-t-lg text-sm">
                {day.day}
              </div>
              <div className="border-2 border-t-0 border-green-200 rounded-b-lg p-2 min-h-[120px]">
                {day.exercises.length > 0 ? (
                  <div className="space-y-1">
                    {day.exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-1 rounded ${
                          cardioExercises.some(e => e.name === exercise)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {exercise.length > 8 ? exercise.substring(0, 8) + '...' : exercise}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-4">Rest</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cardio Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Heart className="h-6 w-6 mr-2 text-blue-600" />
          Cardiovascular Exercise
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Cardio exercises help lower blood sugar, improve heart health, and reduce triglycerides.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardioExercises.map((exercise, index) => {
            const { completed, workout } = isExerciseCompleted(exercise.name)
            return (
              <div
                key={index}
                className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 ${completed ? 'border-green-400 ring-2 ring-green-200' : 'border-blue-200'} hover:border-blue-400 hover:shadow-lg transition-all relative`}
              >
                {completed && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-6 w-6 text-green-600 fill-green-100" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{exercise.name}</h4>
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
                {completed && workout && workout.source !== 'manual' && (
                  <div className="mb-3">
                    <DeviceBadge type={workout.source} size="sm" />
                  </div>
                )}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{exercise.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">{exercise.intensity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">~{getExerciseCalories(exercise.name)} cal</span>
                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1 mt-2">
                  <p className="text-xs font-semibold text-blue-900">{exercise.frequency}</p>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      </div>

      {/* Strength Training Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Dumbbell className="h-6 w-6 mr-2 text-purple-600" />
          Strength Training
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Resistance training builds muscle mass, boosts metabolism, and improves insulin sensitivity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weightExercises.map((exercise, index) => {
            const { completed, workout } = isExerciseCompleted(exercise.name)
            return (
              <div
                key={index}
                className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 ${completed ? 'border-green-400 ring-2 ring-green-200' : 'border-purple-200'} hover:border-purple-400 hover:shadow-lg transition-all relative`}
              >
                {completed && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-6 w-6 text-green-600 fill-green-100" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{exercise.name}</h4>
                  <Dumbbell className="h-5 w-5 text-purple-600" />
                </div>
                {completed && workout && workout.source !== 'manual' && (
                  <div className="mb-3">
                    <DeviceBadge type={workout.source} size="sm" />
                  </div>
                )}
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-2 border border-purple-200">
                  <p className="text-xs text-gray-600">Sets × Reps</p>
                  <p className="text-lg font-bold text-purple-900">
                    {exercise.sets} × {exercise.reps}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">{exercise.intensity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">~{getExerciseCalories(exercise.name)} cal</span>
                </div>
                <div className="bg-purple-100 rounded-lg px-3 py-1 mt-2">
                  <p className="text-xs font-semibold text-purple-900">{exercise.frequency}</p>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      </div>

      {/* Exercise Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-green-600" />
          Exercise Safety & Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Start Gradually</p>
            <p className="text-sm text-gray-600">
              Begin with lower intensity and shorter durations. Gradually increase as your fitness improves.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Stay Hydrated</p>
            <p className="text-sm text-gray-600">
              Drink plenty of water before, during, and after exercise, especially if taking medications.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Listen to Your Body</p>
            <p className="text-sm text-gray-600">
              Stop if you feel dizzy, chest pain, or unusual shortness of breath. Consult your doctor if symptoms persist.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
