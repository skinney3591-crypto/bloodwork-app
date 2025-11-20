import type { DeviceType } from '../data/mockData'
import DeviceIcon from './DeviceIcon'

interface DeviceBadgeProps {
  type: DeviceType
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function DeviceBadge({ type, showLabel = true, size = 'sm' }: DeviceBadgeProps) {
  const labels = {
    fitbit: 'Fitbit',
    apple_health: 'Apple Health',
    oura: 'Oura Ring'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  if (!showLabel) {
    return <DeviceIcon type={type} className={iconSizes[size]} />
  }

  return (
    <span className={`inline-flex items-center space-x-1.5 ${sizeClasses[size]} bg-gray-100 text-gray-700 rounded-full font-medium`}>
      <DeviceIcon type={type} className={iconSizes[size]} />
      <span>{labels[type]}</span>
    </span>
  )
}
