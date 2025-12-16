import { useState, useEffect } from 'react'
import { Activity, Pill, FileText, User, Clock, MessageCircle, TrendingUp, ClipboardCheck, Type, Moon, Dumbbell, BarChart3, Settings, UtensilsCrossed } from 'lucide-react'
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
import ActivityToday from './components/ActivityToday'
import SleepView from './components/SleepView'
import WorkoutsLog from './components/WorkoutsLog'
import ActivityTrends from './components/ActivityTrends'
import DeviceSettings from './components/DeviceSettings'
import VisitSummary from './components/VisitSummary'
import MealsView from './components/MealsView'
import ViewToggle from './components/ViewToggle'
import type { ViewType } from './components/ViewToggle'
import DoctorPortal from './components/doctor/DoctorPortal'
import TrainerPortal from './components/trainer/TrainerPortal'
import WorkoutLinkPopup from './components/WorkoutLinkPopup'
import { mockPendingWorkoutLinks } from './data/mockTrainerData'

// Patient-first portal navigation structure
type TabType = 'dashboard' | 'labs' | 'plan' | 'activity' | 'nutrition' | 'messages' | 'settings'

function App() {
  // Check localStorage for saved view preference
  const savedView = localStorage.getItem('markr-view') as ViewType | null
  const [currentView, setCurrentView] = useState<ViewType>(savedView || 'patient')
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [activitySubTab, setActivitySubTab] = useState<'today' | 'sleep' | 'workouts' | 'trends'>('today')
  const [planSubTab, setPlanSubTab] = useState<'schedule' | 'medications' | 'supplements' | 'exercise'>('schedule')
  const [labsSubTab, setLabsSubTab] = useState<'results' | 'trends'>('results')
  const [messagesSubTab, setMessagesSubTab] = useState<'ai' | 'clinician'>('ai')
  const [reminders, setReminders] = useState<Reminder[]>(customer1Data.reminders)
  const [showVisitSummary, setShowVisitSummary] = useState(false)
  const [aiChatInitialMessage, setAiChatInitialMessage] = useState<string>('')

  // Workout Link Popup state - for demo, show popup for first pending link
  // In a real app, this would check for actual pending workouts detected by the device
  const [pendingWorkoutLinks] = useState(mockPendingWorkoutLinks)
  const [showWorkoutLinkPopup, setShowWorkoutLinkPopup] = useState(false)
  const [dismissedWorkouts, setDismissedWorkouts] = useState<Set<string>>(new Set())

  // Show popup if there are pending links for the current "client"
  // For demo purposes, we'll use client-001 (Sarah Johnson) which matches our customer1Data
  const currentPendingLink = pendingWorkoutLinks.find(
    link => link.clientId === 'client-001' && !dismissedWorkouts.has(link.id)
  )

  // Auto-show popup when there's a pending link (only once per session)
  useEffect(() => {
    if (currentPendingLink && currentView === 'patient' && !showWorkoutLinkPopup) {
      // Delay showing the popup slightly so it feels natural
      const timer = setTimeout(() => {
        setShowWorkoutLinkPopup(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentPendingLink, currentView])

  const handleLinkWorkout = (programId: string, rating?: number, notes?: string) => {
    console.log('Linking workout to program:', { programId, rating, notes })
    // In a real app, this would call an API to create the link
    if (currentPendingLink) {
      setDismissedWorkouts(prev => new Set([...prev, currentPendingLink.id]))
    }
    setShowWorkoutLinkPopup(false)
  }

  const handleSkipWorkout = () => {
    if (currentPendingLink) {
      setDismissedWorkouts(prev => new Set([...prev, currentPendingLink.id]))
    }
    setShowWorkoutLinkPopup(false)
  }

  const handleRemindLater = () => {
    // Just close the popup, don't add to dismissed so it can show again
    setShowWorkoutLinkPopup(false)
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ))
  }

  const handleAskAIAboutMarker = (markerName: string, value: number, unit: string, status: string) => {
    const question = `I see my ${markerName} is ${value} ${unit} and marked as "${status}". Can you explain what this means and what I should do about it?`
    setAiChatInitialMessage(question)
    setActiveTab('messages')
    setMessagesSubTab('ai')
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

  // Patient-first navigation - 6 main tabs
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: TrendingUp },
    { id: 'labs' as TabType, label: 'Labs', icon: FileText },
    { id: 'plan' as TabType, label: 'Plan', icon: Pill },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'nutrition' as TabType, label: 'Nutrition', icon: UtensilsCrossed },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageCircle },
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
    <>
      {/* View Toggle - always visible */}
      <ViewToggle currentView={currentView} onToggle={setCurrentView} />

      {/* Conditionally render Doctor, Trainer, or Patient portal */}
      {currentView === 'doctor' ? (
        <DoctorPortal />
      ) : currentView === 'trainer' ? (
        <TrainerPortal />
      ) : (
        <>
        <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.svg" alt="markr logo" className="h-10" />
              <div>
                <p className="text-sm text-gray-600">Understand your health markers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Font Size Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFontSize('small')}
                  className={`p-2 rounded transition-colors ${fontSize === 'small' ? 'bg-white shadow text-markr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Small text"
                >
                  <Type className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`p-2 rounded transition-colors ${fontSize === 'medium' ? 'bg-white shadow text-markr-blue' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Medium text"
                >
                  <Type className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`p-2 rounded transition-colors ${fontSize === 'large' ? 'bg-white shadow text-markr-blue' : 'text-gray-500 hover:text-gray-700'}`}
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

              {/* Weekly Check-In Button - Navigates to Dashboard */}
              <button
                onClick={() => setActiveTab('dashboard')}
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
                      ? 'border-markr-blue text-markr-blue bg-blue-50'
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
        {activeTab === 'dashboard' && (
          <DashboardOverview
            data={customer1Data}
            reminders={reminders}
            onToggleReminder={toggleReminder}
            onNavigateToPlan={() => setActiveTab('plan')}
            onNavigateToLabs={() => setActiveTab('labs')}
            onOpenVisitSummary={() => setShowVisitSummary(true)}
          />
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Activity Overview Card */}
            <div className="bg-gradient-to-r from-teal-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold flex items-center mb-2">
                    <Activity className="h-7 w-7 mr-3" />
                    Your Movement & Recovery
                  </h2>
                  <p className="text-teal-100 mb-4">Track your daily activity, sleep quality, and workouts to support your health goals</p>
                  {(() => {
                    const today = new Date().toISOString().split('T')[0]
                    const todayActivity = customer1Data.activityHistory.find(a => a.date === today) || customer1Data.activityHistory[customer1Data.activityHistory.length - 1]
                    const todaySleep = customer1Data.sleepHistory.find(s => s.date === today) || customer1Data.sleepHistory[customer1Data.sleepHistory.length - 1]
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                          <p className="text-teal-100 text-sm">Steps Today</p>
                          <p className="text-3xl font-bold">{todayActivity.steps.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                          <p className="text-teal-100 text-sm">Active Minutes</p>
                          <p className="text-3xl font-bold">{todayActivity.activeMinutes}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                          <p className="text-teal-100 text-sm">Sleep Score</p>
                          <p className="text-3xl font-bold">{todaySleep.sleepScore || 'N/A'}</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

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

        {activeTab === 'labs' && (
          <div className="space-y-6">
            {/* Sub-tab navigation - 44px min touch targets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
              <button
                onClick={() => setLabsSubTab('results')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  labsSubTab === 'results'
                    ? 'bg-blue-100 text-markr-blue border-2 border-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Lab Results
              </button>
              <button
                onClick={() => setLabsSubTab('trends')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  labsSubTab === 'trends'
                    ? 'bg-blue-100 text-markr-blue border-2 border-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <TrendingUp className="h-5 w-5 inline mr-2" />
                Trends Over Time
              </button>
            </div>

            {labsSubTab === 'results' && <BloodworkView data={customer1Data.bloodwork} testDate={customer1Data.testDate} onAskAI={handleAskAIAboutMarker} />}
            {labsSubTab === 'trends' && (
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
                onClick={() => setPlanSubTab('schedule')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  planSubTab === 'schedule'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <Clock className="h-5 w-5 inline mr-2" />
                Today's Schedule
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

            {planSubTab === 'schedule' && <RemindersView reminders={reminders} onToggleReminder={toggleReminder} workoutHistory={customer1Data.workoutHistory} />}
            {planSubTab === 'medications' && <MedicationsView medications={customer1Data.medications} bloodwork={customer1Data.bloodwork} />}
            {planSubTab === 'supplements' && <SupplementsView supplements={customer1Data.supplements} bloodwork={customer1Data.bloodwork} />}
            {planSubTab === 'exercise' && <ExerciseView exercises={customer1Data.exercises} workoutHistory={customer1Data.workoutHistory} />}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <MealsView bloodworkIssues={customer1Data.bloodwork.filter(b => b.status !== 'normal').map(b => b.name)} />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Sub-tab navigation - 44px min touch targets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
              <button
                onClick={() => setMessagesSubTab('ai')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  messagesSubTab === 'ai'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <MessageCircle className="h-5 w-5 inline mr-2" />
                AI Assistant
              </button>
              <button
                onClick={() => setMessagesSubTab('clinician')}
                className={`flex-1 min-h-[44px] py-3 px-4 rounded-lg font-medium text-base transition-all ${
                  messagesSubTab === 'clinician'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <User className="h-5 w-5 inline mr-2" />
                My Clinician
              </button>
            </div>

            {messagesSubTab === 'ai' && <AIHealthChat initialMessage={aiChatInitialMessage} />}
            {messagesSubTab === 'clinician' && <DoctorMessaging />}
          </div>
        )}

        {activeTab === 'settings' && <DeviceSettings />}
      </main>

      {/* Visit Summary Modal */}
      {showVisitSummary && (
        <VisitSummary
          data={customer1Data}
          onClose={() => setShowVisitSummary(false)}
        />
      )}

      {/* Workout Link Popup - shows when device detects a workout */}
      {showWorkoutLinkPopup && currentPendingLink && (
        <WorkoutLinkPopup
          pendingLink={currentPendingLink}
          onLink={handleLinkWorkout}
          onSkip={handleSkipWorkout}
          onRemindLater={handleRemindLater}
          onClose={() => setShowWorkoutLinkPopup(false)}
        />
      )}
        </div>
        </>
      )}
    </>
  )
}

export default App
