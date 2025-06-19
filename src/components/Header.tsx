import React, { useState } from 'react';
import { ChefHat, Calendar, ShoppingCart, TrendingUp, User, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
    { id: 'nutrition', label: 'Nutrition', icon: TrendingUp }
  ];

  // Add favorites tab only for logged-in users
  if (user) {
    tabs.push({ id: 'favorites', label: 'Favorites', icon: Heart });
  }

  const handleNavigateToFavorites = () => {
    onTabChange('favorites');
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-xl">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FamilyPrep</h1>
                <p className="text-xs text-gray-500">
                  {user ? `Welcome back, ${user.user_metadata?.full_name || user.email?.split('@')[0]}!` : 'Smart meal planning for busy families'}
                </p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
              
              <div className="ml-4 pl-4 border-l border-gray-200">
                {user ? (
                  <UserMenu onNavigateToFavorites={handleNavigateToFavorites} />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">Sign In</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {!user && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  );
}