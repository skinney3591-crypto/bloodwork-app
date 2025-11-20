import { CheckCircle2, AlertTriangle, AlertCircle, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { PanelSummary } from '../data/mockData'

interface PanelSummaryCardProps {
  summary: PanelSummary
  expanded?: boolean
  onToggle?: () => void
}

export default function PanelSummaryCard({ summary, expanded = true }: PanelSummaryCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case 'good':
        return <CheckCircle2 className="h-6 w-6 text-blue-600" />
      case 'needs_improvement':
        return <AlertTriangle className="h-6 w-6 text-orange-600" />
      case 'concerning':
        return <AlertCircle className="h-6 w-6 text-red-600" />
      default:
        return <Info className="h-6 w-6 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-50 border-green-300'
      case 'good':
        return 'bg-blue-50 border-blue-300'
      case 'needs_improvement':
        return 'bg-orange-50 border-orange-300'
      case 'concerning':
        return 'bg-red-50 border-red-300'
      default:
        return 'bg-gray-50 border-gray-300'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-700'
      case 'good':
        return 'text-blue-700'
      case 'needs_improvement':
        return 'text-orange-700'
      case 'concerning':
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  const getRatioStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-700 bg-green-100'
      case 'borderline':
        return 'text-yellow-700 bg-yellow-100'
      case 'elevated':
        return 'text-orange-700 bg-orange-100'
      case 'high':
        return 'text-red-700 bg-red-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getRiskScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600'
    if (score <= 20) return 'text-green-600'
    if (score <= 40) return 'text-blue-600'
    if (score <= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${getStatusColor(summary.status)} p-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getStatusIcon(summary.status)}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{summary.category}</h3>
            <p className={`text-sm font-medium capitalize ${getStatusTextColor(summary.status)}`}>
              {summary.status.replace('_', ' ')}
            </p>
          </div>
        </div>
        <div className="text-right">
          {summary.riskScore !== undefined && (
            <div className="mb-1">
              <div className={`text-3xl font-bold ${getRiskScoreColor(summary.riskScore)}`}>
                {summary.riskScore}
              </div>
              <div className="text-xs text-gray-600">Risk Score</div>
            </div>
          )}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{summary.abnormalCount}</span> of{' '}
            <span className="font-semibold">{summary.totalCount}</span> markers need attention
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="mb-6 p-4 bg-white/50 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">{summary.interpretation}</p>
        </div>
      </div>

      {/* Calculated Ratios */}
      {summary.ratios && Object.keys(summary.ratios).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
            <div className="h-1 w-1 rounded-full bg-blue-600 mr-2"></div>
            Calculated Ratios
          </h4>
          <div className="space-y-3">
            {Object.entries(summary.ratios).map(([name, ratio]) => (
              <div key={name} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">{name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRatioStatusColor(ratio.status)}`}>
                      {ratio.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{ratio.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-lg font-bold text-gray-900">{ratio.value.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {expanded && summary.recommendations && summary.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
            <div className="h-1 w-1 rounded-full bg-blue-600 mr-2"></div>
            Personalized Recommendations
          </h4>
          <div className="space-y-2">
            {summary.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <p className="text-sm text-gray-700 flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>
                {summary.totalCount - summary.abnormalCount} optimal
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span>{summary.abnormalCount} needs attention</span>
            </div>
          </div>
          {summary.riskScore !== undefined && (
            <div className="text-xs">
              {summary.riskScore <= 20 && (
                <span className="text-green-600 font-medium">Low Risk Panel</span>
              )}
              {summary.riskScore > 20 && summary.riskScore <= 40 && (
                <span className="text-blue-600 font-medium">Moderate Risk Panel</span>
              )}
              {summary.riskScore > 40 && summary.riskScore <= 60 && (
                <span className="text-orange-600 font-medium">Elevated Risk Panel</span>
              )}
              {summary.riskScore > 60 && (
                <span className="text-red-600 font-medium">High Risk Panel</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
