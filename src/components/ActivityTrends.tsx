import { TrendingUp, TrendingDown, Calendar, Target, Award, Activity, Footprints, Flame, Clock, Heart } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts'
import type { DailyActivity, SleepData } from '../data/mockData'

interface ActivityTrendsProps {
  activityHistory: DailyActivity[]
  sleepHistory: SleepData[]
}

export default function ActivityTrends({ activityHistory, sleepHistory }: ActivityTrendsProps) {
  // Get last 30 days
  const last30Days = activityHistory.slice(-30)
  const last30DaysSleep = sleepHistory.slice(-30)

  // Calculate weekly aggregates for the last 4 weeks
  const weeklyData = []
  for (let i = 0; i < 4; i++) {
    const weekStart = 30 - ((i + 1) * 7)
    const weekEnd = 30 - (i * 7)
    const weekActivities = last30Days.slice(weekStart, weekEnd)

    const totalSteps = weekActivities.reduce((sum, a) => sum + a.steps, 0)
    const totalActive = weekActivities.reduce((sum, a) => sum + a.activeMinutes, 0)
    const totalCalories = weekActivities.reduce((sum, a) => sum + a.caloriesBurned, 0)
    const avgRestingHR = weekActivities.reduce((sum, a) => sum + (a.heartRateResting || 65), 0) / weekActivities.length

    weeklyData.unshift({
      week: `Week ${i + 1}`,
      avgSteps: Math.round(totalSteps / 7),
      avgActive: Math.round(totalActive / 7),
      avgCalories: Math.round(totalCalories / 7),
      avgRestingHR: Math.round(avgRestingHR)
    })
  }

  // Daily trend data for charts
  const dailyTrend = last30Days.map((activity, idx) => {
    const sleep = last30DaysSleep[idx]
    return {
      date: new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      steps: activity.steps,
      activeMinutes: activity.activeMinutes,
      calories: activity.caloriesBurned,
      restingHR: activity.heartRateResting || 65,
      sleepScore: sleep?.sleepScore || 0,
      sleepHours: sleep?.duration || 0
    }
  })

  // Calculate day-of-week patterns
  const dayOfWeekPattern = Array.from({ length: 7 }, (_, i) => {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]
    const daysActivities = last30Days.filter(a => new Date(a.date).getDay() === i)

    if (daysActivities.length === 0) {
      return { day: dayName, avgSteps: 0, avgActive: 0 }
    }

    return {
      day: dayName,
      avgSteps: Math.round(daysActivities.reduce((sum, a) => sum + a.steps, 0) / daysActivities.length),
      avgActive: Math.round(daysActivities.reduce((sum, a) => sum + a.activeMinutes, 0) / daysActivities.length)
    }
  })

  // Calculate overall stats
  const totalSteps = last30Days.reduce((sum, a) => sum + a.steps, 0)
  const totalActiveMinutes = last30Days.reduce((sum, a) => sum + a.activeMinutes, 0)
  const totalCalories = last30Days.reduce((sum, a) => sum + a.caloriesBurned, 0)

  const avgSteps = Math.round(totalSteps / 30)
  const avgActiveMinutes = Math.round(totalActiveMinutes / 30)
  const avgCalories = Math.round(totalCalories / 30)

  // Compare last 2 weeks
  const lastWeekActivities = last30Days.slice(-7)
  const previousWeekActivities = last30Days.slice(-14, -7)

  const lastWeekAvgSteps = Math.round(lastWeekActivities.reduce((sum, a) => sum + a.steps, 0) / 7)
  const prevWeekAvgSteps = Math.round(previousWeekActivities.reduce((sum, a) => sum + a.steps, 0) / 7)
  const stepsChange = lastWeekAvgSteps - prevWeekAvgSteps
  const stepsChangePercent = Math.round((stepsChange / prevWeekAvgSteps) * 100)

  const lastWeekAvgActive = Math.round(lastWeekActivities.reduce((sum, a) => sum + a.activeMinutes, 0) / 7)
  const prevWeekAvgActive = Math.round(previousWeekActivities.reduce((sum, a) => sum + a.activeMinutes, 0) / 7)
  const activeChange = lastWeekAvgActive - prevWeekAvgActive
  const activeChangePercent = Math.round((activeChange / prevWeekAvgActive) * 100)

  // Find best and worst days
  const sortedBySteps = [...last30Days].sort((a, b) => b.steps - a.steps)
  const bestDay = sortedBySteps[0]
  const mostActiveDay = [...last30Days].sort((a, b) => b.activeMinutes - a.activeMinutes)[0]

  // Correlation analysis: Activity vs Sleep
  const highActivityDays = last30Days.filter(a => a.activeMinutes >= 30)
  const lowActivityDays = last30Days.filter(a => a.activeMinutes < 30)

  const avgSleepHighActivity = highActivityDays.length > 0
    ? (highActivityDays.reduce((sum, a) => {
        const sleep = last30DaysSleep.find(s => s.date === a.date)
        return sum + (sleep?.sleepScore || 0)
      }, 0) / highActivityDays.length).toFixed(1)
    : '0'

  const avgSleepLowActivity = lowActivityDays.length > 0
    ? (lowActivityDays.reduce((sum, a) => {
        const sleep = last30DaysSleep.find(s => s.date === a.date)
        return sum + (sleep?.sleepScore || 0)
      }, 0) / lowActivityDays.length).toFixed(1)
    : '0'

  // Resting heart rate trend
  const firstWeekAvgHR = last30Days.slice(0, 7).reduce((sum, a) => sum + (a.heartRateResting || 65), 0) / 7
  const lastWeekAvgHR = last30Days.slice(-7).reduce((sum, a) => sum + (a.heartRateResting || 65), 0) / 7
  const hrChange = lastWeekAvgHR - firstWeekAvgHR
  const hrImproving = hrChange < 0 // Lower is better for resting HR

  return (
    <div className="space-y-6">
      {/* 30-Day Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Footprints className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Average Steps</h3>
            </div>
            <div className={`flex items-center space-x-1 text-sm ${stepsChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stepsChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(stepsChangePercent)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgSteps.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              This week: <span className="font-semibold text-gray-900">{lastWeekAvgSteps.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Active Minutes</h3>
            </div>
            <div className={`flex items-center space-x-1 text-sm ${activeChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {activeChangePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(activeChangePercent)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgActiveMinutes}</p>
          <p className="text-sm text-gray-600 mt-1">Per day average</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              This week: <span className="font-semibold text-gray-900">{lastWeekAvgActive} min</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Calories Burned</h3>
            </div>
            <div className={`flex items-center space-x-1 text-sm ${hrImproving ? 'text-green-600' : 'text-gray-600'}`}>
              <Heart className="h-4 w-4" />
              <span>{Math.round(lastWeekAvgHR)} bpm</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgCalories.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Per day average</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Total: <span className="font-semibold text-gray-900">{totalCalories.toLocaleString()} cal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Steps Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Steps Trend - Last 30 Days
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="steps"
              stroke="#3b82f6"
              fill="#93c5fd"
              strokeWidth={2}
              name="Steps"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Minutes Over Time */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Active Minutes Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                interval={6}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
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
                dataKey="activeMinutes"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
                name="Active Minutes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Day of Week Pattern */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Activity by Day of Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dayOfWeekPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="avgSteps" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Steps" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity vs Sleep Correlation */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-600" />
          Activity & Sleep Correlation
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              interval={6}
            />
            <YAxis
              yAxisId="left"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              label={{ value: 'Active Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              label={{ value: 'Sleep Score', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar yAxisId="left" dataKey="activeMinutes" fill="#10b981" radius={[4, 4, 0, 0]} name="Active Minutes" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sleepScore"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 3 }}
              name="Sleep Score"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm font-semibold text-green-700 mb-1">High Activity Days (30+ min)</p>
            <p className="text-2xl font-bold text-green-900">{avgSleepHighActivity}</p>
            <p className="text-xs text-green-700">Average sleep score</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm font-semibold text-orange-700 mb-1">Low Activity Days (&lt;30 min)</p>
            <p className="text-2xl font-bold text-orange-900">{avgSleepLowActivity}</p>
            <p className="text-xs text-orange-700">Average sleep score</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress Comparison */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
          Weekly Progress
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Week</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Steps</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Active Min</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Calories</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Resting HR</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((week, idx) => (
                <tr key={week.week} className={`border-b border-gray-100 ${idx === weeklyData.length - 1 ? 'bg-blue-50' : ''}`}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{week.week}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-700">{week.avgSteps.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-700">{week.avgActive} min</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-700">{week.avgCalories.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-sm text-gray-700">{week.avgRestingHR} bpm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements & Insights */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-600" />
          Insights & Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-700 mb-1">Best Day</p>
            <p className="text-xs text-gray-700">
              {new Date(bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {bestDay.steps.toLocaleString()} steps
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-700 mb-1">Most Active Day</p>
            <p className="text-xs text-gray-700">
              {new Date(mostActiveDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {mostActiveDay.activeMinutes} minutes
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-700 mb-1">Resting Heart Rate</p>
            <p className="text-xs text-gray-700">
              {hrImproving ? `Improved by ${Math.abs(Math.round(hrChange))} bpm this month! 🎉` : `Stable at ${Math.round(lastWeekAvgHR)} bpm`}
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-orange-700 mb-1">Activity Streak</p>
            <p className="text-xs text-gray-700">
              {highActivityDays.length} days with 30+ active minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
