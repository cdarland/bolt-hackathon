import React from 'react';
import { TrendingUp, Target, Award, Apple } from 'lucide-react';
import { Recipe } from '../types';

interface NutritionTrackerProps {
  recipes: Recipe[];
}

export default function NutritionTracker({ recipes }: NutritionTrackerProps) {
  // Calculate average nutrition from all recipes
  const avgNutrition = recipes.reduce(
    (acc, recipe) => ({
      calories: acc.calories + recipe.nutrition.calories,
      protein: acc.protein + recipe.nutrition.protein,
      carbs: acc.carbs + recipe.nutrition.carbs,
      fat: acc.fat + recipe.nutrition.fat,
      fiber: acc.fiber + recipe.nutrition.fiber,
      sugar: acc.sugar + recipe.nutrition.sugar,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );

  Object.keys(avgNutrition).forEach(key => {
    avgNutrition[key as keyof typeof avgNutrition] /= recipes.length;
  });

  const dailyTargets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
    sugar: 50
  };

  const getNutritionColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage < 50) return 'text-red-500 bg-red-100';
    if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const nutritionItems = [
    { key: 'calories', label: 'Calories', unit: 'kcal', icon: '🔥' },
    { key: 'protein', label: 'Protein', unit: 'g', icon: '💪' },
    { key: 'carbs', label: 'Carbs', unit: 'g', icon: '🌾' },
    { key: 'fat', label: 'Fat', unit: 'g', icon: '🥑' },
    { key: 'fiber', label: 'Fiber', unit: 'g', icon: '🌿' },
    { key: 'sugar', label: 'Sugar', unit: 'g', icon: '🍯' }
  ];

  const topRecipesByNutrition = {
    protein: [...recipes].sort((a, b) => b.nutrition.protein - a.nutrition.protein).slice(0, 3),
    fiber: [...recipes].sort((a, b) => b.nutrition.fiber - a.nutrition.fiber).slice(0, 3),
    lowCalorie: [...recipes].sort((a, b) => a.nutrition.calories - b.nutrition.calories).slice(0, 3)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <TrendingUp className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Nutrition Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nutrition Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Recipe Nutrition</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutritionItems.map(item => {
                const value = avgNutrition[item.key as keyof typeof avgNutrition];
                const target = dailyTargets[item.key as keyof typeof dailyTargets];
                const percentage = (value / target) * 100;
                
                return (
                  <div key={item.key} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNutritionColor(value, target)}`}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{Math.round(value)} {item.unit}</span>
                      <span>Target: {target} {item.unit}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 80 ? 'bg-green-500' : 
                          percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Nutrition Goals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Nutrition Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800">Balanced Meals</h4>
                <p className="text-sm text-green-600 mt-1">5+ servings of vegetables daily</p>
                <div className="mt-2 text-2xl font-bold text-green-700">85%</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800">Protein Goal</h4>
                <p className="text-sm text-blue-600 mt-1">150g protein daily</p>
                <div className="mt-2 text-2xl font-bold text-blue-700">92%</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <Apple className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-800">Fiber Intake</h4>
                <p className="text-sm text-purple-600 mt-1">25g fiber daily</p>
                <div className="mt-2 text-2xl font-bold text-purple-700">78%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Recipes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Nutrition Champions</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <span>💪</span>
                  <span>High Protein</span>
                </h4>
                <div className="space-y-2">
                  {topRecipesByNutrition.protein.map((recipe, index) => (
                    <div key={recipe.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </span>
                      <img src={recipe.imageUrl} alt={recipe.name} className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{recipe.name}</p>
                        <p className="text-xs text-gray-500">{recipe.nutrition.protein}g protein</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <span>🌿</span>
                  <span>High Fiber</span>
                </h4>
                <div className="space-y-2">
                  {topRecipesByNutrition.fiber.map((recipe, index) => (
                    <div key={recipe.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </span>
                      <img src={recipe.imageUrl} alt={recipe.name} className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{recipe.name}</p>
                        <p className="text-xs text-gray-500">{recipe.nutrition.fiber}g fiber</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                  <span>🔥</span>
                  <span>Low Calorie</span>
                </h4>
                <div className="space-y-2">
                  {topRecipesByNutrition.lowCalorie.map((recipe, index) => (
                    <div key={recipe.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </span>
                      <img src={recipe.imageUrl} alt={recipe.name} className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{recipe.name}</p>
                        <p className="text-xs text-gray-500">{recipe.nutrition.calories} cal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Tips */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Today's Nutrition Tip</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Try to include a variety of colorful vegetables in your meals. Different colors provide different 
              nutrients and antioxidants that support your family's health. Aim for at least 3 different colored 
              vegetables per meal!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}