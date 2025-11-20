import { useState } from 'react'
import { Pill, Clock, Info, AlertTriangle, DollarSign, BookOpen, ExternalLink, ChevronDown, ChevronUp, FileText, FlaskConical, ScrollText, Settings, Star, TrendingUp, Sparkles, X, Plus, ThumbsDown, MessageSquare, Flag, Target } from 'lucide-react'
import type { Supplement, Citation, CustomerData } from '../data/mockData'
import SupplementPreferences, { type SupplementPreferences as PrefsType } from './SupplementPreferences'

// Feedback interface
interface SupplementFeedback {
  supplementName: string
  issueType: string
  details: string
  preferredAction: string
  submittedAt: string
}

// Issue types for feedback
const issueTypes = [
  { id: 'side-effects', label: 'Side Effects', description: 'Stomach upset, headaches, etc.' },
  { id: 'no-improvement', label: 'No Improvement', description: "Haven't noticed any changes" },
  { id: 'too-expensive', label: 'Too Expensive', description: 'Cost is a concern' },
  { id: 'hard-to-take', label: 'Hard to Take', description: 'Pills too large, bad taste, etc.' },
  { id: 'interactions', label: 'Possible Interaction', description: 'Concerns about other meds' },
  { id: 'other', label: 'Other', description: 'Something else' },
]

const actionOptions = [
  { id: 'stop', label: 'Stop taking it' },
  { id: 'reduce', label: 'Reduce the dose' },
  { id: 'alternative', label: 'Try an alternative' },
  { id: 'discuss', label: 'Discuss with doctor' },
]

interface SupplementsViewProps {
  supplements: Supplement[]
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

// Supplement interaction warnings (simplified version)
const interactionWarnings = [
  {
    supplements: ['Omega-3 Fish Oil', 'Vitamin D3'],
    warning: 'Take together for better absorption - Vitamin D is fat-soluble',
    severity: 'info' as const
  },
  {
    supplements: ['Berberine', 'CoQ10'],
    warning: 'Berberine may reduce CoQ10 levels - taking together is beneficial',
    severity: 'info' as const
  },
  {
    supplements: ['Magnesium Glycinate', 'Calcium'],
    warning: 'High doses of either can reduce absorption of the other - space 2 hours apart',
    severity: 'warning' as const
  }
]

// Estimated costs (monthly)
const supplementCosts: Record<string, number> = {
  'Vitamin D3': 12,
  'Omega-3 Fish Oil': 25,
  'Magnesium Glycinate': 18,
  'Berberine': 30,
  'CoQ10': 35,
}

// Priority levels for supplements
const supplementPriority: Record<string, { level: 'critical' | 'supportive'; rank: number }> = {
  'Vitamin D3': { level: 'critical', rank: 1 },
  'Omega-3 Fish Oil': { level: 'critical', rank: 2 },
  'Magnesium Glycinate': { level: 'critical', rank: 3 },
  'Berberine': { level: 'supportive', rank: 4 },
  'CoQ10': { level: 'supportive', rank: 5 },
}

// Optimization suggestions per category with sources
interface OptimizationItem {
  name: string
  source: string
  year: number
}

const optimizationSuggestions: Record<string, { supplements: OptimizationItem[]; lifestyle: OptimizationItem[] }> = {
  'cholesterol': {
    supplements: [
      { name: 'Plant Sterols (2g/day)', source: 'Journal of the American Heart Association', year: 2018 },
      { name: 'Red Yeast Rice', source: 'Annals of Internal Medicine', year: 2009 },
      { name: 'Niacin (B3)', source: 'New England Journal of Medicine', year: 2011 }
    ],
    lifestyle: [
      { name: 'Increase soluble fiber to 25g/day', source: 'American Journal of Clinical Nutrition', year: 2016 },
      { name: 'Add 30 min daily walking', source: 'Circulation', year: 2019 }
    ]
  },
  'blood-sugar': {
    supplements: [
      { name: 'Alpha Lipoic Acid (600mg)', source: 'Diabetes Care', year: 2011 },
      { name: 'Chromium Picolinate', source: 'Diabetes Technology & Therapeutics', year: 2006 },
      { name: 'Ceylon Cinnamon (1-6g)', source: 'Journal of Medicinal Food', year: 2011 }
    ],
    lifestyle: [
      { name: 'Post-meal 10-minute walks', source: 'Diabetologia', year: 2016 },
      { name: 'Reduce refined carbs', source: 'The Lancet', year: 2019 }
    ]
  },
  'vitamin-d': {
    supplements: [
      { name: 'Vitamin K2 (MK-7) 100-200mcg', source: 'Journal of Bone and Mineral Research', year: 2013 },
      { name: 'Increase D3 to 5000 IU', source: 'Journal of Clinical Endocrinology & Metabolism', year: 2011 }
    ],
    lifestyle: [
      { name: '15 min midday sun exposure', source: 'Dermato-Endocrinology', year: 2013 },
      { name: 'Eat fatty fish 2x/week', source: 'American Journal of Clinical Nutrition', year: 2007 }
    ]
  },
  'energy': {
    supplements: [
      { name: 'B-Complex', source: 'Nutrients', year: 2016 },
      { name: 'Iron (if deficient)', source: 'Canadian Medical Association Journal', year: 2012 },
      { name: 'Ashwagandha (300-600mg)', source: 'Indian Journal of Psychological Medicine', year: 2012 }
    ],
    lifestyle: [
      { name: 'Sleep 7-9 hours consistently', source: 'Sleep Health', year: 2015 },
      { name: 'Morning light exposure (10-30 min)', source: 'Journal of Clinical Sleep Medicine', year: 2017 }
    ]
  },
  'sleep': {
    supplements: [
      { name: 'L-Theanine (200-400mg)', source: 'Journal of Clinical Psychiatry', year: 2019 },
      { name: 'Glycine (3g before bed)', source: 'Sleep and Biological Rhythms', year: 2007 },
      { name: 'Tart Cherry Extract', source: 'European Journal of Nutrition', year: 2012 }
    ],
    lifestyle: [
      { name: 'No screens 1hr before bed', source: 'Proceedings of the National Academy of Sciences', year: 2014 },
      { name: 'Cool bedroom (65-68°F)', source: 'Current Biology', year: 2019 }
    ]
  }
}

// Default preferences
const defaultPreferences: PrefsType = {
  commitmentLevel: 'moderate',
  maxPillsPerDay: 8,
  monthlyBudget: 100,
  existingSupplements: [],
  dietaryRestrictions: [],
  optimizationGoals: []
}

export default function SupplementsView({ supplements, bloodwork = [] }: SupplementsViewProps) {
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set())
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<PrefsType>(defaultPreferences)
  const [expandedOptimize, setExpandedOptimize] = useState<string | null>(null)

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

  // Feedback state
  const [feedbackModal, setFeedbackModal] = useState<string | null>(null) // supplement name
  const [feedbackIssue, setFeedbackIssue] = useState<string>('')
  const [feedbackDetails, setFeedbackDetails] = useState<string>('')
  const [feedbackAction, setFeedbackAction] = useState<string>('')
  const [submittedFeedback, setSubmittedFeedback] = useState<Record<string, SupplementFeedback>>({})

  const handleSubmitFeedback = (supplementName: string) => {
    const feedback: SupplementFeedback = {
      supplementName,
      issueType: feedbackIssue,
      details: feedbackDetails,
      preferredAction: feedbackAction,
      submittedAt: new Date().toISOString()
    }
    setSubmittedFeedback(prev => ({ ...prev, [supplementName]: feedback }))
    setFeedbackModal(null)
    setFeedbackIssue('')
    setFeedbackDetails('')
    setFeedbackAction('')
    // In real app, this would send to API and notify doctor
    console.log('Feedback submitted:', feedback)
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

  // Sort supplements by priority
  const sortedSupplements = [...supplements].sort((a, b) => {
    const prioA = supplementPriority[a.name]?.rank || 99
    const prioB = supplementPriority[b.name]?.rank || 99
    return prioA - prioB
  })

  // Filter based on commitment level
  const filteredSupplements = sortedSupplements.filter((_, index) => {
    if (preferences.commitmentLevel === 'essential') return index < 3
    if (preferences.commitmentLevel === 'moderate') return index < 6
    return true // comprehensive shows all
  })

  const hiddenCount = sortedSupplements.length - filteredSupplements.length

  // Find relevant interactions
  const relevantInteractions = interactionWarnings.filter(interaction =>
    interaction.supplements.every(supp =>
      supplements.some(s => s.name.includes(supp) || supp.includes(s.name))
    )
  )

  // Calculate total monthly cost
  const totalMonthlyCost = supplements.reduce((total, supp) => {
    const cost = supplementCosts[supp.name] || 20 // default estimate
    return total + cost
  }, 0)
  return (
    <div className="space-y-6">
      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Supplement Preferences</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <SupplementPreferences
                preferences={preferences}
                onSave={(newPrefs) => {
                  setPreferences(newPrefs)
                  setShowPreferences(false)
                }}
                onCancel={() => setShowPreferences(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Report an Issue</h2>
                <p className="text-sm text-gray-600">{feedbackModal}</p>
              </div>
              <button
                onClick={() => {
                  setFeedbackModal(null)
                  setFeedbackIssue('')
                  setFeedbackDetails('')
                  setFeedbackAction('')
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's the issue?
                </label>
                <div className="space-y-2">
                  {issueTypes.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => setFeedbackIssue(issue.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        feedbackIssue === issue.id
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{issue.label}</p>
                      <p className="text-xs text-gray-500">{issue.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  value={feedbackDetails}
                  onChange={(e) => setFeedbackDetails(e.target.value)}
                  placeholder="Describe what you're experiencing..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none text-sm"
                  rows={3}
                />
              </div>

              {/* Preferred Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to do?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {actionOptions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => setFeedbackAction(action.id)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        feedbackAction === action.id
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSubmitFeedback(feedbackModal)}
                  disabled={!feedbackIssue}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    feedbackIssue
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Feedback
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Your doctor will be notified and can adjust your plan
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Pill className="h-7 w-7 mr-3 text-blue-600" />
              Your Supplement Plan
            </h2>
            <p className="text-sm text-gray-600 mt-1">Personalized based on your bloodwork and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreferences(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Preferences</span>
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Showing</p>
              <p className="text-3xl font-bold text-blue-600">{filteredSupplements.length}</p>
            </div>
          </div>
        </div>

        {/* Commitment Level Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Plan level:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                preferences.commitmentLevel === 'essential' ? 'bg-green-100 text-green-800' :
                preferences.commitmentLevel === 'moderate' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {preferences.commitmentLevel.charAt(0).toUpperCase() + preferences.commitmentLevel.slice(1)}
              </span>
            </div>
            {hiddenCount > 0 && (
              <button
                onClick={() => setShowPreferences(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                +{hiddenCount} more available
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">Important Notice</p>
            <p className="text-sm text-blue-800 mt-1">
              These supplement recommendations are AI-generated based on your blood work and will be reviewed by a licensed physician before implementation.
              Do not start any new supplements without doctor approval.
            </p>
          </div>
        </div>
      </div>

      {/* Interaction Warnings & Cost Estimate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Warnings */}
        {relevantInteractions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Supplement Interactions
            </h3>
            <div className="space-y-3">
              {relevantInteractions.map((interaction, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    interaction.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {interaction.severity === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-bold uppercase mb-1 ${
                        interaction.severity === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                      }`}>
                        {interaction.supplements.join(' + ')}
                      </p>
                      <p className={`text-sm ${
                        interaction.severity === 'warning' ? 'text-yellow-900' : 'text-blue-900'
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

        {/* Monthly Cost Estimate */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Estimated Monthly Cost
          </h3>
          <div className="space-y-3">
            {supplements.map((supplement, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{supplement.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${supplementCosts[supplement.name] || 20}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-green-600">${totalMonthlyCost}/mo</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Estimates based on average retail prices. Actual costs may vary.
          </p>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Your Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Started Date */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs text-green-600 uppercase font-medium mb-1">Started</p>
            <p className="text-lg font-bold text-green-900">Nov 1, 2024</p>
            <p className="text-sm text-green-700 mt-1">18 days on plan</p>
          </div>

          {/* Expected Results */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-600 uppercase font-medium mb-1">Next Milestone</p>
            <p className="text-lg font-bold text-blue-900">~4 weeks</p>
            <p className="text-sm text-blue-700 mt-1">Vitamin D levels should improve</p>
          </div>

          {/* Check-in Status */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-purple-600 uppercase font-medium mb-1">Last Check-in</p>
            <p className="text-lg font-bold text-purple-900">Feeling Better</p>
            <p className="text-sm text-purple-700 mt-1">Energy improved since starting</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Expected timeline for improvements:</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-24 text-xs text-gray-500">2-4 weeks</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-green-500 rounded-full" />
              </div>
              <div className="w-32 text-xs text-gray-600 ml-2">Energy, Sleep</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-xs text-gray-500">6-8 weeks</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-blue-500 rounded-full" />
              </div>
              <div className="w-32 text-xs text-gray-600 ml-2">Vitamin D, Mood</div>
            </div>
            <div className="flex items-center">
              <div className="w-24 text-xs text-gray-500">8-12 weeks</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-purple-500 rounded-full" />
              </div>
              <div className="w-32 text-xs text-gray-600 ml-2">Cholesterol, HbA1c</div>
            </div>
          </div>
        </div>
      </div>

      {/* Supplements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSupplements.map((supplement, index) => {
          const priority = supplementPriority[supplement.name]
          const isCritical = priority?.level === 'critical'

          return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all ${
              isCritical
                ? 'border-amber-200 hover:border-amber-400 hover:shadow-xl'
                : 'border-gray-100 hover:border-blue-300 hover:shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isCritical
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-gray-900">{supplement.name}</h3>
                    {priority && (
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        isCritical
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isCritical ? (
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-0.5" />
                            Critical
                          </span>
                        ) : (
                          'Supportive'
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{supplement.frequency}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Feedback indicator */}
                {submittedFeedback[supplement.name] && (
                  <span className="flex items-center px-2 py-1 bg-rose-100 text-rose-700 rounded text-xs font-medium">
                    <Flag className="h-3 w-3 mr-1" />
                    Issue reported
                  </span>
                )}
                {priority && (
                  <span className="text-sm font-medium text-gray-400">#{priority.rank}</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 uppercase font-medium mb-1">Dosage</p>
                <p className="text-lg font-bold text-gray-900">{supplement.dosage}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 uppercase font-medium mb-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Timing
                </p>
                <p className="text-sm font-semibold text-blue-900">{supplement.timing}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 uppercase font-medium mb-1 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Reason for Recommendation
                </p>
                <p className="text-sm text-purple-900">{supplement.reason}</p>
              </div>

              {/* Target Markers - Shows which lab markers this supplement supports */}
              {supplement.targetMarkers && supplement.targetMarkers.length > 0 && (
                <div className="bg-teal-50 rounded-lg p-3">
                  <p className="text-xs text-teal-600 uppercase font-medium mb-2 flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Lab Markers This Supports
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {supplement.targetMarkers.map((markerName, idx) => {
                      const markerDisplay = getMarkerDisplay(markerName)
                      const statusColor = getMarkerStatusColor(markerName)
                      return (
                        <div
                          key={idx}
                          className={`px-2 py-1 rounded-lg border ${statusColor}`}
                        >
                          <p className="text-xs font-bold">{markerName}</p>
                          <p className="text-xs">
                            {markerDisplay.value} {markerDisplay.unit}
                            {markerDisplay.trend === 'improving' && ' ↓'}
                            {markerDisplay.trend === 'worsening' && ' ↑'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Dosage Justification */}
              {supplement.dosageJustification && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 uppercase font-medium mb-1">Dosage Basis</p>
                  <p className="text-sm text-gray-800">{supplement.dosageJustification}</p>
                </div>
              )}

              {/* Evidence Citations - Collapsible */}
              {supplement.citations && supplement.citations.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Citation Header with Badge */}
                  <button
                    onClick={() => toggleCitations(supplement.name)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {supplement.citations.length} {supplement.citations.length === 1 ? 'study' : 'studies'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getEvidenceStrength(supplement.citations).color}`}>
                        {getEvidenceStrength(supplement.citations).label} evidence
                      </span>
                    </div>
                    {expandedCitations.has(supplement.name) ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {/* Expanded Citations */}
                  {expandedCitations.has(supplement.name) && (
                    <div className="p-3 space-y-3 bg-white">
                      {supplement.citations.map((citation, idx) => {
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

              {/* Optimize Further Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setExpandedOptimize(
                    expandedOptimize === supplement.name ? null : supplement.name
                  )}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 hover:from-teal-100 hover:to-blue-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center text-sm font-medium text-teal-700">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Want to optimize further?
                  </span>
                  {expandedOptimize === supplement.name ? (
                    <ChevronUp className="h-4 w-4 text-teal-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-teal-600" />
                  )}
                </button>

                {expandedOptimize === supplement.name && (
                  <div className="mt-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-sm font-medium text-teal-900 mb-3">
                      Additional ways to support this area:
                    </p>

                    {/* Get relevant optimization category */}
                    {(() => {
                      const category = supplement.name.toLowerCase().includes('vitamin d') ? 'vitamin-d' :
                        supplement.name.toLowerCase().includes('omega') || supplement.name.toLowerCase().includes('cholesterol') ? 'cholesterol' :
                        supplement.name.toLowerCase().includes('berberine') ? 'blood-sugar' :
                        supplement.name.toLowerCase().includes('magnesium') ? 'sleep' : 'energy'

                      const suggestions = optimizationSuggestions[category]

                      return (
                        <div className="space-y-3">
                          {suggestions?.supplements && suggestions.supplements.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-teal-700 uppercase mb-2">
                                <Plus className="h-3 w-3 inline mr-1" />
                                Additional Supplements
                              </p>
                              <ul className="space-y-2">
                                {suggestions.supplements.map((supp, idx) => (
                                  <li key={idx} className="text-sm">
                                    <div className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                                      <div>
                                        <span className="text-teal-900">{supp.name}</span>
                                        <p className="text-xs text-teal-600 mt-0.5">
                                          {supp.source} ({supp.year})
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {suggestions?.lifestyle && suggestions.lifestyle.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-teal-700 uppercase mb-2">
                                <Sparkles className="h-3 w-3 inline mr-1" />
                                Lifestyle Changes
                              </p>
                              <ul className="space-y-2">
                                {suggestions.lifestyle.map((tip, idx) => (
                                  <li key={idx} className="text-sm">
                                    <div className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                                      <div>
                                        <span className="text-teal-900">{tip.name}</span>
                                        <p className="text-xs text-teal-600 mt-0.5">
                                          {tip.source} ({tip.year})
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <p className="text-xs text-teal-600 mt-2 italic">
                            Discuss these options with your doctor before adding
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Report Issue Button */}
              {!submittedFeedback[supplement.name] ? (
                <button
                  onClick={() => setFeedbackModal(supplement.name)}
                  className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>This isn't working for me</span>
                </button>
              ) : (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-rose-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-rose-900">
                        Feedback submitted
                      </p>
                      <p className="text-xs text-rose-700 mt-1">
                        Issue: {issueTypes.find(i => i.id === submittedFeedback[supplement.name].issueType)?.label}
                      </p>
                      <p className="text-xs text-rose-600 mt-1">
                        Your doctor will review and adjust your plan
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          )
        })}
      </div>

      {/* Daily Adherence Tracking */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Today's Supplements
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Streak:</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-sm">
              7 days
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredSupplements.map((supplement, index) => (
            <label
              key={index}
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                defaultChecked={index < 3} // Mock: first 3 are checked
              />
              <div className="ml-3 flex-1">
                <span className="font-medium text-gray-900">{supplement.name}</span>
                <span className="text-sm text-gray-500 ml-2">{supplement.dosage}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                supplement.timing.toLowerCase().includes('breakfast') ? 'bg-yellow-100 text-yellow-800' :
                supplement.timing.toLowerCase().includes('lunch') ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {supplement.timing.toLowerCase().includes('breakfast') ? 'AM' :
                 supplement.timing.toLowerCase().includes('lunch') ? 'PM' :
                 'Evening'}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">3 of {filteredSupplements.length}</span> taken today
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Set reminders
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Supplement Schedule Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Morning (with breakfast)</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {supplements.filter(s => s.timing.toLowerCase().includes('breakfast')).length} supplements
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Afternoon (with lunch)</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {supplements.filter(s => s.timing.toLowerCase().includes('lunch')).length} supplements
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Evening (before bed)</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {supplements.filter(s => s.timing.toLowerCase().includes('bed')).length} supplements
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
