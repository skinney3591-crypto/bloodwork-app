import { useState } from 'react'
import { Pill, AlertTriangle, Info, Stethoscope, TrendingUp, BookOpen, ExternalLink, ChevronDown, ChevronUp, FileText, FlaskConical, ScrollText, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Medication, Citation, CustomerData } from '../data/mockData'

interface MedicationsViewProps {
  medications: Medication[]
  bloodwork?: CustomerData['bloodwork']
}

// Helper to get study type icon and color
const getStudyTypeInfo = (type: Citation['studyType']) => {
  switch (type) {
    case 'guideline':
      return { icon: ScrollText, color: 'text-green-600', bg: 'bg-green-100', label: 'Guideline' }
    case 'meta-analysis':
      return { icon: FlaskConical, color: 'text-green-600', bg: 'bg-green-100', label: 'Meta-analysis' }
    case 'rct':
      return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', label: 'RCT' }
    case 'review':
      return { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Review' }
    default:
      return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Study' }
  }
}

// Helper to get evidence strength
const getEvidenceStrength = (citations: Citation[]) => {
  const hasGuideline = citations.some(c => c.studyType === 'guideline')
  const hasMetaAnalysis = citations.some(c => c.studyType === 'meta-analysis')
  const hasMultipleRCTs = citations.filter(c => c.studyType === 'rct').length >= 2

  if (hasGuideline || hasMetaAnalysis || hasMultipleRCTs) {
    return { label: 'Strong', color: 'bg-green-100 text-green-800 border-green-300' }
  }
  if (citations.length >= 1) {
    return { label: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-300' }
  }
  return { label: 'Emerging', color: 'bg-gray-100 text-gray-800 border-gray-300' }
}

// Drug interactions with supplements
const drugInteractions = [
  {
    medication: 'Atorvastatin',
    interactsWith: 'CoQ10',
    warning: 'Statins can deplete CoQ10 levels - supplementing with CoQ10 is recommended',
    severity: 'info' as const
  },
  {
    medication: 'Metformin',
    interactsWith: 'Vitamin B12',
    warning: 'Long-term Metformin use can reduce B12 absorption - monitor B12 levels',
    severity: 'warning' as const
  },
  {
    medication: 'Metformin',
    interactsWith: 'Berberine',
    warning: 'Both lower blood sugar - monitor closely to avoid hypoglycemia',
    severity: 'caution' as const
  },
]

// Mock adherence data for the week
const adherenceData = [
  { day: 'Mon', adherence: 100 },
  { day: 'Tue', adherence: 100 },
  { day: 'Wed', adherence: 75 },
  { day: 'Thu', adherence: 100 },
  { day: 'Fri', adherence: 50 },
  { day: 'Sat', adherence: 100 },
  { day: 'Sun', adherence: 75 },
]

export default function MedicationsView({ medications, bloodwork = [] }: MedicationsViewProps) {
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set())

  // Helper to get marker status color
  const getMarkerStatusColor = (markerName: string) => {
    const marker = bloodwork.find(m => m.name === markerName)
    if (!marker) return 'bg-gray-100 text-gray-600'

    switch (marker.riskLevel) {
      case 'optimal':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'borderline':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'elevated':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  // Helper to get marker value display
  const getMarkerDisplay = (markerName: string) => {
    const marker = bloodwork.find(m => m.name === markerName)
    if (!marker) return { value: 'N/A', trend: '', unit: '' }

    return {
      value: marker.value.toString(),
      trend: marker.trend,
      unit: marker.unit,
      status: marker.status
    }
  }

  const toggleCitations = (name: string) => {
    setExpandedCitations(prev => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  // Find relevant drug interactions
  const relevantInteractions = drugInteractions.filter(interaction =>
    medications.some(med => med.name.includes(interaction.medication))
  )

  // Calculate average adherence
  const avgAdherence = Math.round(
    adherenceData.reduce((sum, day) => sum + day.adherence, 0) / adherenceData.length
  )
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Stethoscope className="h-7 w-7 mr-3 text-purple-600" />
              Prescribed Medications
            </h2>
            <p className="text-sm text-gray-600 mt-1">AI-recommended medications based on bloodwork analysis</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Active Medications</p>
            <p className="text-3xl font-bold text-purple-600">{medications.length}</p>
          </div>
        </div>
      </div>

      {/* Critical Notice */}
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-900 text-lg">CRITICAL: Doctor Review Required</p>
            <p className="text-sm text-red-800 mt-2">
              These medication recommendations are AI-generated and <span className="font-bold">MUST BE REVIEWED AND APPROVED</span> by a licensed physician
              before taking any medication. Never start, stop, or change medication dosages without explicit doctor authorization.
              This is for informational purposes only and does not constitute medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Adherence & Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Adherence Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Weekly Adherence
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-600">Average</p>
              <p className={`text-2xl font-bold ${
                avgAdherence >= 80 ? 'text-green-600' : avgAdherence >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {avgAdherence}%
              </p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.day}</p>
                          <p className="text-sm">Adherence: {payload[0].value}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="adherence"
                  radius={[4, 4, 0, 0]}
                  fill="#8b5cf6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drug Interactions */}
        {relevantInteractions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Drug & Supplement Interactions
            </h3>
            <div className="space-y-3">
              {relevantInteractions.map((interaction, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    interaction.severity === 'caution'
                      ? 'bg-red-50 border-red-300'
                      : interaction.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      interaction.severity === 'caution'
                        ? 'text-red-600'
                        : interaction.severity === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`} />
                    <div>
                      <p className={`text-xs font-bold uppercase mb-1 ${
                        interaction.severity === 'caution'
                          ? 'text-red-700'
                          : interaction.severity === 'warning'
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }`}>
                        {interaction.medication} + {interaction.interactsWith}
                      </p>
                      <p className={`text-sm ${
                        interaction.severity === 'caution'
                          ? 'text-red-900'
                          : interaction.severity === 'warning'
                          ? 'text-yellow-900'
                          : 'text-blue-900'
                      }`}>
                        {interaction.warning}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 gap-6">
        {medications.map((medication, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl shadow-md">
                  <Pill className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{medication.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{medication.frequency}</p>
                </div>
              </div>
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <p className="text-xs text-purple-600 font-medium">DOSAGE</p>
                <p className="text-xl font-bold text-purple-900">{medication.dosage}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Prescribed For */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-bold mb-1">Prescribed For</p>
                    <p className="text-sm font-semibold text-blue-900">{medication.prescribedFor}</p>
                  </div>
                </div>
              </div>

              {/* Target Markers - Shows which lab markers this medication supports */}
              {medication.targetMarkers && medication.targetMarkers.length > 0 && (
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <div className="flex items-start space-x-2">
                    <Target className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-teal-600 uppercase font-bold mb-2">Lab Markers This Supports</p>
                      <div className="flex flex-wrap gap-2">
                        {medication.targetMarkers.map((markerName, idx) => {
                          const markerDisplay = getMarkerDisplay(markerName)
                          const statusColor = getMarkerStatusColor(markerName)
                          return (
                            <div
                              key={idx}
                              className={`px-3 py-2 rounded-lg border ${statusColor} flex items-center space-x-2`}
                            >
                              <div>
                                <p className="text-xs font-bold">{markerName}</p>
                                <p className="text-xs">
                                  {markerDisplay.value} {markerDisplay.unit}
                                  {markerDisplay.trend === 'improving' && ' ↓'}
                                  {markerDisplay.trend === 'worsening' && ' ↑'}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Side Effects */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-yellow-600 uppercase font-bold mb-2">Possible Side Effects</p>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {medication.sideEffects.map((effect, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-yellow-900">
                          <span className="h-1.5 w-1.5 bg-yellow-600 rounded-full"></span>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dosage Justification */}
              {medication.dosageJustification && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 uppercase font-bold mb-1">Dosage Basis</p>
                  <p className="text-sm text-gray-800">{medication.dosageJustification}</p>
                </div>
              )}

              {/* Evidence Citations - Collapsible */}
              {medication.citations && medication.citations.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Citation Header with Badge */}
                  <button
                    onClick={() => toggleCitations(medication.name)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {medication.citations.length} {medication.citations.length === 1 ? 'study' : 'studies'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getEvidenceStrength(medication.citations).color}`}>
                        {getEvidenceStrength(medication.citations).label} evidence
                      </span>
                    </div>
                    {expandedCitations.has(medication.name) ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {/* Expanded Citations */}
                  {expandedCitations.has(medication.name) && (
                    <div className="p-3 space-y-3 bg-white">
                      {medication.citations.map((citation, idx) => {
                        const typeInfo = getStudyTypeInfo(citation.studyType)
                        const TypeIcon = typeInfo.icon
                        return (
                          <div key={idx} className="border-l-2 border-gray-200 pl-3">
                            <div className="flex items-start space-x-2">
                              <div className={`p-1 rounded ${typeInfo.bg}`}>
                                <TypeIcon className={`h-3 w-3 ${typeInfo.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <a
                                  href={citation.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline block"
                                >
                                  {citation.title}
                                  <ExternalLink className="h-3 w-3 inline ml-1 text-gray-400" />
                                </a>
                                <p className="text-xs text-gray-500">
                                  {citation.source} ({citation.year}) • {typeInfo.label}
                                </p>
                                <p className="text-xs text-green-700 mt-1 font-medium">
                                  → {citation.takeaway}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Medication Safety Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-purple-600" />
          Medication Safety Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Take as Directed</p>
            <p className="text-sm text-gray-600">
              Always follow the prescribed dosage and timing. Do not skip doses or take extra medication.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Monitor Side Effects</p>
            <p className="text-sm text-gray-600">
              Report any unusual symptoms or severe side effects to your doctor immediately.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Drug Interactions</p>
            <p className="text-sm text-gray-600">
              Inform your doctor of all medications and supplements you're taking to avoid interactions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Regular Follow-ups</p>
            <p className="text-sm text-gray-600">
              Schedule regular check-ups to monitor medication effectiveness and adjust as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
