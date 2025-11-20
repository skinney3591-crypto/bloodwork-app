import { useState, useEffect } from 'react'
import { Activity, Pill, Bell, FileText, User, Clock, MessageCircle, TrendingUp, ClipboardCheck, Type, UtensilsCrossed, Moon, Dumbbell, BarChart3, Settings } from 'lucide-react'
import { customer1Data } from './data/mockData'
import type { Reminder } from './data/mockData'
import BloodworkView from './components/BloodworkView'
import SupplementsView from './components/SupplementsView'
import MedicationsView from './components/MedicationsView'
import ExerciseView from './components/ExerciseView'
import RemindersView from './components/RemindersView'
import DashboardOverview from './components/DashboardOverview'
import DoctorMessaging from './components/DoctorMessaging'
import AIHealthChat from './components/AIHealthChat'
import TrendsView from './components/TrendsView'
import WeeklyCheckIn from './components/WeeklyCheckIn'
import MealsView from './components/MealsView'
import ActivityToday from './components/ActivityToday'
import SleepView from './components/SleepView'
import WorkoutsLog from './components/WorkoutsLog'
import ActivityTrends from './components/ActivityTrends'
import DeviceSettings from './components/DeviceSettings'

// Simplified tab structure for better UX
type TabType = 'overview' | 'activity' | 'results' | 'plan' | 'meals' | 'messages' | 'reminders' | 'checkin' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [activitySubTab, setActivitySubTab] = useState<'today' | 'sleep' | 'workouts' | 'trends'>('today')
  const [planSubTab, setPlanSubTab] = useState<'supplements' | 'medications' | 'exercise'>('supplements')
  const [resultsSubTab, setResultsSubTab] = useState<'bloodwork' | 'trends'>('bloodwork')
  const [messagesSubTab, setMessagesSubTab] = useState<'doctor' | 'questions'>('doctor')
  const [reminders, setReminders] = useState<Reminder[]>(customer1Data.reminders)

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ))
  }

  // Apply font size to document - larger defaults for accessibility
  useEffect(() => {
    const sizes = { small: '16px', medium: '18px', large: '20px' }
    document.documentElement.style.fontSize = sizes[fontSize]
  }, [fontSize])

  // Mock check-in status - would come from API
  const lastCheckIn = new Date('2024-01-08') // 8 days ago for demo
  const daysSinceCheckIn = Math.floor((new Date().getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))
  const checkInDue = daysSinceCheckIn >= 7

  // Simplified navigation - 7 main tabs
  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'results' as TabType, label: 'My Results', icon: FileText },
    { id: 'plan' as TabType, label: 'My Plan', icon: Pill },
    { id: 'meals' as TabType, label: 'Meals', icon: UtensilsCrossed },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageCircle },
    { id: 'reminders' as TabType, label: 'Reminders', icon: Bell },
  ]

  const doctorReviewStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    in_review: 'bg-blue-100 text-blue-800 border-blue-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
  }

  const doctorReviewStatusText = {
    pending: 'Pending Doctor Review',
    in_review: 'Under Doctor Review',
    approved: 'Approved by Doctor',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthSync AI</h1>
                <p className="text-sm text-gray-600">Personalized Health Insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Font Size Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFontSize('small')}
                  className={`p-2 rounded transition-colors ${fontSize === 'small' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Small text"
                >
                  <Type className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`p-2 rounded transition-colors ${fontSize === 'medium' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Medium text"
                >
                  <Type className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`p-2 rounded transition-colors ${fontSize === 'large' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Large text"
                >
                  <Type className="h-5 w-5" />
                </button>
              </div>

              {/* Device Settings Button */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Device Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Weekly Check-In Button */}
              <button
                onClick={() => setActiveTab('checkin')}
                className={`relative px-4 py-2 rounded-lg border-2 font-semibold text-sm flex items-center space-x-2 transition-colors ${
                  checkInDue
                    ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                <span>Check-In</span>
                {checkInDue && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </button>

              <div className={`px-4 py-2 rounded-lg border-2 ${doctorReviewStatusColors[customer1Data.doctorReviewStatus]} font-semibold text-sm flex items-center space-x-2`}>
                <Clock className="h-4 w-4" />
                <span>{doctorReviewStatusText[customer1Data.doctorReviewStatus]}</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{customer1Data.name}</p>
                  <p className="text-gray-600">{customer1Data.age} years old</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-4 transition-all duration-200 font-medium ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            data={customer1Data}
            reminders={reminders}
            onToggleReminder={toggleReminder}
            onNavigateToReminders={() => setActiveTab('reminders')}
          />
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Sub-tab navigation - 44px min touch targets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
              <button
                onClick={() => setActivitySubTab('today')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  activitySubTab === 'today'
                    ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Activity className="h-5 w-5 inline mr-2" />
                Today
              </button>
              <button
                onClick={() => setActivitySubTab('sleep')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  activitySubTab === 'sleep'
                    ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Moon className="h-5 w-5 inline mr-2" />
                Sleep
              </button>
              <button
                onClick={() => setActivitySubTab('workouts')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  activitySubTab === 'workouts'
                    ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Dumbbell className="h-5 w-5 inline mr-2" />
                Workouts
              </button>
              <button
                onClick={() => setActivitySubTab('trends')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  activitySubTab === 'trends'
                    ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Trends
              </button>
            </div>

            {activitySubTab === 'today' && (
              <>
                {(() => {
                  const today = new Date().toISOString().split('T')[0]
                  const todayActivity = customer1Data.activityHistory.find(a => a.date === today) || customer1Data.activityHistory[customer1Data.activityHistory.length - 1]
                  return <ActivityToday activity={todayActivity} />
                })()}
              </>
            )}
            {activitySubTab === 'sleep' && <SleepView sleepHistory={customer1Data.sleepHistory} />}
            {activitySubTab === 'workouts' && <WorkoutsLog workouts={customer1Data.workoutHistory} />}
            {activitySubTab === 'trends' && (
              <ActivityTrends
                activityHistory={customer1Data.activityHistory}
                sleepHistory={customer1Data.sleepHistory}
              />
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Sub-tab navigation - 44px min touch targets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
              <button
                onClick={() => setResultsSubTab('bloodwork')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  resultsSubTab === 'bloodwork'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Lab Results
              </button>
              <button
                onClick={() => setResultsSubTab('trends')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  resultsSubTab === 'trends'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <TrendingUp className="h-5 w-5 inline mr-2" />
                Trends Over Time
              </button>
            </div>

            {resultsSubTab === 'bloodwork' && <BloodworkView data={customer1Data.bloodwork} testDate={customer1Data.testDate} />}
            {resultsSubTab === 'trends' && (
              <TrendsView
                activityHistory={customer1Data.activityHistory}
                sleepHistory={customer1Data.sleepHistory}
              />
            )}
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Sub-tab navigation - 44px min touch targets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
              <button
                onClick={() => setPlanSubTab('supplements')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  planSubTab === 'supplements'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Pill className="h-5 w-5 inline mr-2" />
                Supplements
              </button>
              <button
                onClick={() => setPlanSubTab('medications')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  planSubTab === 'medications'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Pill className="h-5 w-5 inline mr-2" />
                Medications
              </button>
              <button
                onClick={() => setPlanSubTab('exercise')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  planSubTab === 'exercise'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Activity className="h-5 w-5 inline mr-2" />
                Exercise
              </button>
            </div>

            {planSubTab === 'supplements' && <SupplementsView supplements={customer1Data.supplements} />}
            {planSubTab === 'medications' && <MedicationsView medications={customer1Data.medications} />}
            {planSubTab === 'exercise' && <ExerciseView exercises={customer1Data.exercises} workoutHistory={customer1Data.workoutHistory} />}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Sub-tab navigation - 44px min touch targets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
              <button
                onClick={() => setMessagesSubTab('doctor')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  messagesSubTab === 'doctor'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <User className="h-5 w-5 inline mr-2" />
                Doctor Messages
              </button>
              <button
                onClick={() => setMessagesSubTab('questions')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  messagesSubTab === 'questions'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <MessageCircle className="h-5 w-5 inline mr-2" />
                Ask Questions
              </button>
            </div>

            {messagesSubTab === 'doctor' && <DoctorMessaging />}
            {messagesSubTab === 'questions' && <AIHealthChat />}
          </div>
        )}

        {activeTab === 'meals' && <MealsView />}

        {activeTab === 'reminders' && <RemindersView reminders={reminders} onToggleReminder={toggleReminder} workoutHistory={customer1Data.workoutHistory} />}
        {activeTab === 'checkin' && (
          <WeeklyCheckIn
            activityHistory={customer1Data.activityHistory}
            sleepHistory={customer1Data.sleepHistory}
          />
        )}
        {activeTab === 'settings' && <DeviceSettings />}
      </main>
    </div>
  )
}

export default App
