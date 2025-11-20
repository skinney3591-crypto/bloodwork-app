interface RangeHistogramProps {
  value: number
  min: number
  max: number
  optimalMin?: number
  optimalMax?: number
  unit: string
  riskLevel: 'optimal' | 'borderline' | 'elevated' | 'high' | 'critical'
}

export default function RangeHistogram({
  value,
  min,
  max,
  optimalMin,
  optimalMax,
  unit,
  riskLevel
}: RangeHistogramProps) {
  // Calculate percentage position of value
  const range = max - min
  const valuePosition = ((value - min) / range) * 100

  // Calculate optimal zone position if available
  let optimalStartPercent = 0
  let optimalWidthPercent = 0
  if (optimalMin !== undefined && optimalMax !== undefined) {
    optimalStartPercent = ((optimalMin - min) / range) * 100
    optimalWidthPercent = ((optimalMax - optimalMin) / range) * 100
  }

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

  return (
    <div className="w-full space-y-2">
      {/* Value Label Above */}
      <div className="relative h-8">
        <div
          className="absolute flex flex-col items-center"
          style={{ left: `${Math.min(Math.max(valuePosition, 5), 95)}%`, transform: 'translateX(-50%)' }}
        >
          <div
            className="text-sm font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap"
            style={{ backgroundColor: color, color: 'white' }}
          >
            {value} {unit}
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-transparent" style={{ borderTopWidth: '6px', borderTopColor: color }}></div>
        </div>
      </div>

      {/* Histogram Bar */}
      <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden">
        {/* Optimal Zone Highlight */}
        {optimalMin !== undefined && optimalMax !== undefined && (
          <div
            className="absolute h-full bg-green-100 border-x-2 border-green-400"
            style={{
              left: `${optimalStartPercent}%`,
              width: `${optimalWidthPercent}%`
            }}
          />
        )}

        {/* Value Marker Line */}
        <div
          className="absolute h-full w-1 z-10"
          style={{
            left: `${valuePosition}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`
          }}
        />
      </div>

      {/* Range Labels Below */}
      <div className="flex justify-between text-xs text-gray-600">
        <span className="font-medium">{min}</span>
        {optimalMin !== undefined && optimalMax !== undefined && (
          <span className="text-green-700 font-medium">
            Optimal: {optimalMin}-{optimalMax}
          </span>
        )}
        <span className="font-medium">{max}</span>
      </div>
    </div>
  )
}
