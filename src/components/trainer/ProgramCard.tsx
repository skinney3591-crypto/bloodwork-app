import { Clock, Users, Dumbbell, Edit2, Copy, Trash2, Globe, Lock, Play } from 'lucide-react'
import type { DailyProgram, ClientSummary } from '../../data/trainerData'
import { estimateProgramDuration, getProgramParticipants } from '../../data/mockTrainerData'

interface ProgramCardProps {
  program: DailyProgram
  clients: ClientSummary[]
  onEdit?: (program: DailyProgram) => void
  onDuplicate?: (program: DailyProgram) => void
  onDelete?: (program: DailyProgram) => void
  onStart?: (program: DailyProgram) => void
  onClick?: (program: DailyProgram) => void
}

export default function ProgramCard({
  program,
  clients: _clients,
  onEdit,
  onDuplicate,
  onDelete,
  onStart,
  onClick,
}: ProgramCardProps) {
  const participants = getProgramParticipants(program.id)
  const estimatedDuration = estimateProgramDuration(program)
  const totalParticipants = program.assignedClientIds.length + program.selfJoinedClientIds.length

  const getStatusBadge = () => {
    switch (program.status) {
      case 'draft':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Draft</span>
      case 'published':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Published</span>
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">In Progress</span>
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Completed</span>
      default:
        return null
    }
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-5 border-2 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-orange-300' : ''
      } ${program.status === 'draft' ? 'border-dashed border-gray-300' : 'border-gray-100'}`}
      onClick={() => onClick?.(program)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-gray-900">{program.name}</h3>
            <span title={program.isPublic ? "Public - clients can join" : "Private - invite only"}>
              {program.isPublic ? (
                <Globe className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4 text-gray-400" />
              )}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Description */}
      {program.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{program.description}</p>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Dumbbell className="h-4 w-4 text-orange-500" />
          <span>{program.exercises.length} exercises</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-blue-500" />
          <span>~{estimatedDuration} min</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          {participants.length > 0 ? (
            <div className="flex items-center">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {participants.slice(0, 4).map((client, idx) => (
                  <div
                    key={client.id}
                    className="w-7 h-7 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center text-orange-800 text-xs font-bold"
                    title={client.name}
                    style={{ zIndex: 10 - idx }}
                  >
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
              </div>
              {participants.length > 4 && (
                <span className="ml-2 text-sm text-gray-600">+{participants.length - 4} more</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No participants yet</span>
          )}
        </div>
        {program.maxParticipants && (
          <span className="text-xs text-gray-500">
            {totalParticipants}/{program.maxParticipants} spots
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(program); }}
              className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Edit program"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(program); }}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Duplicate program"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          {onDelete && program.status === 'draft' && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(program); }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete program"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        {onStart && program.status === 'published' && (
          <button
            onClick={(e) => { e.stopPropagation(); onStart(program); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="h-4 w-4" />
            Start
          </button>
        )}
      </div>
    </div>
  )
}
