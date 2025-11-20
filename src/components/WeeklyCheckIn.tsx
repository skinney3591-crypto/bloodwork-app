import { useState } from 'react'
import { Heart, TrendingUp, TrendingDown, Minus, Calendar, CheckCircle, MessageSquare, Zap, Moon, Brain, Dumbbell, Sparkles } from 'lucide-react'
import type { DailyActivity, SleepData } from '../data/mockData'
import DeviceBadge from './DeviceBadge'

// API-ready interfaces
interface CheckInQuestion {
  id: string
  category: 'energy' | 'sleep' | 'mood' | 'physical' | 'digestion' | 'custom'
  question: string
  relatedTo?: string[] // Links to supplements/medications/exercises
}

interface CheckInResponse {
  questionId: string
  response: 'better' | 'same' | 'worse'
  notes?: string
}

interface WeeklyCheckInData {
  id: string
  userId: string
  weekOf: string
  completedAt: string
  responses: CheckInResponse[]
  overallFeeling: 'better' | 'same' | 'worse'
  additionalNotes?: string
}

// Questions tied to common improvement plan areas
const checkInQuestions: CheckInQuestion[] = [
  {
    id: 'energy',
    category: 'energy',
    question: 'How are your energy levels throughout the day?',
    relatedTo: ['Vitamin D3', 'CoQ10', 'B12', 'Iron']
  },
  {
    id: 'sleep',
    category: 'sleep',
    question: 'How is your sleep quality?',
    relatedTo: ['Magnesium Glycinate', 'Melatonin']
  },
  {
    id: 'mood',
    category: 'mood',
    question: 'How is your overall mood and mental clarity?',
    relatedTo: ['Omega-3 Fish Oil', 'Vitamin D3', 'B Vitamins']
  },
  {
    id: 'physical',
    category: 'physical',
    question: 'How do you feel physically during exercise?',
    relatedTo: ['Exercise Plan', 'CoQ10', 'Electrolytes']
  },
  {
    id: 'digestion',
    category: 'digestion',
    question: 'How is your digestion and gut comfort?',
    relatedTo: ['Berberine', 'Probiotics', 'Fiber']
  }
]

const getCategoryIcon = (category: CheckInQuestion['category']) => {
  switch (category) {
    case 'energy': return Zap
    case 'sleep': return Moon
    case 'mood': return Brain
    case 'physical': return Dumbbell
    case 'digestion': return Heart
    default: return Heart
  }
}

interface WeeklyCheckInProps {
  activityHistory?: DailyActivity[]
  sleepHistory?: SleepData[]
}

export default function WeeklyCheckIn({ activityHistory = [], sleepHistory = [] }: WeeklyCheckInProps) {
  const [responses, setResponses] = useState<Record<string, 'better' | 'same' | 'worse'>>({})
  const [overallFeeling, setOverallFeeling] = useState<'better' | 'same' | 'worse' | null>(null)
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Calculate device insights for auto-suggestions
  const hasDeviceData = activityHistory.length > 0 && sleepHistory.length > 0

  // Compare this week vs last week
  const thisWeekActivity = activityHistory.slice(-7)
  const lastWeekActivity = activityHistory.slice(-14, -7)
  const thisWeekSleep = sleepHistory.slice(-7)
  const lastWeekSleep = sleepHistory.slice(-14, -7)

  const getAvgSteps = (days: DailyActivity[]) => days.length > 0 ? Math.round(days.reduce((sum, d) => sum + d.steps, 0) / days.length) : 0
  const getAvgActive = (days: DailyActivity[]) => days.length > 0 ? Math.round(days.reduce((sum, d) => sum + d.activeMinutes, 0) / days.length) : 0
  const getAvgSleepScore = (days: SleepData[]) => days.length > 0 ? Math.round(days.reduce((sum, d) => sum + (d.sleepScore || 0), 0) / days.length) : 0

  const thisWeekAvgSteps = getAvgSteps(thisWeekActivity)
  const lastWeekAvgSteps = getAvgSteps(lastWeekActivity)
  const thisWeekAvgActive = getAvgActive(thisWeekActivity)
  const lastWeekAvgActive = getAvgActive(lastWeekActivity)
  const thisWeekSleepScore = getAvgSleepScore(thisWeekSleep)
  const lastWeekSleepScore = getAvgSleepScore(lastWeekSleep)

  // Calculate suggestions
  const stepsChange = thisWeekAvgSteps - lastWeekAvgSteps
  const activeChange = thisWeekAvgActive - lastWeekAvgActive
  const sleepChange = thisWeekSleepScore - lastWeekSleepScore

  const getSuggestion = (questionId: string): 'better' | 'same' | 'worse' | null => {
    if (!hasDeviceData) return null

    switch (questionId) {
      case 'energy':
        // Energy based on active minutes and steps
        if (activeChange > 5 || stepsChange > 1000) return 'better'
        if (activeChange < -5 || stepsChange < -1000) return 'worse'
        return 'same'

      case 'sleep':
        // Sleep based on sleep score
        if (sleepChange > 5) return 'better'
        if (sleepChange < -5) return 'worse'
        return 'same'

      case 'physical':
        // Physical feeling based on active minutes
        if (activeChange > 5) return 'better'
        if (activeChange < -5) return 'worse'
        return 'same'

      default:
        return null
    }
  }

  const getDeviceInsight = (questionId: string): string | null => {
    if (!hasDeviceData) return null

    switch (questionId) {
      case 'energy':
        return `Your activity: ${thisWeekAvgActive} avg active min/day (${activeChange >= 0 ? '+' : ''}${activeChange} vs last week)`

      case 'sleep':
        return `Your sleep score: ${thisWeekSleepScore} avg (${sleepChange >= 0 ? '+' : ''}${sleepChange} vs last week)`

      case 'physical':
        return `Your workouts: ${thisWeekAvgActive} avg active min/day (${activeChange >= 0 ? '+' : ''}${activeChange} vs last week)`

      default:
        return null
    }
  }

  // Mock historical data - would come from API
  const checkInHistory: { weekOf: string; overall: 'better' | 'same' | 'worse'; streak: number }[] = [
    { weekOf: '2024-01-08', overall: 'better', streak: 3 },
    { weekOf: '2024-01-01', overall: 'better', streak: 2 },
    { weekOf: '2023-12-25', overall: 'same', streak: 1 },
  ]

  const handleResponse = (questionId: string, response: 'better' | 'same' | 'worse') => {
    setResponses(prev => ({ ...prev, [questionId]: response }))
  }

  const handleSubmit = () => {
    // API call would go here
    const checkInData: WeeklyCheckInData = {
      id: crypto.randomUUID(),
      userId: 'user-1',
      weekOf: new Date().toISOString().split('T')[0],
      completedAt: new Date().toISOString(),
      responses: Object.entries(responses).map(([questionId, response]) => ({
        questionId,
        response
      })),
      overallFeeling: overallFeeling!,
      additionalNotes: additionalNotes || undefined
    }
    console.log('Submitting check-in:', checkInData)
    setIsSubmitted(true)
  }

  const isComplete = Object.keys(responses).length === checkInQuestions.length && overallFeeling !== null

  const getResponseIcon = (response: 'better' | 'same' | 'worse') => {
    switch (response) {
      case 'better': return <TrendingUp className="h-5 w-5" />
      case 'same': return <Minus className="h-5 w-5" />
      case 'worse': return <TrendingDown className="h-5 w-5" />
    }
  }

  const getResponseColor = (response: 'better' | 'same' | 'worse', isSelected: boolean) => {
    if (!isSelected) return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    switch (response) {
      case 'better': return 'bg-green-100 text-green-700 border-2 border-green-500'
      case 'same': return 'bg-blue-100 text-blue-700 border-2 border-blue-500'
      case 'worse': return 'bg-orange-100 text-orange-700 border-2 border-orange-500'
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Check-In Complete!</h2>
          <p className="text-green-800 mb-4">
            Thanks for sharing how you're feeling. Your doctor will review this along with your other health data.
          </p>

          {/* Summary */}
          <div className="bg-white rounded-lg p-4 mt-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Your Responses</h3>
            <div className="space-y-2">
              {checkInQuestions.map(q => {
                const response = responses[q.id]
                return (
                  <div key={q.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{q.category.charAt(0).toUpperCase() + q.category.slice(1)}</span>
                    <span className={`font-medium ${
                      response === 'better' ? 'text-green-600' :
                      response === 'same' ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {response?.charAt(0).toUpperCase() + response?.slice(1)}
                    </span>
                  </div>
                )
              })}
              <div className="border-t pt-2 mt-2 flex items-center justify-between font-semibold">
                <span className="text-gray-900">Overall</span>
                <span className={`${
                  overallFeeling === 'better' ? 'text-green-600' :
                  overallFeeling === 'same' ? 'text-blue-600' :
                  'text-orange-600'
                }`}>
                  {overallFeeling ? overallFeeling.charAt(0).toUpperCase() + overallFeeling.slice(1) : ''}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSubmitted(false)
              setResponses({})
              setOverallFeeling(null)
              setAdditionalNotes('')
            }}
            className="mt-6 text-green-700 hover:text-green-800 font-medium"
          >
            Submit Another Check-In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Heart className="h-7 w-7 mr-3 text-rose-500" />
              Weekly Wellness Check-In
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Track how you're feeling as you follow your improvement plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Week of</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Check-in History Toggle */}
      {checkInHistory.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-3 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Previous Check-Ins</span>
          </div>
          <span className="text-sm text-gray-500">
            {checkInHistory.length} completed
          </span>
        </button>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="space-y-3">
            {checkInHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Week of {new Date(entry.weekOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {entry.streak} week streak
                  </p>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  entry.overall === 'better' ? 'bg-green-100 text-green-700' :
                  entry.overall === 'same' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {getResponseIcon(entry.overall)}
                  <span className="ml-1">{entry.overall.charAt(0).toUpperCase() + entry.overall.slice(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Device Data Banner */}
      {hasDeviceData && thisWeekActivity.length > 0 && (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 border-2 border-teal-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-gray-900">AI-Powered Suggestions</h3>
            </div>
            <DeviceBadge type={thisWeekActivity[0].source} />
          </div>
          <p className="text-sm text-gray-700">
            We've analyzed your device data from this past week. Click the suggestions below to quickly fill in your check-in based on your tracked metrics.
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {checkInQuestions.map((question) => {
          const Icon = getCategoryIcon(question.category)
          const currentResponse = responses[question.id]
          const suggestion = getSuggestion(question.id)
          const deviceInsight = getDeviceInsight(question.id)

          return (
            <div key={question.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{question.question}</p>
                  {question.relatedTo && (
                    <p className="text-xs text-gray-500 mt-1">
                      Related to: {question.relatedTo.slice(0, 3).join(', ')}
                      {question.relatedTo.length > 3 && ` +${question.relatedTo.length - 3} more`}
                    </p>
                  )}
                </div>
              </div>

              {/* Device Insight */}
              {deviceInsight && (
                <div className="mb-3 bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-teal-700 mb-1">From your device:</p>
                      <p className="text-sm text-teal-900">{deviceInsight}</p>
                    </div>
                    {suggestion && (
                      <button
                        onClick={() => handleResponse(question.id, suggestion)}
                        className="ml-3 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Use suggestion</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                {(['better', 'same', 'worse'] as const).map((response) => (
                  <button
                    key={response}
                    onClick={() => handleResponse(question.id, response)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                      getResponseColor(response, currentResponse === response)
                    }${suggestion === response && currentResponse !== response ? ' ring-2 ring-teal-400' : ''}`}
                  >
                    {getResponseIcon(response)}
                    <span>{response.charAt(0).toUpperCase() + response.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall Feeling */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">
          Overall, compared to last week, how are you feeling?
        </h3>
        <div className="flex space-x-4">
          {(['better', 'same', 'worse'] as const).map((response) => (
            <button
              key={response}
              onClick={() => setOverallFeeling(response)}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-4 rounded-xl font-medium transition-all ${
                getResponseColor(response, overallFeeling === response)
              }`}
            >
              <div className="mb-2">
                {response === 'better' && <TrendingUp className="h-8 w-8" />}
                {response === 'same' && <Minus className="h-8 w-8" />}
                {response === 'worse' && <TrendingDown className="h-8 w-8" />}
              </div>
              <span className="text-lg">{response.charAt(0).toUpperCase() + response.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Anything else to share? (Optional)</h3>
        </div>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Any symptoms, concerns, or positive changes you've noticed..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isComplete}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isComplete
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isComplete ? 'Submit Check-In' : `Answer ${checkInQuestions.length - Object.keys(responses).length + (overallFeeling ? 0 : 1)} more questions`}
      </button>

      {/* Info Note */}
      <div className="text-center text-sm text-gray-500">
        <p>Your responses help your doctor understand how the treatment plan is working for you.</p>
      </div>
    </div>
  )
}
