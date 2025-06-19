import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Recipe } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import RecipeCard from './RecipeCard';

interface FavoritesViewProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function FavoritesView({ recipes, onSelectRecipe }: FavoritesViewProps) {
  const { favorites, loading } = useFavorites();

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <Heart className="h-6 w-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Favorite Recipes</h2>
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
          {favoriteRecipes.length}
        </span>
      </div>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">
              Start adding recipes to your favorites by clicking the heart icon on any recipe card
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>Discover amazing recipes to save</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}