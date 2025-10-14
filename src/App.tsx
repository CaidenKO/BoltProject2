import React, { useState } from 'react';
import Navigation from './components/Navigation';
import TabContent from './components/TabContent';
import Cart from './components/Cart';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-themed-secondary">
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCartClick={() => setIsCartOpen(true)}
            />
            <TabContent activeTab={activeTab} />
            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;