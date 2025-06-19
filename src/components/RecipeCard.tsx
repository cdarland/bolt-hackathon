import React from 'react';
import { Clock, Users, Star, Heart } from 'lucide-react';
import { Recipe } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  isSelected?: boolean;
}

export default function RecipeCard({ recipe, onSelect, isSelected = false }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(recipe.id);
    }
  };

  const isRecipeFavorite = user ? isFavorite(recipe.id) : false;

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden ${
        isSelected ? 'ring-2 ring-orange-400 shadow-lg' : ''
      }`}
      onClick={() => onSelect(recipe)}
    >
      <div className="relative">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          {recipe.kidFriendly && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Kid-Friendly
            </span>
          )}
          {user && (
            <button 
              onClick={handleFavoriteClick}
              className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isRecipeFavorite 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-600 hover:text-red-500'
                }`} 
              />
            </button>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {recipe.name}
          </h3>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs text-gray-600 ml-1">4.8</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{totalTime}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings}</span>
            </div>
          </div>
          <span className="text-orange-600 font-medium">{recipe.cuisine}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.dietaryTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{recipe.nutrition.calories} cal</span>
            <span>{recipe.nutrition.protein}g protein</span>
            <span>{recipe.nutrition.fiber}g fiber</span>
          </div>
        </div>
      </div>
    </div>
  );
}