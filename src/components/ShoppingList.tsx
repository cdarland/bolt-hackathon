import React, { useState } from 'react';
import { ShoppingCart, Check, Plus, Trash2, Apple } from 'lucide-react';
import { Recipe, ShoppingListItem, Ingredient } from '../types';

interface ShoppingListProps {
  recipes: Recipe[];
}

export default function ShoppingList({ recipes }: ShoppingListProps) {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const generateShoppingList = () => {
    const ingredientMap = new Map<string, ShoppingListItem>();

    selectedRecipes.forEach(recipeId => {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;

      recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.ingredient.amount += ingredient.amount;
          existing.recipes.push(recipe.name);
        } else {
          ingredientMap.set(key, {
            ingredient: { ...ingredient },
            recipes: [recipe.name],
            purchased: false
          });
        }
      });
    });

    setShoppingList(Array.from(ingredientMap.values()));
  };

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const toggleItemPurchased = (index: number) => {
    setShoppingList(prev => prev.map((item, i) => 
      i === index ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const addCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeCustomItem = (index: number) => {
    setCustomItems(prev => prev.filter((_, i) => i !== index));
  };

  const categoryOrder = ['protein', 'dairy', 'vegetable', 'fruit', 'grain', 'pantry', 'spice'];
  const groupedItems = shoppingList.reduce((acc, item) => {
    const category = item.ingredient.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const getCategoryIcon = (category: string) => {
    const icons = {
      protein: '🥩',
      dairy: '🥛',
      vegetable: '🥬',
      fruit: '🍎',
      grain: '🌾',
      pantry: '🏺',
      spice: '🧂'
    };
    return icons[category as keyof typeof icons] || '📦';
  };

  const completedItems = shoppingList.filter(item => item.purchased).length;
  const totalItems = shoppingList.length + customItems.length;
  const progress = totalItems > 0 ? ((completedItems + customItems.length) / totalItems) * 100 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recipe Selection */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shopping List Generator</h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Recipes to Cook</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recipes.map(recipe => (
                <label key={recipe.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRecipes.includes(recipe.id)}
                    onChange={() => toggleRecipeSelection(recipe.id)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{recipe.name}</p>
                    <p className="text-sm text-gray-500">{recipe.servings} servings • {recipe.prepTime + recipe.cookTime}min</p>
                  </div>
                </label>
              ))}
            </div>
            
            <button
              onClick={generateShoppingList}
              disabled={selectedRecipes.length === 0}
              className="w-full mt-4 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Generate Shopping List ({selectedRecipes.length} recipes)
            </button>
          </div>
        </div>

        {/* Shopping List */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Shopping List</h3>
              {totalItems > 0 && (
                <div className="text-sm text-gray-600">
                  {completedItems} of {totalItems} items
                </div>
              )}
            </div>

            {totalItems > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {shoppingList.length > 0 ? (
              <div className="space-y-6">
                {categoryOrder.map(category => {
                  const items = groupedItems[category];
                  if (!items) return null;

                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        <span className="capitalize">{category}</span>
                        <span className="text-sm text-gray-500">({items.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                              item.purchased 
                                ? 'bg-green-50 border-green-200 opacity-75' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <button
                              onClick={() => toggleItemPurchased(shoppingList.indexOf(item))}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                item.purchased
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {item.purchased && <Check className="h-3 w-3" />}
                            </button>
                            <div className="flex-1">
                              <p className={`font-medium ${item.purchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.ingredient.amount} {item.ingredient.unit} {item.ingredient.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                For: {item.recipes.join(', ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Custom Items */}
                {customItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span className="text-lg">📝</span>
                      <span>Custom Items</span>
                      <span className="text-sm text-gray-500">({customItems.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {customItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border bg-white border-gray-200">
                          <div className="w-5 h-5 rounded border-2 border-gray-300 bg-green-500 flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="flex-1 text-gray-900">{item}</span>
                          <button
                            onClick={() => removeCustomItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Custom Item */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                    placeholder="Add custom item..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    onClick={addCustomItem}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select recipes to generate your shopping list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}