import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Header from '../Header'
import CartContext from '../../context/CartContext'

import './index.css'

const ProductItemDetails = () => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const { addCartItem } = useContext(CartContext)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        setProduct({
          id: data.id,
          title: data.title,
          brand: data.brand,
          price: data.price,
          imageUrl: data.image_url,
          rating: parseFloat(data.rating),
        })
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addCartItem({ ...product, quantity })
    navigate('/checkout')
  }

  if (loading) return <div>Loading...</div>
  if (error || !product) return <div>Failed to load product.</div>

  return (
    <>
      <Header />
      <div className="product-details-container">
        <img src={product.imageUrl} alt={product.title} className="product-image" />
        <div className="product-info">
          <h1>{product.title}</h1>
          <p>Brand: {product.brand}</p>
          <p>Price: ₹{product.price}</p>
          <p>Rating: {product.rating}</p>

          <div className="quantity-container">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </>
  )
}

export default ProductItemDetails
