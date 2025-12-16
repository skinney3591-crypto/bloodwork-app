import { useState } from 'react'
import { ArrowLeft, Dumbbell, Apple, Target, Video, MessageSquare, TrendingUp, Activity, Calendar, AlertTriangle, Beaker } from 'lucide-react'
import {
  getClientById,
  getClientProgram,
  getClientNutritionPlan,
  getClientMeasurements,
  getClientStrengthRecords,
  getClientFormChecks,
  getClientGoals,
} from '../../data/mockTrainerData'

interface ClientChartProps {
  clientId: string
  onBack: () => void
}

type ClientTab = 'overview' | 'program' | 'nutrition' | 'progress' | 'form_checks'

export default function ClientChart({ clientId, onBack }: ClientChartProps) {
  const [activeTab, setActiveTab] = useState<ClientTab>('overview')

  const client = getClientById(clientId)
  const program = getClientProgram(clientId)
  const nutritionPlan = getClientNutritionPlan(clientId)
  const measurements = getClientMeasurements(clientId)
  const strengthRecords = getClientStrengthRecords(clientId)
  const formChecks = getClientFormChecks(clientId)
  const goals = getClientGoals(clientId)

  if (!client) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">Client not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview' as ClientTab, label: 'Overview', icon: Activity },
    { id: 'program' as ClientTab, label: 'Program', icon: Dumbbell },
    { id: 'nutrition' as ClientTab, label: 'Nutrition', icon: Apple },
    { id: 'progress' as ClientTab, label: 'Progress', icon: TrendingUp },
    { id: 'form_checks' as ClientTab, label: 'Form Checks', icon: Video, badge: client.pendingFormChecks },
  ]

  const getGoalProgress = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-gray-700"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Clients</span>
      </button>

      {/* Client Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{client.name}</h1>
              <p className="text-orange-100 text-lg">
                {client.age} y/o {client.gender} | {client.fitnessLevel} | Member since {new Date(client.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-semibold capitalize">
                  {client.primaryGoal.replace('_', ' ')}
                </span>
                {client.secondaryGoals?.map((goal, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-sm font-semibold capitalize">
                    {goal.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-6 py-3 bg-white text-orange-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Message</span>
            </button>
            <button className="px-6 py-3 bg-white text-orange-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Program</p>
          <div className={`text-3xl font-bold ${
            client.programAdherence >= 80 ? 'text-green-600' :
            client.programAdherence >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {client.programAdherence}%
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Nutrition</p>
          <div className={`text-3xl font-bold ${
            client.nutritionAdherence >= 80 ? 'text-green-600' :
            client.nutritionAdherence >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {client.nutritionAdherence}%
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Current</p>
          <div className="text-3xl font-bold text-gray-900">
            {client.currentWeight || '—'}<span className="text-lg text-gray-500"> lbs</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Target</p>
          <div className="text-3xl font-bold text-gray-900">
            {client.targetWeight || '—'}<span className="text-lg text-gray-500"> lbs</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Body Fat</p>
          <div className="text-3xl font-bold text-gray-900">
            {client.bodyFatPercent || '—'}<span className="text-lg text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Bloodwork Concerns (if shared) */}
      {client.sharesBloodwork && client.bloodworkConcerns && client.bloodworkConcerns.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 flex items-center mb-4">
            <Beaker className="h-6 w-6 mr-2" />
            Bloodwork Concerns (Shared by Client)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {client.bloodworkConcerns.map((concern, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{concern}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {concern.includes('A1C') && 'Consider low-GI foods and post-meal walks'}
                      {concern.includes('Cholesterol') && 'Emphasize cardio and omega-3 rich foods'}
                      {concern.includes('Vitamin D') && 'May affect recovery and energy levels'}
                      {concern.includes('Blood Pressure') && 'Monitor intensity, avoid heavy Valsalva'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {client.exerciseRestrictions && client.exerciseRestrictions.length > 0 && (
            <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-200">
              <p className="font-semibold text-orange-900 mb-2">Exercise Restrictions:</p>
              <ul className="list-disc list-inside text-orange-800 text-sm space-y-1">
                {client.exerciseRestrictions.map((restriction, idx) => (
                  <li key={idx}>{restriction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-base transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Goals */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Active Goals
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {goals.filter(g => g.status === 'in_progress').map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <span className="text-sm text-gray-500">
                      Due: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {goal.currentValue} / {goal.targetValue} {goal.targetUnit}
                    </span>
                    <span className="font-semibold">{Math.round(goal.progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getGoalProgress(goal.progressPercent)}`}
                      style={{ width: `${Math.min(100, goal.progressPercent)}%` }}
                    />
                  </div>
                </div>
              ))}
              {goals.filter(g => g.status === 'in_progress').length === 0 && (
                <p className="text-gray-500 text-center py-4">No active goals</p>
              )}
            </div>
          </div>

          {/* Recent Strength PRs */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent PRs
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {strengthRecords.slice(0, 4).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{record.exerciseName}</p>
                    <p className="text-sm text-gray-600">
                      {record.weight} lbs x {record.reps} reps
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{record.estimated1RM} lbs</p>
                    <p className="text-xs text-gray-500">Est. 1RM</p>
                  </div>
                </div>
              ))}
              {strengthRecords.length === 0 && (
                <p className="text-gray-500 text-center py-4">No strength records yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'program' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {program ? (
            <>
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{program.name}</h3>
                    <p className="text-orange-100">
                      Week {program.currentWeek} of {program.durationWeeks} | {program.sessionsPerWeek}x per week
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                    <p className="text-white text-2xl font-bold">
                      {program.completedSessions}/{program.totalSessions}
                    </p>
                    <p className="text-orange-100 text-sm">sessions</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Weekly Schedule</h4>
                <div className="grid grid-cols-7 gap-2">
                  {program.weeklySchedule.map((day) => (
                    <div
                      key={day.dayOfWeek}
                      className={`p-3 rounded-lg text-center ${
                        day.isRestDay
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-orange-50 text-orange-800 border border-orange-200'
                      }`}
                    >
                      <p className="font-semibold text-sm">{day.dayName.slice(0, 3)}</p>
                      <p className="text-xs mt-1">
                        {day.isRestDay ? 'Rest' : day.sessionName || 'Training'}
                      </p>
                    </div>
                  ))}
                </div>
                {program.progressionScheme && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-1">Progression Scheme</p>
                    <p className="text-sm text-blue-800">{program.progressionScheme}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No program assigned</p>
              <button className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700">
                Create Program
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {nutritionPlan ? (
            <>
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{nutritionPlan.name}</h3>
                    <p className="text-green-100 capitalize">
                      {nutritionPlan.goal} | Started {new Date(nutritionPlan.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                    <p className="text-white text-2xl font-bold">
                      {nutritionPlan.targetCalories}
                    </p>
                    <p className="text-green-100 text-sm">cal/day</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Daily Macro Targets</h4>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{nutritionPlan.macroTargets.protein}g</p>
                    <p className="text-sm text-blue-800">Protein</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">{nutritionPlan.macroTargets.carbs}g</p>
                    <p className="text-sm text-orange-800">Carbs</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">{nutritionPlan.macroTargets.fat}g</p>
                    <p className="text-sm text-purple-800">Fat</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{nutritionPlan.macroTargets.fiber || 25}g</p>
                    <p className="text-sm text-green-800">Fiber</p>
                  </div>
                </div>
                {nutritionPlan.trainerNotes && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold text-yellow-900 mb-1">Notes</p>
                    <p className="text-sm text-yellow-800">{nutritionPlan.trainerNotes}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Apple className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No nutrition plan assigned</p>
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                Create Nutrition Plan
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Body Measurements */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Body Measurements
              </h3>
            </div>
            <div className="p-4">
              {measurements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 font-semibold text-gray-600">Date</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-600">Weight</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-600">Body Fat %</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-600">Waist</th>
                        <th className="text-left py-2 px-4 font-semibold text-gray-600">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.map((m, idx) => (
                        <tr key={m.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="py-2 px-4">{new Date(m.date).toLocaleDateString()}</td>
                          <td className="py-2 px-4 font-semibold">{m.weight} lbs</td>
                          <td className="py-2 px-4">{m.bodyFatPercent ? `${m.bodyFatPercent}%` : '—'}</td>
                          <td className="py-2 px-4">{m.waist ? `${m.waist}"` : '—'}</td>
                          <td className="py-2 px-4 text-sm text-gray-600">{m.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No measurements recorded yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'form_checks' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Form Check Submissions
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {formChecks.length > 0 ? (
              formChecks.map((fc) => (
                <div
                  key={fc.id}
                  className={`p-4 rounded-lg border-2 ${
                    fc.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                    fc.status === 'reviewed' ? 'bg-green-50 border-green-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{fc.exerciseName}</h4>
                      <p className="text-sm text-gray-600">
                        {fc.weight && `${fc.weight} lbs`} {fc.reps && `x ${fc.reps} reps`} | {new Date(fc.recordedDate).toLocaleDateString()}
                      </p>
                      {fc.clientQuestion && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{fc.clientQuestion}"</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      fc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      fc.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {fc.status}
                    </span>
                  </div>
                  {fc.feedback && (
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <p className="text-sm font-semibold text-gray-700">Your Feedback:</p>
                      <p className="text-sm text-gray-600">{fc.feedback}</p>
                    </div>
                  )}
                  {fc.status === 'pending' && (
                    <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 text-sm">
                      Review Now
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No form checks submitted</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
