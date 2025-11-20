import { useState } from 'react'
import { Sliders, DollarSign, Pill, Leaf, ChevronRight, Check } from 'lucide-react'

// API-ready interfaces
export interface SupplementPreferences {
  commitmentLevel: 'essential' | 'moderate' | 'comprehensive'
  maxPillsPerDay: number
  monthlyBudget: number
  existingSupplements: string[]
  dietaryRestrictions: string[]
  optimizationGoals: string[]
}

interface SupplementPreferencesProps {
  preferences: SupplementPreferences
  onSave: (preferences: SupplementPreferences) => void
  onCancel?: () => void
}

const commitmentLevels = [
  {
    id: 'essential' as const,
    label: 'Essential',
    description: '2-3 supplements for critical needs only',
    pillCount: '2-3',
    cost: '$30-50/mo',
  },
  {
    id: 'moderate' as const,
    label: 'Moderate',
    description: '4-6 supplements for good coverage',
    pillCount: '4-6',
    cost: '$60-100/mo',
  },
  {
    id: 'comprehensive' as const,
    label: 'Comprehensive',
    description: '7+ supplements for full optimization',
    pillCount: '7+',
    cost: '$120+/mo',
  },
]

const dietaryOptions = [
  { id: 'vegan', label: 'Vegan/Vegetarian' },
  { id: 'fish-allergy', label: 'Fish/Shellfish Allergy' },
  { id: 'soy-free', label: 'Soy-Free' },
  { id: 'gluten-free', label: 'Gluten-Free' },
]

const goalOptions = [
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'sleep', label: 'Better Sleep', icon: '😴' },
  { id: 'focus', label: 'Mental Clarity', icon: '🧠' },
  { id: 'immunity', label: 'Immune Support', icon: '🛡️' },
  { id: 'longevity', label: 'Longevity', icon: '🌱' },
  { id: 'stress', label: 'Stress Relief', icon: '🧘' },
]

const commonSupplements = [
  'Multivitamin',
  'Vitamin D',
  'Omega-3/Fish Oil',
  'Magnesium',
  'Vitamin C',
  'B-Complex',
  'Probiotics',
  'Iron',
  'Calcium',
  'Zinc',
]

export default function SupplementPreferences({ preferences, onSave, onCancel }: SupplementPreferencesProps) {
  const [localPrefs, setLocalPrefs] = useState<SupplementPreferences>(preferences)
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const updatePrefs = (updates: Partial<SupplementPreferences>) => {
    setLocalPrefs(prev => ({ ...prev, ...updates }))
  }

  const toggleArrayItem = (field: 'existingSupplements' | 'dietaryRestrictions' | 'optimizationGoals', item: string) => {
    setLocalPrefs(prev => {
      const array = prev[field]
      if (array.includes(item)) {
        return { ...prev, [field]: array.filter(i => i !== item) }
      } else {
        return { ...prev, [field]: [...array, item] }
      }
    })
  }

  const handleSave = () => {
    onSave(localPrefs)
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-12 rounded-full transition-colors ${
                idx + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
      </div>

      {/* Step 1: Commitment Level */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Sliders className="h-6 w-6 mr-2 text-blue-600" />
              How committed are you?
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose your comfort level with supplements. You can always adjust later.
            </p>
          </div>

          <div className="space-y-3">
            {commitmentLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => updatePrefs({ commitmentLevel: level.id })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  localPrefs.commitmentLevel === level.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{level.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{level.pillCount} pills</p>
                    <p className="text-xs text-gray-500">{level.cost}</p>
                  </div>
                </div>
                {localPrefs.commitmentLevel === level.id && (
                  <div className="mt-2 flex items-center text-blue-600 text-sm font-medium">
                    <Check className="h-4 w-4 mr-1" />
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget & Capacity */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              Budget & Preferences
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Help us tailor recommendations to your lifestyle
            </p>
          </div>

          {/* Monthly Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly supplement budget
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="25"
                max="200"
                step="25"
                value={localPrefs.monthlyBudget}
                onChange={(e) => updatePrefs({ monthlyBudget: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold text-gray-900 w-20 text-right">
                ${localPrefs.monthlyBudget}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$25</span>
              <span>$200+</span>
            </div>
          </div>

          {/* Max Pills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum pills per day you're comfortable with
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={localPrefs.maxPillsPerDay}
                onChange={(e) => updatePrefs({ maxPillsPerDay: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold text-gray-900 w-20 text-right">
                {localPrefs.maxPillsPerDay} pills
              </span>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any dietary restrictions?
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleArrayItem('dietaryRestrictions', option.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    localPrefs.dietaryRestrictions.includes(option.id)
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Existing Supplements */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Pill className="h-6 w-6 mr-2 text-purple-600" />
              Already taking supplements?
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Select any you're currently taking so we don't duplicate
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {commonSupplements.map((supp) => (
              <button
                key={supp}
                onClick={() => toggleArrayItem('existingSupplements', supp)}
                className={`p-3 rounded-lg text-sm font-medium text-left transition-colors ${
                  localPrefs.existingSupplements.includes(supp)
                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-500'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                {localPrefs.existingSupplements.includes(supp) && (
                  <Check className="h-4 w-4 inline mr-1" />
                )}
                {supp}
              </button>
            ))}
          </div>

          {localPrefs.existingSupplements.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>{localPrefs.existingSupplements.length}</strong> supplements selected -
                we'll check for interactions and avoid duplicates
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Optimization Goals */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Leaf className="h-6 w-6 mr-2 text-teal-600" />
              Beyond the basics
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Any areas you'd like to optimize beyond your bloodwork?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleArrayItem('optimizationGoals', goal.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  localPrefs.optimizationGoals.includes(goal.id)
                    ? 'bg-teal-100 border-2 border-teal-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{goal.icon}</span>
                <p className={`font-medium mt-1 ${
                  localPrefs.optimizationGoals.includes(goal.id) ? 'text-teal-900' : 'text-gray-900'
                }`}>
                  {goal.label}
                </p>
              </button>
            ))}
          </div>

          {localPrefs.optimizationGoals.length > 0 && (
            <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
              <p className="text-sm text-teal-800">
                We'll suggest additional supplements for: {localPrefs.optimizationGoals.map(g =>
                  goalOptions.find(o => o.id === g)?.label
                ).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Back
            </button>
          ) : onCancel ? (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
          ) : null}
        </div>

        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Check className="h-4 w-4 mr-1" />
            Save Preferences
          </button>
        )}
      </div>
    </div>
  )
}
