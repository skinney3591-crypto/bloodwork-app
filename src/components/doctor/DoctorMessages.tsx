import { useState } from 'react'
import {
  MessageSquare,
  Send,
  Paperclip,
  AlertCircle,
  Clock,
  User,
  FileText,
  Pill,
  Beaker,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react'
import { mockDoctorData } from '../../data/mockDoctorData'
import PrescriptionModal from './PrescriptionModal'
import LabOrderModal from './LabOrderModal'
import Toast from '../Toast'
import type { ToastType } from '../Toast'

interface DoctorMessagesProps {
  onViewPatient: (patientId: string) => void
}

type MessageCategory = 'all' | 'prescription' | 'lab' | 'appointment' | 'medical' | 'admin'

// Categorize messages based on content
function categorizeMessage(message: typeof mockDoctorData.messages[0]): MessageCategory {
  const text = message.fullText.toLowerCase()
  if (text.includes('prescription') || text.includes('refill') || text.includes('medication')) {
    return 'prescription'
  }
  if (text.includes('lab') || text.includes('test') || text.includes('blood')) {
    return 'lab'
  }
  if (text.includes('appointment') || text.includes('schedule') || text.includes('visit')) {
    return 'appointment'
  }
  if (text.includes('symptom') || text.includes('pain') || text.includes('sick')) {
    return 'medical'
  }
  return 'admin'
}

function getCategoryIcon(category: MessageCategory) {
  switch (category) {
    case 'prescription': return <Pill className="h-4 w-4" />
    case 'lab': return <Beaker className="h-4 w-4" />
    case 'appointment': return <CalendarIcon className="h-4 w-4" />
    case 'medical': return <MessageSquare className="h-4 w-4" />
    case 'admin': return <FileText className="h-4 w-4" />
    default: return <MessageSquare className="h-4 w-4" />
  }
}

function getCategoryColor(category: MessageCategory) {
  switch (category) {
    case 'prescription': return 'bg-teal-100 text-teal-700 border-teal-300'
    case 'lab': return 'bg-purple-100 text-purple-700 border-purple-300'
    case 'appointment': return 'bg-blue-100 text-blue-700 border-blue-300'
    case 'medical': return 'bg-orange-100 text-orange-700 border-orange-300'
    case 'admin': return 'bg-gray-100 text-gray-700 border-gray-300'
    default: return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

function getCategoryLabel(category: MessageCategory) {
  switch (category) {
    case 'prescription': return 'Prescription Request'
    case 'lab': return 'Lab Question'
    case 'appointment': return 'Appointment'
    case 'medical': return 'Medical Question'
    case 'admin': return 'Administrative'
    default: return 'Message'
  }
}

export default function DoctorMessages({ onViewPatient }: DoctorMessagesProps) {
  const { messages, patients } = mockDoctorData
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null)
  const [replyText, setReplyText] = useState('')
  const [filterCategory, setFilterCategory] = useState<MessageCategory>('all')
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
  const [isLabModalOpen, setIsLabModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const selectedMessage = messages.find(m => m.id === selectedMessageId)
  const selectedPatient = selectedMessage
    ? patients.find(p => p.id === selectedMessage.patientId)
    : null

  // Filter messages by category
  const filteredMessages = filterCategory === 'all'
    ? messages
    : messages.filter(m => categorizeMessage(m) === filterCategory)

  const handleSendReply = () => {
    if (!replyText.trim()) return
    // In a real app, would send to backend
    console.log('Sending reply:', replyText)
    setToast({ message: 'Message sent successfully!', type: 'success' })
    setReplyText('')
  }

  const handlePrescriptionSuccess = () => {
    setToast({ message: 'Prescription sent to pharmacy! Patient will be notified.', type: 'prescription' })
  }

  const handleLabSuccess = () => {
    setToast({ message: 'Lab order sent! Patient will receive instructions.', type: 'lab' })
  }

  const handleScheduleAppointment = () => {
    setToast({ message: 'Appointment scheduling opened!', type: 'info' })
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        {/* Left: Conversation List */}
        <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <h3 className="text-lg font-bold">Messages</h3>
            <p className="text-sm text-purple-100">{messages.filter(m => m.unread).length} unread</p>
          </div>

          {/* Category Filter */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 mb-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase">Filter by Type</span>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as MessageCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Messages ({messages.length})</option>
              <option value="prescription">Prescriptions ({messages.filter(m => categorizeMessage(m) === 'prescription').length})</option>
              <option value="lab">Lab Questions ({messages.filter(m => categorizeMessage(m) === 'lab').length})</option>
              <option value="appointment">Appointments ({messages.filter(m => categorizeMessage(m) === 'appointment').length})</option>
              <option value="medical">Medical ({messages.filter(m => categorizeMessage(m) === 'medical').length})</option>
              <option value="admin">Administrative ({messages.filter(m => categorizeMessage(m) === 'admin').length})</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((msg) => {
              const category = categorizeMessage(msg)
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                    selectedMessageId === msg.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : msg.unread
                      ? 'bg-purple-50 hover:bg-purple-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {msg.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-semibold text-sm ${msg.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {msg.patientName}
                        </p>
                        {msg.isUrgent && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      {/* Category Badge */}
                      <div className="mb-1">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(category)}`}>
                          {getCategoryIcon(category)}
                          <span>{getCategoryLabel(category)}</span>
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2 ${msg.unread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {msg.preview}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Middle: Active Conversation */}
      <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
        {selectedMessage ? (
          <>
            {/* Message Header */}
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedMessage.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedMessage.patientName}</p>
                  <p className="text-xs text-gray-600">{selectedMessage.time}</p>
                </div>
              </div>
              {selectedMessage.isUrgent && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 rounded-full">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-600">URGENT</span>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500">PATIENT MESSAGE</span>
                </div>
                <p className="text-gray-900 leading-relaxed">{selectedMessage.fullText}</p>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedMessage.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="mt-4 bg-white rounded-lg p-4 border-2 border-blue-200">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Quick Actions</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    <Pill className="h-5 w-5" />
                    <span>Write Rx</span>
                  </button>
                  <button
                    onClick={() => setIsLabModalOpen(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Beaker className="h-5 w-5" />
                    <span>Order Labs</span>
                  </button>
                  <button
                    onClick={handleScheduleAppointment}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <CalendarIcon className="h-5 w-5" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>

              {/* AI Suggested Response */}
              <div className="mt-4 bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-purple-600 p-1 rounded">
                    <MessageSquare className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700">AI SUGGESTED RESPONSE</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedMessage.isUrgent
                    ? "Thank you for reaching out. Based on your symptoms, I'd like to see you in the office as soon as possible. Please call our scheduling line at (555) 0123 to book an urgent appointment. In the meantime, please continue monitoring your symptoms and seek emergency care if they worsen."
                    : "Thank you for your message. I've reviewed your question and will address this at your upcoming appointment. If you have any concerns before then, please don't hesitate to reach out."}
                </p>
                <button className="mt-2 text-xs text-purple-700 font-semibold hover:underline">
                  Use this response
                </button>
              </div>
            </div>

            {/* Reply Box */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a message to view</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Patient Context Panel */}
      <div className="col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
        {selectedPatient ? (
          <div>
            {/* Patient Header */}
            <div className="bg-teal-600 p-4 text-white">
              <h3 className="text-lg font-bold">Patient Context</h3>
            </div>

            {/* Patient Info */}
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedPatient.name}</p>
                  <p className="text-sm text-gray-600">{selectedPatient.age} years, {selectedPatient.gender}</p>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Active Conditions</p>
                <div className="space-y-1">
                  {selectedPatient.conditions.map((condition, idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Medications</p>
                <div className="space-y-1">
                  {selectedPatient.medications.map((med, idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      <span>{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Labs */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Labs</p>
                <div className="space-y-2">
                  {Object.entries(selectedPatient.recentLabs).slice(0, 4).map(([key, lab]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                      <span className={`font-semibold ${lab.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                        {lab.value} {lab.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => onViewPatient(selectedPatient.id)}
                  className="w-full py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  View Full Chart
                </button>
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a message to view patient info</p>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Modals */}
      {selectedMessage && selectedPatient && (
        <>
          <PrescriptionModal
            isOpen={isPrescriptionModalOpen}
            onClose={() => setIsPrescriptionModalOpen(false)}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            existingMedications={selectedPatient.medications}
            onSuccess={handlePrescriptionSuccess}
          />
          <LabOrderModal
            isOpen={isLabModalOpen}
            onClose={() => setIsLabModalOpen(false)}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            onSuccess={handleLabSuccess}
          />
        </>
      )}

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
