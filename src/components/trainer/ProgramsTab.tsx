import { useState } from 'react'
import { Plus, Calendar, ChevronLeft, ChevronRight, ListFilter } from 'lucide-react'
import type { DailyProgram, ClientSummary } from '../../data/trainerData'
import { mockDailyPrograms } from '../../data/mockTrainerData'
import ProgramCard from './ProgramCard'
import DailyProgramBuilder from './DailyProgramBuilder'

interface ProgramsTabProps {
  clients: ClientSummary[]
}

type ViewMode = 'today' | 'week' | 'builder'
type FilterType = 'all' | 'published' | 'draft'

export default function ProgramsTab({ clients }: ProgramsTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingProgram, setEditingProgram] = useState<DailyProgram | null>(null)
  const [programs, setPrograms] = useState<DailyProgram[]>(mockDailyPrograms)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const selectedDateStr = selectedDate.toISOString().split('T')[0]

  // Get programs for the selected date
  const programsForDate = programs.filter(p => p.date === selectedDateStr)

  // Apply filters
  const filteredPrograms = programsForDate.filter(p => {
    if (filter === 'all') return true
    return p.status === filter
  })

  // Sort by time
  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    if (!a.scheduledTime && !b.scheduledTime) return 0
    if (!a.scheduledTime) return 1
    if (!b.scheduledTime) return -1
    return a.scheduledTime.localeCompare(b.scheduledTime)
  })

  // Get week dates
  const getWeekDates = () => {
    const dates: Date[] = []
    const startOfWeek = new Date(selectedDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

  const handleCreateNew = () => {
    setEditingProgram(null)
    setViewMode('builder')
  }

  const handleEditProgram = (program: DailyProgram) => {
    setEditingProgram(program)
    setViewMode('builder')
  }

  const handleDuplicateProgram = (program: DailyProgram) => {
    const newProgram: DailyProgram = {
      ...program,
      id: `dp-${Date.now()}`,
      name: `${program.name} (Copy)`,
      status: 'draft',
      assignedClientIds: [],
      selfJoinedClientIds: [],
      createdAt: new Date().toISOString(),
    }
    setPrograms([...programs, newProgram])
    setEditingProgram(newProgram)
    setViewMode('builder')
  }

  const handleDeleteProgram = (program: DailyProgram) => {
    if (confirm(`Delete "${program.name}"? This cannot be undone.`)) {
      setPrograms(programs.filter(p => p.id !== program.id))
    }
  }

  const handleSaveProgram = (program: DailyProgram) => {
    if (editingProgram) {
      // Update existing
      setPrograms(programs.map(p => p.id === program.id ? program : p))
    } else {
      // Add new
      setPrograms([...programs, program])
    }
    setViewMode('today')
    setEditingProgram(null)
  }

  const handleCancelBuilder = () => {
    setViewMode('today')
    setEditingProgram(null)
  }

  const getProgramCountForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return programs.filter(p => p.date === dateStr).length
  }

  // Builder view
  if (viewMode === 'builder') {
    return (
      <DailyProgramBuilder
        clients={clients}
        existingProgram={editingProgram}
        selectedDate={selectedDateStr}
        onSave={handleSaveProgram}
        onCancel={handleCancelBuilder}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Programs</h2>
          <p className="text-gray-600">Build and manage your workout programs</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Program
        </button>
      </div>

      {/* View Toggle & Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setViewMode('today'); setSelectedDate(today); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                viewMode === 'today' && selectedDateStr === todayStr
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Week
            </button>
          </div>

          {/* Date Navigation (for week view) */}
          {viewMode === 'week' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[180px] text-center">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Filter */}
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="text-sm border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Programs</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Week Calendar (for week view) */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDates.map((date) => {
              const dateStr = date.toISOString().split('T')[0]
              const isSelected = dateStr === selectedDateStr
              const isToday = dateStr === todayStr
              const programCount = getProgramCountForDate(date)

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white'
                      : isToday
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p className="text-xs font-medium">{formatDateShort(date)}</p>
                  <p className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                    {date.getDate()}
                  </p>
                  {programCount > 0 && (
                    <p className={`text-xs mt-1 ${isSelected ? 'text-orange-200' : 'text-gray-500'}`}>
                      {programCount} {programCount === 1 ? 'program' : 'programs'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Date Header */}
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedDateStr === todayStr ? 'Today' : formatDate(selectedDate)}
        </h3>
        <span className="text-gray-500">
          ({sortedPrograms.length} {sortedPrograms.length === 1 ? 'program' : 'programs'})
        </span>
      </div>

      {/* Programs Grid */}
      {sortedPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              clients={clients}
              onEdit={handleEditProgram}
              onDuplicate={handleDuplicateProgram}
              onDelete={handleDeleteProgram}
              onClick={handleEditProgram}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No programs for this day</h3>
          <p className="text-gray-600 mb-4">
            {filter !== 'all'
              ? `No ${filter} programs found. Try a different filter.`
              : 'Create a program to get started!'
            }
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Program
          </button>
        </div>
      )}
    </div>
  )
}
