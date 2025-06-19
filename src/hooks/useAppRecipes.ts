import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Recipe } from '../types';

export function useAppRecipes() {
  const [appRecipes, setAppRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppRecipes();
  }, []);

  const loadAppRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('app_recipes')
        .select('*')
        .order('popularity_score', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform the data to match our Recipe interface
      const transformedRecipes: Recipe[] = (data || []).map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        prepTime: recipe.prep_time,
        cookTime: recipe.cook_time,
        servings: recipe.servings,
        difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard',
        cuisine: recipe.cuisine,
        dietaryTags: recipe.dietary_tags || [],
        kidFriendly: recipe.kid_friendly,
        ingredients: recipe.ingredients || [],
        nutrition: recipe.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0
        },
        instructions: recipe.instructions || [],
        imageUrl: recipe.image_url,
        mealType: recipe.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack'
      }));

      setAppRecipes(transformedRecipes);
    } catch (error: any) {
      console.error('Error loading app recipes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedRecipes = () => {
    return appRecipes.filter(recipe => {
      // Since we don't have is_featured in our Recipe interface,
      // we'll use popularity as a proxy (top recipes)
      return appRecipes.indexOf(recipe) < 6; // Top 6 recipes
    });
  };

  const getRecipesByMealType = (mealType: string) => {
    return appRecipes.filter(recipe => recipe.mealType === mealType);
  };

  return {
    appRecipes,
    loading,
    error,
    getFeaturedRecipes,
    getRecipesByMealType,
    refreshRecipes: loadAppRecipes,
  };
}