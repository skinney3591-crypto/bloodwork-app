import { useState, useMemo } from 'react'
import { Search, X, Plus, Dumbbell, Filter } from 'lucide-react'
import type { ExerciseDefinition, MuscleGroup, Equipment, DailyExercise, CustomExercise } from '../../data/trainerData'
import { exerciseLibrary } from '../../data/exerciseLibrary'
import { mockCustomExercises } from '../../data/mockTrainerData'

interface ExercisePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelectExercise: (exercise: DailyExercise) => void
  trainerId: string
}

type MuscleFilter = 'all' | MuscleGroup
type EquipmentFilter = 'all' | Equipment
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced'

export default function ExercisePicker({
  isOpen,
  onClose,
  onSelectExercise,
  trainerId,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [muscleFilter, setMuscleFilter] = useState<MuscleFilter>('all')
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentFilter>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customExerciseName, setCustomExerciseName] = useState('')

  // Combine library and custom exercises
  const customExercises = mockCustomExercises.filter(e => e.trainerId === trainerId)

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exerciseLibrary.filter(exercise => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = exercise.name.toLowerCase().includes(query)
        const matchesMuscle = exercise.muscleGroups.some(m => m.toLowerCase().includes(query))
        if (!matchesName && !matchesMuscle) return false
      }

      // Muscle filter
      if (muscleFilter !== 'all' && !exercise.muscleGroups.includes(muscleFilter)) {
        return false
      }

      // Equipment filter
      if (equipmentFilter !== 'all' && !exercise.equipment.includes(equipmentFilter)) {
        return false
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && exercise.difficulty !== difficultyFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, muscleFilter, equipmentFilter, difficultyFilter])

  // Filter custom exercises
  const filteredCustomExercises = useMemo(() => {
    if (!searchQuery) return customExercises
    const query = searchQuery.toLowerCase()
    return customExercises.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.muscleGroups?.some(m => m.toLowerCase().includes(query))
    )
  }, [customExercises, searchQuery])

  const handleSelectExercise = (exercise: ExerciseDefinition | CustomExercise) => {
    const dailyExercise: DailyExercise = {
      id: `de-${Date.now()}`,
      exerciseId: exercise.id,
      name: exercise.name,
      order: 0, // Will be set by parent
      sets: 3,
      reps: '10-12',
      restPeriod: 60,
    }
    onSelectExercise(dailyExercise)
    onClose()
  }

  const handleAddCustomExercise = () => {
    if (!customExerciseName.trim()) return

    const dailyExercise: DailyExercise = {
      id: `de-${Date.now()}`,
      name: customExerciseName.trim(),
      order: 0,
      sets: 3,
      reps: '10-12',
      restPeriod: 60,
    }
    onSelectExercise(dailyExercise)
    setCustomExerciseName('')
    setShowCustomForm(false)
    onClose()
  }

  const getMuscleGroupEmoji = (muscle: MuscleGroup): string => {
    const emojiMap: Record<string, string> = {
      chest: '🫁',
      back: '🔙',
      shoulders: '💪',
      biceps: '💪',
      triceps: '💪',
      quadriceps: '🦵',
      hamstrings: '🦵',
      glutes: '🍑',
      calves: '🦶',
      core: '🎯',
      abs: '🎯',
      full_body: '🏃',
    }
    return emojiMap[muscle] || '🏋️'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const muscleGroups: MuscleGroup[] = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps',
    'quadriceps', 'hamstrings', 'glutes', 'calves', 'core', 'abs', 'full_body'
  ]

  const equipmentOptions: Equipment[] = [
    'barbell', 'dumbbell', 'kettlebell', 'machine', 'cable',
    'bodyweight', 'resistance_bands', 'pull_up_bar', 'bench'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Add Exercise</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showFilters ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(muscleFilter !== 'all' || equipmentFilter !== 'all' || difficultyFilter !== 'all') && (
                <span className="bg-orange-500 text-white text-xs px-1.5 rounded-full">!</span>
              )}
            </button>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="flex items-center gap-2 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Custom Exercise
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">MUSCLE GROUP</label>
                <select
                  value={muscleFilter}
                  onChange={(e) => setMuscleFilter(e.target.value as MuscleFilter)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Muscle Groups</option>
                  {muscleGroups.map(m => (
                    <option key={m} value={m}>{m.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">EQUIPMENT</label>
                <select
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value as EquipmentFilter)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Equipment</option>
                  {equipmentOptions.map(e => (
                    <option key={e} value={e}>{e.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">DIFFICULTY</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setMuscleFilter('all')
                  setEquipmentFilter('all')
                  setDifficultyFilter('all')
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Custom Exercise Form */}
          {showCustomForm && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Add Custom Exercise
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customExerciseName}
                  onChange={(e) => setCustomExerciseName(e.target.value)}
                  placeholder="Exercise name..."
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomExercise()}
                />
                <button
                  onClick={handleAddCustomExercise}
                  disabled={!customExerciseName.trim()}
                  className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Custom Exercises Section */}
          {filteredCustomExercises.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Your Custom Exercises</h3>
              <div className="space-y-2">
                {filteredCustomExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelectExercise(exercise)}
                    className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-orange-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{exercise.name}</p>
                        {exercise.muscleGroups && (
                          <p className="text-sm text-gray-600">
                            {exercise.muscleGroups.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Plus className="h-5 w-5 text-orange-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Library Exercises */}
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Exercise Library ({filteredExercises.length})
          </h3>
          <div className="space-y-2">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleSelectExercise(exercise)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg">
                    {getMuscleGroupEmoji(exercise.muscleGroups[0])}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{exercise.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {exercise.muscleGroups.join(', ')}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-gray-400 group-hover:text-orange-600" />
              </button>
            ))}
          </div>

          {filteredExercises.length === 0 && filteredCustomExercises.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No exercises found matching your search</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setMuscleFilter('all')
                  setEquipmentFilter('all')
                  setDifficultyFilter('all')
                }}
                className="mt-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear search & filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
