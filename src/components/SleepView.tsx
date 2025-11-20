import { Moon, Clock, TrendingUp, Heart, Wind, Zap } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { SleepData } from '../data/mockData'

interface SleepViewProps {
  sleepHistory: SleepData[]
}

export default function SleepView({ sleepHistory }: SleepViewProps) {
  // Get last night's sleep
  const lastNight = sleepHistory[sleepHistory.length - 1]

  // Get last 7 days for trend
  const last7Days = sleepHistory.slice(-7)

  // Get last 30 days for monthly view
  const last30Days = sleepHistory.slice(-30)

  // Prepare sleep stages data for stacked area chart
  const sleepStagesData = [
    { stage: 'Awake', hours: lastNight.stages.awake, color: '#ef4444', order: 4 },
    { stage: 'REM', hours: lastNight.stages.rem, color: '#8b5cf6', order: 3 },
    { stage: 'Light', hours: lastNight.stages.light, color: '#3b82f6', order: 2 },
    { stage: 'Deep', hours: lastNight.stages.deep, color: '#1e40af', order: 1 }
  ]

  // Generate hourly sleep stages for visualization (simulated)
  const hourlyStages = Array.from({ length: Math.ceil(lastNight.duration) }, (_, i) => {
    const hour = i
    let stage = 'Light'

    // Simulate sleep cycle pattern
    if (i === 0 && lastNight.timeToSleep && lastNight.timeToSleep > 10) {
      stage = 'Awake'
    } else if (i < 1.5) {
      stage = 'Light'
    } else if (i < 2) {
      stage = 'Deep'
    } else if (i < 3) {
      stage = 'Light'
    } else if (i < 3.5) {
      stage = 'REM'
    } else if (i < 5) {
      stage = 'Light'
    } else if (i < 5.5) {
      stage = 'Deep'
    } else if (i < 6.5) {
      stage = 'Light'
    } else if (i < 7) {
      stage = 'REM'
    } else {
      stage = 'Light'
    }

    return {
      hour: `${i}h`,
      stage,
      stageValue: stage === 'Deep' ? 1 : stage === 'Light' ? 2 : stage === 'REM' ? 3 : 4
    }
  })

  // Weekly trend data
  const weeklyTrend = last7Days.map((sleep, idx) => ({
    day: new Date(sleep.date).toLocaleDateString('en-US', { weekday: 'short' }),
    duration: sleep.duration,
    score: sleep.sleepScore || 0,
    efficiency: sleep.efficiency
  }))

  // Calculate averages
  const avgDuration = (last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length).toFixed(1)
  const avgScore = Math.round(last7Days.reduce((sum, s) => sum + (s.sleepScore || 0), 0) / last7Days.length)
  const avgEfficiency = Math.round(last7Days.reduce((sum, s) => sum + s.efficiency, 0) / last7Days.length)

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Sleep Score Hero */}
      <div className={`rounded-xl shadow-md p-8 border-2 ${getScoreBg(lastNight.sleepScore || 0)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center mb-2">
              <Moon className="h-6 w-6 mr-2 text-indigo-600" />
              Last Night's Sleep
            </h2>
            <p className="text-sm text-gray-600">{new Date(lastNight.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(lastNight.sleepScore || 0)}`}>
              {lastNight.sleepScore}
            </div>
            <p className="text-sm text-gray-600 mt-1">Sleep Score</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{lastNight.duration}h</p>
          <p className="text-sm text-gray-600 mt-1">Total Sleep</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{lastNight.efficiency}%</p>
          <p className="text-sm text-gray-600 mt-1">Efficiency</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{lastNight.restingHeartRate}</p>
          <p className="text-sm text-gray-600 mt-1">Resting HR</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Wind className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{lastNight.respiratoryRate}</p>
          <p className="text-sm text-gray-600 mt-1">Breaths/min</p>
        </div>
      </div>

      {/* Sleep Stages Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sleep Stages</h3>

        {/* Visual stage timeline */}
        <div className="mb-6">
          <div className="flex h-16 rounded-lg overflow-hidden">
            {sleepStagesData.sort((a, b) => a.order - b.order).map((stage) => (
              <div
                key={stage.stage}
                style={{
                  width: `${(stage.hours / lastNight.duration) * 100}%`,
                  backgroundColor: stage.color
                }}
                className="flex items-center justify-center text-white text-sm font-medium"
              >
                {stage.hours > 0.5 && stage.stage}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Bedtime</span>
            <span>{lastNight.duration}h total</span>
            <span>Wake up</span>
          </div>
        </div>

        {/* Stage details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-blue-900" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{lastNight.stages.deep}h</p>
              <p className="text-xs text-gray-600">Deep Sleep</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{lastNight.stages.light}h</p>
              <p className="text-xs text-gray-600">Light Sleep</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{lastNight.stages.rem}h</p>
              <p className="text-xs text-gray-600">REM Sleep</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{lastNight.stages.awake}h</p>
              <p className="text-xs text-gray-600">Awake</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Trend */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">7-Day Sleep Trend</h3>
            <p className="text-sm text-gray-600 mt-1">Your sleep patterns this week</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Weekly Average</p>
            <p className="text-2xl font-bold text-gray-900">{avgDuration}h</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              domain={[0, 10]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sleep Duration (hours)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Score Trend */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sleep Score Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Sleep Score"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">7-Day Average</p>
            <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
          </div>
        </div>

        {/* Sleep Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-indigo-600" />
            Sleep Insights
          </h3>
          <div className="space-y-4">
            {lastNight.sleepScore && lastNight.sleepScore >= 85 && (
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-700 mb-1">Excellent Sleep Quality!</p>
                <p className="text-xs text-gray-700">You're getting restorative sleep. Keep up your current sleep routine.</p>
              </div>
            )}

            {lastNight.stages.deep < 1.5 && (
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-700 mb-1">Low Deep Sleep</p>
                <p className="text-xs text-gray-700">Try avoiding caffeine after 2 PM and keeping your bedroom cool (65-68°F).</p>
              </div>
            )}

            {lastNight.timeToSleep && lastNight.timeToSleep > 20 && (
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-semibold text-orange-700 mb-1">Long Time to Fall Asleep</p>
                <p className="text-xs text-gray-700">Consider a relaxing bedtime routine and reducing screen time 1 hour before bed.</p>
              </div>
            )}

            {avgDuration < '7' && (
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-700 mb-1">Sleep Duration Tip</p>
                <p className="text-xs text-gray-700">Adults need 7-9 hours. Try going to bed 30 minutes earlier to improve recovery.</p>
              </div>
            )}

            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-indigo-700 mb-1">Correlation with Activity</p>
              <p className="text-xs text-gray-700">Your sleep quality improves on days with 30+ active minutes. Keep moving!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sleep Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{lastNight.timeToSleep} min</p>
            <p className="text-sm text-gray-600">Time to Sleep</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgEfficiency}%</p>
            <p className="text-sm text-gray-600">Avg Efficiency</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {(last30Days.reduce((sum, s) => sum + s.duration, 0) / last30Days.length).toFixed(1)}h
            </p>
            <p className="text-sm text-gray-600">30-Day Average</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {last30Days.filter(s => (s.sleepScore || 0) >= 80).length}
            </p>
            <p className="text-sm text-gray-600">Good Nights (30d)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
