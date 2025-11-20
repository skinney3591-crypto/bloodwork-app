import { useMemo } from 'react'

interface GaugeChartProps {
  value: number
  min: number
  max: number
  optimalMin?: number
  optimalMax?: number
  unit: string
  size?: 'sm' | 'md' | 'lg'
  status: 'normal' | 'low' | 'high'
  riskLevel: 'optimal' | 'borderline' | 'elevated' | 'high' | 'critical'
}

export default function GaugeChart({
  value,
  min,
  max,
  optimalMin,
  optimalMax,
  unit,
  size = 'md',
  status,
  riskLevel
}: GaugeChartProps) {
  // Size configurations
  const sizeConfig = {
    sm: { width: 120, height: 70, strokeWidth: 8, fontSize: 12 },
    md: { width: 160, height: 90, strokeWidth: 10, fontSize: 14 },
    lg: { width: 200, height: 110, strokeWidth: 12, fontSize: 16 }
  }

  const config = sizeConfig[size]
  const radius = (config.width / 2) - (config.strokeWidth / 2) - 5
  const centerX = config.width / 2
  const centerY = config.height - 10

  // Calculate percentage position (0-100%)
  const percentage = useMemo(() => {
    const clampedValue = Math.max(min, Math.min(max, value))
    return ((clampedValue - min) / (max - min)) * 100
  }, [value, min, max])

  // Calculate angle (-90 to +90 degrees, representing 0-100%)
  const angle = -90 + (percentage * 1.8) // 180 degrees total span

  // Calculate needle end point
  const needleLength = radius - 5
  const needleX = centerX + needleLength * Math.cos((angle * Math.PI) / 180)
  const needleY = centerY + needleLength * Math.sin((angle * Math.PI) / 180)

  // Get color based on risk level
  const getRiskColor = (risk: typeof riskLevel) => {
    switch (risk) {
      case 'optimal':
        return '#10b981' // green
      case 'borderline':
        return '#f59e0b' // amber
      case 'elevated':
        return '#f97316' // orange
      case 'high':
        return '#ef4444' // red
      case 'critical':
        return '#991b1b' // dark red
    }
  }

  const color = getRiskColor(riskLevel)

  // Create arc path for background (semicircle)
  const createArcPath = (startAngle: number, endAngle: number, r: number) => {
    const start = {
      x: centerX + r * Math.cos((startAngle * Math.PI) / 180),
      y: centerY + r * Math.sin((startAngle * Math.PI) / 180)
    }
    const end = {
      x: centerX + r * Math.cos((endAngle * Math.PI) / 180),
      y: centerY + r * Math.sin((endAngle * Math.PI) / 180)
    }
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
  }

  // Background arc (gray)
  const backgroundArc = createArcPath(-90, 90, radius)

  // Color zones for optimal range visualization
  const zones = useMemo(() => {
    if (!optimalMin || !optimalMax) return []

    const optimalStartPercent = ((optimalMin - min) / (max - min)) * 100
    const optimalEndPercent = ((optimalMax - min) / (max - min)) * 100

    return [
      // Below optimal (yellow/orange)
      {
        start: -90,
        end: -90 + (optimalStartPercent * 1.8),
        color: '#fbbf24'
      },
      // Optimal zone (green)
      {
        start: -90 + (optimalStartPercent * 1.8),
        end: -90 + (optimalEndPercent * 1.8),
        color: '#10b981'
      },
      // Above optimal (orange/red)
      {
        start: -90 + (optimalEndPercent * 1.8),
        end: 90,
        color: '#f97316'
      }
    ]
  }, [min, max, optimalMin, optimalMax])

  return (
    <div className="flex flex-col items-center">
      <svg width={config.width} height={config.height} className="overflow-visible">
        {/* Background arc */}
        <path
          d={backgroundArc}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />

        {/* Optimal range zones */}
        {zones.map((zone, i) => (
          <path
            key={i}
            d={createArcPath(zone.start, zone.end, radius)}
            fill="none"
            stroke={zone.color}
            strokeWidth={config.strokeWidth - 2}
            strokeLinecap="round"
            opacity={0.3}
          />
        ))}

        {/* Progress arc (colored based on risk level) */}
        <path
          d={createArcPath(-90, angle, radius)}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r={5} fill={color} />

        {/* Value text */}
        <text
          x={centerX}
          y={centerY + 25}
          textAnchor="middle"
          className="font-bold"
          style={{ fontSize: config.fontSize + 2 }}
          fill="#1f2937"
        >
          {value} {unit}
        </text>

        {/* Min/Max labels */}
        <text
          x={15}
          y={centerY + 5}
          textAnchor="start"
          style={{ fontSize: config.fontSize - 2 }}
          fill="#6b7280"
        >
          {min}
        </text>
        <text
          x={config.width - 15}
          y={centerY + 5}
          textAnchor="end"
          style={{ fontSize: config.fontSize - 2 }}
          fill="#6b7280"
        >
          {max}
        </text>
      </svg>

      {/* Risk level indicator */}
      <div className="mt-2 flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full`} style={{ backgroundColor: color }}></div>
        <span className="text-xs font-medium text-gray-700 capitalize">
          {riskLevel === 'optimal' && 'Optimal Range'}
          {riskLevel === 'borderline' && 'Borderline'}
          {riskLevel === 'elevated' && 'Elevated'}
          {riskLevel === 'high' && 'High Risk'}
          {riskLevel === 'critical' && 'Critical'}
        </span>
      </div>
    </div>
  )
}
