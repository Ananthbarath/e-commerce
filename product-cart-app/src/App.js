import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import { CartProvider } from './context/CartContext';
import "./App.css"

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
