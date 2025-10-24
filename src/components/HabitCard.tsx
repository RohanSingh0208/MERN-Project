import { useState } from 'react';
import { CheckCircle, Circle, Trash2, Edit, Flame } from 'lucide-react';
import { Habit } from '../lib/supabase';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function HabitCard({
  habit,
  isCompleted,
  streak,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [showActions, setShowActions] = useState(false);

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
  };

  const colors = colorClasses[habit.color] || colorClasses.blue;

  return (
    <div
      className={`${colors.bg} ${colors.border} border-2 rounded-xl p-5 transition-all hover:shadow-md relative`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={onToggle}
          className="flex-shrink-0 transition-transform hover:scale-110"
        >
          {isCompleted ? (
            <CheckCircle className={`w-8 h-8 ${colors.text} fill-current`} />
          ) : (
            <Circle className={`w-8 h-8 ${colors.text}`} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${colors.text} ${isCompleted ? 'line-through opacity-60' : ''}`}>
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
              {habit.category}
            </span>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{streak}</span>
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
