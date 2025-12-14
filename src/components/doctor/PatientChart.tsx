import { useState } from 'react'
import { ArrowLeft, FileText, Pill, MessageSquare, Calendar, Sparkles, Beaker, RotateCw } from 'lucide-react'
import { mockDoctorData } from '../../data/mockDoctorData'
import PrescriptionModal from './PrescriptionModal'
import LabOrderModal from './LabOrderModal'
import Toast from '../Toast'
import type { ToastType } from '../Toast'

interface PatientChartProps {
  patientId: string
  onBack: () => void
}

export default function PatientChart({ patientId, onBack }: PatientChartProps) {
  const patient = mockDoctorData.patients.find(p => p.id === patientId)
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const handlePrescriptionSuccess = () => {
    setToast({ message: 'Prescription sent to pharmacy! Patient will be notified.', type: 'prescription' })
  }

  const handleLabSuccess = () => {
    setToast({ message: 'Lab order sent! Patient will receive instructions.', type: 'lab' })
  }

  const handleSendMessage = () => {
    setToast({ message: 'Message composer opened!', type: 'info' })
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">Patient not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Patients</span>
        </button>

        {/* Quick Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-teal-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600 uppercase">Quick Actions</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                <Pill className="h-5 w-5" />
                <span>Write Prescription</span>
              </button>
              <button
                onClick={() => setIsLabModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <Beaker className="h-5 w-5" />
                <span>Order Labs</span>
              </button>
              <button
                onClick={handleSendMessage}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{patient.name}</h1>
              <p className="text-teal-100 text-lg">{patient.age} years | {patient.gender} | Member since 2020</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {patient.conditions.map((condition, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Send Message</span>
            </button>
            <button className="px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Risk Score */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Risk Score</p>
          <div className={`text-5xl font-bold mb-2 ${
            patient.riskScore > 70 ? 'text-red-600' :
            patient.riskScore > 50 ? 'text-orange-600' :
            'text-green-600'
          }`}>
            {patient.riskScore}
          </div>
          <p className="text-sm text-gray-600">
            {patient.riskScore > 70 ? 'High Risk' :
             patient.riskScore > 50 ? 'Moderate Risk' :
             'Low Risk'}
          </p>
        </div>

        {/* Last Visit */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Last Visit</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-sm text-gray-600">
            {Math.floor((new Date().getTime() - new Date(patient.lastVisit).getTime()) / (1000 * 60 * 60 * 24))} days ago
          </p>
        </div>

        {/* Critical Labs */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Critical Labs</p>
          <div className={`text-5xl font-bold mb-2 ${
            patient.criticalLabs > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {patient.criticalLabs}
          </div>
          <p className="text-sm text-gray-600">abnormal values</p>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Unread Messages</p>
          <div className={`text-5xl font-bold mb-2 ${
            patient.unreadMessages > 0 ? 'text-purple-600' : 'text-gray-400'
          }`}>
            {patient.unreadMessages}
          </div>
          <p className="text-sm text-gray-600">pending responses</p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">AI Clinical Summary</h3>
            <p className="text-purple-100 leading-relaxed">
              {patient.riskScore > 70
                ? `${patient.name} presents with multiple concerning trends. Primary focus areas include ${Object.entries(patient.recentLabs).filter(([_, lab]) => lab.isAbnormal).map(([key]) => key.replace('_', ' ')).join(', ')}. Recommend urgent medication review and lifestyle intervention. Patient has been responsive to previous treatment adjustments.`
                : patient.riskScore > 50
                ? `${patient.name} shows moderate cardiovascular risk factors. Recent labs indicate need for continued monitoring of ${Object.entries(patient.recentLabs).filter(([_, lab]) => lab.isAbnormal).slice(0, 2).map(([key]) => key.replace('_', ' ')).join(' and ')}. Current medication regimen appears effective with room for optimization.`
                : `${patient.name} is generally stable with good medication adherence. Continue current treatment plan and monitor ${Object.keys(patient.recentLabs)[0]?.replace('_', ' ')} at next visit. Patient engaged and motivated to maintain health improvements.`}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Labs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-100 p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-teal-600" />
            Recent Laboratory Results
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(patient.recentLabs).map(([key, lab]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  lab.isAbnormal ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900 capitalize">{key.replace('_', ' ')}</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    lab.isAbnormal ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {lab.isAbnormal ? 'ABNORMAL' : 'NORMAL'}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{lab.value}</p>
                    <p className="text-sm text-gray-600">{lab.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold capitalize ${
                      lab.trend === 'rising' ? 'text-red-600' :
                      lab.trend === 'falling' ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {lab.trend}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-100 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Pill className="h-6 w-6 mr-2 text-teal-600" />
              Current Medications
            </h3>
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm"
            >
              + Add Medication
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {patient.medications.map((med, idx) => (
              <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-teal-400 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{med.split(' ')[0]}</p>
                    <p className="text-sm text-gray-600 mt-1">{med.split(' ').slice(1).join(' ')}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Last filled: {Math.floor(Math.random() * 20) + 5} days ago</p>
                      <p>Refills remaining: {Math.floor(Math.random() * 4)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsPrescriptionModalOpen(true)
                      setToast({ message: `Refilling ${med.split(' ')[0]}...`, type: 'prescription' })
                    }}
                    className="flex items-center space-x-1 px-3 py-1 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-xs flex-shrink-0"
                  >
                    <RotateCw className="h-3 w-3" />
                    <span>Refill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Note */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-amber-800">
          DEMO MODE - In production, this would show full bloodwork history, vital trends, medications, visit notes, and more
        </p>
      </div>
    </div>

    {/* Modals */}
    <PrescriptionModal
      isOpen={isPrescriptionModalOpen}
      onClose={() => setIsPrescriptionModalOpen(false)}
      patientId={patient.id}
      patientName={patient.name}
      existingMedications={patient.medications}
      onSuccess={handlePrescriptionSuccess}
    />
    <LabOrderModal
      isOpen={isLabModalOpen}
      onClose={() => setIsLabModalOpen(false)}
      patientId={patient.id}
      patientName={patient.name}
      onSuccess={handleLabSuccess}
    />

    {/* Toast Notification */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
  </>
  )
}
