import React, { useState } from 'react'

const CartContext = React.createContext()

export const CartProvider = ({ children }) => {
  const [cartList, setCartList] = useState([])

  const addCartItem = product => {
    setCartList(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      }
      return [...prev, product]
    })
  }

  const removeCartItem = id => {
    setCartList(prev => prev.filter(item => item.id !== id))
  }

  const incrementCartItemQuantity = id => {
    setCartList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrementCartItemQuantity = id => {
    setCartList(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const removeAllCartItems = () => {
    setCartList([])
  }

  return (
    <CartContext.Provider
      value={{
       cartItems:  cartList,
        addCartItem,
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        clearCart: removeAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
