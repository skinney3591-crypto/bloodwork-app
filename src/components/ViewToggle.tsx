import { User, Stethoscope } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ViewToggleProps {
  currentView: 'patient' | 'doctor'
  onToggle: (view: 'patient' | 'doctor') => void
}

export default function ViewToggle({ currentView, onToggle }: ViewToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    onToggle(currentView === 'patient' ? 'doctor' : 'patient')
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Store in localStorage
  useEffect(() => {
    localStorage.setItem('markr-view', currentView)
  }, [currentView])

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white shadow-lg rounded-xl border-2 border-gray-200 overflow-hidden">
        <div className="flex">
          <button
            onClick={handleToggle}
            disabled={currentView === 'patient'}
            className={`flex items-center space-x-2 px-4 py-3 transition-all duration-300 ${
              currentView === 'patient'
                ? 'bg-markr-blue text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } ${isAnimating ? 'scale-95' : 'scale-100'}`}
            title="Switch to Patient View"
          >
            <User className="h-5 w-5" />
            <span className="font-semibold text-sm">Patient</span>
          </button>
          <button
            onClick={handleToggle}
            disabled={currentView === 'doctor'}
            className={`flex items-center space-x-2 px-4 py-3 transition-all duration-300 ${
              currentView === 'doctor'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } ${isAnimating ? 'scale-95' : 'scale-100'}`}
            title="Switch to Doctor View"
          >
            <Stethoscope className="h-5 w-5" />
            <span className="font-semibold text-sm">Doctor</span>
          </button>
        </div>
      </div>

      {/* Demo mode badge */}
      <div className="mt-2 bg-amber-100 border-2 border-amber-300 rounded-lg px-3 py-1 text-center">
        <p className="text-xs font-semibold text-amber-800">DEMO MODE</p>
      </div>
    </div>
  )
}
