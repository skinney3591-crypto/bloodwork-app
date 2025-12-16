import { useState } from 'react'
import { LayoutDashboard, Users, MessageSquare, Calendar, Dumbbell, ClipboardList } from 'lucide-react'
import { mockTrainerData } from '../../data/mockTrainerData'
import TrainerDashboard from './TrainerDashboard'
import ClientsList from './ClientsList'
import ClientChart from './ClientChart'
import ProgramsTab from './ProgramsTab'

type TrainerTab = 'dashboard' | 'clients' | 'programs' | 'messages' | 'calendar'

export default function TrainerPortal() {
  const [activeTab, setActiveTab] = useState<TrainerTab>('dashboard')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const { trainer, clients, messages, sessions } = mockTrainerData

  // Count unread messages and pending items
  const unreadMessagesCount = messages.filter(m => m.unread).length
  const pendingFormChecks = trainer.pendingFormChecks

  const tabs = [
    { id: 'dashboard' as TrainerTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients' as TrainerTab, label: 'Clients', icon: Users, badge: pendingFormChecks > 0 ? pendingFormChecks : undefined },
    { id: 'programs' as TrainerTab, label: 'Programs', icon: ClipboardList },
    { id: 'messages' as TrainerTab, label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { id: 'calendar' as TrainerTab, label: 'Calendar', icon: Calendar },
  ]

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId)
  }

  const handleBackToClients = () => {
    setSelectedClientId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Trainer Portal</h1>
                <p className="text-orange-100">Welcome back, {trainer.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-white">
                <p className="text-sm text-orange-100">Active Clients</p>
                <p className="text-2xl font-bold">{trainer.clientCount}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-white">
                <p className="text-sm text-orange-100">Active Programs</p>
                <p className="text-2xl font-bold">{trainer.activePrograms}</p>
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
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id !== 'clients') {
                      setSelectedClientId(null)
                    }
                  }}
                  className={`relative flex items-center space-x-2 px-6 py-4 border-b-4 transition-all duration-200 font-medium ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <TrainerDashboard
            trainer={trainer}
            clients={clients}
            sessions={sessions}
            messages={messages}
            onSelectClient={(clientId) => {
              setSelectedClientId(clientId)
              setActiveTab('clients')
            }}
          />
        )}

        {activeTab === 'clients' && (
          selectedClientId ? (
            <ClientChart
              clientId={selectedClientId}
              onBack={handleBackToClients}
            />
          ) : (
            <ClientsList
              clients={clients}
              onSelectClient={handleSelectClient}
            />
          )
        )}

        {activeTab === 'programs' && (
          <ProgramsTab clients={clients} />
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
            <p className="text-gray-600">
              {unreadMessagesCount} unread messages
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Full messaging interface coming soon...
            </p>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Calendar</h2>
            <p className="text-gray-600">
              {sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length} sessions today
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Full calendar interface coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
