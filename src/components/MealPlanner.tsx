import React, { useState } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Shuffle, Sparkles, X, Cloud, User } from 'lucide-react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import AddRecipeModal from './AddRecipeModal';
import { useMealPlan } from '../hooks/useMealPlan';
import { useAuth } from '../contexts/AuthContext';

interface MealPlannerProps {
  recipes: Recipe[];
  onAddRecipe?: (recipe: Recipe) => void;
}

export default function MealPlanner({ recipes, onAddRecipe }: MealPlannerProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<{ day: number; mealType: string } | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  
  const { user } = useAuth();
  const { mealPlan, loading, saving, updateMealPlan, changeWeek } = useMealPlan();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'lunch', label: 'Lunch', color: 'bg-blue-50 border-blue-200' },
    { key: 'dinner', label: 'Dinner', color: 'bg-purple-50 border-purple-200' }
  ];

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const navigateWeek = async (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
    
    if (user) {
      await changeWeek(newWeek);
    }
  };

  const handleMealSelect = (recipe: Recipe) => {
    if (selectedMeal) {
      const key = `${selectedMeal.day}-${selectedMeal.mealType}`;
      updateMealPlan(key, recipe);
      setSelectedMeal(null);
    }
  };

  const getMealForSlot = (day: number, mealType: string) => {
    const key = `${day}-${mealType}`;
    return mealPlan[key];
  };

  const clearMealSlot = (day: number, mealType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${day}-${mealType}`;
    updateMealPlan(key, null);
  };

  const handleAddRecipe = (recipe: Recipe) => {
    if (onAddRecipe) {
      onAddRecipe(recipe);
    }
    setShowAddRecipeModal(false);
    
    if (selectedMeal) {
      handleMealSelect(recipe);
    }
  };

  const surpriseMe = async () => {
    if (!user) {
      setShowSignUpPrompt(true);
      return;
    }

    setIsGenerating(true);
    
    // Add a delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get recipes by meal type
    const breakfastRecipes = recipes.filter(r => r.mealType === 'breakfast');
    const lunchRecipes = recipes.filter(r => r.mealType === 'lunch');
    const dinnerRecipes = recipes.filter(r => r.mealType === 'dinner');
    
    // Fill all 7 days with all 3 meal types
    for (let day = 0; day < 7; day++) {
      // Add breakfast
      if (breakfastRecipes.length > 0) {
        const randomBreakfast = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
        updateMealPlan(`${day}-breakfast`, randomBreakfast);
      }
      
      // Add lunch
      if (lunchRecipes.length > 0) {
        const randomLunch = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
        updateMealPlan(`${day}-lunch`, randomLunch);
      }
      
      // Add dinner
      if (dinnerRecipes.length > 0) {
        const randomDinner = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
        updateMealPlan(`${day}-dinner`, randomDinner);
      }
    }
    
    setIsGenerating(false);
  };

  const clearMealPlan = () => {
    Object.keys(mealPlan).forEach(key => {
      updateMealPlan(key, null);
    });
  };

  const getFilteredRecipes = () => {
    if (!selectedMeal) return [];
    return recipes.filter(recipe => recipe.mealType === selectedMeal.mealType);
  };

  const hasAnyMeals = Object.keys(mealPlan).length > 0;
  const hasRecipes = recipes.length > 0;

  const weekDates = getWeekDates();
  const filteredRecipes = getFilteredRecipes();

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Planner</h2>
          {user && saving && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Cloud className="h-4 w-4 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Surprise Me Button - positioned discretely next to calendar controls */}
          {hasRecipes && user && (
            <button
              onClick={surpriseMe}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  <span className="hidden sm:inline">Surprise Me</span>
                </>
              )}
            </button>
          )}
          
          {/* Clear All Button */}
          {hasAnyMeals && (
            <button
              onClick={clearMealPlan}
              className="flex items-center space-x-1 px-2 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
              title="Clear all meals"
            >
              <Shuffle className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">Clear</span>
            </button>
          )}
          
          {/* Calendar Navigation */}
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-lg font-medium text-gray-700 min-w-[140px] text-center">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Save Your Meal Plans Forever!</h3>
              <p className="text-blue-800 text-sm mb-4">
                Sign up to automatically save your meal plans, favorites, and recipes. Never lose your planning again!
              </p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Auto-save meal plans</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sync across devices</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Save favorites</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Your Week</h3>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-8 bg-gray-50">
              <div className="p-3 text-sm font-medium text-gray-600">Meal</div>
              {daysOfWeek.map((day, index) => (
                <div key={day} className="p-3 text-sm font-medium text-gray-600 text-center">
                  <div>{day.slice(0, 3)}</div>
                  <div className="text-xs text-gray-400">
                    {weekDates[index].getDate()}
                  </div>
                </div>
              ))}
            </div>
            
            {mealTypes.map((mealType) => (
              <div key={mealType.key} className="grid grid-cols-8 border-t border-gray-100">
                <div className={`p-3 text-sm font-medium text-gray-700 ${mealType.color} border-r border-gray-100`}>
                  {mealType.label}
                </div>
                {weekDates.map((_, dayIndex) => {
                  const meal = getMealForSlot(dayIndex, mealType.key);
                  const isSelected = selectedMeal?.day === dayIndex && selectedMeal?.mealType === mealType.key;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`p-2 border-r border-gray-100 min-h-[80px] cursor-pointer transition-all duration-200 relative group ${
                        isSelected ? 'bg-orange-100 ring-2 ring-orange-400' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMeal({ day: dayIndex, mealType: mealType.key })}
                    >
                      {meal ? (
                        <div className="bg-white rounded-lg p-2 shadow-sm h-full relative">
                          <div className="text-xs font-medium text-gray-900 line-clamp-2 pr-6">
                            {meal.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {meal.prepTime + meal.cookTime}min
                          </div>
                          
                          <button
                            onClick={(e) => clearMealSlot(dayIndex, mealType.key, e)}
                            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            title="Remove meal"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Plus className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedMeal 
                ? `Choose ${selectedMeal.mealType} for ${daysOfWeek[selectedMeal.day]}`
                : 'Select a meal slot to add recipes'
              }
            </h3>
            
            {selectedMeal && (
              <button
                onClick={() => setShowAddRecipeModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add Recipe</span>
              </button>
            )}
          </div>
          
          {selectedMeal ? (
            <div className="space-y-4">
              <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                {filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className="transform scale-90">
                    <RecipeCard
                      recipe={recipe}
                      onSelect={handleMealSelect}
                    />
                  </div>
                ))}
                
                {filteredRecipes.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No {selectedMeal.mealType} recipes yet</p>
                    <button
                      onClick={() => setShowAddRecipeModal(true)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Create Your First Recipe
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              {!hasRecipes ? (
                <>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No recipes available yet</p>
                  <button
                    onClick={() => setShowAddRecipeModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    Add Your First Recipe
                  </button>
                </>
              ) : (
                <>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click on any meal slot to start planning</p>
                  {user && (
                    <p className="text-sm text-gray-500">Or use "Surprise Me" to auto-fill your entire week!</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddRecipeModal && (
        <AddRecipeModal
          isOpen={showAddRecipeModal}
          onClose={() => setShowAddRecipeModal(false)}
          onSave={handleAddRecipe}
          defaultMealType={selectedMeal?.mealType}
        />
      )}

      {/* Sign Up Prompt Modal for non-logged-in users trying to use Surprise Me */}
      {showSignUpPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up to Use Surprise Me!</h3>
              <p className="text-gray-600 mb-6">
                Create an account to automatically generate meal plans and save them forever.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSignUpPrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowSignUpPrompt(false);
                    // This would trigger the auth modal in a real implementation
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}