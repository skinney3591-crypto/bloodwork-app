import { AlertCircle, CheckCircle, TrendingUp, Calendar, Zap, ArrowUpRight, Sun, Pill, Clock, Circle, Star, ArrowRight, Activity, Heart, Footprints, Flame } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { CustomerData, Reminder } from '../data/mockData'
import DeviceBadge from './DeviceBadge'

interface DashboardOverviewProps {
  data: CustomerData
  reminders: Reminder[]
  onToggleReminder: (id: string) => void
  onNavigateToPlan: () => void
  onNavigateToLabs: () => void
}

export default function DashboardOverview({ data, reminders, onToggleReminder, onNavigateToPlan, onNavigateToLabs }: DashboardOverviewProps) {
  const abnormalResults = data.bloodwork.filter(item => item.status !== 'normal')
  const lowResults = data.bloodwork.filter(item => item.status === 'low')
  const highResults = data.bloodwork.filter(item => item.status === 'high')

  const completedReminders = reminders.filter(r => r.completed).length
  const totalReminders = reminders.length
  const normalResults = data.bloodwork.length - abnormalResults.length

  // Calculate improvement score based on ACTIONS TAKEN, not current health status
  // This rewards engagement with the improvement plan, not where you started
  const supplementAdherence = data.supplements.length > 0 ? 25 : 0 // Following supplement plan
  const medicationAdherence = data.medications.length > 0 ? 25 : 0 // Following medication plan
  const exerciseEngagement = data.exercises.length > 3 ? 25 : (data.exercises.length / 3) * 25 // Exercise plan engagement
  const reminderCompliance = totalReminders > 0 ? (completedReminders / totalReminders) * 25 : 0 // Daily compliance

  const improvementScore = Math.round(supplementAdherence + medicationAdherence + exerciseEngagement + reminderCompliance)

  // Improvement factors breakdown for display
  const improvementFactors = [
    { label: 'Supplements', score: Math.round(supplementAdherence), max: 25 },
    { label: 'Medications', score: Math.round(medicationAdherence), max: 25 },
    { label: 'Exercise Plan', score: Math.round(exerciseEngagement), max: 25 },
    { label: 'Daily Tasks', score: Math.round(reminderCompliance), max: 25 },
  ]

  // Pie chart data for bloodwork distribution
  const bloodworkDistribution = [
    { name: 'Normal', value: normalResults, color: '#10b981' },
    { name: 'Low', value: lowResults.length, color: '#f97316' },
    { name: 'High', value: highResults.length, color: '#ef4444' },
  ].filter(item => item.value > 0)

  const stats = [
    {
      label: 'Total Tests',
      value: data.bloodwork.length,
      icon: CheckCircle,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Abnormal Results',
      value: abnormalResults.length,
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Active Medications',
      value: data.medications.length,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Reminders Today',
      value: `${completedReminders}/${totalReminders}`,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
    },
  ]

  // Today's actions based on reminders - show incomplete first, then completed
  const incompleteReminders = reminders.filter(r => !r.completed).slice(0, 3)
  const completedRemindersList = reminders.filter(r => r.completed).slice(0, 2)
  const todayActions = [...incompleteReminders, ...completedRemindersList].slice(0, 4)

  return (
    <div className="space-y-6">
      {/* What to Do Today - Primary Action Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Sun className="h-7 w-7 mr-3" />
              What to Do Today
            </h2>
            <p className="text-blue-100 mt-1">Your personalized health tasks for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{completedReminders}/{totalReminders}</p>
            <p className="text-blue-100 text-sm">completed</p>
          </div>
        </div>

        {todayActions.length > 0 ? (
          <div className="space-y-3">
            {todayActions.map((action, idx) => (
              <button
                key={action.id}
                onClick={() => onToggleReminder(action.id)}
                className={`w-full flex items-center p-4 rounded-lg transition-all hover:scale-[1.02] ${
                  action.completed
                    ? 'bg-white/10'
                    : idx === 0
                    ? 'bg-white/20 border-2 border-white/40'
                    : 'bg-white/10'
                }`}
              >
                {/* Checkbox */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center mr-3 ${
                  action.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-white/50 hover:border-white'
                }`}>
                  {action.completed && <CheckCircle className="h-5 w-5" />}
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  action.completed ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  {action.type === 'supplement' ? (
                    <Pill className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={`font-semibold text-lg ${action.completed ? 'line-through opacity-70' : ''}`}>
                    {action.name}
                  </p>
                  <p className="text-blue-100 text-sm">{action.time}</p>
                </div>
                {!action.completed && idx === 0 && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold ml-3">
                    Next Up
                  </span>
                )}
                {action.completed && (
                  <span className="text-green-300 text-sm font-medium ml-3">Done!</span>
                )}
              </button>
            ))}

            {/* View Full Schedule Link */}
            <button
              onClick={onNavigateToPlan}
              className="w-full flex items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              View Full Schedule
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ) : (
          <div className="bg-white/20 rounded-lg p-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-300" />
            <p className="text-xl font-semibold">All done for today!</p>
            <p className="text-blue-100 mt-1">Great job staying on track with your health plan.</p>
          </div>
        )}

        {completedReminders < totalReminders && (
          <p className="text-blue-100 text-sm mt-4 text-center">
            Complete these tasks to improve your daily score
          </p>
        )}
      </div>

      {/* Today's Activity - Device Data */}
      {data.deviceConnections.length > 0 && data.deviceConnections[0].status === 'connected' && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-teal-600" />
                Today's Activity
              </h3>
              <p className="text-sm text-gray-600 mt-1">Your fitness metrics for today</p>
            </div>
            <div className="flex items-center space-x-2">
              <DeviceBadge type={data.deviceConnections[0].type} size="sm" />
              <span className="text-xs text-gray-500">
                {(() => {
                  const lastSync = new Date(data.deviceConnections[0].lastSync)
                  const now = new Date()
                  const hoursAgo = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60))
                  return hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`
                })()}
              </span>
            </div>
          </div>

          {(() => {
            const today = new Date().toISOString().split('T')[0]
            const todayActivity = data.activityHistory.find(a => a.date === today) || data.activityHistory[data.activityHistory.length - 1]

            const stepsGoal = 10000
            const stepsProgress = Math.min((todayActivity.steps / stepsGoal) * 100, 100)
            const activeGoal = 30
            const activeProgress = Math.min((todayActivity.activeMinutes / activeGoal) * 100, 100)

            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Steps */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Footprints className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-900">{todayActivity.steps.toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-medium text-blue-700">Steps</p>
                  <div className="mt-2 bg-white/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${stepsProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">{Math.round(stepsProgress)}% of {stepsGoal.toLocaleString()} goal</p>
                </div>

                {/* Active Minutes */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-900">{todayActivity.activeMinutes}</span>
                  </div>
                  <p className="text-sm font-medium text-green-700">Active Min</p>
                  <div className="mt-2 bg-white/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all duration-300"
                      style={{ width: `${activeProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-1">{Math.round(activeProgress)}% of {activeGoal} min goal</p>
                </div>

                {/* Calories */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-900">{todayActivity.caloriesBurned.toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-medium text-orange-700">Calories</p>
                  <p className="text-xs text-orange-600 mt-4">Total burned today</p>
                </div>

                {/* Heart Rate */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold text-red-900">{todayActivity.heartRateResting}</span>
                  </div>
                  <p className="text-sm font-medium text-red-700">Resting HR</p>
                  <p className="text-xs text-red-600 mt-4">bpm (avg: {todayActivity.heartRateAvg})</p>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Progress Checklist with Priority Badges */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Your Health Journey Progress
        </h3>
        <div className="space-y-3">
          {[
            {
              label: 'Complete initial bloodwork',
              completed: true,
              priority: 'high',
              description: 'Get baseline measurements'
            },
            {
              label: 'Review results with doctor',
              completed: data.doctorReviewStatus === 'approved',
              priority: 'high',
              description: 'Understand your health status'
            },
            {
              label: 'Start supplement regimen',
              completed: data.supplements.length > 0,
              priority: 'high',
              description: `${data.supplements.length} supplements in your plan`
            },
            {
              label: 'Set up daily reminders',
              completed: data.reminders.length > 0,
              priority: 'medium',
              description: 'Stay consistent with your plan'
            },
            {
              label: 'Complete weekly check-in',
              completed: false,
              priority: 'medium',
              description: 'Track how you\'re feeling'
            },
            {
              label: 'Schedule follow-up bloodwork',
              completed: false,
              priority: 'low',
              description: 'Recommended in 3 months'
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center p-3 rounded-lg border-2 ${
                item.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {item.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${item.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <span className={`flex-shrink-0 ml-3 px-2 py-1 rounded text-xs font-bold uppercase ${
                item.priority === 'high'
                  ? 'bg-red-100 text-red-700'
                  : item.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-bold text-green-600">
              {[true, data.doctorReviewStatus === 'approved', data.supplements.length > 0, data.reminders.length > 0, false, false].filter(Boolean).length}/6 completed
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${([true, data.doctorReviewStatus === 'approved', data.supplements.length > 0, data.reminders.length > 0, false, false].filter(Boolean).length / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Health Score & Bloodwork Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Improvement Score - Focus on actions, not current state */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Improvement Score
          </h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={improvementScore >= 75 ? '#10b981' : improvementScore >= 50 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${improvementScore * 2.51} 251`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{improvementScore}</span>
                <span className="text-sm text-gray-500">out of 100</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className={`text-lg font-semibold flex items-center justify-center ${
              improvementScore >= 75 ? 'text-green-600' : improvementScore >= 50 ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              <ArrowUpRight className="h-5 w-5 mr-1" />
              {improvementScore >= 75 ? 'Great Progress!' : improvementScore >= 50 ? 'Building Momentum' : 'Getting Started'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on your engagement with your health plan</p>
          </div>

          {/* Improvement factors breakdown */}
          <div className="mt-4 space-y-2">
            {improvementFactors.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{factor.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${factor.score === factor.max ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${(factor.score / factor.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{factor.score}/{factor.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloodwork Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bloodwork Distribution</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloodworkDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bloodworkDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload
                      const total = normalResults + lowResults.length + highResults.length
                      const percentage = Math.round((item.value / total) * 100)
                      return (
                        <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-lg">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm">{item.value} tests ({percentage}%)</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center space-x-4 mt-4">
            {bloodworkDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Findings</h2>
        <div className="space-y-4">
          {highResults.length > 0 && (
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-red-900 flex items-center mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                Elevated Levels ({highResults.length})
              </h3>
              <ul className="space-y-1 text-sm text-red-800">
                {highResults.map((result, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{result.name}:</span> {result.value} {result.unit} (Normal: {result.referenceRange})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lowResults.length > 0 && (
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-orange-900 flex items-center mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                Low Levels ({lowResults.length})
              </h3>
              <ul className="space-y-1 text-sm text-orange-800">
                {lowResults.map((result, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{result.name}:</span> {result.value} {result.unit} (Normal: {result.referenceRange})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
            <h3 className="font-semibold text-green-900 flex items-center mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Normal Results
            </h3>
            <p className="text-sm text-green-800">
              {data.bloodwork.length - abnormalResults.length} out of {data.bloodwork.length} tests are within normal range
            </p>
          </div>

          {/* View Full Labs Button */}
          <button
            onClick={onNavigateToLabs}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-semibold"
          >
            View Full Lab Results
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Treatment Plan Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Supplements</h2>
          <div className="space-y-3">
            {data.supplements.slice(0, 3).map((supplement, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-600 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{supplement.name}</p>
                  <p className="text-sm text-gray-600">{supplement.dosage} - {supplement.frequency}</p>
                  <p className="text-xs text-gray-500 mt-1">{supplement.reason}</p>
                </div>
              </div>
            ))}
            {data.supplements.length > 3 && (
              <p className="text-sm text-gray-600 text-center pt-2">
                +{data.supplements.length - 3} more supplements
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exercise Plan</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Cardio</h3>
              <p className="text-sm text-gray-600">
                {data.exercises.filter(e => e.type === 'cardio').length} activities recommended
              </p>
              <p className="text-xs text-gray-500 mt-1">Focus: Heart health & weight management</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Strength Training</h3>
              <p className="text-sm text-gray-600">
                {data.exercises.filter(e => e.type === 'weights').length} exercises recommended
              </p>
              <p className="text-xs text-gray-500 mt-1">Focus: Muscle strength & metabolism</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Date Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Blood Panel Test Date</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{new Date(data.testDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          <Calendar className="h-12 w-12 text-blue-600" />
        </div>
      </div>
    </div>
  )
}
