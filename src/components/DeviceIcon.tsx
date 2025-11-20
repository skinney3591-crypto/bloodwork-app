import { Watch, Heart, Activity } from 'lucide-react'
import type { DeviceType } from '../data/mockData'

interface DeviceIconProps {
  type: DeviceType
  className?: string
}

export default function DeviceIcon({ type, className = 'h-5 w-5' }: DeviceIconProps) {
  const icons = {
    fitbit: { component: Activity, color: 'text-teal-600', bg: 'bg-teal-100' },
    apple_health: { component: Heart, color: 'text-red-600', bg: 'bg-red-100' },
    oura: { component: Watch, color: 'text-purple-600', bg: 'bg-purple-100' }
  }

  const config = icons[type]
  const Icon = config.component

  return (
    <div className={`inline-flex items-center justify-center rounded-full p-1 ${config.bg}`}>
      <Icon className={`${className} ${config.color}`} />
    </div>
  )
}
