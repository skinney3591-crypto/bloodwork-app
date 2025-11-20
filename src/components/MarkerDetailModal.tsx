import { X, BookOpen, AlertCircle, Utensils, Activity, Pill, Target, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { BloodworkResult } from '../data/mockData'
import { markerEducationRegistry } from '../data/markerEducation'
import GaugeChart from './GaugeChart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MarkerDetailModalProps {
  marker: BloodworkResult
  onClose: () => void
}

export default function MarkerDetailModal({ marker, onClose }: MarkerDetailModalProps) {
  const education = markerEducationRegistry[marker.name]

  // Parse reference range for gauge
  const parseReferenceRange = (range: string): { min: number; max: number } | null => {
    if (range.includes('-')) {
      const parts = range.split('-').map(p => parseFloat(p.replace(/[^\d.]/g, '')))
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { min: parts[0], max: parts[1] }
      }
    } else if (range.startsWith('<')) {
      const max = parseFloat(range.replace(/[^\d.]/g, ''))
      if (!isNaN(max)) {
        return { min: 0, max: max * 1.5 }
      }
    } else if (range.startsWith('>')) {
      const min = parseFloat(range.replace(/[^\d.]/g, ''))
      if (!isNaN(min)) {
        return { min: min * 0.5, max: min * 2 }
      }
    }
    return null
  }

  const parseOptimalRange = (range: string): { min: number; max: number } | null => {
    if (range.includes('-')) {
      const parts = range.split('-').map(p => parseFloat(p.replace(/[^\d.]/g, '')))
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { min: parts[0], max: parts[1] }
      }
    } else if (range.startsWith('<')) {
      const max = parseFloat(range.replace(/[^\d.]/g, ''))
      if (!isNaN(max)) {
        return { min: 0, max }
      }
    }
    return null
  }

  const referenceRange = parseReferenceRange(marker.referenceRange)
  const optimalRange = marker.optimalRange ? parseOptimalRange(marker.optimalRange) : null
  const riskLevel = marker.riskLevel || (marker.status === 'normal' ? 'optimal' : marker.status === 'low' ? 'borderline' : 'elevated')

  const getStatusColor = (status: string) => {
    if (status === 'normal') return 'bg-green-50 border-green-200'
    if (status === 'low') return 'bg-orange-50 border-orange-200'
    if (status === 'high') return 'bg-red-50 border-red-200'
    return 'bg-gray-50 border-gray-200'
  }

  const getStatusTextColor = (status: string) => {
    if (status === 'normal') return 'text-green-700'
    if (status === 'low') return 'text-orange-700'
    if (status === 'high') return 'text-red-700'
    return 'text-gray-700'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'worsening':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      case 'stable':
        return <Minus className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const getBarColor = (status: string) => {
    if (status === 'normal') return '#10b981'
    if (status === 'low') return '#f97316'
    if (status === 'high') return '#ef4444'
    return '#6b7280'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 ${getStatusColor(marker.status)} border-b-2 p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className={`text-2xl font-bold ${getStatusTextColor(marker.status)}`}>
                  {marker.name}
                </h2>
                {marker.trend && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(marker.trend)}
                    <span className={`text-sm font-medium ${
                      marker.trend === 'improving' ? 'text-green-600' :
                      marker.trend === 'worsening' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {marker.trend === 'improving' && 'Improving'}
                      {marker.trend === 'worsening' && 'Worsening'}
                      {marker.trend === 'stable' && 'Stable'}
                      {marker.changePercent !== undefined && marker.changePercent !== 0 && (
                        <> ({marker.changePercent > 0 ? '+' : ''}{marker.changePercent.toFixed(1)}%)</>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{marker.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Value & Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gauge Chart */}
            {referenceRange && (
              <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4">
                <GaugeChart
                  value={marker.value}
                  min={referenceRange.min}
                  max={referenceRange.max}
                  optimalMin={optimalRange?.min}
                  optimalMax={optimalRange?.max}
                  unit={marker.unit}
                  size="lg"
                  status={marker.status}
                  riskLevel={riskLevel}
                />
              </div>
            )}

            {/* Value Details */}
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Your Result</p>
                <p className={`text-4xl font-bold ${getStatusTextColor(marker.status)}`}>
                  {marker.value}
                </p>
                <p className="text-sm text-gray-600">{marker.unit}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Reference</p>
                  <p className="text-lg font-semibold text-gray-700">{marker.referenceRange}</p>
                  <p className="text-xs text-gray-600">{marker.unit}</p>
                </div>
                {marker.optimalRange && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600 uppercase font-medium mb-1">Optimal</p>
                    <p className="text-lg font-semibold text-green-700">{marker.optimalRange}</p>
                    <p className="text-xs text-gray-600">{marker.unit}</p>
                  </div>
                )}
              </div>

              {marker.goal && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Your Goal</p>
                  <p className="text-2xl font-bold text-blue-700">{marker.goal} {marker.unit}</p>
                </div>
              )}

              {marker.percentile !== undefined && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Percentile</p>
                  <p className="text-2xl font-bold text-purple-700">{marker.percentile}th</p>
                  <p className="text-xs text-gray-600">Better than {marker.percentile}% of population</p>
                </div>
              )}
            </div>
          </div>

          {/* Historical Trend */}
          {marker.historicalValues && marker.historicalValues.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">6-Month Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={marker.historicalValues}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    fontSize={11}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis fontSize={11} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                            <p className="text-xs font-semibold">{new Date(payload[0].payload.date).toLocaleDateString()}</p>
                            <p className="text-sm">{payload[0].value} {marker.unit}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getBarColor(marker.status)}
                    strokeWidth={3}
                    dot={{ fill: getBarColor(marker.status), r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Education Content */}
          {education && (
            <div className="space-y-4">
              {/* What It Measures */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-900">What It Measures</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{education.whatItMeasures}</p>
              </div>

              {/* Why It Matters */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-purple-900">Why It Matters</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{education.whyItMatters}</p>
              </div>

              {/* Symptoms */}
              {(education.symptomsLow || education.symptomsHigh) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {education.symptomsLow && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-orange-900 mb-2">Low Levels May Cause</h4>
                      <ul className="space-y-1">
                        {education.symptomsLow.map((symptom, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start">
                            <span className="text-orange-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {education.symptomsHigh && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-red-900 mb-2">High Levels May Cause</h4>
                      <ul className="space-y-1">
                        {education.symptomsHigh.map((symptom, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Dietary Factors */}
              {education.dietaryFactors && education.dietaryFactors.length > 0 && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Utensils className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-bold text-green-900">Dietary Factors</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {education.dietaryFactors.map((factor, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lifestyle Factors */}
              {education.lifestyleFactors && education.lifestyleFactors.length > 0 && (
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-indigo-900">Lifestyle Factors</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {education.lifestyleFactors.map((factor, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medication Effects */}
              {education.medicationEffects && education.medicationEffects.length > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Pill className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-yellow-900">Medications That May Affect This Marker</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {education.medicationEffects.map((med, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        {med}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvement Strategies */}
              {education.improvementStrategies && education.improvementStrategies.length > 0 && (
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-bold text-teal-900">How to Improve This Marker</h3>
                  </div>
                  <ol className="space-y-2">
                    {education.improvementStrategies.map((strategy, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-teal-600 font-bold mr-2 min-w-[20px]">{i + 1}.</span>
                        <span className="flex-1">{strategy}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Learn More */}
              {education.learnMoreUrl && (
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
                  <a
                    href={education.learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Learn More from Trusted Medical Sources</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {!education && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-sm text-yellow-800">
                Detailed educational information for this marker is being prepared. Please consult your healthcare provider for more information.
              </p>
            </div>
          )}

          {/* Related Markers */}
          {marker.relatedMarkers && marker.relatedMarkers.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Related Markers to Monitor</h3>
              <div className="flex flex-wrap gap-2">
                {marker.relatedMarkers.map((relMarker, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {relMarker}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
