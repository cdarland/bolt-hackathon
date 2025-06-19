import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Mediterranean Chicken Bowl',
    description: 'A colorful, nutrient-packed bowl with grilled chicken, quinoa, and fresh vegetables',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    dietaryTags: ['Gluten-Free', 'High-Protein'],
    kidFriendly: true,
    mealType: 'dinner',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    ingredients: [
      { id: '1', name: 'Chicken Breast', amount: 1, unit: 'lb', category: 'protein' },
      { id: '2', name: 'Quinoa', amount: 1, unit: 'cup', category: 'grain' },
      { id: '3', name: 'Cherry Tomatoes', amount: 2, unit: 'cups', category: 'vegetable' },
      { id: '4', name: 'Cucumber', amount: 1, unit: 'large', category: 'vegetable' },
      { id: '5', name: 'Red Onion', amount: 0.5, unit: 'medium', category: 'vegetable' },
      { id: '6', name: 'Feta Cheese', amount: 0.5, unit: 'cup', category: 'dairy' },
      { id: '7', name: 'Olive Oil', amount: 3, unit: 'tbsp', category: 'pantry' },
      { id: '8', name: 'Lemon', amount: 1, unit: 'large', category: 'fruit' }
    ],
    nutrition: {
      calories: 485,
      protein: 35,
      carbs: 42,
      fat: 18,
      fiber: 6,
      sugar: 8
    },
    instructions: [
      'Cook quinoa according to package directions',
      'Season and grill chicken breast until cooked through',
      'Dice vegetables and prepare dressing',
      'Assemble bowls with quinoa, chicken, and vegetables',
      'Drizzle with olive oil and lemon dressing'
    ]
  },
  {
    id: '2',
    name: 'Veggie-Packed Mac & Cheese',
    description: 'Kid-friendly mac and cheese secretly loaded with butternut squash and cauliflower',
    prepTime: 10,
    cookTime: 20,
    servings: 6,
    difficulty: 'Easy',
    cuisine: 'American',
    dietaryTags: ['Vegetarian', 'Kid-Friendly'],
    kidFriendly: true,
    mealType: 'dinner',
    imageUrl: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
    ingredients: [
      { id: '9', name: 'Whole Wheat Pasta', amount: 12, unit: 'oz', category: 'grain' },
      { id: '10', name: 'Butternut Squash', amount: 2, unit: 'cups', category: 'vegetable' },
      { id: '11', name: 'Cauliflower', amount: 1, unit: 'cup', category: 'vegetable' },
      { id: '12', name: 'Cheddar Cheese', amount: 2, unit: 'cups', category: 'dairy' },
      { id: '13', name: 'Milk', amount: 1, unit: 'cup', category: 'dairy' },
      { id: '14', name: 'Butter', amount: 2, unit: 'tbsp', category: 'dairy' }
    ],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 45,
      fat: 12,
      fiber: 5,
      sugar: 8
    },
    instructions: [
      'Steam butternut squash and cauliflower until tender',
      'Cook pasta according to package directions',
      'Blend steamed vegetables with milk until smooth',
      'Mix pasta with vegetable puree and cheese',
      'Bake until bubbly and golden'
    ]
  },
  {
    id: '3',
    name: 'Asian Lettuce Wraps',
    description: 'Fresh, crunchy lettuce wraps filled with seasoned ground turkey and vegetables',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Asian',
    dietaryTags: ['Low-Carb', 'Gluten-Free'],
    kidFriendly: true,
    mealType: 'lunch',
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    ingredients: [
      { id: '15', name: 'Ground Turkey', amount: 1, unit: 'lb', category: 'protein' },
      { id: '16', name: 'Butter Lettuce', amount: 2, unit: 'heads', category: 'vegetable' },
      { id: '17', name: 'Carrots', amount: 2, unit: 'medium', category: 'vegetable' },
      { id: '18', name: 'Bell Pepper', amount: 1, unit: 'large', category: 'vegetable' },
      { id: '19', name: 'Green Onions', amount: 4, unit: 'stalks', category: 'vegetable' },
      { id: '20', name: 'Ginger', amount: 1, unit: 'tbsp', category: 'spice' },
      { id: '21', name: 'Garlic', amount: 3, unit: 'cloves', category: 'spice' },
      { id: '22', name: 'Soy Sauce', amount: 3, unit: 'tbsp', category: 'pantry' }
    ],
    nutrition: {
      calories: 245,
      protein: 28,
      carbs: 12,
      fat: 10,
      fiber: 4,
      sugar: 6
    },
    instructions: [
      'Cook ground turkey with garlic and ginger',
      'Add diced vegetables and stir-fry',
      'Season with soy sauce and other seasonings',
      'Wash and separate lettuce leaves',
      'Serve turkey mixture in lettuce cups'
    ]
  },
  {
    id: '4',
    name: 'Overnight Berry Oats',
    description: 'Make-ahead breakfast with oats, yogurt, and fresh berries',
    prepTime: 5,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'American',
    dietaryTags: ['Vegetarian', 'Make-Ahead'],
    kidFriendly: true,
    mealType: 'breakfast',
    imageUrl: 'https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg',
    ingredients: [
      { id: '23', name: 'Rolled Oats', amount: 2, unit: 'cups', category: 'grain' },
      { id: '24', name: 'Greek Yogurt', amount: 1, unit: 'cup', category: 'dairy' },
      { id: '25', name: 'Mixed Berries', amount: 2, unit: 'cups', category: 'fruit' },
      { id: '26', name: 'Honey', amount: 4, unit: 'tbsp', category: 'pantry' },
      { id: '27', name: 'Chia Seeds', amount: 2, unit: 'tbsp', category: 'pantry' },
      { id: '28', name: 'Vanilla Extract', amount: 1, unit: 'tsp', category: 'pantry' }
    ],
    nutrition: {
      calories: 285,
      protein: 12,
      carbs: 52,
      fat: 5,
      fiber: 8,
      sugar: 28
    },
    instructions: [
      'Mix oats, yogurt, and chia seeds',
      'Add honey and vanilla extract',
      'Layer with berries in jars',
      'Refrigerate overnight',
      'Enjoy cold in the morning'
    ]
  },
  {
    id: '5',
    name: 'Sheet Pan Salmon & Vegetables',
    description: 'One-pan dinner with salmon, sweet potatoes, and broccoli',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'American',
    dietaryTags: ['Gluten-Free', 'Omega-3 Rich'],
    kidFriendly: true,
    mealType: 'dinner',
    imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    ingredients: [
      { id: '29', name: 'Salmon Fillets', amount: 4, unit: 'pieces', category: 'protein' },
      { id: '30', name: 'Sweet Potatoes', amount: 2, unit: 'large', category: 'vegetable' },
      { id: '31', name: 'Broccoli', amount: 4, unit: 'cups', category: 'vegetable' },
      { id: '32', name: 'Olive Oil', amount: 3, unit: 'tbsp', category: 'pantry' },
      { id: '33', name: 'Lemon', amount: 1, unit: 'large', category: 'fruit' },
      { id: '34', name: 'Garlic Powder', amount: 1, unit: 'tsp', category: 'spice' }
    ],
    nutrition: {
      calories: 385,
      protein: 32,
      carbs: 28,
      fat: 18,
      fiber: 6,
      sugar: 12
    },
    instructions: [
      'Preheat oven to 425°F',
      'Cut sweet potatoes into cubes',
      'Toss vegetables with olive oil and seasonings',
      'Add salmon to sheet pan',
      'Bake for 20-25 minutes until cooked through'
    ]
  },
  {
    id: '6',
    name: 'Rainbow Veggie Quesadillas',
    description: 'Colorful quesadillas packed with cheese and hidden vegetables',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mexican',
    dietaryTags: ['Vegetarian', 'Kid-Friendly'],
    kidFriendly: true,
    mealType: 'lunch',
    imageUrl: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg',
    ingredients: [
      { id: '35', name: 'Whole Wheat Tortillas', amount: 8, unit: 'pieces', category: 'grain' },
      { id: '36', name: 'Cheese Blend', amount: 2, unit: 'cups', category: 'dairy' },
      { id: '37', name: 'Bell Peppers', amount: 2, unit: 'medium', category: 'vegetable' },
      { id: '38', name: 'Zucchini', amount: 1, unit: 'medium', category: 'vegetable' },
      { id: '39', name: 'Corn', amount: 1, unit: 'cup', category: 'vegetable' },
      { id: '40', name: 'Black Beans', amount: 1, unit: 'cup', category: 'protein' }
    ],
    nutrition: {
      calories: 325,
      protein: 18,
      carbs: 38,
      fat: 12,
      fiber: 8,
      sugar: 6
    },
    instructions: [
      'Sauté vegetables until tender',
      'Fill tortillas with cheese and vegetables',
      'Cook quesadillas in a pan until golden',
      'Cut into triangles and serve',
      'Serve with salsa and guacamole'
    ]
  }
];