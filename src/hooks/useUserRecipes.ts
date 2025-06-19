import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types';

export function useUserRecipes() {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserRecipes();
    } else {
      setUserRecipes([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserRecipes(data || []);
    } catch (error) {
      console.error('Error loading user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_recipes')
        .insert({
          ...recipe,
          user_id: user.id,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setUserRecipes(prev => [recipe, ...prev]);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('id', recipeId);

      if (error) throw error;

      setUserRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return {
    userRecipes,
    loading,
    saveRecipe,
    deleteRecipe,
    refreshRecipes: loadUserRecipes,
  };
}