import {
  Users,
  Calendar,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import { mockDoctorData } from '../../data/mockDoctorData'

interface DoctorDashboardProps {
  onViewPatient: (patientId: string) => void
}

export default function DoctorDashboard({ onViewPatient }: DoctorDashboardProps) {
  const { doctor, patients, appointments, messages } = mockDoctorData

  // Get critical patients (those with high risk scores or critical labs)
  const criticalPatients = patients
    .filter(p => p.criticalLabs > 0 || p.riskScore > 70)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4)

  // Today's appointments
  const todaysAppointments = appointments.slice(0, 4)

  // Recent urgent messages
  const urgentMessages = messages.filter(m => m.isUrgent && m.unread)

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        {/* Active Patients Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-teal-600 mb-2">
                <Users className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Active Patients</p>
              </div>
              <p className="text-4xl font-bold text-gray-900">{doctor.patientCount}</p>
              <p className="text-sm text-gray-600 mt-1">+3 this month</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Today's Appointments Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <Calendar className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Today's Schedule</p>
              </div>
              <p className="text-4xl font-bold text-gray-900">{doctor.todaysAppointments}</p>
              <p className="text-sm text-gray-600 mt-1">appointments</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Unread Messages Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-purple-600 mb-2">
                <MessageSquare className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Unread Messages</p>
              </div>
              <p className="text-4xl font-bold text-gray-900">{doctor.unreadMessages}</p>
              <p className="text-sm text-gray-600 mt-1">{urgentMessages.length} urgent</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Critical Alerts Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">Critical Labs</p>
              </div>
              <p className="text-4xl font-bold text-gray-900">{doctor.criticalAlerts}</p>
              <p className="text-sm text-gray-600 mt-1">require attention</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Today's Schedule */}
        <div className="col-span-2 space-y-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Today's Appointments</h3>
                  <p className="text-teal-100 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <Calendar className="h-8 w-8 opacity-80" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              {todaysAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                  onClick={() => onViewPatient(apt.patientId)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {apt.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-gray-900">{apt.patientName}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        apt.type === 'urgent' ? 'bg-red-100 text-red-700' :
                        apt.type === 'new_patient' ? 'bg-blue-100 text-blue-700' :
                        apt.type === 'lab_review' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {apt.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{apt.reason}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{apt.time}</span>
                    </div>
                    <span className="text-gray-400">({apt.duration} min)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Lab Results */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    Critical Lab Results
                  </h3>
                  <p className="text-red-100 text-sm mt-1">Patients requiring immediate attention</p>
                </div>
                <Sparkles className="h-8 w-8 opacity-80" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              {criticalPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-300 transition-colors cursor-pointer"
                  onClick={() => onViewPatient(patient.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Risk Score</p>
                        <p className={`text-lg font-bold ${
                          patient.riskScore > 70 ? 'text-red-600' : 'text-orange-600'
                        }`}>{patient.riskScore}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Abnormal Labs */}
                  <div className="space-y-2">
                    {Object.entries(patient.recentLabs)
                      .filter(([_, lab]) => lab.isAbnormal)
                      .slice(0, 2)
                      .map(([key, lab]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">{lab.value} {lab.unit}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              lab.trend === 'rising' ? 'bg-red-100 text-red-700' :
                              lab.trend === 'falling' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {lab.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* AI Insight */}
                  <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-purple-700 mb-1">AI Insight</p>
                        <p className="text-xs text-gray-700">
                          {patient.riskScore > 80
                            ? 'Multiple critical values trending upward. Consider medication adjustment and urgent follow-up.'
                            : 'Elevated values detected. Recommend lifestyle interventions and 2-week recheck.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Messages */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>New Message</span>
              </button>
              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Appointment</span>
              </button>
              <button className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Order Labs</span>
              </button>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Messages</h3>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {messages.slice(0, 5).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    msg.unread ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border border-gray-200'
                  } hover:shadow-md`}
                  onClick={() => onViewPatient(msg.patientId)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {msg.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-sm text-gray-900">{msg.patientName}</p>
                        {msg.isUrgent && (
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{msg.preview}</p>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Stats */}
          <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              <h3 className="text-lg font-bold">This Month</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-teal-100">New Patients</span>
                <span className="text-2xl font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-teal-100">Appointments</span>
                <span className="text-2xl font-bold">167</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-teal-100">Lab Reviews</span>
                <span className="text-2xl font-bold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-teal-100">Avg Response Time</span>
                <span className="text-2xl font-bold">2.4h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
