import { useState, useEffect } from 'react'
import { X, Pill, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  existingMedications?: string[]
  onSuccess?: () => void
}

// Mock medication database
const MOCK_MEDICATIONS = [
  { name: 'Lisinopril', strengths: ['5mg', '10mg', '20mg', '40mg'], form: 'Tablet', commonSig: 'Take 1 tablet daily' },
  { name: 'Metformin', strengths: ['500mg', '850mg', '1000mg'], form: 'Tablet', commonSig: 'Take 1 tablet twice daily with meals' },
  { name: 'Atorvastatin', strengths: ['10mg', '20mg', '40mg', '80mg'], form: 'Tablet', commonSig: 'Take 1 tablet daily at bedtime' },
  { name: 'Levothyroxine', strengths: ['25mcg', '50mcg', '75mcg', '100mcg', '125mcg'], form: 'Tablet', commonSig: 'Take 1 tablet daily on empty stomach' },
  { name: 'Omeprazole', strengths: ['20mg', '40mg'], form: 'Capsule', commonSig: 'Take 1 capsule daily before breakfast' },
  { name: 'Amlodipine', strengths: ['2.5mg', '5mg', '10mg'], form: 'Tablet', commonSig: 'Take 1 tablet daily' },
  { name: 'Gabapentin', strengths: ['100mg', '300mg', '600mg', '800mg'], form: 'Capsule', commonSig: 'Take 1 capsule three times daily' },
  { name: 'Sertraline', strengths: ['25mg', '50mg', '100mg'], form: 'Tablet', commonSig: 'Take 1 tablet daily' },
  { name: 'Amoxicillin', strengths: ['250mg', '500mg'], form: 'Capsule', commonSig: 'Take 1 capsule three times daily' },
  { name: 'Albuterol', strengths: ['90mcg'], form: 'Inhaler', commonSig: 'Inhale 2 puffs every 4-6 hours as needed' },
]

const MOCK_PHARMACIES = [
  'CVS Pharmacy #1234 - 123 Main St',
  'Walgreens #5678 - 456 Oak Ave',
  'Rite Aid #9012 - 789 Elm St',
  'Costco Pharmacy - 321 Commerce Dr',
  'Local Pharmacy - 555 Health Way',
]

export default function PrescriptionModal({
  isOpen,
  onClose,
  patientId: _patientId,
  patientName,
  existingMedications = [],
  onSuccess
}: PrescriptionModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMed, setSelectedMed] = useState<typeof MOCK_MEDICATIONS[0] | null>(null)
  const [selectedStrength, setSelectedStrength] = useState('')
  const [sig, setSig] = useState('')
  const [quantity, setQuantity] = useState('30')
  const [refills, setRefills] = useState('3')
  const [pharmacy, setPharmacy] = useState(MOCK_PHARMACIES[0])
  const [showInteractionWarning, setShowInteractionWarning] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Filter medications based on search
  const filteredMeds = searchQuery
    ? MOCK_MEDICATIONS.filter(med =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSelectedMed(null)
      setSelectedStrength('')
      setSig('')
      setQuantity('30')
      setRefills('3')
      setShowInteractionWarning(false)
    }
  }, [isOpen])

  // Auto-fill SIG when medication and strength are selected
  useEffect(() => {
    if (selectedMed && selectedStrength) {
      setSig(selectedMed.commonSig)

      // Mock interaction warning for certain combinations
      if (selectedMed.name === 'Gabapentin' && existingMedications.some(m => m.includes('Metformin'))) {
        setShowInteractionWarning(true)
      } else {
        setShowInteractionWarning(false)
      }
    }
  }, [selectedMed, selectedStrength, existingMedications])

  const handleSelectMed = (med: typeof MOCK_MEDICATIONS[0]) => {
    setSelectedMed(med)
    setSearchQuery(med.name)
    setSelectedStrength(med.strengths[0])
  }

  const handleSendPrescription = async () => {
    setIsSending(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSending(false)
    onSuccess?.()
    onClose()
  }

  const isFormValid = selectedMed && selectedStrength && sig && quantity && pharmacy

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Pill className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Write Prescription</h2>
                <p className="text-teal-100 text-sm">For: {patientName}</p>
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
          {/* Medication Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medication Name *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medications..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Search Results Dropdown */}
            {searchQuery && !selectedMed && filteredMeds.length > 0 && (
              <div className="mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredMeds.map((med) => (
                  <button
                    key={med.name}
                    onClick={() => handleSelectMed(med)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <p className="font-semibold text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.form} - {med.strengths.join(', ')}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Show form fields only after medication is selected */}
          {selectedMed && (
            <>
              {/* Strength Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Strength *
                </label>
                <select
                  value={selectedStrength}
                  onChange={(e) => setSelectedStrength(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {selectedMed.strengths.map((strength) => (
                    <option key={strength} value={strength}>
                      {strength} {selectedMed.form}
                    </option>
                  ))}
                </select>
              </div>

              {/* SIG (Directions) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Directions (SIG) *
                </label>
                <input
                  type="text"
                  value={sig}
                  onChange={(e) => setSig(e.target.value)}
                  placeholder="e.g., Take 1 tablet daily"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Quantity and Refills */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Refills *
                  </label>
                  <select
                    value={refills}
                    onChange={(e) => setRefills(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="0">0 (No refills)</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="11">11 (1 year)</option>
                  </select>
                </div>
              </div>

              {/* Pharmacy */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pharmacy *
                </label>
                <select
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {MOCK_PHARMACIES.map((pharm) => (
                    <option key={pharm} value={pharm}>
                      {pharm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interaction Warning */}
              {showInteractionWarning && (
                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-orange-900">Potential Drug Interaction</p>
                      <p className="text-sm text-orange-800 mt-1">
                        {selectedMed.name} may interact with Metformin. Monitor blood glucose levels closely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Prescription Summary */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Prescription Summary:</p>
                <p className="text-sm text-blue-800">
                  <strong>{selectedMed.name} {selectedStrength}</strong><br />
                  {sig}<br />
                  Quantity: {quantity} | Refills: {refills}<br />
                  Send to: {pharmacy.split(' - ')[0]}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex items-center justify-between border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendPrescription}
            disabled={!isFormValid || isSending}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSending ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Send to Pharmacy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
