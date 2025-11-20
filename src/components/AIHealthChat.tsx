import { useState, useRef, useEffect } from 'react'
import { Send, User, Sparkles, Info, HelpCircle, RefreshCw, MessageCircle } from 'lucide-react'

// API-ready interfaces
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: {
    title: string
    url: string
    type: 'pubmed' | 'guideline' | 'internal'
  }[]
  relatedMarkers?: string[]
}

export interface ChatContext {
  patientId: string
  recentBloodwork: {
    marker: string
    value: number
    unit: string
    status: string
  }[]
}

interface AIHealthChatProps {
  context?: ChatContext
  messages?: ChatMessage[]
  onSendMessage?: (message: string) => Promise<ChatMessage>
  initialMessage?: string // Pre-populate the input with a question
}

// Mock conversation - replace with API calls
const mockMessages: ChatMessage[] = [
  {
    id: 'c1',
    role: 'assistant',
    content: "Hi there! I'm here to help you understand your bloodwork results. Feel free to ask me anything - no question is too simple or too detailed. What's on your mind?",
    timestamp: '2025-11-19T09:00:00Z',
  },
  {
    id: 'c2',
    role: 'user',
    content: "Why is my LDL cholesterol high?",
    timestamp: '2025-11-19T09:01:00Z',
  },
  {
    id: 'c3',
    role: 'assistant',
    content: "Your LDL cholesterol is 145 mg/dL, which is above the optimal range of <100 mg/dL. Here's what could be contributing:\n\n**Dietary factors:**\n- High saturated fat intake (red meat, full-fat dairy, fried foods)\n- Trans fats from processed foods\n- Low fiber intake\n\n**Lifestyle factors:**\n- Sedentary lifestyle reduces HDL (good cholesterol)\n- Excess weight, especially around the midsection\n\n**Genetic factors:**\n- Family history of high cholesterol\n- Familial hypercholesterolemia affects 1 in 250 people\n\nThe good news: Your doctor has recommended Atorvastatin 10mg and dietary changes, which typically reduce LDL by 30-50% within 6-8 weeks.\n\nWould you like specific food recommendations to help lower your LDL?",
    timestamp: '2025-11-19T09:01:30Z',
    sources: [
      { title: 'ACC/AHA Cholesterol Guidelines 2018', url: '#', type: 'guideline' },
      { title: 'Effect of statins on LDL-C', url: '#', type: 'pubmed' },
    ],
    relatedMarkers: ['LDL Cholesterol', 'Total Cholesterol', 'Triglycerides'],
  },
  {
    id: 'c4',
    role: 'user',
    content: "Yes, what foods should I eat?",
    timestamp: '2025-11-19T09:02:00Z',
  },
  {
    id: 'c5',
    role: 'assistant',
    content: "Based on your lipid panel results, here are the best foods to lower your LDL:\n\n**Add these to your diet:**\n\n🥑 **Soluble fiber** (aim for 10-25g/day)\n- Oatmeal, oat bran\n- Beans, lentils\n- Apples, citrus fruits\n- Brussels sprouts\n\n🐟 **Omega-3 fatty acids**\n- Salmon, mackerel, sardines (2-3x/week)\n- Walnuts, flaxseeds\n- You're already taking Omega-3 supplements - great!\n\n🫒 **Plant sterols**\n- Olive oil (2 tbsp/day)\n- Avocados\n- Nuts (almonds, walnuts)\n\n**Limit or avoid:**\n- Red meat (max 1-2x/week)\n- Full-fat dairy\n- Fried foods\n- Processed snacks with trans fats\n\nThese changes, combined with your prescribed statin and exercise plan, should significantly improve your next test results.",
    timestamp: '2025-11-19T09:02:30Z',
    sources: [
      { title: 'Dietary approaches to lower LDL', url: '#', type: 'pubmed' },
    ],
    relatedMarkers: ['LDL Cholesterol', 'HDL Cholesterol'],
  },
]

const suggestedQuestions = [
  "Why is my glucose elevated?",
  "What do my results mean for my heart health?",
  "How can I improve my vitamin D?",
  "Should I be worried about my HbA1c?",
  "What's the difference between LDL and HDL?",
  "How do my medications affect my results?",
]

export default function AIHealthChat({
  messages = mockMessages,
  onSendMessage,
  initialMessage = '',
}: AIHealthChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages)
  const [newMessage, setNewMessage] = useState(initialMessage)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSend = async () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages([...chatMessages, userMessage])
    setNewMessage('')
    setIsTyping(true)

    try {
      if (onSendMessage) {
        const response = await onSendMessage(newMessage)
        setChatMessages(prev => [...prev, response])
      } else {
        // Mock response for demo
        setTimeout(() => {
          const mockResponse: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: "I understand your question. Based on your bloodwork results, I can provide personalized insights. This is a demo response - in the full version, I'll analyze your specific markers and provide evidence-based recommendations.\n\nWould you like me to explain any specific test results?",
            timestamp: new Date().toISOString(),
          }
          setChatMessages(prev => [...prev, mockResponse])
          setIsTyping(false)
        }, 1500)
      }
    } catch (error) {
      console.error('Failed to get response:', error)
      setIsTyping(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <HelpCircle className="h-7 w-7 mr-3 text-teal-600" />
              Have Questions?
            </h2>
            <p className="text-sm text-gray-600 mt-1">Get clear, simple answers about your results</p>
          </div>
          <div className="bg-teal-50 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-teal-700">Available 24/7</span>
          </div>
        </div>
      </div>

      {/* Reassurance Note */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-teal-900">
              I'm here to help you understand your results in plain language. Your doctor will always make the final call on any health decisions - I'm just here to help explain things.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Messages */}
        <div className="h-[450px] overflow-y-auto p-6 space-y-6">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    message.role === 'assistant' ? 'bg-teal-100' : 'bg-blue-100'
                  }`}>
                    {message.role === 'assistant' ? (
                      <MessageCircle className="h-5 w-5 text-teal-600" />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Learn more:</p>
                        <div className="space-y-1">
                          {message.sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              className="block text-xs text-teal-600 hover:text-teal-800 hover:underline"
                            >
                              {source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Markers */}
                    {message.relatedMarkers && message.relatedMarkers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.relatedMarkers.map((marker, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs"
                          >
                            {marker}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-teal-100">
                  <MessageCircle className="h-5 w-5 text-teal-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your question here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-sm"
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
              disabled={!newMessage.trim() || isTyping}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim() && !isTyping
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-teal-500" />
          Common Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(question)}
              className="text-left px-4 py-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 rounded-lg text-sm text-gray-700 hover:text-teal-700 transition-all"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="text-center">
        <button
          onClick={() => setChatMessages([mockMessages[0]])}
          className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Start New Conversation
        </button>
      </div>
    </div>
  )
}
