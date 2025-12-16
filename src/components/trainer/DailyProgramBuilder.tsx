import { useState } from 'react'
import { ArrowLeft, Plus, GripVertical, Trash2, Clock, Timer, Save, Send, Users, Globe, Lock, Link2 } from 'lucide-react'
import type { DailyProgram, DailyExercise, ClientSummary, ExerciseGroup } from '../../data/trainerData'
import ExercisePicker from './ExercisePicker'
import ProgramAssignment from './ProgramAssignment'

// Available groups with colors
const EXERCISE_GROUPS: { value: ExerciseGroup; label: string; color: string; bgColor: string; bgColorLight: string; borderColor: string }[] = [
  { value: 'A', label: 'Group A', color: 'text-blue-700', bgColor: 'bg-blue-100', bgColorLight: 'bg-blue-50', borderColor: 'border-blue-300' },
  { value: 'B', label: 'Group B', color: 'text-green-700', bgColor: 'bg-green-100', bgColorLight: 'bg-green-50', borderColor: 'border-green-300' },
  { value: 'C', label: 'Group C', color: 'text-purple-700', bgColor: 'bg-purple-100', bgColorLight: 'bg-purple-50', borderColor: 'border-purple-300' },
  { value: 'D', label: 'Group D', color: 'text-orange-700', bgColor: 'bg-orange-100', bgColorLight: 'bg-orange-50', borderColor: 'border-orange-300' },
  { value: 'E', label: 'Group E', color: 'text-pink-700', bgColor: 'bg-pink-100', bgColorLight: 'bg-pink-50', borderColor: 'border-pink-300' },
  { value: 'F', label: 'Group F', color: 'text-cyan-700', bgColor: 'bg-cyan-100', bgColorLight: 'bg-cyan-50', borderColor: 'border-cyan-300' },
]

const getGroupStyle = (group?: string) => {
  const found = EXERCISE_GROUPS.find(g => g.value === group)
  return found || { value: '', label: 'None', color: 'text-gray-500', bgColor: 'bg-gray-100', bgColorLight: 'bg-gray-50', borderColor: 'border-gray-300' }
}

interface DailyProgramBuilderProps {
  clients: ClientSummary[]
  existingProgram: DailyProgram | null
  selectedDate: string
  onSave: (program: DailyProgram) => void
  onCancel: () => void
}

export default function DailyProgramBuilder({
  clients,
  existingProgram,
  selectedDate,
  onSave,
  onCancel,
}: DailyProgramBuilderProps) {
  const [name, setName] = useState(existingProgram?.name || '')
  const [description, setDescription] = useState(existingProgram?.description || '')
  const [date, setDate] = useState(existingProgram?.date || selectedDate)
  const [exercises, setExercises] = useState<DailyExercise[]>(existingProgram?.exercises || [])
  const [isPublic, setIsPublic] = useState(existingProgram?.isPublic ?? true)
  const [maxParticipants, setMaxParticipants] = useState(existingProgram?.maxParticipants?.toString() || '')
  const [assignedClientIds, setAssignedClientIds] = useState<string[]>(existingProgram?.assignedClientIds || [])
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [showAssignment, setShowAssignment] = useState(false)
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleAddExercise = (exercise: DailyExercise) => {
    const newExercise = {
      ...exercise,
      order: exercises.length + 1,
    }
    setExercises([...exercises, newExercise])
  }

  const handleUpdateExercise = (exerciseId: string, updates: Partial<DailyExercise>) => {
    setExercises(exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    ))
  }

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId).map((ex, idx) => ({
      ...ex,
      order: idx + 1,
    })))
  }

  const handleMoveExercise = (fromIndex: number, toIndex: number) => {
    const newExercises = [...exercises]
    const [moved] = newExercises.splice(fromIndex, 1)
    newExercises.splice(toIndex, 0, moved)
    setExercises(newExercises.map((ex, idx) => ({ ...ex, order: idx + 1 })))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      handleMoveExercise(draggedIndex, index)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDropOnGroup = (group: string | undefined) => {
    if (draggedIndex !== null) {
      const exercise = exercises[draggedIndex]
      handleUpdateExercise(exercise.id, { group })
    }
  }

  // Get existing groups in the program
  const existingGroups = [...new Set(exercises.map(e => e.group).filter(Boolean))] as string[]

  const handleSave = (publish: boolean) => {
    if (!name.trim()) {
      alert('Please enter a program name')
      return
    }
    if (exercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    const program: DailyProgram = {
      id: existingProgram?.id || `dp-${Date.now()}`,
      trainerId: 'trainer-001',
      name: name.trim(),
      description: description.trim() || undefined,
      date,
      exercises,
      assignedClientIds,
      selfJoinedClientIds: existingProgram?.selfJoinedClientIds || [],
      isPublic,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
      status: publish ? 'published' : 'draft',
      createdAt: existingProgram?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(program)
  }

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {existingProgram ? 'Edit Program' : 'New Program'}
            </h2>
            <p className="text-gray-600">{formatDateDisplay(date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Program Details & Exercises */}
        <div className="col-span-2 space-y-6">
          {/* Program Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Program Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Upper Body, Leg Day, HIIT Cardio"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the workout..."
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Exercises ({exercises.length})
              </h3>
              <button
                onClick={() => setShowExercisePicker(true)}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </button>
            </div>

            {/* Group Drop Zones - visible when dragging */}
            {exercises.length > 0 && (
              <div className={`mb-4 p-3 rounded-lg transition-all ${draggedIndex !== null ? 'bg-orange-50 border-2 border-orange-200' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  {draggedIndex !== null ? 'Drop on a group to create supersets/circuits:' : 'Drag exercises to group them into supersets/circuits:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* No Group option */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnGroup(undefined)}
                    className={`px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-500 text-sm font-medium transition-colors ${draggedIndex !== null ? 'cursor-pointer hover:border-gray-400 hover:bg-gray-100' : ''}`}
                  >
                    No Group
                  </div>
                  {/* Group options */}
                  {EXERCISE_GROUPS.map((g) => {
                    const isUsed = existingGroups.includes(g.value)
                    const exerciseCount = exercises.filter(e => e.group === g.value).length
                    return (
                      <div
                        key={g.value}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnGroup(g.value)}
                        className={`px-3 py-2 rounded-lg border-2 ${draggedIndex !== null ? 'border-dashed' : ''} ${g.borderColor} ${g.bgColorLight} ${g.color} text-sm font-bold transition-all ${draggedIndex !== null ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}`}
                      >
                        {g.label}
                        {isUsed && <span className="ml-1 opacity-60">({exerciseCount})</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {exercises.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-2">No exercises added yet</p>
                <button
                  onClick={() => setShowExercisePicker(true)}
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  + Add your first exercise
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise, index) => {
                  // Check if this exercise is part of a group and determine its position in the group
                  const currentGroup = exercise.group
                  const prevExercise = exercises[index - 1]
                  const isStartOfGroup = currentGroup && (!prevExercise || prevExercise.group !== currentGroup)
                  const groupStyle = getGroupStyle(currentGroup)

                  return (
                  <div
                    key={exercise.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative rounded-lg p-4 ${
                      draggedIndex === index ? 'opacity-50' : ''
                    } ${currentGroup ? `${groupStyle.bgColorLight} border-2 ${groupStyle.borderColor}` : 'bg-gray-50'}`}
                  >
                    {/* Group label for first exercise in group */}
                    {isStartOfGroup && (
                      <div className={`absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-bold ${groupStyle.bgColor} ${groupStyle.color}`}>
                        Group {currentGroup}
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      {/* Drag Handle */}
                      <div className="cursor-grab text-gray-400 hover:text-gray-600 pt-1">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      {/* Order Number */}
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>

                      {/* Exercise Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                          <button
                            onClick={() => handleRemoveExercise(exercise.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Editable Fields */}
                        {editingExerciseId === exercise.id ? (
                          <div className="grid grid-cols-4 gap-2 mt-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Sets</label>
                              <input
                                type="number"
                                value={exercise.sets || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { sets: parseInt(e.target.value) || undefined })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                min={1}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Reps</label>
                              <input
                                type="text"
                                value={exercise.reps || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { reps: e.target.value || undefined })}
                                placeholder="10-12"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Duration (sec)</label>
                              <input
                                type="number"
                                value={exercise.duration || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { duration: parseInt(e.target.value) || undefined })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Rest (sec)</label>
                              <input
                                type="number"
                                value={exercise.restPeriod || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { restPeriod: parseInt(e.target.value) || undefined })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Group</label>
                              <select
                                value={exercise.group || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { group: e.target.value || undefined })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              >
                                <option value="">None</option>
                                {EXERCISE_GROUPS.map(g => (
                                  <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Weight</label>
                              <input
                                type="text"
                                value={exercise.weight || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { weight: e.target.value || undefined })}
                                placeholder="135lbs"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-gray-500 mb-1">Notes</label>
                              <input
                                type="text"
                                value={exercise.notes || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { notes: e.target.value || undefined })}
                                placeholder="Form cues, tips..."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                            <div className="col-span-4">
                              <button
                                onClick={() => setEditingExerciseId(null)}
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                              >
                                Done editing
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            {exercise.group && (
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${getGroupStyle(exercise.group).bgColor} ${getGroupStyle(exercise.group).color}`}>
                                <Link2 className="h-3 w-3" />
                                {exercise.group}
                              </span>
                            )}
                            {exercise.sets && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{exercise.sets}</span> sets
                              </span>
                            )}
                            {exercise.reps && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">{exercise.reps}</span> reps
                              </span>
                            )}
                            {exercise.duration && (
                              <span className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                <span className="font-medium">{exercise.duration}s</span>
                              </span>
                            )}
                            {exercise.restPeriod && (
                              <span className="flex items-center gap-1 text-gray-400">
                                <Clock className="h-3 w-3" />
                                {exercise.restPeriod}s rest
                              </span>
                            )}
                            <button
                              onClick={() => setEditingExerciseId(exercise.id)}
                              className="ml-auto text-orange-600 hover:text-orange-700 font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                        {exercise.notes && editingExerciseId !== exercise.id && (
                          <p className="text-sm text-gray-500 mt-1 italic">{exercise.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Settings & Assignment */}
        <div className="space-y-6">
          {/* Visibility Settings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Visibility</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe className="h-5 w-5 text-green-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium">{isPublic ? 'Public' : 'Private'}</span>
                </div>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPublic ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {isPublic
                  ? 'Clients can join this program themselves'
                  : 'Only assigned clients can see this program'
                }
              </p>
              {isPublic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants (optional)
                  </label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    placeholder="No limit"
                    min={1}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Client Assignment */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Assigned Clients</h3>
              <button
                onClick={() => setShowAssignment(true)}
                className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
              >
                Manage
              </button>
            </div>
            {assignedClientIds.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No clients assigned</p>
                <button
                  onClick={() => setShowAssignment(true)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium mt-1"
                >
                  + Assign clients
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {assignedClientIds.map((clientId) => {
                  const client = clients.find(c => c.id === clientId)
                  if (!client) return null
                  return (
                    <div
                      key={clientId}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-xs">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{client.name}</span>
                    </div>
                  )
                })}
                <button
                  onClick={() => setShowAssignment(true)}
                  className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium py-2"
                >
                  + Add more clients
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePicker
        isOpen={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={handleAddExercise}
        trainerId="trainer-001"
      />

      {/* Assignment Modal */}
      {showAssignment && (
        <ProgramAssignment
          clients={clients}
          assignedClientIds={assignedClientIds}
          onSave={(clientIds) => {
            setAssignedClientIds(clientIds)
            setShowAssignment(false)
          }}
          onClose={() => setShowAssignment(false)}
        />
      )}
    </div>
  )
}
