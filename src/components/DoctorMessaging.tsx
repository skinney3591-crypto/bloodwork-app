import { useState } from 'react'
import { MessageCircle, Send, User, Stethoscope, Paperclip, Clock, Phone, Award, GraduationCap, MapPin } from 'lucide-react'

// API-ready interfaces
export interface Message {
  id: string
  senderId: string
  senderType: 'patient' | 'physician'
  content: string
  timestamp: string
  read: boolean
  attachments?: {
    id: string
    name: string
    type: string
    url: string
  }[]
}

export interface Physician {
  id: string
  name: string
  specialty: string
  credentials: string
  education: string
  boardCertified: string[]
  yearsExperience: number
  location: string
  avatarUrl?: string
  responseTime: string
  isOnline: boolean
  phone?: string
}

interface DoctorMessagingProps {
  patientId?: string
  physician?: Physician
  messages?: Message[]
  onSendMessage?: (content: string, attachments?: File[]) => Promise<void>
}

// Mock data - replace with API calls
const mockPhysician: Physician = {
  id: 'dr-1',
  name: 'Dr. Sarah Chen',
  specialty: 'Internal Medicine',
  credentials: 'MD, FACP',
  education: 'Johns Hopkins School of Medicine',
  boardCertified: ['Internal Medicine', 'Preventive Medicine'],
  yearsExperience: 15,
  location: 'Austin, TX',
  responseTime: 'Usually responds within 24 hours',
  isOnline: true,
  phone: '(512) 555-0123',
}

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'dr-1',
    senderType: 'physician',
    content: "I've reviewed your latest bloodwork. Your LDL cholesterol has improved significantly - down from 145 to 128 mg/dL. Great progress!",
    timestamp: '2025-11-18T10:30:00Z',
    read: true,
  },
  {
    id: 'm2',
    senderId: 'dr-1',
    senderType: 'physician',
    content: "I'd recommend continuing the current statin dosage and maintaining your exercise routine. Let's retest in 3 months.",
    timestamp: '2025-11-18T10:31:00Z',
    read: true,
  },
  {
    id: 'm3',
    senderId: 'patient-1',
    senderType: 'patient',
    content: "Thank you! I've been walking 30 minutes daily and reduced saturated fats. Should I also be concerned about my triglycerides?",
    timestamp: '2025-11-18T14:22:00Z',
    read: true,
  },
  {
    id: 'm4',
    senderId: 'dr-1',
    senderType: 'physician',
    content: "Your triglycerides at 165 mg/dL are slightly elevated but improving. The Omega-3 supplement I recommended should help. Keep limiting refined carbs and sugars.",
    timestamp: '2025-11-18T16:45:00Z',
    read: true,
  },
]

export default function DoctorMessaging({
  physician = mockPhysician,
  messages = mockMessages,
  onSendMessage,
}: DoctorMessagingProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      if (onSendMessage) {
        await onSendMessage(newMessage)
      }
      // In real app, message would be added via API response
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
        ' ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-7 w-7 mr-3 text-blue-600" />
              Doctor Messaging
            </h2>
            <p className="text-sm text-gray-600 mt-1">Secure communication with your physician</p>
          </div>
        </div>
      </div>

      {/* Physician Info Card - Enhanced with full credentials */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <div className="bg-blue-600 p-4 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            {physician.isOnline && (
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{physician.name}</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                physician.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {physician.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{physician.specialty} • {physician.credentials}</p>

            {/* Detailed Credentials */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                <span>{physician.education}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 text-blue-500" />
                <span>{physician.yearsExperience} years experience</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                <span>{physician.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                <span>{physician.responseTime}</span>
              </div>
            </div>

            {/* Board Certifications */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Board Certified in:</p>
              <div className="flex flex-wrap gap-1">
                {physician.boardCertified.map((cert, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Request a Call Button */}
            {physician.phone && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto justify-center">
                  <Phone className="h-5 w-5" />
                  <span>Request a Call Back</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Our team will call you within 1 business day at the phone number on file.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Messages List */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${message.senderType === 'patient' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-end space-x-2 ${message.senderType === 'patient' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-1 rounded-full ${
                    message.senderType === 'physician' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    {message.senderType === 'physician' ? (
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.senderType === 'patient'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${
                  message.senderType === 'patient' ? 'text-right mr-8' : 'ml-8'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to Dr. Chen..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim() && !isSending
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Can you explain my latest results?',
            'Should I adjust my medication?',
            'When should I retest?',
            'Are my supplements working?',
          ].map((question, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(question)}
              className="text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-all"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
