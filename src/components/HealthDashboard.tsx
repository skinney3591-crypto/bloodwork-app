import { useState } from 'react'
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { BloodworkResult, PanelSummary } from '../data/mockData'

interface HealthDashboardProps {
  bloodwork: BloodworkResult[]
  panelSummaries: PanelSummary[]
  onMarkerClick?: (marker: BloodworkResult) => void
}

export default function HealthDashboard({ bloodwork, panelSummaries, onMarkerClick }: HealthDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(bloodwork.map(m => m.category)))]

  // Filter markers by category
  const filteredMarkers = selectedCategory === 'All'
    ? bloodwork
    : bloodwork.filter(m => m.category === selectedCategory)

  // Calculate overall health score
  const overallScore = Math.round(
    (bloodwork.filter(m => m.riskLevel === 'optimal').length / bloodwork.length) * 100
  )

  // Get color based on risk level
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'optimal': return 'bg-green-500'
      case 'borderline': return 'bg-yellow-500'
      case 'elevated': return 'bg-orange-500'
      case 'high': return 'bg-red-500'
      case 'critical': return 'bg-red-700'
      default: return 'bg-gray-400'
    }
  }

  const getRiskTextColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'optimal': return 'text-green-700'
      case 'borderline': return 'text-yellow-700'
      case 'elevated': return 'text-orange-700'
      case 'high': return 'text-red-700'
      case 'critical': return 'text-red-900'
      default: return 'text-gray-700'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'worsening': return <TrendingDown className="h-3 w-3 text-red-600" />
      case 'stable': return <Minus className="h-3 w-3 text-gray-500" />
      default: return null
    }
  }

  // Group markers by category for organized display
  const markersByCategory = filteredMarkers.reduce((acc, marker) => {
    if (!acc[marker.category]) {
      acc[marker.category] = []
    }
    acc[marker.category].push(marker)
    return acc
  }, {} as Record<string, BloodworkResult[]>)

  // Count markers by risk level
  const riskCounts = bloodwork.reduce((acc, marker) => {
    acc[marker.riskLevel] = (acc[marker.riskLevel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getPanelSummaryStatus = (category: string) => {
    const summary = panelSummaries.find(p => p.category === category)
    return summary?.status || 'good'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 border-green-300'
      case 'good': return 'bg-blue-100 border-blue-300'
      case 'needs_improvement': return 'bg-orange-100 border-orange-300'
      case 'concerning': return 'bg-red-100 border-red-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Health Dashboard</h1>
              <p className="text-blue-100">Complete overview of your lab results</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{overallScore}%</div>
            <p className="text-blue-100">Markers in Optimal Range</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{riskCounts['optimal'] || 0}</div>
            <div className="text-sm text-blue-100">Optimal</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{riskCounts['borderline'] || 0}</div>
            <div className="text-sm text-blue-100">Borderline</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{riskCounts['elevated'] || 0}</div>
            <div className="text-sm text-blue-100">Elevated</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{riskCounts['high'] || 0}</div>
            <div className="text-sm text-blue-100">High Risk</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{riskCounts['critical'] || 0}</div>
            <div className="text-sm text-blue-100">Critical</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="space-y-6">
        {Object.entries(markersByCategory).map(([category, markers]) => {
          const panelStatus = getPanelSummaryStatus(category)
          const summary = panelSummaries.find(p => p.category === category)

          return (
            <div key={category} className={`bg-white rounded-xl shadow-sm border-2 ${getStatusColor(panelStatus)} p-6`}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                  <div className="flex items-center space-x-2">
                    {panelStatus === 'excellent' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {panelStatus === 'needs_improvement' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                    <span className="text-sm text-gray-600 capitalize">{panelStatus.replace('_', ' ')}</span>
                  </div>
                </div>
                {summary && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {summary.abnormalCount} of {summary.totalCount} markers need attention
                    </div>
                    {summary.riskScore !== undefined && (
                      <div className="text-lg font-bold text-gray-900">
                        Risk Score: {summary.riskScore}/100
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Markers Heat Map Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {markers.map(marker => (
                  <button
                    key={marker.name}
                    onClick={() => onMarkerClick && onMarkerClick(marker)}
                    onMouseEnter={() => setHoveredMarker(marker.name)}
                    onMouseLeave={() => setHoveredMarker(null)}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg ${
                      hoveredMarker === marker.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    } ${
                      marker.riskLevel === 'optimal' ? 'bg-green-50 border-green-300' :
                      marker.riskLevel === 'borderline' ? 'bg-yellow-50 border-yellow-300' :
                      marker.riskLevel === 'elevated' ? 'bg-orange-50 border-orange-300' :
                      marker.riskLevel === 'high' ? 'bg-red-50 border-red-300' :
                      'bg-red-100 border-red-500'
                    }`}
                  >
                    {/* Trend Indicator */}
                    <div className="absolute top-1 right-1">
                      {getTrendIcon(marker.trend)}
                    </div>

                    {/* Marker Name */}
                    <div className={`text-xs font-semibold mb-2 pr-4 ${getRiskTextColor(marker.riskLevel)}`}>
                      {marker.name}
                    </div>

                    {/* Value */}
                    <div className="text-lg font-bold text-gray-900">
                      {marker.value}
                    </div>
                    <div className="text-xs text-gray-600">
                      {marker.unit}
                    </div>

                    {/* Change Indicator */}
                    {marker.changePercent !== 0 && (
                      <div className={`mt-1 text-xs font-medium ${
                        marker.trend === 'improving' ? 'text-green-600' :
                        marker.trend === 'worsening' ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {marker.changePercent > 0 ? '+' : ''}{marker.changePercent.toFixed(1)}%
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Panel Summary Interpretation */}
              {summary && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {summary.interpretation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Risk Level Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-700">Optimal - Within ideal range</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Borderline - Close to optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-orange-500"></div>
            <span className="text-sm text-gray-700">Elevated - Needs attention</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-red-500"></div>
            <span className="text-sm text-gray-700">High Risk - Requires action</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-red-700"></div>
            <span className="text-sm text-gray-700">Critical - Urgent care needed</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4 mt-6">Trend Indicators</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">Improving - Positive trend</span>
          </div>
          <div className="flex items-center space-x-2">
            <Minus className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Stable - No significant change</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm text-gray-700">Worsening - Needs attention</span>
          </div>
        </div>
      </div>
    </div>
  )
}
