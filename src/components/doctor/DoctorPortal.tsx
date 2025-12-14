import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Bell,
  Stethoscope,
  User
} from 'lucide-react'
import { mockDoctorData } from '../../data/mockDoctorData'
import DoctorDashboard from './DoctorDashboard'
import PatientsList from './PatientsList'
import DoctorMessages from './DoctorMessages'
import DoctorCalendar from './DoctorCalendar'
import PatientChart from './PatientChart'

type DoctorTab = 'dashboard' | 'patients' | 'messages' | 'calendar' | 'notifications'

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState<DoctorTab>('dashboard')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const { doctor } = mockDoctorData

  const tabs = [
    {
      id: 'dashboard' as DoctorTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'patients' as DoctorTab,
      label: 'Patients',
      icon: Users,
      badge: doctor.criticalAlerts
    },
    {
      id: 'messages' as DoctorTab,
      label: 'Messages',
      icon: MessageSquare,
      badge: doctor.unreadMessages
    },
    {
      id: 'calendar' as DoctorTab,
      label: 'Calendar',
      icon: Calendar,
      badge: doctor.todaysAppointments
    },
    {
      id: 'notifications' as DoctorTab,
      label: 'Notifications',
      icon: Bell,
      badge: doctor.criticalAlerts
    }
  ]

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId)
  }

  const handleBackToList = () => {
    setSelectedPatientId(null)
    setActiveTab('patients')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Doctor Header */}
      <header className="bg-white shadow-md border-b-2 border-teal-500">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-600 p-3 rounded-xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">markr for Providers</h1>
                <p className="text-sm text-gray-600">{doctor.practice}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Quick stats */}
              <div className="flex items-center space-x-6 px-6 py-2 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Patients</p>
                  <p className="text-lg font-bold text-gray-900">{doctor.patientCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-lg font-bold text-teal-600">{doctor.todaysAppointments}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Alerts</p>
                  <p className="text-lg font-bold text-red-600">{doctor.criticalAlerts}</p>
                </div>
              </div>

              {/* Doctor profile */}
              <div className="flex items-center space-x-3 bg-teal-50 px-4 py-2 rounded-lg border-2 border-teal-200">
                <div className="bg-teal-600 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900">{doctor.name}</p>
                  <p className="text-xs text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id && !selectedPatientId
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSelectedPatientId(null)
                  }}
                  className={`relative flex items-center space-x-2 px-6 py-4 border-b-4 transition-all duration-200 font-semibold ${
                    isActive
                      ? 'border-teal-600 text-teal-700 bg-teal-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className={`absolute top-2 right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                      tab.id === 'notifications' || tab.id === 'patients'
                        ? 'bg-red-500 text-white'
                        : 'bg-teal-600 text-white'
                    }`}>
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
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {selectedPatientId ? (
          <PatientChart patientId={selectedPatientId} onBack={handleBackToList} />
        ) : (
          <>
            {activeTab === 'dashboard' && <DoctorDashboard onViewPatient={handleViewPatient} />}
            {activeTab === 'patients' && <PatientsList onViewPatient={handleViewPatient} />}
            {activeTab === 'messages' && <DoctorMessages onViewPatient={handleViewPatient} />}
            {activeTab === 'calendar' && <DoctorCalendar onViewPatient={handleViewPatient} />}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications</h3>
                <p className="text-gray-600">Critical alerts and system notifications will appear here</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
