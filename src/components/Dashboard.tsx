import { useState, useEffect } from 'react';
import { Plus, LogOut, TrendingUp, Calendar, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Habit, HabitLog } from '../lib/supabase';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import ProgressChart from './ProgressChart';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);

    const [habitsResult, logsResult] = await Promise.all([
      supabase
        .from('habits')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('habit_logs')
        .select('*')
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    ]);

    if (habitsResult.data) setHabits(habitsResult.data);
    if (logsResult.data) setHabitLogs(logsResult.data);

    setLoading(false);
  };

  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    if (editingHabit) {
      const { error } = await supabase
        .from('habits')
        .update(habitData)
        .eq('id', editingHabit.id);

      if (!error) {
        await loadData();
        setShowForm(false);
        setEditingHabit(undefined);
      }
    } else {
      const { error } = await supabase
        .from('habits')
        .insert([{ ...habitData, user_id: user!.id }]);

      if (!error) {
        await loadData();
        setShowForm(false);
      }
    }
  };

  const handleToggleLog = async (habitId: string) => {
    const existingLog = habitLogs.find(
      (log) => log.habit_id === habitId && log.completed_at === today
    );

    if (existingLog) {
      await supabase.from('habit_logs').delete().eq('id', existingLog.id);
    } else {
      await supabase.from('habit_logs').insert([
        {
          habit_id: habitId,
          user_id: user!.id,
          completed_at: today,
        },
      ]);
    }

    await loadData();
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      await supabase.from('habits').update({ is_active: false }).eq('id', habitId);
      await loadData();
    }
  };

  const calculateStreak = (habitId: string): number => {
    const logs = habitLogs
      .filter((log) => log.habit_id === habitId)
      .map((log) => new Date(log.completed_at))
      .sort((a, b) => b.getTime() - a.getTime());

    if (logs.length === 0) return 0;

    let streak = 0;
    const todayDate = new Date(today);

    for (let i = 0; i < logs.length; i++) {
      const expectedDate = new Date(todayDate);
      expectedDate.setDate(todayDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      const logDateStr = logs[i].toISOString().split('T')[0];

      if (logDateStr === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const todayCompletedCount = habits.filter((habit) =>
    habitLogs.some((log) => log.habit_id === habit.id && log.completed_at === today)
  ).length;

  const totalActiveHabits = habits.length;
  const completionRate = totalActiveHabits > 0 ? Math.round((todayCompletedCount / totalActiveHabits) * 100) : 0;

  const longestStreak = habits.reduce((max, habit) => {
    const streak = calculateStreak(habit.id);
    return Math.max(max, streak);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-gray-600 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayCompletedCount}/{totalActiveHabits}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-900">{longestStreak} days</p>
              </div>
            </div>
          </div>
        </div>

        <ProgressChart habits={habits} habitLogs={habitLogs} />

        <div className="flex items-center justify-between mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
          <button
            onClick={() => {
              setEditingHabit(undefined);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-600 mb-4">No habits yet. Start building better habits today!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={habitLogs.some(
                  (log) => log.habit_id === habit.id && log.completed_at === today
                )}
                streak={calculateStreak(habit.id)}
                onToggle={() => handleToggleLog(habit.id)}
                onEdit={() => {
                  setEditingHabit(habit);
                  setShowForm(true);
                }}
                onDelete={() => handleDeleteHabit(habit.id)}
              />
            ))}
          </div>
        )}

        {showForm && (
          <HabitForm
            habit={editingHabit}
            onSave={handleSaveHabit}
            onCancel={() => {
              setShowForm(false);
              setEditingHabit(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
}
