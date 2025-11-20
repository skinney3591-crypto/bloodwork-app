import { FileText, TrendingDown, TrendingUp, Pill, Activity, CheckCircle, AlertCircle, Printer, Download, X } from 'lucide-react'
import type { CustomerData } from '../data/mockData'

interface VisitSummaryProps {
  data: CustomerData
  onClose: () => void
}

export default function VisitSummary({ data, onClose }: VisitSummaryProps) {
  // Get abnormal markers
  const abnormalMarkers = data.bloodwork.filter(m => m.status !== 'normal')
  const improvingMarkers = abnormalMarkers.filter(m => m.trend === 'improving')

  // Get adherence stats from reminders
  const completedReminders = data.reminders.filter(r => r.completed).length
  const totalReminders = data.reminders.length
  const adherencePercent = Math.round((completedReminders / totalReminders) * 100)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('PDF download would be generated here')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header - Don't print close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Doctor Visit Summary</h2>
              <p className="text-sm text-gray-600">Ready to print or share</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Patient</p>
                <p className="text-sm font-bold text-gray-900">{data.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Age</p>
                <p className="text-sm font-bold text-gray-900">{data.age} years</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Last Test Date</p>
                <p className="text-sm font-bold text-gray-900">{new Date(data.testDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Report Generated</p>
                <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Executive Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Abnormal Markers</p>
                <p className="text-2xl font-bold text-orange-600">{abnormalMarkers.length}</p>
                <p className="text-xs text-gray-500">out of {data.bloodwork.length} total</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Improving</p>
                <p className="text-2xl font-bold text-green-600">{improvingMarkers.length}</p>
                <p className="text-xs text-gray-500">trending better</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Plan Adherence</p>
                <p className="text-2xl font-bold text-blue-600">{adherencePercent}%</p>
                <p className="text-xs text-gray-500">today's completion</p>
              </div>
            </div>
          </div>

          {/* Top Priority Markers */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Top Priority: What to Discuss
            </h3>
            <div className="space-y-3">
              {abnormalMarkers.slice(0, 5).map((marker, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg font-bold text-gray-900">{marker.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          marker.status === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {marker.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Current: <strong>{marker.value} {marker.unit}</strong></span>
                        <span>•</span>
                        <span>Target: {marker.optimalRange} {marker.unit}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          {marker.trend === 'improving' ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-green-600 font-medium">Improving ({marker.changePercent > 0 ? '+' : ''}{marker.changePercent.toFixed(1)}%)</span>
                            </>
                          ) : marker.trend === 'worsening' ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                              <span className="text-red-600 font-medium">Worsening ({marker.changePercent > 0 ? '+' : ''}{marker.changePercent.toFixed(1)}%)</span>
                            </>
                          ) : (
                            <span className="text-gray-600">Stable</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Pill className="h-5 w-5 mr-2 text-purple-600" />
              Current Medications
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {data.medications.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.prescribedFor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{med.dosage}</p>
                      <p className="text-xs text-gray-500">{med.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Supplements */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Pill className="h-5 w-5 mr-2 text-blue-600" />
              Current Supplements
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.supplements.map((supp, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3">
                    <p className="font-bold text-gray-900">{supp.name}</p>
                    <p className="text-sm text-gray-600">{supp.dosage} • {supp.frequency}</p>
                    <p className="text-xs text-gray-500 mt-1">{supp.timing}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lifestyle & Activity */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Activity & Lifestyle Plan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.exercises.slice(0, 6).map((exercise, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{exercise.name}</p>
                      <p className="text-xs text-gray-600">
                        {exercise.duration || `${exercise.sets}x${exercise.reps}`} • {exercise.frequency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Questions to Ask Doctor */}
          <div className="border-2 border-purple-300 bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-purple-900 mb-3">Questions to Ask Your Doctor</h3>
            <div className="space-y-2">
              {abnormalMarkers.slice(0, 3).map((marker, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <p className="text-sm text-purple-900">
                    What can I do to improve my {marker.name}? Current: {marker.value} {marker.unit}, Goal: {marker.optimalRange} {marker.unit}
                  </p>
                </div>
              ))}
              <div className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <p className="text-sm text-purple-900">
                  Should we adjust my medication dosages based on my current progress?
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <p className="text-sm text-purple-900">
                  Are there any additional tests or screenings I should consider?
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>This summary was generated from HealthSync AI on {new Date().toLocaleDateString()}</p>
            <p className="mt-1">Always consult with your healthcare provider before making changes to your treatment plan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
