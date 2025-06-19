import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MealPlanner from './components/MealPlanner';
import RecipeGrid from './components/RecipeGrid';
import ShoppingList from './components/ShoppingList';
import NutritionTracker from './components/NutritionTracker';
import FavoritesView from './components/FavoritesView';
import WelcomeDashboard from './components/WelcomeDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useUserRecipes } from './hooks/useUserRecipes';
import { useAppRecipes } from './hooks/useAppRecipes';
import { Recipe } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();
  const { userRecipes, saveRecipe } = useUserRecipes();
  const { appRecipes, loading: appRecipesLoading } = useAppRecipes();

  // Set default tab based on user status
  useEffect(() => {
    if (!loading) {
      if (user && activeTab === 'dashboard') {
        // Keep dashboard as default for logged-in users
      } else if (!user && activeTab === 'dashboard') {
        // Redirect non-logged-in users to planner
        setActiveTab('planner');
      }
    }
  }, [user, loading, activeTab]);

  // Combine app recipes with user recipes
  const allRecipes = [...appRecipes, ...userRecipes];

  const handleAddRecipe = (newRecipe: Recipe) => {
    if (user) {
      saveRecipe(newRecipe);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    console.log('Selected recipe:', recipe);
  };

  const handleTabChange = (tab: string) => {
    // If user is not logged in and tries to access user-specific tabs, redirect to planner
    if (!user && ['favorites', 'dashboard'].includes(tab)) {
      setActiveTab('planner');
      return;
    }
    setActiveTab(tab);
  };

  const renderActiveTab = () => {
    // Show dashboard for logged-in users by default
    if (user && activeTab === 'dashboard') {
      return <WelcomeDashboard onNavigate={setActiveTab} />;
    }

    switch (activeTab) {
      case 'planner':
        return <MealPlanner recipes={allRecipes} onAddRecipe={handleAddRecipe} />;
      case 'recipes':
        return <RecipeGrid recipes={allRecipes} onAddRecipe={handleAddRecipe} />;
      case 'shopping':
        return <ShoppingList recipes={allRecipes} />;
      case 'nutrition':
        return <NutritionTracker recipes={allRecipes} />;
      case 'favorites':
        return user ? <FavoritesView recipes={allRecipes} onSelectRecipe={handleSelectRecipe} /> : <MealPlanner recipes={allRecipes} onAddRecipe={handleAddRecipe} />;
      default:
        return user ? <WelcomeDashboard onNavigate={setActiveTab} /> : <MealPlanner recipes={allRecipes} onAddRecipe={handleAddRecipe} />;
    }
  };

  if (loading || appRecipesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FamilyPrep...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="pb-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;