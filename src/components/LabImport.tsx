import { useState, useCallback } from 'react'
import { Upload, FileText, Check, X, Building2, Loader2 } from 'lucide-react'

// API-ready interfaces
export interface ParsedLabResult {
  id: string
  name: string
  value: number
  unit: string
  referenceRange: string
  status: 'normal' | 'low' | 'high' | 'unknown'
  confidence: number
  matched: boolean
}

export interface LabImportRequest {
  file: File
  labSource: string
  testDate: string
}

export interface LabImportResponse {
  success: boolean
  results: ParsedLabResult[]
  warnings: string[]
  labSource: string
  testDate: string
}

interface LabImportProps {
  onImport?: (request: LabImportRequest) => Promise<LabImportResponse>
  onConfirm?: (results: ParsedLabResult[]) => Promise<void>
}

const labSources = [
  { id: 'quest', name: 'Quest Diagnostics', logo: '🔬' },
  { id: 'labcorp', name: 'LabCorp', logo: '🧪' },
  { id: 'hospital', name: 'Hospital/Clinic', logo: '🏥' },
  { id: 'other', name: 'Other Lab', logo: '📋' },
]

// Mock parsed results - replace with API
const mockParsedResults: ParsedLabResult[] = [
  { id: '1', name: 'Glucose (Fasting)', value: 112, unit: 'mg/dL', referenceRange: '70-99', status: 'high', confidence: 98, matched: true },
  { id: '2', name: 'Total Cholesterol', value: 215, unit: 'mg/dL', referenceRange: '<200', status: 'high', confidence: 95, matched: true },
  { id: '3', name: 'LDL Cholesterol', value: 145, unit: 'mg/dL', referenceRange: '<100', status: 'high', confidence: 97, matched: true },
  { id: '4', name: 'HDL Cholesterol', value: 42, unit: 'mg/dL', referenceRange: '>40', status: 'normal', confidence: 96, matched: true },
  { id: '5', name: 'Triglycerides', value: 165, unit: 'mg/dL', referenceRange: '<150', status: 'high', confidence: 94, matched: true },
  { id: '6', name: 'HbA1c', value: 5.8, unit: '%', referenceRange: '<5.7', status: 'high', confidence: 99, matched: true },
  { id: '7', name: 'Vitamin D', value: 28, unit: 'ng/mL', referenceRange: '30-100', status: 'low', confidence: 92, matched: true },
  { id: '8', name: 'TSH', value: 2.8, unit: 'mIU/L', referenceRange: '0.4-4.0', status: 'normal', confidence: 91, matched: true },
]

export default function LabImport({ onImport, onConfirm }: LabImportProps) {
  const [step, setStep] = useState<'upload' | 'source' | 'preview' | 'complete'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [labSource, setLabSource] = useState<string>('')
  const [testDate, setTestDate] = useState<string>('')
  const [parsedResults, setParsedResults] = useState<ParsedLabResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.includes('image'))) {
      setFile(droppedFile)
      setStep('source')
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStep('source')
    }
  }

  const handleProcess = async () => {
    if (!file || !labSource || !testDate) return

    setIsProcessing(true)
    try {
      if (onImport) {
        const response = await onImport({ file, labSource, testDate })
        setParsedResults(response.results)
      } else {
        // Mock processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        setParsedResults(mockParsedResults)
      }
      setStep('preview')
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      if (onConfirm) {
        await onConfirm(parsedResults)
      }
      setStep('complete')
    } catch (error) {
      console.error('Confirm failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetImport = () => {
    setStep('upload')
    setFile(null)
    setLabSource('')
    setTestDate('')
    setParsedResults([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Upload className="h-7 w-7 mr-3 text-emerald-600" />
              Import Lab Results
            </h2>
            <p className="text-sm text-gray-600 mt-1">Upload results from any lab - we'll extract and analyze them</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          {['Upload', 'Lab Source', 'Preview', 'Complete'].map((label, index) => {
            const stepNames = ['upload', 'source', 'preview', 'complete']
            const currentIndex = stepNames.indexOf(step)
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex

            return (
              <div key={label} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  isCompleted ? 'bg-emerald-500 text-white' :
                  isActive ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-emerald-700' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      {step === 'upload' && (
        <div
          className={`bg-white rounded-xl shadow-md p-12 border-2 border-dashed transition-colors ${
            isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className={`h-16 w-16 mx-auto mb-4 ${isDragging ? 'text-emerald-500' : 'text-gray-400'}`} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isDragging ? 'Drop your file here' : 'Upload Lab Results'}
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your PDF or image, or click to browse
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,image/*"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Select File
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supports PDF, PNG, JPG • Max 10MB
            </p>
          </div>
        </div>
      )}

      {step === 'source' && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {/* Selected File */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="font-semibold text-gray-900">{file?.name}</p>
                <p className="text-sm text-gray-500">
                  {file && (file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button onClick={resetImport} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lab Source Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Building2 className="h-4 w-4 inline mr-2" />
              Where did you get tested?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {labSources.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setLabSource(lab.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    labSource === lab.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{lab.logo}</span>
                  <p className="font-medium text-gray-900 mt-2">{lab.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Test Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Test Date
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleProcess}
            disabled={!labSource || !testDate || isProcessing}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              labSource && testDate && !isProcessing
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              'Process Lab Results'
            )}
          </button>
        </div>
      )}

      {step === 'preview' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900">
                  Successfully extracted {parsedResults.length} results
                </p>
                <p className="text-sm text-emerald-700 mt-1">
                  Review the results below and confirm to add them to your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900">Extracted Results</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {parsedResults.map((result) => (
                <div key={result.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{result.name}</p>
                      {result.confidence >= 90 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {result.confidence}% match
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Reference: {result.referenceRange} {result.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      result.status === 'normal' ? 'text-green-600' :
                      result.status === 'high' ? 'text-red-600' :
                      result.status === 'low' ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {result.value} {result.unit}
                    </p>
                    <p className={`text-xs font-medium uppercase ${
                      result.status === 'normal' ? 'text-green-600' :
                      result.status === 'high' ? 'text-red-600' :
                      result.status === 'low' ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {result.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={resetImport}
              className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Confirm & Save Results'
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="bg-white rounded-xl shadow-md p-12 border border-gray-100 text-center">
          <div className="bg-emerald-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h3>
          <p className="text-gray-600 mb-6">
            Your lab results have been added to your profile and are ready for analysis.
          </p>
          <button
            onClick={resetImport}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Import Another Lab
          </button>
        </div>
      )}
    </div>
  )
}
