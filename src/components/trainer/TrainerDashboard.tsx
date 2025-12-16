import { Users, Trophy, TrendingUp, MessageSquare, Calendar, Video, CheckCircle, Flame, Target } from 'lucide-react'
import type { TrainerProfile, ClientSummary, ScheduledSession, TrainerMessage } from '../../data/trainerData'
import { mockStrengthRecords, mockGoals } from '../../data/mockTrainerData'

interface TrainerDashboardProps {
  trainer: TrainerProfile
  clients: ClientSummary[]
  sessions: ScheduledSession[]
  messages: TrainerMessage[]
  onSelectClient: (clientId: string) => void
}

export default function TrainerDashboard({
  trainer,
  clients,
  sessions,
  messages,
  onSelectClient,
}: TrainerDashboardProps) {
  // Get today's date for filtering
  const today = new Date().toISOString().split('T')[0]
  const todaySessions = sessions.filter(s => s.date === today)
  const unreadMessages = messages.filter(m => m.unread)

  // Calculate average adherence across all clients
  const avgProgramAdherence = Math.round(clients.reduce((sum, c) => sum + c.programAdherence, 0) / clients.length)

  // Recent PRs (last 7 days)
  const recentPRs = mockStrengthRecords.filter(r => r.isPersonalRecord).slice(0, 5)

  // Goals close to completion (75%+ progress)
  const goalsNearCompletion = mockGoals.filter(g => g.status === 'in_progress' && g.progressPercent >= 75)

  // Clients on hot streaks (high adherence)
  const hotStreakClients = clients.filter(c => c.programAdherence >= 85).slice(0, 3)

  // Get adherence color
  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 80) return 'text-green-600 bg-green-100'
    if (adherence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Active Clients</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{trainer.clientCount}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Avg Program</p>
              <p className={`text-4xl font-bold mt-1 ${avgProgramAdherence >= 80 ? 'text-green-600' : avgProgramAdherence >= 60 ? 'text-yellow-600' : 'text-orange-600'}`}>
                {avgProgramAdherence}%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Form Checks</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{trainer.pendingFormChecks}</p>
            </div>
            <div className={`p-3 rounded-lg ${trainer.pendingFormChecks > 0 ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <Video className={`h-8 w-8 ${trainer.pendingFormChecks > 0 ? 'text-purple-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Messages</p>
              <p className="text-4xl font-bold text-gray-900 mt-1">{unreadMessages.length}</p>
            </div>
            <div className={`p-3 rounded-lg ${unreadMessages.length > 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <MessageSquare className={`h-8 w-8 ${unreadMessages.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Wins & Momentum Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent PRs */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold flex items-center mb-4">
            <Trophy className="h-6 w-6 mr-2" />
            Recent PRs
          </h3>
          <div className="space-y-3">
            {recentPRs.slice(0, 3).map((pr) => {
              const client = clients.find(c => c.id === pr.clientId)
              return (
                <button
                  key={pr.id}
                  onClick={() => onSelectClient(pr.clientId)}
                  className="w-full bg-white/20 backdrop-blur rounded-lg p-3 text-left hover:bg-white/30 transition-colors"
                >
                  <p className="font-semibold">{client?.name}</p>
                  <p className="text-sm text-yellow-100">
                    {pr.exerciseName}: {pr.weight}lbs x {pr.reps} ({pr.estimated1RM} e1RM)
                  </p>
                </button>
              )
            })}
            {recentPRs.length === 0 && (
              <p className="text-yellow-100 text-center py-4">PRs incoming...</p>
            )}
          </div>
        </div>

        {/* Goals Near Completion */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold flex items-center mb-4">
            <Target className="h-6 w-6 mr-2" />
            Almost There!
          </h3>
          <div className="space-y-3">
            {goalsNearCompletion.slice(0, 3).map((goal) => {
              const client = clients.find(c => c.id === goal.clientId)
              return (
                <button
                  key={goal.id}
                  onClick={() => onSelectClient(goal.clientId)}
                  className="w-full bg-white/20 backdrop-blur rounded-lg p-3 text-left hover:bg-white/30 transition-colors"
                >
                  <p className="font-semibold">{client?.name}</p>
                  <p className="text-sm text-green-100">{goal.title}</p>
                  <div className="mt-2 w-full bg-white/30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${Math.min(100, goal.progressPercent)}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-100 mt-1">{Math.round(goal.progressPercent)}% complete</p>
                </button>
              )
            })}
            {goalsNearCompletion.length === 0 && (
              <p className="text-green-100 text-center py-4">Goals progressing nicely</p>
            )}
          </div>
        </div>

        {/* Hot Streaks */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold flex items-center mb-4">
            <Flame className="h-6 w-6 mr-2" />
            On Fire
          </h3>
          <div className="space-y-3">
            {hotStreakClients.map((client) => (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className="w-full bg-white/20 backdrop-blur rounded-lg p-3 text-left hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{client.name}</p>
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-sm text-orange-100">
                  {client.programAdherence}% program | {client.nutritionAdherence}% nutrition
                </p>
              </button>
            ))}
            {hotStreakClients.length === 0 && (
              <p className="text-orange-100 text-center py-4">Building momentum...</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Schedule
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {todaySessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sessions scheduled for today</p>
            ) : (
              todaySessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectClient(session.clientId)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 px-3 py-1 rounded-lg">
                      <p className="font-bold text-blue-700">{session.time}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{session.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {session.type.replace('_', ' ')} - {session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {session.status}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Messages
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {messages.slice(0, 5).map((message) => (
              <button
                key={message.id}
                onClick={() => onSelectClient(message.clientId)}
                className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors text-left ${
                  message.unread ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                  message.unread ? 'bg-green-600' : 'bg-gray-400'
                }`}>
                  {message.clientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.clientName}
                    </p>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                  {message.isUrgent && (
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                      URGENT
                    </span>
                  )}
                </div>
                {message.unread && (
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Client Overview */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Client Overview
          </h3>
          <span className="text-orange-100 text-sm">Click a client for details</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {clients.slice(0, 6).map((client) => (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors text-left border border-gray-200 hover:border-orange-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {client.primaryGoal.replace('_', ' ')} | {client.fitnessLevel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getAdherenceColor(client.programAdherence)}`}>
                    {client.programAdherence}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">adherence</p>
                </div>
              </button>
            ))}
          </div>
          {clients.length > 6 && (
            <p className="text-center text-gray-500 mt-4 text-sm">
              + {clients.length - 6} more clients
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          This Week's Progress
        </h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">87%</p>
            <p className="text-purple-200 text-sm">Avg Adherence</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">24</p>
            <p className="text-purple-200 text-sm">Sessions Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">8</p>
            <p className="text-purple-200 text-sm">PRs Hit</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">12</p>
            <p className="text-purple-200 text-sm">Form Checks Reviewed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
