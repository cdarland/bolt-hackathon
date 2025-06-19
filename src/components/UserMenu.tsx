import React, { useState } from 'react';
import { User, Settings, Heart, LogOut, ChevronDown, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserMenuProps {
  onNavigateToFavorites?: () => void;
}

export default function UserMenu({ onNavigateToFavorites }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleFavoritesClick = () => {
    if (onNavigateToFavorites) {
      onNavigateToFavorites();
    }
    setIsOpen(false);
  };

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {displayName}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">Member since {joinDate}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online
                </div>
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Premium User
                </div>
              </div>
            </div>
            
            <div className="py-1">
              <button 
                onClick={handleFavoritesClick}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Heart className="h-4 w-4 text-red-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Favorite Recipes</div>
                  <div className="text-xs text-gray-500">Your saved favorites</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">My Recipes</div>
                  <div className="text-xs text-gray-500">Your created recipes</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 text-purple-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Meal History</div>
                  <div className="text-xs text-gray-500">Past meal plans</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Nutrition Stats</div>
                  <div className="text-xs text-gray-500">Your health insights</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 text-gray-500" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Account Settings</div>
                  <div className="text-xs text-gray-500">Preferences & privacy</div>
                </div>
              </button>
            </div>
            
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-red-400">See you soon!</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}