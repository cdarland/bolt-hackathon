import React from 'react';
import { Calendar, Heart, ChefHat, TrendingUp, Sparkles, Clock, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useMealPlan } from '../hooks/useMealPlan';
import { useUserRecipes } from '../hooks/useUserRecipes';

interface WelcomeDashboardProps {
  onNavigate: (tab: string) => void;
}

export default function WelcomeDashboard({ onNavigate }: WelcomeDashboardProps) {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { mealPlan } = useMealPlan();
  const { userRecipes } = useUserRecipes();

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const plannedMeals = Object.keys(mealPlan).length;
  const favoriteCount = favorites.length;
  const recipeCount = userRecipes.length;

  const quickActions = [
    {
      title: 'Plan This Week',
      description: 'Create your weekly meal plan',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('planner'),
      count: plannedMeals,
      countLabel: 'meals planned'
    },
    {
      title: 'Browse Recipes',
      description: 'Discover new recipes to try',
      icon: ChefHat,
      color: 'from-orange-500 to-orange-600',
      action: () => onNavigate('recipes'),
      count: recipeCount,
      countLabel: 'your recipes'
    },
    {
      title: 'View Favorites',
      description: 'Your saved favorite recipes',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      action: () => onNavigate('favorites'),
      count: favoriteCount,
      countLabel: 'favorites'
    },
    {
      title: 'Nutrition Tracker',
      description: 'Monitor your nutrition goals',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      action: () => onNavigate('nutrition'),
      count: null,
      countLabel: 'insights'
    }
  ];

  const recentActivity = [
    { action: 'Added Mediterranean Chicken Bowl to favorites', time: '2 hours ago', icon: Heart },
    { action: 'Planned meals for this week', time: '1 day ago', icon: Calendar },
    { action: 'Created new recipe: Veggie Pasta', time: '3 days ago', icon: ChefHat },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-gray-600">
              Ready to plan some delicious meals? Here's what's happening with your account.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-4 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meals Planned</p>
              <p className="text-2xl font-bold text-gray-900">{plannedMeals}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorite Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{favoriteCount}</p>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{recipeCount}</p>
            </div>
            <ChefHat className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Days Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 text-left group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {action.count !== null && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{action.count}</p>
                        <p className="text-xs text-gray-500">{action.countLabel}</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 text-center">
                🎉 You're doing great! Keep up the healthy meal planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}