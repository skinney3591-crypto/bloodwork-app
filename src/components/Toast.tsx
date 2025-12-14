import { useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info, Beaker, Pill } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'prescription' | 'lab'

export interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'success', duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6" />
      case 'error':
        return <AlertCircle className="h-6 w-6" />
      case 'info':
        return <Info className="h-6 w-6" />
      case 'prescription':
        return <Pill className="h-6 w-6" />
      case 'lab':
        return <Beaker className="h-6 w-6" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white'
      case 'error':
        return 'bg-red-600 text-white'
      case 'info':
        return 'bg-blue-600 text-white'
      case 'prescription':
        return 'bg-teal-600 text-white'
      case 'lab':
        return 'bg-purple-600 text-white'
    }
  }

  return (
    <div
      className={`fixed top-6 right-6 z-[100] ${getStyles()} rounded-xl shadow-2xl px-6 py-4 flex items-center space-x-4 animate-slide-in-right max-w-md`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <p className="flex-1 font-semibold text-sm">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            animation: `slide-in-right 0.3s ease-out ${index * 0.1}s both`
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}
