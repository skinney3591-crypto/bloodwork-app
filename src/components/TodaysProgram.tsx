import { useState } from 'react'
import { Dumbbell, Clock, Timer, CheckCircle, Link2, Play, ChevronRight, ArrowRight, Repeat } from 'lucide-react'
import type { DailyProgram, DailyExercise } from '../data/trainerData'
import { getTodaysDailyPrograms, getDailyProgramById } from '../data/mockTrainerData'

// Available groups with colors (same as builder)
const GROUP_STYLES: Record<string, { color: string; bgColor: string; bgColorLight: string; borderColor: string }> = {
  'A': { color: 'text-blue-700', bgColor: 'bg-blue-100', bgColorLight: 'bg-blue-50', borderColor: 'border-blue-300' },
  'B': { color: 'text-green-700', bgColor: 'bg-green-100', bgColorLight: 'bg-green-50', borderColor: 'border-green-300' },
  'C': { color: 'text-purple-700', bgColor: 'bg-purple-100', bgColorLight: 'bg-purple-50', borderColor: 'border-purple-300' },
  'D': { color: 'text-orange-700', bgColor: 'bg-orange-100', bgColorLight: 'bg-orange-50', borderColor: 'border-orange-300' },
  'E': { color: 'text-pink-700', bgColor: 'bg-pink-100', bgColorLight: 'bg-pink-50', borderColor: 'border-pink-300' },
  'F': { color: 'text-cyan-700', bgColor: 'bg-cyan-100', bgColorLight: 'bg-cyan-50', borderColor: 'border-cyan-300' },
}

const getGroupStyle = (group?: string) => {
  return group ? GROUP_STYLES[group] || { color: 'text-gray-500', bgColor: 'bg-gray-100', bgColorLight: 'bg-gray-50', borderColor: 'border-gray-300' } : null
}

interface TodaysProgramProps {
  clientId?: string  // Optional - filter to programs assigned to this client
  onStartWorkout?: (program: DailyProgram) => void
}

export default function TodaysProgram({ clientId, onStartWorkout }: TodaysProgramProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())

  // Get today's programs
  const todaysPrograms = getTodaysDailyPrograms()

  // Filter to programs the client is assigned to or joined
  const clientPrograms = clientId
    ? todaysPrograms.filter(p =>
        p.assignedClientIds.includes(clientId) ||
        p.selfJoinedClientIds.includes(clientId)
      )
    : todaysPrograms.filter(p => p.isPublic || p.status === 'published')

  const selectedProgram = selectedProgramId
    ? getDailyProgramById(selectedProgramId)
    : clientPrograms[0]

  // Group exercises by their group property
  const groupExercises = (exercises: DailyExercise[]) => {
    const groups: { group: string | null; exercises: DailyExercise[] }[] = []
    let currentGroup: string | null = null
    let currentExercises: DailyExercise[] = []

    exercises.forEach((exercise) => {
      if (exercise.group !== currentGroup) {
        if (currentExercises.length > 0) {
          groups.push({ group: currentGroup, exercises: currentExercises })
        }
        currentGroup = exercise.group || null
        currentExercises = [exercise]
      } else {
        currentExercises.push(exercise)
      }
    })

    if (currentExercises.length > 0) {
      groups.push({ group: currentGroup, exercises: currentExercises })
    }

    return groups
  }

  const handleToggleComplete = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const next = new Set(prev)
      if (next.has(exerciseId)) {
        next.delete(exerciseId)
      } else {
        next.add(exerciseId)
      }
      return next
    })
  }

  // Calculate progress
  const totalExercises = selectedProgram?.exercises.length || 0
  const completedCount = selectedProgram
    ? selectedProgram.exercises.filter(e => completedExercises.has(e.id)).length
    : 0
  const progressPercent = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0

  if (clientPrograms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Programs Today</h3>
        <p className="text-gray-600">
          You don't have any workout programs scheduled for today.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Dumbbell className="h-7 w-7" />
              Today's Workout
            </h2>
            <p className="text-orange-100 mt-1">
              {clientPrograms.length} program{clientPrograms.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {selectedProgram && (
            <div className="text-right">
              <p className="text-orange-100 text-sm">Progress</p>
              <p className="text-3xl font-bold">{progressPercent}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Program Selector (if multiple programs) */}
      {clientPrograms.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {clientPrograms.map((program) => (
            <button
              key={program.id}
              onClick={() => setSelectedProgramId(program.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedProgram?.id === program.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              {program.name}
            </button>
          ))}
        </div>
      )}

      {/* Selected Program Details */}
      {selectedProgram && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Program Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{selectedProgram.name}</h3>
              {onStartWorkout && (
                <button
                  onClick={() => onStartWorkout(selectedProgram)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  Start
                </button>
              )}
            </div>
            {selectedProgram.description && (
              <p className="text-gray-600">{selectedProgram.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Dumbbell className="h-4 w-4" />
                {selectedProgram.exercises.length} exercises
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                ~{Math.round(selectedProgram.exercises.length * 5)} min
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">
                {completedCount} of {totalExercises} completed
              </span>
              <span className="font-bold text-orange-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Exercises - Grouped */}
          <div className="p-5">
            {groupExercises(selectedProgram.exercises).map((group, groupIdx) => {
              const groupStyle = getGroupStyle(group.group || undefined)
              const isGrouped = group.group && group.exercises.length > 1

              return (
                <div key={groupIdx} className="mb-6 last:mb-0">
                  {/* Group Header */}
                  {isGrouped && groupStyle && (
                    <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${groupStyle.bgColor}`}>
                      <Link2 className={`h-4 w-4 ${groupStyle.color}`} />
                      <span className={`font-bold ${groupStyle.color}`}>
                        Group {group.group}
                      </span>
                      <span className={`text-sm ${groupStyle.color} opacity-75`}>
                        - {group.exercises.length} exercises, rotate for {group.exercises[0].sets || 3} rounds
                      </span>
                      <Repeat className={`h-4 w-4 ml-auto ${groupStyle.color}`} />
                    </div>
                  )}

                  {/* Exercises in Group */}
                  <div className={`space-y-2 ${isGrouped ? `rounded-xl p-3 ${groupStyle?.bgColorLight} border-2 ${groupStyle?.borderColor}` : ''}`}>
                    {group.exercises.map((exercise, exerciseIdx) => {
                      const isCompleted = completedExercises.has(exercise.id)
                      const isLast = exerciseIdx === group.exercises.length - 1

                      return (
                        <div key={exercise.id}>
                          <div
                            className={`flex items-center gap-3 p-4 rounded-lg transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-green-50 border-2 border-green-300'
                                : isGrouped
                                  ? `bg-white/80 border-2 ${groupStyle?.borderColor} hover:border-orange-300`
                                  : 'bg-gray-50 border-2 border-transparent hover:border-orange-200'
                            }`}
                            onClick={() => handleToggleComplete(exercise.id)}
                          >
                            {/* Checkbox */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 text-transparent hover:border-orange-400'
                            }`}>
                              <CheckCircle className="h-5 w-5" />
                            </div>

                            {/* Exercise Details */}
                            <div className="flex-1">
                              <h4 className={`font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {exercise.name}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                {exercise.sets && (
                                  <span>{exercise.sets} sets</span>
                                )}
                                {exercise.reps && (
                                  <span>{exercise.reps} reps</span>
                                )}
                                {exercise.duration && (
                                  <span className="flex items-center gap-1">
                                    <Timer className="h-3 w-3" />
                                    {exercise.duration}s
                                  </span>
                                )}
                                {exercise.weight && (
                                  <span className="text-orange-600 font-medium">{exercise.weight}</span>
                                )}
                                {exercise.restPeriod && (
                                  <span className="text-gray-400">{exercise.restPeriod}s rest</span>
                                )}
                              </div>
                              {exercise.notes && (
                                <p className="text-sm text-gray-500 mt-1 italic">{exercise.notes}</p>
                              )}
                            </div>

                            <ChevronRight className={`h-5 w-5 ${isCompleted ? 'text-green-400' : 'text-gray-300'}`} />
                          </div>

                          {/* Arrow between grouped exercises */}
                          {isGrouped && !isLast && (
                            <div className="flex justify-center py-1">
                              <ArrowRight className={`h-4 w-4 ${groupStyle?.color || 'text-gray-400'}`} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Group Legend */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-orange-500" />
          How Exercise Groups Work
        </h4>
        <p className="text-sm text-gray-600">
          Exercises with the same group letter (A, B, C...) are meant to be performed together in rotation.
          Complete one set of each exercise in the group, then repeat for the prescribed number of rounds.
          This helps maximize your workout efficiency and keeps your muscles engaged!
        </p>
      </div>
    </div>
  )
}
