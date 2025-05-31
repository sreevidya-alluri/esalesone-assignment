import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Checkout from './components/Checkout'
import ThankYou from './components/Thankyou'
import { CartProvider } from './context/CartContext' // <-- Import the provider

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductItemDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you/:orderId" element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
