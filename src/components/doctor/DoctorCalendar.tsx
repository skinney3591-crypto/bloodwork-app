import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle
} from 'lucide-react'
import { mockDoctorData } from '../../data/mockDoctorData'

interface DoctorCalendarProps {
  onViewPatient: (patientId: string) => void
}

export default function DoctorCalendar({ onViewPatient }: DoctorCalendarProps) {
  const { appointments } = mockDoctorData

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300'
      case 'new_patient': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'lab_review': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'follow-up': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Schedule Appointment
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              View Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left: Timeline View */}
        <div className="col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-4 text-white">
            <h3 className="text-lg font-bold flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Appointments ({appointments.length})
            </h3>
          </div>

          <div className="p-6">
            {/* Timeline */}
            <div className="space-y-6">
              {appointments.map((apt, index) => {
                const isUrgent = apt.type === 'urgent'
                const isNext = index === 0

                return (
                  <div
                    key={apt.id}
                    className={`relative pl-8 ${
                      isNext ? 'animate-pulse-slow' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-4 ${
                      isUrgent ? 'bg-red-600 border-red-300' :
                      isNext ? 'bg-teal-600 border-teal-300 ring-4 ring-teal-100' :
                      'bg-gray-400 border-gray-200'
                    }`} />

                    {/* Timeline line */}
                    {index < appointments.length - 1 && (
                      <div className="absolute left-1.5 top-6 w-0.5 h-full bg-gray-200" />
                    )}

                    {/* Appointment Card */}
                    <div
                      onClick={() => onViewPatient(apt.patientId)}
                      className={`bg-white border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                        isUrgent ? 'border-red-300 bg-red-50' :
                        isNext ? 'border-teal-300 bg-teal-50' :
                        'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Time */}
                          <div className="text-center min-w-[80px]">
                            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                              <Clock className="h-4 w-4" />
                              <span className="text-lg font-bold">{apt.time}</span>
                            </div>
                            <span className="text-xs text-gray-500">{apt.duration} minutes</span>
                          </div>

                          {/* Patient Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                {apt.patientName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{apt.patientName}</p>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getTypeColor(apt.type)}`}>
                                  {apt.type.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-700 mt-2">{apt.reason}</p>

                            {apt.notes && (
                              <p className="text-sm text-gray-500 mt-2 italic">Note: {apt.notes}</p>
                            )}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col items-end space-y-2">
                          {isUrgent && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <AlertCircle className="h-5 w-5" />
                              <span className="text-xs font-semibold">URGENT</span>
                            </div>
                          )}
                          {isNext && (
                            <span className="px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-bold">
                              UP NEXT
                            </span>
                          )}
                          <button className="px-4 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold hover:bg-teal-200 transition-colors">
                            View Chart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Appointments</span>
                <span className="text-2xl font-bold text-gray-900">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="text-2xl font-bold text-blue-600">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Urgent</span>
                <span className="text-2xl font-bold text-red-600">
                  {appointments.filter(a => a.type === 'urgent').length}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Types */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">By Type</h3>
            <div className="space-y-2">
              {['routine', 'follow-up', 'new_patient', 'lab_review', 'urgent'].map(type => {
                const count = appointments.filter(a => a.type === type).length
                if (count === 0) return null
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(type)}`}>
                      {type.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-4">This Week</h3>
            <div className="space-y-3">
              <div>
                <p className="text-teal-100 text-sm">Total Appointments</p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <div>
                <p className="text-teal-100 text-sm">Avg per Day</p>
                <p className="text-3xl font-bold">8.4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
