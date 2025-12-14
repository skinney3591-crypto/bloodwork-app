import { useState } from 'react'
import {
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Calendar,
  MessageSquare,
  Activity
} from 'lucide-react'
import { mockDoctorData } from '../../data/mockDoctorData'

interface PatientsListProps {
  onViewPatient: (patientId: string) => void
}

type SortOption = 'name' | 'risk' | 'lastVisit' | 'nextAppointment'
type FilterOption = 'all' | 'critical' | 'due_for_visit' | 'unread_messages'

export default function PatientsList({ onViewPatient }: PatientsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('risk')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const { patients } = mockDoctorData

  // Filter and sort patients
  let filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.conditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Apply filters
  if (filterBy === 'critical') {
    filteredPatients = filteredPatients.filter(p => p.criticalLabs > 0 || p.riskScore > 70)
  } else if (filterBy === 'due_for_visit') {
    filteredPatients = filteredPatients.filter(p => {
      if (!p.lastVisit) return false
      const daysSinceVisit = Math.floor((new Date().getTime() - new Date(p.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
      return daysSinceVisit > 30
    })
  } else if (filterBy === 'unread_messages') {
    filteredPatients = filteredPatients.filter(p => p.unreadMessages > 0)
  }

  // Sort patients
  filteredPatients.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'risk') return b.riskScore - a.riskScore
    if (sortBy === 'lastVisit') return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    if (sortBy === 'nextAppointment') {
      if (!a.nextAppointment) return 1
      if (!b.nextAppointment) return -1
      return new Date(a.nextAppointment).getTime() - new Date(b.nextAppointment).getTime()
    }
    return 0
  })

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100'
    if (score >= 50) return 'text-orange-600 bg-orange-100'
    return 'text-green-600 bg-green-100'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk'
    if (score >= 50) return 'Moderate Risk'
    return 'Low Risk'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Roster</h2>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="risk">Sort by Risk Score</option>
            <option value="lastVisit">Sort by Last Visit</option>
            <option value="nextAppointment">Sort by Next Appointment</option>
          </select>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilterBy('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterBy === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Patients ({patients.length})
          </button>
          <button
            onClick={() => setFilterBy('critical')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              filterBy === 'critical'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Critical Labs ({patients.filter(p => p.criticalLabs > 0).length})</span>
          </button>
          <button
            onClick={() => setFilterBy('due_for_visit')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              filterBy === 'due_for_visit'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Due for Visit</span>
          </button>
          <button
            onClick={() => setFilterBy('unread_messages')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              filterBy === 'unread_messages'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Unread Messages ({patients.filter(p => p.unreadMessages > 0).length})</span>
          </button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-teal-300"
            onClick={() => onViewPatient(patient.id)}
          >
            {/* Patient Header */}
            <div className={`p-4 ${
              patient.criticalLabs > 0 ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.age} yrs, {patient.gender}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {patient.unreadMessages > 0 && (
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {patient.unreadMessages}
                    </div>
                  )}
                  {patient.criticalLabs > 0 && (
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Patient Body */}
            <div className="p-4 space-y-3">
              {/* Conditions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Conditions</p>
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.slice(0, 3).map((condition, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      {condition}
                    </span>
                  ))}
                  {patient.conditions.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      +{patient.conditions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Risk Score */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">Risk Score</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(patient.riskScore)}`}>
                  {patient.riskScore} - {getRiskLabel(patient.riskScore)}
                </span>
              </div>

              {/* Recent Labs */}
              {Object.keys(patient.recentLabs).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Labs</p>
                  <div className="space-y-1">
                    {Object.entries(patient.recentLabs).slice(0, 3).map(([key, lab]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${lab.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                            {lab.value} {lab.unit}
                          </span>
                          {lab.trend === 'rising' && <TrendingUp className="h-3 w-3 text-red-500" />}
                          {lab.trend === 'falling' && <TrendingDown className="h-3 w-3 text-green-500" />}
                          {lab.trend === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visits */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500">Last Visit</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
                {patient.nextAppointment && (
                  <div className="text-right">
                    <p className="text-gray-500">Next</p>
                    <p className="font-semibold text-teal-600">
                      {new Date(patient.nextAppointment).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* View Chart Button */}
              <button className="w-full py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>View Chart</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
