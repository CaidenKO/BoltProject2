import React, { useState } from 'react';
import {
  Home,
  User,
  Briefcase,
  Mail,
  Settings,
  CreditCard,
  ShoppingBag,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCartClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onCartClick,
}) => {
  const { settings } = useTheme();
  const { getItemCount } = useCart();
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <nav className="bg-themed-primary shadow-themed-lg border-b border-themed">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold gradient-text">
                  Caiden's Gaming Designer Website
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={onCartClick}
                  className="relative p-2 text-themed-secondary hover:text-themed-primary hover:bg-themed-tertiary rounded-lg transition-all duration-300 hover:scale-110"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {getItemCount()}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-themed-secondary hidden md:block">
                      {user.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-2 px-3 py-2 text-themed-secondary hover:text-themed-primary hover:bg-themed-tertiary rounded-lg transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="hidden md:inline">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-all duration-300 hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                          activeTab === tab.id
                            ? 'bg-accent-secondary text-white shadow-themed-lg'
                            : 'text-themed-secondary hover:text-themed-primary hover:bg-themed-tertiary'
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-themed-secondary">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-accent-secondary text-white'
                      : 'text-themed-secondary hover:text-themed-primary hover:bg-themed-tertiary'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
