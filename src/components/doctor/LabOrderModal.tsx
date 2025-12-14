import { useState, useEffect } from 'react'
import { X, Beaker, Search, CheckCircle, Clock, FileText } from 'lucide-react'

interface LabOrderModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  onSuccess?: () => void
}

// Mock lab panels and individual tests
const COMMON_PANELS = [
  {
    name: 'Comprehensive Metabolic Panel (CMP)',
    tests: ['Glucose', 'Calcium', 'Sodium', 'Potassium', 'CO2', 'Chloride', 'BUN', 'Creatinine', 'Albumin', 'Total Protein', 'ALP', 'ALT', 'AST', 'Bilirubin'],
    code: 'CMP'
  },
  {
    name: 'Complete Blood Count (CBC)',
    tests: ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets', 'MCV', 'MCH', 'MCHC'],
    code: 'CBC'
  },
  {
    name: 'Lipid Panel',
    tests: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'VLDL'],
    code: 'LIPID'
  },
  {
    name: 'Thyroid Panel',
    tests: ['TSH', 'Free T4', 'Free T3'],
    code: 'THYROID'
  },
  {
    name: 'Basic Metabolic Panel (BMP)',
    tests: ['Glucose', 'Calcium', 'Sodium', 'Potassium', 'CO2', 'Chloride', 'BUN', 'Creatinine'],
    code: 'BMP'
  },
  {
    name: 'Hemoglobin A1c',
    tests: ['HbA1c'],
    code: 'HBA1C'
  },
]

const INDIVIDUAL_TESTS = [
  'Vitamin D, 25-Hydroxy',
  'Vitamin B12',
  'Ferritin',
  'Iron',
  'Folate',
  'Magnesium',
  'CRP (C-Reactive Protein)',
  'ESR (Sedimentation Rate)',
  'PSA (Prostate Specific Antigen)',
  'Testosterone, Total',
  'Estradiol',
  'Cortisol',
  'Insulin, Fasting',
  'Homocysteine',
  'Uric Acid',
]

const LAB_COMPANIES = [
  'Quest Diagnostics',
  'LabCorp',
  'Local Hospital Lab',
]

export default function LabOrderModal({
  isOpen,
  onClose,
  patientId: _patientId,
  patientName,
  onSuccess
}: LabOrderModalProps) {
  const [selectedPanels, setSelectedPanels] = useState<string[]>([])
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [labCompany, setLabCompany] = useState(LAB_COMPANIES[0])
  const [clinicalNote, setClinicalNote] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPanels([])
      setSelectedTests([])
      setSearchQuery('')
      setClinicalNote('')
    }
  }, [isOpen])

  const togglePanel = (code: string) => {
    setSelectedPanels(prev =>
      prev.includes(code)
        ? prev.filter(p => p !== code)
        : [...prev, code]
    )
  }

  const toggleTest = (test: string) => {
    setSelectedTests(prev =>
      prev.includes(test)
        ? prev.filter(t => t !== test)
        : [...prev, test]
    )
  }

  const handleOrderLabs = async () => {
    setIsSending(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSending(false)
    onSuccess?.()
    onClose()
  }

  const filteredTests = searchQuery
    ? INDIVIDUAL_TESTS.filter(test =>
        test.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : INDIVIDUAL_TESTS

  const totalTests = selectedPanels.length + selectedTests.length
  const isFormValid = totalTests > 0 && labCompany

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Beaker className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Order Laboratory Tests</h2>
                <p className="text-purple-100 text-sm">For: {patientName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Common Lab Panels */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Common Lab Panels</h3>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_PANELS.map((panel) => (
                <button
                  key={panel.code}
                  onClick={() => togglePanel(panel.code)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPanels.includes(panel.code)
                      ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{panel.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {panel.tests.length} tests: {panel.tests.slice(0, 3).join(', ')}
                        {panel.tests.length > 3 && '...'}
                      </p>
                    </div>
                    {selectedPanels.includes(panel.code) && (
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Tests */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Individual Tests</h3>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search individual tests..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Test List */}
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {filteredTests.map((test) => (
                <button
                  key={test}
                  onClick={() => toggleTest(test)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedTests.includes(test)
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'bg-gray-50 text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{test}</span>
                    {selectedTests.includes(test) && (
                      <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lab Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Laboratory Company *
            </label>
            <select
              value={labCompany}
              onChange={(e) => setLabCompany(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {LAB_COMPANIES.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Clinical Note / Indication */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinical Indication (Optional)
            </label>
            <textarea
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              placeholder="e.g., Annual wellness check, monitor diabetes, follow-up abnormal lipids..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Order Summary */}
          {totalTests > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Order Summary:</p>

                  {selectedPanels.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Panels ({selectedPanels.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPanels.map(code => {
                          const panel = COMMON_PANELS.find(p => p.code === code)
                          return (
                            <span key={code} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {panel?.name.split('(')[0].trim()}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedTests.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-blue-800 mb-1">Individual Tests ({selectedTests.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTests.map(test => (
                          <span key={test} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-blue-700 mt-2">
                    Laboratory: {labCompany}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {totalTests > 0 ? (
              <span><strong>{totalTests}</strong> test{totalTests !== 1 ? 's' : ''} selected</span>
            ) : (
              <span>Select at least one panel or test</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOrderLabs}
              disabled={!isFormValid || isSending}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSending ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Ordering...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Order Labs</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
