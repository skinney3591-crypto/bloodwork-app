import { Dumbbell, Clock, Flame, Heart, TrendingUp, MapPin, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Workout } from '../data/mockData'
import DeviceBadge from './DeviceBadge'

interface WorkoutsLogProps {
  workouts: Workout[]
}

export default function WorkoutsLog({ workouts }: WorkoutsLogProps) {
  // Get last 30 days
  const last30Days = workouts.slice(-30)

  // Calculate workout type distribution
  const typeDistribution = last30Days.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeColors: Record<string, string> = {
    running: '#3b82f6',
    walking: '#10b981',
    cycling: '#f59e0b',
    swimming: '#06b6d4',
    weights: '#8b5cf6',
    yoga: '#ec4899'
  }

  const pieData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: typeColors[type] || '#6b7280'
  }))

  // Weekly workout summary
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayWorkouts = last30Days.filter(w => w.date === dateStr)

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayWorkouts.length,
      calories: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0)
    }
  })

  // Calculate stats
  const totalWorkouts = last30Days.length
  const totalMinutes = last30Days.reduce((sum, w) => sum + w.duration, 0)
  const totalCalories = last30Days.reduce((sum, w) => sum + w.caloriesBurned, 0)
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0
  const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0

  // Recent workouts (last 10)
  const recentWorkouts = [...last30Days].reverse().slice(0, 10)

  // Get workout icon
  const getWorkoutIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      running: TrendingUp,
      walking: TrendingUp,
      cycling: TrendingUp,
      swimming: TrendingUp,
      weights: Dumbbell,
      yoga: Dumbbell
    }
    return icons[type] || Dumbbell
  }

  const getWorkoutColor = (type: string) => {
    const colors: Record<string, string> = {
      running: 'from-blue-500 to-blue-600',
      walking: 'from-green-500 to-green-600',
      cycling: 'from-orange-500 to-orange-600',
      swimming: 'from-cyan-500 to-cyan-600',
      weights: 'from-purple-500 to-purple-600',
      yoga: 'from-pink-500 to-pink-600'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{totalWorkouts}</p>
          <p className="text-sm font-medium text-blue-700">Workouts (30d)</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">{Math.round(totalMinutes / 60)}h</p>
          <p className="text-sm font-medium text-green-700">Total Time</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900">{totalCalories.toLocaleString()}</p>
          <p className="text-sm font-medium text-orange-700">Calories Burned</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-900">{avgDuration} min</p>
          <p className="text-sm font-medium text-purple-700">Avg Duration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Type Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Workout Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">This Week's Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
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
              <Bar dataKey="duration" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Workouts</h3>
        <div className="space-y-3">
          {recentWorkouts.map((workout) => {
            const Icon = getWorkoutIcon(workout.type)
            return (
              <div
                key={workout.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`bg-gradient-to-br ${getWorkoutColor(workout.type)} p-3 rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 capitalize">{workout.type}</h4>
                        {workout.source !== 'manual' && (
                          <DeviceBadge type={workout.source} size="sm" showLabel={false} />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-right ml-4">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{workout.duration} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="text-sm font-semibold text-gray-900">{workout.caloriesBurned}</p>
                    </div>
                    {workout.distance && (
                      <div>
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="text-sm font-semibold text-gray-900">{workout.distance} mi</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Heart Rate Info */}
                {workout.averageHeartRate && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Avg HR: <span className="font-medium text-gray-900">{workout.averageHeartRate} bpm</span></span>
                    </div>
                    {workout.maxHeartRate && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        <span>Max: <span className="font-medium text-gray-900">{workout.maxHeartRate} bpm</span></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {last30Days.length > 10 && (
          <button className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            View All {last30Days.length} Workouts
          </button>
        )}
      </div>

      {/* Additional Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Workout Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-700 mb-1">Most Active Day</p>
            <p className="text-xs text-gray-700">
              {weeklyData.reduce((max, day) => day.duration > max.duration ? day : max).day} - Keep that energy going!
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-indigo-700 mb-1">Favorite Workout</p>
            <p className="text-xs text-gray-700 capitalize">
              {pieData[0]?.name.toLowerCase() || 'N/A'} - {pieData[0]?.value || 0} sessions this month
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-700 mb-1">Consistency</p>
            <p className="text-xs text-gray-700">
              {Math.round((totalWorkouts / 30) * 7)} workouts per week on average
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-700 mb-1">Calorie Goal</p>
            <p className="text-xs text-gray-700">
              {avgCalories} cal per workout - {avgCalories >= 250 ? 'Great burn!' : 'Try increasing intensity'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
