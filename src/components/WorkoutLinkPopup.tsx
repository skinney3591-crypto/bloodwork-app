import { useState } from 'react'
import { X, Watch, Clock, Flame, Heart, Dumbbell, Check, SkipForward, Bell } from 'lucide-react'
import type { PendingWorkoutLink, DailyProgram } from '../data/trainerData'
import { getDailyProgramById } from '../data/mockTrainerData'

interface WorkoutLinkPopupProps {
  pendingLink: PendingWorkoutLink
  onLink: (programId: string, rating?: number, notes?: string) => void
  onSkip: () => void
  onRemindLater: () => void
  onClose: () => void
}

export default function WorkoutLinkPopup({
  pendingLink,
  onLink,
  onSkip,
  onRemindLater,
  onClose,
}: WorkoutLinkPopupProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [notes, setNotes] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const { workout, suggestedProgramIds } = pendingLink
  const suggestedPrograms = suggestedProgramIds
    .map(id => getDailyProgramById(id))
    .filter((p): p is DailyProgram => p !== undefined)

  // Format time ago
  const getTimeAgo = (isoString: string): string => {
    const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return 'Yesterday'
  }

  // Get device icon
  const getDeviceIcon = () => {
    switch (workout.source) {
      case 'apple_health':
        return <Watch className="h-5 w-5 text-gray-600" />
      case 'fitbit':
        return <Watch className="h-5 w-5 text-teal-600" />
      case 'oura':
        return <Watch className="h-5 w-5 text-purple-600" />
      default:
        return <Dumbbell className="h-5 w-5 text-gray-600" />
    }
  }

  // Get device name
  const getDeviceName = () => {
    switch (workout.source) {
      case 'apple_health':
        return 'Apple Watch'
      case 'fitbit':
        return 'Fitbit'
      case 'oura':
        return 'Oura Ring'
      default:
        return 'Device'
    }
  }

  const handleProgramSelect = (programId: string) => {
    setSelectedProgramId(programId)
    setShowFeedback(true)
  }

  const handleConfirmLink = () => {
    if (selectedProgramId) {
      onLink(selectedProgramId, rating > 0 ? rating : undefined, notes || undefined)
    }
  }

  const handleDifferentWorkout = () => {
    onSkip()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Dumbbell className="h-6 w-6" />
            <h2 className="text-lg font-bold">Workout Detected!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Workout Details Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              {getDeviceIcon()}
              <span className="text-sm">Your {getDeviceName()} logged a workout:</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-900">{workout.type}</h3>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{workout.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{workout.caloriesBurned} cal</span>
                </div>
                {workout.averageHeartRate && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Avg {workout.averageHeartRate} bpm</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Detected {getTimeAgo(pendingLink.detectedAt)}
              </p>
            </div>
          </div>

          {!showFeedback ? (
            <>
              {/* Program Selection */}
              <h3 className="font-semibold text-gray-900 mb-3">
                Was this one of your programs?
              </h3>

              <div className="space-y-2 mb-4">
                {suggestedPrograms.map((program) => (
                  <button
                    key={program.id}
                    onClick={() => handleProgramSelect(program.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      selectedProgramId === program.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Check className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{program.name}</p>
                        <p className="text-sm text-gray-500">
                          {program.exercises.length} exercises
                        </p>
                      </div>
                    </div>
                    {selectedProgramId === program.id && (
                      <Check className="h-5 w-5 text-orange-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Alternative Action */}
              <button
                onClick={handleDifferentWorkout}
                className="w-full py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                This was a different workout
              </button>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={onSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
                >
                  <SkipForward className="h-4 w-4" />
                  Skip
                </button>
                <button
                  onClick={onRemindLater}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
                >
                  <Bell className="h-4 w-4" />
                  Remind Me
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Feedback Section */}
              <h3 className="font-semibold text-gray-900 mb-3">
                How was your workout?
              </h3>

              {/* Rating */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">
                  Rate your workout (optional)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-10 h-10 rounded-lg text-xl transition-all ${
                        rating >= star
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {rating >= star ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it feel? Any PRs?"
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Confirm Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmLink}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Link Workout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
