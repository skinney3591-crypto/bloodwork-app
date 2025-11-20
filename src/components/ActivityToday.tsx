import { Footprints, Zap, Flame, TrendingUp, Heart, Target } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyActivity } from '../data/mockData'

interface ActivityTodayProps {
  activity: DailyActivity
}

export default function ActivityToday({ activity }: ActivityTodayProps) {
  const stepsGoal = 10000
  const activeGoal = 30
  const caloriesGoal = 2500
  const floorsGoal = 10

  const stepsProgress = Math.min((activity.steps / stepsGoal) * 100, 100)
  const activeProgress = Math.min((activity.activeMinutes / activeGoal) * 100, 100)
  const caloriesProgress = Math.min((activity.caloriesBurned / caloriesGoal) * 100, 100)
  const floorsProgress = activity.floors ? Math.min((activity.floors / floorsGoal) * 100, 100) : 0

  // Generate hourly activity data (mock for now)
  const hourlyActivity = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const isPeakHour = hour >= 7 && hour <= 9 || hour >= 12 && hour <= 13 || hour >= 17 && hour <= 19
    const steps = isPeakHour ? Math.floor(Math.random() * 800 + 400) : Math.floor(Math.random() * 300 + 50)
    return {
      hour: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
      steps
    }
  })

  // Heart rate throughout the day
  const heartRateData = Array.from({ length: 24 }, (_, i) => ({
    time: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
    bpm: activity.heartRateResting! + Math.floor(Math.random() * 30) + (i >= 6 && i <= 22 ? 10 : 0)
  }))

  // Active minutes by intensity
  const intensityData = [
    { name: 'Light', value: Math.floor(activity.activeMinutes * 0.4), color: '#93c5fd' },
    { name: 'Moderate', value: Math.floor(activity.activeMinutes * 0.35), color: '#3b82f6' },
    { name: 'Vigorous', value: Math.floor(activity.activeMinutes * 0.25), color: '#1e40af' }
  ]

  const heroStats = [
    {
      label: 'Steps',
      value: activity.steps.toLocaleString(),
      goal: stepsGoal.toLocaleString(),
      progress: stepsProgress,
      icon: Footprints,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Minutes',
      value: activity.activeMinutes,
      goal: activeGoal,
      progress: activeProgress,
      icon: Zap,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Calories',
      value: activity.caloriesBurned.toLocaleString(),
      goal: caloriesGoal.toLocaleString(),
      progress: caloriesProgress,
      icon: Flame,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Floors',
      value: activity.floors || 0,
      goal: floorsGoal,
      progress: floorsProgress,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {heroStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Goal: {stat.goal}</span>
                  <span className={stat.textColor}>{Math.round(stat.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${stat.color} h-full transition-all duration-500`}
                    style={{ width: `${Math.min(stat.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Heart Rate Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-600" />
              Heart Rate
            </h3>
            <p className="text-sm text-gray-600 mt-1">24-hour heart rate tracking</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Resting</p>
            <p className="text-2xl font-bold text-red-600">{activity.heartRateResting} bpm</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={heartRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              domain={[50, 150]}
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
              dataKey="bpm"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              name="Heart Rate (bpm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Hourly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
                interval={2}
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
              <Bar dataKey="steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Minutes by Intensity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Active Minutes by Intensity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={intensityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {intensityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {intensityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value} min</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Daily Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{activity.distance} mi</p>
            <p className="text-sm text-gray-600">Distance</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{Math.round(stepsProgress)}%</p>
            <p className="text-sm text-gray-600">Goal Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{activity.heartRateAvg}</p>
            <p className="text-sm text-gray-600">Avg Heart Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{activity.floors || 0}</p>
            <p className="text-sm text-gray-600">Floors Climbed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
