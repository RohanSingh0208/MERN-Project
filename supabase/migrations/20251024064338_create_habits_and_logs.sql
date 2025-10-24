/*
  # Personal Habit Tracker Database Schema

  1. New Tables
    - `habits`
      - `id` (uuid, primary key) - Unique identifier for each habit
      - `user_id` (uuid, foreign key) - References auth.users, owner of the habit
      - `title` (text) - Name of the habit (e.g., "Morning Exercise")
      - `description` (text, optional) - Detailed description of the habit
      - `category` (text) - Category like "Health", "Productivity", "Learning"
      - `target_frequency` (text) - How often: "daily", "weekly", etc.
      - `color` (text) - UI color for the habit card
      - `icon` (text) - Icon name from lucide-react
      - `created_at` (timestamptz) - When the habit was created
      - `updated_at` (timestamptz) - Last modification time
      - `is_active` (boolean) - Whether habit is currently being tracked
    
    - `habit_logs`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `habit_id` (uuid, foreign key) - References habits table
      - `user_id` (uuid, foreign key) - References auth.users
      - `completed_at` (date) - Date when habit was completed
      - `notes` (text, optional) - Optional notes for the day
      - `created_at` (timestamptz) - When the log was created

  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own habits and logs
    - Policies check authentication and ownership
    - Foreign key constraints ensure data integrity

  3. Indexes
    - Index on user_id for faster habit queries
    - Index on habit_id and completed_at for log queries
    - Unique constraint on habit_id + completed_at (one log per day per habit)
*/

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  target_frequency text NOT NULL DEFAULT 'daily',
  color text NOT NULL DEFAULT 'blue',
  icon text NOT NULL DEFAULT 'target',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true NOT NULL
);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_at date NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(habit_id, completed_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_is_active ON habits(is_active);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON habit_logs(completed_at);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits table
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for habit_logs table
CREATE POLICY "Users can view their own habit logs"
  ON habit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit logs"
  ON habit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit logs"
  ON habit_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit logs"
  ON habit_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();