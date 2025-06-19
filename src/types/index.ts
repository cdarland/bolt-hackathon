export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  dietaryTags: string[];
  kidFriendly: boolean;
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  instructions: string[];
  imageUrl: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'protein' | 'vegetable' | 'fruit' | 'grain' | 'dairy' | 'pantry' | 'spice';
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface MealPlan {
  id: string;
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks: Recipe[];
}

export interface ShoppingListItem {
  ingredient: Ingredient;
  recipes: string[];
  purchased: boolean;
}