import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Calendar, Target, ArrowRight, Activity, Moon, Footprints, Zap } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, ComposedChart, Line, Bar } from 'recharts'
import type { DailyActivity, SleepData } from '../data/mockData'
import DeviceBadge from './DeviceBadge'

// API-ready interfaces
export interface HistoricalResult {
  date: string
  value: number
  unit: string
  status: 'normal' | 'low' | 'high'
}

export interface MarkerTrend {
  id: string
  name: string
  category: string
  unit: string
  currentValue: number
  previousValue: number
  percentChange: number
  trend: 'improving' | 'worsening' | 'stable'
  history: HistoricalResult[]
  normalRangeMin: number
  normalRangeMax: number
  prediction?: {
    nextValue: number
    confidence: number
    date: string
  }
}

interface TrendsViewProps {
  trends?: MarkerTrend[]
  onSelectMarker?: (markerId: string) => void
  activityHistory?: DailyActivity[]
  sleepHistory?: SleepData[]
}

// Mock historical data - replace with API calls
const mockTrends: MarkerTrend[] = [
  {
    id: 'ldl',
    name: 'LDL Cholesterol',
    category: 'Lipid Panel',
    unit: 'mg/dL',
    currentValue: 145,
    previousValue: 165,
    percentChange: -12.1,
    trend: 'improving',
    normalRangeMin: 0,
    normalRangeMax: 100,
    history: [
      { date: '2025-05', value: 180, unit: 'mg/dL', status: 'high' },
      { date: '2025-07', value: 165, unit: 'mg/dL', status: 'high' },
      { date: '2025-09', value: 155, unit: 'mg/dL', status: 'high' },
      { date: '2025-11', value: 145, unit: 'mg/dL', status: 'high' },
    ],
    prediction: {
      nextValue: 125,
      confidence: 78,
      date: '2026-01',
    },
  },
  {
    id: 'glucose',
    name: 'Glucose (Fasting)',
    category: 'Metabolic Panel',
    unit: 'mg/dL',
    currentValue: 112,
    previousValue: 118,
    percentChange: -5.1,
    trend: 'improving',
    normalRangeMin: 70,
    normalRangeMax: 99,
    history: [
      { date: '2025-05', value: 125, unit: 'mg/dL', status: 'high' },
      { date: '2025-07', value: 118, unit: 'mg/dL', status: 'high' },
      { date: '2025-09', value: 115, unit: 'mg/dL', status: 'high' },
      { date: '2025-11', value: 112, unit: 'mg/dL', status: 'high' },
    ],
    prediction: {
      nextValue: 105,
      confidence: 72,
      date: '2026-01',
    },
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'Diabetes Markers',
    unit: '%',
    currentValue: 5.8,
    previousValue: 6.0,
    percentChange: -3.3,
    trend: 'improving',
    normalRangeMin: 0,
    normalRangeMax: 5.7,
    history: [
      { date: '2025-05', value: 6.2, unit: '%', status: 'high' },
      { date: '2025-07', value: 6.0, unit: '%', status: 'high' },
      { date: '2025-09', value: 5.9, unit: '%', status: 'high' },
      { date: '2025-11', value: 5.8, unit: '%', status: 'high' },
    ],
    prediction: {
      nextValue: 5.6,
      confidence: 65,
      date: '2026-01',
    },
  },
  {
    id: 'vitd',
    name: 'Vitamin D',
    category: 'Vitamins & Minerals',
    unit: 'ng/mL',
    currentValue: 28,
    previousValue: 22,
    percentChange: 27.3,
    trend: 'improving',
    normalRangeMin: 30,
    normalRangeMax: 100,
    history: [
      { date: '2025-05', value: 18, unit: 'ng/mL', status: 'low' },
      { date: '2025-07', value: 22, unit: 'ng/mL', status: 'low' },
      { date: '2025-09', value: 25, unit: 'ng/mL', status: 'low' },
      { date: '2025-11', value: 28, unit: 'ng/mL', status: 'low' },
    ],
    prediction: {
      nextValue: 35,
      confidence: 82,
      date: '2026-01',
    },
  },
  {
    id: 'trig',
    name: 'Triglycerides',
    category: 'Lipid Panel',
    unit: 'mg/dL',
    currentValue: 165,
    previousValue: 158,
    percentChange: 4.4,
    trend: 'worsening',
    normalRangeMin: 0,
    normalRangeMax: 150,
    history: [
      { date: '2025-05', value: 145, unit: 'mg/dL', status: 'normal' },
      { date: '2025-07', value: 158, unit: 'mg/dL', status: 'high' },
      { date: '2025-09', value: 160, unit: 'mg/dL', status: 'high' },
      { date: '2025-11', value: 165, unit: 'mg/dL', status: 'high' },
    ],
  },
]

export default function TrendsView({ trends = mockTrends, activityHistory = [], sleepHistory = [] }: TrendsViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerTrend>(trends[0])

  // Calculate activity correlations
  const hasDeviceData = activityHistory.length > 0 && sleepHistory.length > 0

  // Get last 90 days of data
  const last90DaysActivity = activityHistory.slice(-90)
  const last90DaysSleep = sleepHistory.slice(-90)

  // Calculate average metrics over time periods
  const getAverageSteps = (days: DailyActivity[]) =>
    Math.round(days.reduce((sum, d) => sum + d.steps, 0) / days.length)

  const getAverageActiveMinutes = (days: DailyActivity[]) =>
    Math.round(days.reduce((sum, d) => sum + d.activeMinutes, 0) / days.length)

  const getAverageSleepScore = (days: SleepData[]) =>
    Math.round(days.reduce((sum, d) => sum + (d.sleepScore || 0), 0) / days.length)

  // Split into first and last 30 days
  const firstMonth = last90DaysActivity.slice(0, 30)
  const lastMonth = last90DaysActivity.slice(-30)
  const firstMonthSleep = last90DaysSleep.slice(0, 30)
  const lastMonthSleep = last90DaysSleep.slice(-30)

  const stepsImprovement = getAverageSteps(lastMonth) - getAverageSteps(firstMonth)
  const activeImprovement = getAverageActiveMinutes(lastMonth) - getAverageActiveMinutes(firstMonth)
  const sleepImprovement = getAverageSleepScore(lastMonthSleep) - getAverageSleepScore(firstMonthSleep)

  // Prepare activity trend chart data (monthly averages)
  const activityTrendData = hasDeviceData ? [
    {
      month: 'Month 1',
      steps: getAverageSteps(last90DaysActivity.slice(0, 30)),
      activeMinutes: getAverageActiveMinutes(last90DaysActivity.slice(0, 30)),
      sleepScore: getAverageSleepScore(last90DaysSleep.slice(0, 30))
    },
    {
      month: 'Month 2',
      steps: getAverageSteps(last90DaysActivity.slice(30, 60)),
      activeMinutes: getAverageActiveMinutes(last90DaysActivity.slice(30, 60)),
      sleepScore: getAverageSleepScore(last90DaysSleep.slice(30, 60))
    },
    {
      month: 'Month 3',
      steps: getAverageSteps(last90DaysActivity.slice(60, 90)),
      activeMinutes: getAverageActiveMinutes(last90DaysActivity.slice(60, 90)),
      sleepScore: getAverageSleepScore(last90DaysSleep.slice(60, 90))
    }
  ] : []

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingDown className="h-5 w-5 text-green-600" />
    if (trend === 'worsening') return <TrendingUp className="h-5 w-5 text-red-600" />
    return <Minus className="h-5 w-5 text-gray-600" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'text-green-600'
    if (trend === 'worsening') return 'text-red-600'
    return 'text-gray-600'
  }

  const getTrendBg = (trend: string) => {
    if (trend === 'improving') return 'bg-green-50 border-green-200'
    if (trend === 'worsening') return 'bg-red-50 border-red-200'
    return 'bg-gray-50 border-gray-200'
  }

  // Prepare chart data with prediction
  const chartData = [
    ...selectedMarker.history.map(h => ({
      date: h.date,
      value: h.value,
      type: 'actual',
    })),
    ...(selectedMarker.prediction ? [{
      date: selectedMarker.prediction.date,
      value: selectedMarker.prediction.nextValue,
      type: 'predicted',
    }] : []),
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-7 w-7 mr-3 text-indigo-600" />
              Health Trends
            </h2>
            <p className="text-sm text-gray-600 mt-1">Track your biomarker changes over time</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last 6 months</span>
          </div>
        </div>
      </div>

      {/* Activity Correlations */}
      {hasDeviceData && last90DaysActivity.length > 0 && (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-md p-6 border-2 border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-teal-600" />
                Activity & Health Correlations
              </h3>
              <p className="text-sm text-gray-600 mt-1">How your fitness impacts your bloodwork</p>
            </div>
            <DeviceBadge type={last90DaysActivity[0].source} />
          </div>

          {/* Improvement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Footprints className="h-5 w-5 text-blue-600" />
                <span className={`text-sm font-semibold ${stepsImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stepsImprovement >= 0 ? '+' : ''}{stepsImprovement}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{getAverageSteps(lastMonth)}</p>
              <p className="text-xs text-gray-600">Avg Steps (Last Month)</p>
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span className={`text-sm font-semibold ${activeImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {activeImprovement >= 0 ? '+' : ''}{activeImprovement}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{getAverageActiveMinutes(lastMonth)} min</p>
              <p className="text-xs text-gray-600">Active Minutes (Last Month)</p>
            </div>

            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Moon className="h-5 w-5 text-purple-600" />
                <span className={`text-sm font-semibold ${sleepImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {sleepImprovement >= 0 ? '+' : ''}{sleepImprovement}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{getAverageSleepScore(lastMonthSleep)}</p>
              <p className="text-xs text-gray-600">Sleep Score (Last Month)</p>
            </div>
          </div>

          {/* Activity Trend Chart */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">3-Month Activity Trends</h4>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={activityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar yAxisId="left" dataKey="steps" fill="#3b82f6" name="Avg Steps" />
                <Line yAxisId="right" type="monotone" dataKey="sleepScore" stroke="#8b5cf6" strokeWidth={2} name="Sleep Score" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Correlation Insights */}
          <div className="mt-4 bg-teal-100 rounded-lg p-4 border border-teal-300">
            <p className="text-sm font-semibold text-teal-900 mb-2">💡 Key Insight</p>
            <p className="text-xs text-teal-800">
              {stepsImprovement > 0 && trends.filter(t => t.trend === 'improving').length > 0
                ? `Your increased activity (${stepsImprovement > 0 ? '+' : ''}${stepsImprovement} avg steps) correlates with improving bloodwork markers! Keep it up!`
                : stepsImprovement > 0
                ? `Great job increasing activity! Continue this trend to see improvements in your bloodwork.`
                : `Consider increasing your daily activity to support your health goals. Aim for at least 8,000 steps per day.`}
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <p className="text-sm text-green-600 font-medium">Improving</p>
          <p className="text-3xl font-bold text-green-900">
            {trends.filter(t => t.trend === 'improving').length}
          </p>
          <p className="text-xs text-green-700 mt-1">markers trending better</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
          <p className="text-sm text-red-600 font-medium">Needs Attention</p>
          <p className="text-3xl font-bold text-red-900">
            {trends.filter(t => t.trend === 'worsening').length}
          </p>
          <p className="text-xs text-red-700 mt-1">markers trending worse</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-600 font-medium">Stable</p>
          <p className="text-3xl font-bold text-gray-900">
            {trends.filter(t => t.trend === 'stable').length}
          </p>
          <p className="text-xs text-gray-700 mt-1">markers unchanged</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{selectedMarker.name}</h3>
            <p className="text-sm text-gray-600">{selectedMarker.category}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${getTrendBg(selectedMarker.trend)}`}>
            <div className="flex items-center space-x-2">
              {getTrendIcon(selectedMarker.trend)}
              <span className={`font-bold ${getTrendColor(selectedMarker.trend)}`}>
                {selectedMarker.percentChange > 0 ? '+' : ''}{selectedMarker.percentChange.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} domain={['auto', 'auto']} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.date}</p>
                        <p className="text-sm">
                          {data.value} {selectedMarker.unit}
                          {data.type === 'predicted' && (
                            <span className="ml-2 text-xs text-indigo-600">(Predicted)</span>
                          )}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ReferenceLine
                y={selectedMarker.normalRangeMax}
                stroke="#10b981"
                strokeDasharray="5 5"
                label={{ value: 'Normal', position: 'right', fontSize: 10, fill: '#10b981' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{ r: 6, fill: '#6366f1' }}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction */}
        {selectedMarker.prediction && (
          <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-indigo-900">Predicted Next Result</p>
                  <p className="text-sm text-indigo-700">
                    {selectedMarker.prediction.nextValue} {selectedMarker.unit} by {selectedMarker.prediction.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-600">Confidence</p>
                <p className="text-lg font-bold text-indigo-900">{selectedMarker.prediction.confidence}%</p>
              </div>
            </div>
            {selectedMarker.prediction.nextValue <= selectedMarker.normalRangeMax && (
              <p className="mt-2 text-sm text-green-700 font-medium">
                🎯 On track to reach normal range!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Marker Selection */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Tracked Markers</h3>
        <div className="space-y-3">
          {trends.map((marker) => (
            <button
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                selectedMarker.id === marker.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <p className="font-semibold text-gray-900">{marker.name}</p>
                    {getTrendIcon(marker.trend)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{marker.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {marker.currentValue} <span className="text-sm font-normal text-gray-500">{marker.unit}</span>
                  </p>
                  <p className={`text-sm font-medium ${getTrendColor(marker.trend)}`}>
                    {marker.percentChange > 0 ? '+' : ''}{marker.percentChange.toFixed(1)}%
                  </p>
                </div>
                <ArrowRight className={`h-5 w-5 ml-3 ${
                  selectedMarker.id === marker.id ? 'text-indigo-500' : 'text-gray-300'
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
