import { useState } from 'react'
import { Search, Filter, TrendingUp, TrendingDown, Minus, Video, MessageSquare, Calendar, Activity, Apple } from 'lucide-react'
import type { ClientSummary, GoalType } from '../../data/trainerData'

interface ClientsListProps {
  clients: ClientSummary[]
  onSelectClient: (clientId: string) => void
}

type FilterType = 'all' | 'crushing_it' | 'building_momentum' | GoalType

export default function ClientsList({ clients, onSelectClient }: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<'name' | 'adherence' | 'lastWorkout'>('name')

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      // Search filter
      if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Category filter
      if (filter === 'crushing_it') {
        return client.programAdherence >= 85 && client.nutritionAdherence >= 80
      }
      if (filter === 'building_momentum') {
        return client.programAdherence >= 60 && client.programAdherence < 85
      }
      if (filter !== 'all' && client.primaryGoal !== filter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'adherence') return b.programAdherence - a.programAdherence
      if (sortBy === 'lastWorkout') {
        const aDate = a.lastWorkout ? new Date(a.lastWorkout).getTime() : 0
        const bDate = b.lastWorkout ? new Date(b.lastWorkout).getTime() : 0
        return bDate - aDate
      }
      return 0
    })

  const getGoalIcon = (goal: GoalType) => {
    switch (goal) {
      case 'weight_loss': return '🔥'
      case 'muscle_gain': return '💪'
      case 'strength': return '🏋️'
      case 'endurance': return '🏃'
      case 'body_recomposition': return '⚖️'
      case 'athletic_performance': return '🏆'
      case 'general_fitness': return '❤️'
      case 'rehabilitation': return '🩹'
      default: return '🎯'
    }
  }

  const getDaysSinceWorkout = (lastWorkout?: string) => {
    if (!lastWorkout) return null
    const days = Math.floor((new Date().getTime() - new Date(lastWorkout).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Clients' },
    { id: 'crushing_it', label: 'Crushing It' },
    { id: 'building_momentum', label: 'Building Momentum' },
    { id: 'weight_loss', label: 'Weight Loss' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'strength', label: 'Strength' },
    { id: 'general_fitness', label: 'General Fitness' },
  ]

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="adherence">Sort by Adherence</option>
            <option value="lastWorkout">Sort by Last Workout</option>
          </select>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === option.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredClients.length}</span> of {clients.length} clients
        </p>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => {
          const daysSince = getDaysSinceWorkout(client.lastWorkout)
          const isCrushingIt = client.programAdherence >= 85

          return (
            <button
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={`bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-all border-2 ${
                isCrushingIt ? 'border-green-200 hover:border-green-400' : 'border-gray-100 hover:border-orange-400'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-xl">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                    <p className="text-gray-600">
                      {client.age} y/o {client.gender} | {client.fitnessLevel}
                    </p>
                  </div>
                </div>
                <span className="text-2xl">{getGoalIcon(client.primaryGoal)}</span>
              </div>

              {/* Goal */}
              <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {client.primaryGoal.replace('_', ' ')}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 uppercase font-semibold flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      Program
                    </span>
                    {client.programAdherence >= 80 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : client.programAdherence >= 60 ? (
                      <Minus className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className={`text-xl font-bold ${
                    client.programAdherence >= 80 ? 'text-green-600' :
                    client.programAdherence >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {client.programAdherence}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 uppercase font-semibold flex items-center">
                      <Apple className="h-3 w-3 mr-1" />
                      Nutrition
                    </span>
                  </div>
                  <div className={`text-xl font-bold ${
                    client.nutritionAdherence >= 80 ? 'text-green-600' :
                    client.nutritionAdherence >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {client.nutritionAdherence}%
                  </div>
                </div>
              </div>

              {/* Weight Progress */}
              {client.currentWeight && client.startingWeight && client.targetWeight && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Weight Progress</span>
                    <span className="font-semibold">
                      {client.currentWeight} / {client.targetWeight} lbs
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0,
                          client.primaryGoal === 'weight_loss'
                            ? ((client.startingWeight - client.currentWeight) / (client.startingWeight - client.targetWeight)) * 100
                            : ((client.currentWeight - client.startingWeight) / (client.targetWeight - client.startingWeight)) * 100
                        ))}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-gray-500">
                  {daysSince !== null && (
                    <span className={daysSince === 0 ? 'text-green-600' : ''}>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
                    </span>
                  )}
                  {client.unreadMessages > 0 && (
                    <span className="text-green-600 font-semibold">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      {client.unreadMessages}
                    </span>
                  )}
                  {client.pendingFormChecks > 0 && (
                    <span className="text-purple-600 font-semibold">
                      <Video className="h-4 w-4 inline mr-1" />
                      {client.pendingFormChecks}
                    </span>
                  )}
                </div>
                {client.bloodworkConcerns && client.bloodworkConcerns.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Labs shared
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
