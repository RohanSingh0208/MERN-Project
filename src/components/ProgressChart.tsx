import { Habit, HabitLog } from '../lib/supabase';

interface ProgressChartProps {
  habits: Habit[];
  habitLogs: HabitLog[];
}

export default function ProgressChart({ habits, habitLogs }: ProgressChartProps) {
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const getCompletionForDay = (date: string) => {
    const completed = habitLogs.filter((log) => log.completed_at === date).length;
    const total = habits.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Progress</h3>
      <div className="flex items-end justify-between gap-2 h-48">
        {last7Days.map((day) => {
          const completion = getCompletionForDay(day);
          const height = completion;

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-lg h-full flex items-end overflow-hidden">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-900">{getDayName(day)}</p>
                <p className="text-xs text-gray-500">{Math.round(completion)}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
