import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './index.css'

const ProductCard = props => {
  const { productData } = props
  const { title, brand, imageUrl, rating, price, id } = productData

  const navigate = useNavigate()

  useEffect(() => {
    // For debugging — remove in production
   // console.log(`/products/${id}`)
  }, [id])

  const onClickItem = () => {
    navigate(`/products/${id}`)
     console.log(`/products/${id}`)
  }

  return (
    <li className="product-item" onClick={onClickItem}>
      <img src={imageUrl} alt="product" className="thumbnail" />
      <h3 className="title">{title}</h3>
      <p className="brand">by {brand}</p>
      <div className="product-details">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default ProductCard
