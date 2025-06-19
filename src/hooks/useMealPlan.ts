import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types';

export interface SavedMealPlan {
  id: string;
  user_id: string;
  week_start: string;
  meal_date?: string;
  meal_moment?: string;
  meal_data: Record<string, Recipe>;
  created_at: string;
  updated_at: string;
}

export function useMealPlan() {
  const [mealPlan, setMealPlan] = useState<Record<string, Recipe>>({});
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const getWeekStart = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (user) {
      const weekStart = getWeekStart(new Date());
      setCurrentWeekStart(weekStart);
      loadMealPlan(weekStart);
    } else {
      setMealPlan({});
      setLoading(false);
    }
  }, [user]);

  const loadMealPlan = async (weekStart: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setMealPlan(data?.meal_data || {});
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMealPlan = async (newMealPlan: Record<string, Recipe>) => {
    if (!user || !currentWeekStart) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('meal_plans')
        .upsert({
          user_id: user.id,
          week_start: currentWeekStart,
          meal_data: newMealPlan,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMealPlan(newMealPlan);
    } catch (error) {
      console.error('Error saving meal plan:', error);
    } finally {
      setSaving(false);
    }
  };

  // New method for saving individual meal entries using the new schema
  const saveMealEntry = async (date: string, mealMoment: string, recipe: Recipe | null) => {
    if (!user) return;

    try {
      setSaving(true);
      
      if (recipe) {
        // Insert or update the meal entry
        const { error } = await supabase
          .from('meal_plans')
          .upsert({
            user_id: user.id,
            meal_date: date,
            meal_moment: mealMoment,
            meal_data: { recipe },
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      } else {
        // Delete the meal entry
        const { error } = await supabase
          .from('meal_plans')
          .delete()
          .eq('user_id', user.id)
          .eq('meal_date', date)
          .eq('meal_moment', mealMoment);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving meal entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateMealPlan = (key: string, recipe: Recipe | null) => {
    const newMealPlan = { ...mealPlan };
    
    if (recipe) {
      newMealPlan[key] = recipe;
    } else {
      delete newMealPlan[key];
    }

    setMealPlan(newMealPlan);
    
    // Auto-save if user is logged in
    if (user) {
      saveMealPlan(newMealPlan);
    }
  };

  const changeWeek = async (newDate: Date) => {
    const weekStart = getWeekStart(newDate);
    setCurrentWeekStart(weekStart);
    await loadMealPlan(weekStart);
  };

  return {
    mealPlan,
    loading,
    saving,
    updateMealPlan,
    saveMealPlan,
    saveMealEntry, // New method for individual meal entries
    changeWeek,
    currentWeekStart,
  };
}