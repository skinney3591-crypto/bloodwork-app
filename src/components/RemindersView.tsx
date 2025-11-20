import { useState, useEffect } from 'react'
import { Bell, Clock, CheckCircle, Circle, Pill, Dumbbell, Flame, Trophy, Smartphone, Mail, Calendar, Settings, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Reminder, Workout } from '../data/mockData'
import DeviceBadge from './DeviceBadge'

interface RemindersViewProps {
  reminders: Reminder[]
  onToggleReminder: (id: string) => void
  workoutHistory?: Workout[]
}

// Mock weekly adherence history
const weeklyAdherence = [
  { day: 'Mon', completed: 10, total: 10 },
  { day: 'Tue', completed: 10, total: 10 },
  { day: 'Wed', completed: 8, total: 10 },
  { day: 'Thu', completed: 10, total: 10 },
  { day: 'Fri', completed: 7, total: 10 },
  { day: 'Sat', completed: 10, total: 10 },
  { day: 'Sun', completed: 3, total: 10 }, // Today (in progress)
]

export default function RemindersView({ reminders, onToggleReminder, workoutHistory = [] }: RemindersViewProps) {
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [autoCompletedToday, setAutoCompletedToday] = useState<string[]>([])

  // Check for today's workouts and auto-complete exercise reminders
  useEffect(() => {
    if (workoutHistory.length === 0) return

    const today = new Date().toISOString().split('T')[0]
    const todayWorkouts = workoutHistory.filter(w => w.date === today)

    if (todayWorkouts.length > 0) {
      // Find exercise reminders that should be auto-completed
      const exerciseReminders = reminders.filter(r => r.type === 'exercise' && !r.completed)

      // Auto-complete them based on workout duration
      const totalWorkoutMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0)

      if (totalWorkoutMinutes >= 20) { // At least 20 minutes of exercise
        const toComplete = exerciseReminders.map(r => r.id)
        setAutoCompletedToday(toComplete)

        // Auto-toggle them
        toComplete.forEach(id => {
          if (!reminders.find(r => r.id === id)?.completed) {
            onToggleReminder(id)
          }
        })
      }
    }
  }, []) // Run once on mount

  const todaysWorkouts = workoutHistory.filter(w => w.date === new Date().toISOString().split('T')[0])
  const hasWorkoutsToday = todaysWorkouts.length > 0

  // Calculate current streak (consecutive days with 100% completion)
  const currentStreak = 2 // Mock: Mon-Tue were 100%, Wed broke it, Thu-Sat were 100% = 3 day streak before today
  const bestStreak = 7 // Mock best streak

  // Generate calendar export
  const handleCalendarExport = () => {
    // Create ICS file content for all reminders
    const now = new Date()
    const events = reminders.map(reminder => {
      const [time, period] = reminder.time.split(' ')
      const [hours, minutes] = time.split(':')
      let hour = parseInt(hours)
      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0

      const start = new Date(now)
      start.setHours(hour, parseInt(minutes), 0, 0)
      const end = new Date(start)
      end.setMinutes(end.getMinutes() + 15)

      return `BEGIN:VEVENT
DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${reminder.name}
DESCRIPTION:${reminder.type} reminder
RRULE:FREQ=DAILY
END:VEVENT`
    }).join('\n')

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HealthSync AI//Reminders//EN
${events}
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'health-reminders.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getIcon = (type: string) => {
    if (type === 'medication' || type === 'supplement') return <Pill className="h-5 w-5" />
    if (type === 'exercise') return <Dumbbell className="h-5 w-5" />
    return <Bell className="h-5 w-5" />
  }

  const getTypeColor = (type: string) => {
    if (type === 'medication') return 'bg-purple-100 text-purple-700 border-purple-300'
    if (type === 'supplement') return 'bg-blue-100 text-blue-700 border-blue-300'
    if (type === 'exercise') return 'bg-green-100 text-green-700 border-green-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const completedCount = reminders.filter(r => r.completed).length
  const upcomingReminders = reminders.filter(r => !r.completed)

  // Helper function to categorize time into time of day
  const getTimeOfDay = (timeStr: string): 'Morning' | 'Afternoon' | 'Evening' => {
    const [time, period] = timeStr.split(' ')
    const [hours] = time.split(':')
    let hour = parseInt(hours)
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0

    if (hour >= 5 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 17) return 'Afternoon'
    return 'Evening'
  }

  // Group reminders by time of day
  const groupedByTimeOfDay = reminders.reduce((acc, reminder) => {
    const timeOfDay = getTimeOfDay(reminder.time)
    if (!acc[timeOfDay]) {
      acc[timeOfDay] = []
    }
    acc[timeOfDay].push(reminder)
    return acc
  }, {} as Record<string, Reminder[]>)

  // Sort each group by time
  Object.keys(groupedByTimeOfDay).forEach(timeOfDay => {
    groupedByTimeOfDay[timeOfDay].sort((a, b) => {
      const aTime = a.time.replace(/(\d+):(\d+) (\w+)/, (_, h, m, p) => {
        let hour = parseInt(h)
        if (p === 'PM' && hour !== 12) hour += 12
        if (p === 'AM' && hour === 12) hour = 0
        return `${hour.toString().padStart(2, '0')}:${m}`
      })
      const bTime = b.time.replace(/(\d+):(\d+) (\w+)/, (_, h, m, p) => {
        let hour = parseInt(h)
        if (p === 'PM' && hour !== 12) hour += 12
        if (p === 'AM' && hour === 12) hour = 0
        return `${hour.toString().padStart(2, '0')}:${m}`
      })
      return aTime.localeCompare(bTime)
    })
  })

  const timeOfDayOrder = ['Morning', 'Afternoon', 'Evening']
  const sortedTimeOfDay = timeOfDayOrder.filter(tod => groupedByTimeOfDay[tod])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="h-7 w-7 mr-3 text-orange-600" />
              Daily Reminders
            </h2>
            <p className="text-sm text-gray-600 mt-1">Stay on track with your health plan</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress Today</p>
            <p className="text-3xl font-bold text-orange-600">
              {completedCount}/{reminders.length}
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Complete Banner */}
      {hasWorkoutsToday && autoCompletedToday.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Auto-Completed Exercises!</h3>
                <p className="text-sm text-gray-700">
                  We detected {todaysWorkouts.length} workout{todaysWorkouts.length !== 1 ? 's' : ''} today ({todaysWorkouts.reduce((sum, w) => sum + w.duration, 0)} min total).
                  Your exercise reminders have been automatically marked complete.
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  {todaysWorkouts[0].source !== 'manual' && (
                    <DeviceBadge type={todaysWorkouts[0].source} size="sm" />
                  )}
                  <span className="text-xs text-gray-600">
                    {todaysWorkouts.map(w => w.type).join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Notification Preferences & Calendar Export */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-600" />
            Notification Preferences
          </h3>
          <button
            onClick={handleCalendarExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Calendar className="h-4 w-4" />
            <span>Add to Calendar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SMS Notifications */}
          <div className={`p-4 rounded-xl border-2 transition-all ${
            smsEnabled ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className={`h-6 w-6 ${smsEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="font-semibold text-gray-900">Text Reminders</p>
                  <p className="text-xs text-gray-600">Get SMS notifications</p>
                </div>
              </div>
              <button
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  smsEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  smsEnabled ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {smsEnabled && (
              <p className="text-xs text-green-700 mt-2 bg-green-100 p-2 rounded">
                Reminders sent to: (512) 555-0123
              </p>
            )}
          </div>

          {/* Email Notifications */}
          <div className={`p-4 rounded-xl border-2 transition-all ${
            emailEnabled ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className={`h-6 w-6 ${emailEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                <div>
                  <p className="font-semibold text-gray-900">Email Reminders</p>
                  <p className="text-xs text-gray-600">Get email notifications</p>
                </div>
              </div>
              <button
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  emailEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  emailEnabled ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
            {emailEnabled && (
              <p className="text-xs text-blue-700 mt-2 bg-blue-100 p-2 rounded">
                Reminders sent to: user@example.com
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          You'll receive reminders 15 minutes before each scheduled time
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Daily Completion</span>
          <span className="text-sm font-bold text-orange-600">
            {Math.round((completedCount / reminders.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-pink-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / reminders.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Streak & Weekly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Counter */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Flame className="h-5 w-5 mr-2 text-orange-600" />
              Current Streak
            </h3>
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-center py-4">
            <div className="inline-flex items-baseline">
              <span className="text-6xl font-bold text-orange-600">{currentStreak}</span>
              <span className="text-2xl font-semibold text-gray-600 ml-2">days</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Best streak: <span className="font-bold text-orange-600">{bestStreak} days</span>
            </p>
          </div>
          <div className="mt-4 bg-white rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              Complete all reminders today to extend your streak!
            </p>
          </div>
        </div>

        {/* Weekly Adherence Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Overview</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAdherence}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis domain={[0, 10]} fontSize={12} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const percentage = Math.round((data.completed / data.total) * 100)
                      return (
                        <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-lg">
                          <p className="text-sm font-semibold">{data.day}</p>
                          <p className="text-sm">{data.completed}/{data.total} completed</p>
                          <p className="text-sm font-bold">{percentage}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {weeklyAdherence.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.completed === entry.total ? '#10b981' : entry.completed >= entry.total * 0.7 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>100%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span>70-99%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>&lt;70%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Medications</p>
          <p className="text-2xl font-bold text-purple-900">
            {reminders.filter(r => r.type === 'medication').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Supplements</p>
          <p className="text-2xl font-bold text-blue-900">
            {reminders.filter(r => r.type === 'supplement').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <p className="text-sm text-green-600 font-medium">Exercise</p>
          <p className="text-2xl font-bold text-green-900">
            {reminders.filter(r => r.type === 'exercise').length}
          </p>
        </div>
      </div>

      {/* Reminders Timeline - Grouped by Time of Day */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          Today's Schedule
        </h3>
        <div className="space-y-8">
          {sortedTimeOfDay.map((timeOfDay) => (
            <div key={timeOfDay} className="relative">
              {/* Time of Day Header */}
              <div className="flex items-center mb-4">
                <div className={`text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg ${
                  timeOfDay === 'Morning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  timeOfDay === 'Afternoon' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                  'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {timeOfDay === 'Morning' && '🌅 '}
                  {timeOfDay === 'Afternoon' && '☀️ '}
                  {timeOfDay === 'Evening' && '🌙 '}
                  {timeOfDay}
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-gray-300 to-transparent ml-4 rounded"></div>
              </div>

              {/* Reminders for this time of day */}
              <div className="ml-8 space-y-3">
                {groupedByTimeOfDay[timeOfDay].map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      reminder.completed
                        ? 'bg-gray-50 border-gray-300 opacity-75'
                        : 'bg-white border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => onToggleReminder(reminder.id)}
                        className={`flex-shrink-0 ${
                          reminder.completed ? 'text-green-600' : 'text-gray-400 hover:text-orange-600'
                        }`}
                      >
                        {reminder.completed ? (
                          <CheckCircle className="h-8 w-8" />
                        ) : (
                          <Circle className="h-8 w-8" />
                        )}
                      </button>

                      <div className={`${getTypeColor(reminder.type)} px-3 py-1 rounded-lg border flex items-center space-x-2`}>
                        {getIcon(reminder.type)}
                        <span className="text-xs font-bold uppercase">{reminder.type}</span>
                      </div>

                      <div className="flex-1">
                        <p className={`font-semibold ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {reminder.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Reminders Alert */}
      {upcomingReminders.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-orange-600" />
            <div>
              <p className="font-bold text-gray-900">You have {upcomingReminders.length} upcoming reminder{upcomingReminders.length !== 1 ? 's' : ''}</p>
              <p className="text-sm text-gray-600 mt-1">
                Stay on track to reach your health goals!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Complete Celebration */}
      {upcomingReminders.length === 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-bold text-green-900 text-lg">Great job! All reminders completed!</p>
              <p className="text-sm text-green-700 mt-1">
                You've completed all your health tasks for today. Keep up the excellent work!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
