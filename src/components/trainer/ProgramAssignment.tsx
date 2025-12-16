import { useState, useMemo } from 'react'
import { X, Search, Check, Users, Filter } from 'lucide-react'
import type { ClientSummary, GoalType } from '../../data/trainerData'

interface ProgramAssignmentProps {
  clients: ClientSummary[]
  assignedClientIds: string[]
  onSave: (clientIds: string[]) => void
  onClose: () => void
}

type FilterLevel = 'all' | 'beginner' | 'intermediate' | 'advanced'
type FilterGoal = 'all' | GoalType

export default function ProgramAssignment({
  clients,
  assignedClientIds,
  onSave,
  onClose,
}: ProgramAssignmentProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(assignedClientIds)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<FilterLevel>('all')
  const [goalFilter, setGoalFilter] = useState<FilterGoal>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Search filter
      if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Level filter
      if (levelFilter !== 'all' && client.fitnessLevel !== levelFilter) {
        return false
      }
      // Goal filter
      if (goalFilter !== 'all' && client.primaryGoal !== goalFilter) {
        return false
      }
      return true
    })
  }, [clients, searchQuery, levelFilter, goalFilter])

  const handleToggleClient = (clientId: string) => {
    setSelectedIds(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredClients.map(c => c.id)
    const allSelected = allFilteredIds.every(id => selectedIds.includes(id))

    if (allSelected) {
      // Deselect all filtered
      setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)))
    } else {
      // Select all filtered
      setSelectedIds(prev => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  const handleSave = () => {
    onSave(selectedIds)
  }

  const getGoalLabel = (goal: GoalType) => {
    return goal.replace(/_/g, ' ')
  }

  const goalOptions: GoalType[] = [
    'weight_loss',
    'muscle_gain',
    'strength',
    'endurance',
    'body_recomposition',
    'general_fitness',
    'athletic_performance',
    'rehabilitation',
  ]

  const allFilteredSelected = filteredClients.length > 0 &&
    filteredClients.every(c => selectedIds.includes(c.id))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Assign Clients</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showFilters ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(levelFilter !== 'all' || goalFilter !== 'all') && (
                <span className="bg-orange-500 text-white text-xs px-1.5 rounded-full">!</span>
              )}
            </button>
            <span className="text-sm text-gray-500">
              {selectedIds.length} selected
            </span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">FITNESS LEVEL</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as FilterLevel)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">GOAL</label>
                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value as FilterGoal)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Goals</option>
                  {goalOptions.map(goal => (
                    <option key={goal} value={goal}>{getGoalLabel(goal)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Select All */}
          {filteredClients.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="w-full flex items-center justify-between p-3 mb-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-700">
                {allFilteredSelected ? 'Deselect All' : 'Select All'}
              </span>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                allFilteredSelected
                  ? 'bg-orange-500 border-orange-500'
                  : 'border-gray-300'
              }`}>
                {allFilteredSelected && <Check className="h-3 w-3 text-white" />}
              </div>
            </button>
          )}

          {/* Client Items */}
          <div className="space-y-2">
            {filteredClients.map((client) => {
              const isSelected = selectedIds.includes(client.id)
              return (
                <button
                  key={client.id}
                  onClick={() => handleToggleClient(client.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-orange-50 border-2 border-orange-300'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-orange-200 text-orange-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{client.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{client.fitnessLevel}</span>
                        <span>•</span>
                        <span className="capitalize">{getGoalLabel(client.primaryGoal)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                </button>
              )
            })}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No clients match your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setLevelFilter('all')
                  setGoalFilter('all')
                }}
                className="mt-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{selectedIds.length}</span> client{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
