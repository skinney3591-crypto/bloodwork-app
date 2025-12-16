import { Clock, Flame, Heart, Calendar, CheckCircle, XCircle, Star, Watch } from 'lucide-react'
import type { CompletedProgramWorkout } from '../../data/trainerData'
import { getClientCompletedWorkouts, getClientWorkoutStats } from '../../data/mockTrainerData'

interface ClientWorkoutHistoryProps {
  clientId: string
  clientName?: string  // Optional - for display purposes
}

export default function ClientWorkoutHistory({ clientId, clientName: _clientName }: ClientWorkoutHistoryProps) {
  const completedWorkouts = getClientCompletedWorkouts(clientId)

  // Sort by date descending
  const sortedWorkouts = [...completedWorkouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Get stats for last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const stats = getClientWorkoutStats(
    clientId,
    thirtyDaysAgo.toISOString().split('T')[0],
    today.toISOString().split('T')[0]
  )

  // Group workouts by status
  const linkedWorkouts = sortedWorkouts.filter(w => w.status === 'linked')
  const skippedWorkouts = sortedWorkouts.filter(w => w.status === 'skipped')

  // Get device icon
  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'apple_health':
        return <Watch className="h-4 w-4 text-gray-500" />
      case 'fitbit':
        return <Watch className="h-4 w-4 text-teal-500" />
      case 'oura':
        return <Watch className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  // Get device name
  const getDeviceName = (deviceType?: string) => {
    switch (deviceType) {
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

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  // Format time range
  const formatTimeRange = (start?: string, end?: string) => {
    if (!start) return ''
    const startTime = start
    const endTime = end || ''
    return `${startTime}${endTime ? ` - ${endTime}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Workouts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalWorkouts}</p>
          <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Linked to Programs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.linkedWorkouts}</p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.totalWorkouts > 0
              ? `${Math.round((stats.linkedWorkouts / stats.totalWorkouts) * 100)}% rate`
              : 'No workouts'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Time</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {Math.round(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
          </p>
          <p className="text-xs text-gray-400 mt-1">Active minutes</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Avg Heart Rate</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {stats.avgHeartRate > 0 ? `${stats.avgHeartRate}` : '--'}
          </p>
          <p className="text-xs text-gray-400 mt-1">bpm</p>
        </div>
      </div>

      {/* Linked Workouts */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Program Workouts ({linkedWorkouts.length})
          </h3>
          <p className="text-green-100 text-sm mt-1">
            Workouts linked to trainer programs with device metrics
          </p>
        </div>
        <div className="p-4">
          {linkedWorkouts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No workouts linked to programs yet
            </p>
          ) : (
            <div className="space-y-3">
              {linkedWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} getDeviceIcon={getDeviceIcon} getDeviceName={getDeviceName} formatDate={formatDate} formatTimeRange={formatTimeRange} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skipped/Unlinked Workouts */}
      {skippedWorkouts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Other Workouts ({skippedWorkouts.length})
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Device workouts not linked to a program
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {skippedWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} getDeviceIcon={getDeviceIcon} getDeviceName={getDeviceName} formatDate={formatDate} formatTimeRange={formatTimeRange} dimmed />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Workout Card Component
interface WorkoutCardProps {
  workout: CompletedProgramWorkout
  getDeviceIcon: (deviceType?: string) => React.ReactNode
  getDeviceName: (deviceType?: string) => string
  formatDate: (dateStr: string) => string
  formatTimeRange: (start?: string, end?: string) => string
  dimmed?: boolean
}

function WorkoutCard({ workout, getDeviceIcon, getDeviceName, formatDate, formatTimeRange, dimmed }: WorkoutCardProps) {
  return (
    <div className={`rounded-lg p-4 border ${
      dimmed
        ? 'bg-gray-50 border-gray-200'
        : 'bg-green-50/50 border-green-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Program Name & Date */}
          <div className="flex items-center gap-2 mb-2">
            {workout.dailyProgramName ? (
              <h4 className="font-bold text-gray-900">{workout.dailyProgramName}</h4>
            ) : (
              <h4 className="font-medium text-gray-500">Unlinked Workout</h4>
            )}
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(workout.date)}
            </span>
          </div>

          {/* Device & Time */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            {workout.deviceType && (
              <span className="flex items-center gap-1">
                {getDeviceIcon(workout.deviceType)}
                {getDeviceName(workout.deviceType)}
              </span>
            )}
            {workout.startTime && (
              <span>{formatTimeRange(workout.startTime, workout.endTime)}</span>
            )}
          </div>

          {/* Metrics Row */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{workout.duration}</span>
              <span>min</span>
            </div>
            {workout.caloriesBurned && (
              <div className="flex items-center gap-1 text-gray-600">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{workout.caloriesBurned}</span>
                <span>cal</span>
              </div>
            )}
            {workout.averageHeartRate && (
              <div className="flex items-center gap-1 text-gray-600">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Avg</span>
                <span className="font-medium">{workout.averageHeartRate}</span>
                <span>bpm</span>
              </div>
            )}
            {workout.maxHeartRate && (
              <div className="flex items-center gap-1 text-gray-600">
                <Heart className="h-4 w-4 text-red-400" />
                <span>Max</span>
                <span className="font-medium">{workout.maxHeartRate}</span>
                <span>bpm</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {workout.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">"{workout.notes}"</p>
            </div>
          )}
        </div>

        {/* Rating */}
        {workout.rating && (
          <div className="flex flex-col items-center ml-4">
            <div className="flex gap-0.5 text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= workout.rating! ? 'fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 mt-1">Client rating</span>
          </div>
        )}
      </div>
    </div>
  )
}
