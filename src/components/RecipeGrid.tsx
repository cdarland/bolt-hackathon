import React, { useState } from 'react';
import { Search, Filter, Plus, Star, Sparkles } from 'lucide-react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import AddRecipeModal from './AddRecipeModal';
import { useAppRecipes } from '../hooks/useAppRecipes';

interface RecipeGridProps {
  recipes: Recipe[];
  onAddRecipe?: (recipe: Recipe) => void;
}

export default function RecipeGrid({ recipes, onAddRecipe }: RecipeGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [kidFriendlyOnly, setKidFriendlyOnly] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { getFeaturedRecipes } = useAppRecipes();

  const cuisines = [...new Set(recipes.map(r => r.cuisine))].filter(Boolean);
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    const matchesTime = !maxTime || (recipe.prepTime + recipe.cookTime) <= parseInt(maxTime);
    const matchesKidFriendly = !kidFriendlyOnly || recipe.kidFriendly;

    return matchesSearch && matchesCuisine && matchesDifficulty && matchesTime && matchesKidFriendly;
  });

  // Get featured recipes if the filter is active
  const displayRecipes = showFeaturedOnly ? getFeaturedRecipes().filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    const matchesTime = !maxTime || (recipe.prepTime + recipe.cookTime) <= parseInt(maxTime);
    const matchesKidFriendly = !kidFriendlyOnly || recipe.kidFriendly;

    return matchesSearch && matchesCuisine && matchesDifficulty && matchesTime && matchesKidFriendly;
  }) : filteredRecipes;

  const handleAddRecipe = (recipe: Recipe) => {
    if (onAddRecipe) {
      onAddRecipe(recipe);
    }
    setShowAddRecipeModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">Recipe Collection</h2>
            {showFeaturedOnly && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-600 fill-current" />
                <span className="text-sm font-medium text-yellow-800">Featured</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAddRecipeModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Recipe</span>
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Featured Filter */}
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                showFeaturedOnly
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-400 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Featured</span>
            </button>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            {/* Time Filter */}
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Any Time</option>
              <option value="15">Under 15 min</option>
              <option value="30">Under 30 min</option>
              <option value="45">Under 45 min</option>
              <option value="60">Under 1 hour</option>
            </select>

            {/* Kid-Friendly Filter */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={kidFriendlyOnly}
                onChange={(e) => setKidFriendlyOnly(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Kid-Friendly</span>
            </label>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {displayRecipes.length} of {recipes.length} recipes
            {showFeaturedOnly && <span className="text-yellow-600 font-medium"> (Featured)</span>}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>Filters applied</span>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={(recipe) => console.log('Selected recipe:', recipe)}
          />
        ))}
      </div>

      {displayRecipes.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('');
                  setSelectedDifficulty('');
                  setMaxTime('');
                  setKidFriendlyOnly(false);
                  setShowFeaturedOnly(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear filters
              </button>
              <button
                onClick={() => setShowAddRecipeModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <AddRecipeModal
          isOpen={showAddRecipeModal}
          onClose={() => setShowAddRecipeModal(false)}
          onSave={handleAddRecipe}
        />
      )}
    </div>
  );
}