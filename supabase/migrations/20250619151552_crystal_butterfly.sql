/*
  # Update meal_plans table schema

  1. Schema Changes
    - Add `meal_date` column for specific meal dates
    - Add `meal_moment` column for specific meal times (breakfast/lunch/dinner)
    - Keep existing `week_start` and `meal_data` for backward compatibility
    - Add indexes for new columns

  2. Migration Strategy
    - Add new columns without breaking existing data
    - Create indexes for performance
    - Update RLS policies if needed
*/

-- Add new columns to meal_plans table
DO $$
BEGIN
  -- Add meal_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meal_plans' AND column_name = 'meal_date'
  ) THEN
    ALTER TABLE meal_plans ADD COLUMN meal_date date;
  END IF;

  -- Add meal_moment column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meal_plans' AND column_name = 'meal_moment'
  ) THEN
    ALTER TABLE meal_plans ADD COLUMN meal_moment text;
  END IF;
END $$;

-- Add check constraint for meal_moment values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'meal_plans_meal_moment_check'
  ) THEN
    ALTER TABLE meal_plans 
    ADD CONSTRAINT meal_plans_meal_moment_check 
    CHECK (meal_moment IN ('breakfast', 'lunch', 'dinner', 'snack') OR meal_moment IS NULL);
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_meal_plans_date_moment ON meal_plans(user_id, meal_date, meal_moment);
CREATE INDEX IF NOT EXISTS idx_meal_plans_meal_date ON meal_plans(meal_date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_meal_moment ON meal_plans(meal_moment);

-- Update the existing unique constraint to include new columns (optional)
-- This would be for future use when transitioning to the new schema
-- For now, we'll keep both approaches working