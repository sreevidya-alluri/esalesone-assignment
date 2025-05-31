import React, { useState, useContext } from 'react'
import CartContext from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext)
  //const { cartList, removeAllCartItems, cartItems, clearCart } = useContext(CartContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\d{10}$/
  const cardRegex = /^\d{16}$/
  const cvvRegex = /^\d{3}$/

  const isExpiryValid = (date) => {
    const [month, year] = date.split('/')
    if (!month || !year || isNaN(month) || isNaN(year)) return false
    const expDate = new Date(`20${year}`, parseInt(month))
    return expDate > new Date()
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

 const validateForm = () => {
  const newErrors = {}

  const cleanedCard = formData.cardNumber.replace(/\s+/g, '')
  console.log('Card Input:', formData.cardNumber)
  console.log('Cleaned:', cleanedCard)
  console.log('Matches Regex:', cardRegex.test(cleanedCard))

  if (!formData.fullName) newErrors.fullName = 'Full Name is required'
  if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email'
  if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number'
  if (!formData.address) newErrors.address = 'Address is required'
  if (!formData.city) newErrors.city = 'City is required'
  if (!formData.state) newErrors.state = 'State is required'
  if (!formData.zip) newErrors.zip = 'Zip code is required'
  if (!cardRegex.test(cleanedCard)) newErrors.cardNumber = 'Card must be 16 digits'
  if (!isExpiryValid(formData.expiryDate)) newErrors.expiryDate = 'Invalid expiry date'
  if (!cvvRegex.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 digits'

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  setSubmitting(true)
  setSubmitError('')

  //const outcomes = ['approved', 'declined', 'gateway_error']
  const outcome = 'approved'


  // Construct clean customer data
  const {
    fullName, email, phone, address, city, state, zip
  } = formData

  const orderData = {
    customer: { fullName, email, phone, address, city, state, zip },
    items: cartItems.map(({ id, quantity, price }) => ({
      id,
      quantity,
      price,
    })),
    total: parseFloat(total.toFixed(2)),
    transactionStatus: outcome,
    orderNumber: `ORD-${Date.now()}`,
  }

  console.log("Sending orderData", orderData)

 try {
  const response = await fetch('https://esalesone-assignment-production-3aef.up.railway.app/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })

  console.log("Response status:", response.status)

  const data = await response.json()
  console.log("Backend response:", data)

  if (!response.ok) {
    throw new Error(data.error || 'Failed to place order')
  }

  clearCart()
  navigate(`/thank-you/${data.orderNumber}`)
} catch (err) {
  console.error("Error during order submission:", err.message)
  setSubmitError(err.message || 'Something went wrong. Please try again.')
}
 finally {
    setSubmitting(false)
  }
}


  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        {[
          { name: 'fullName', label: 'Full Name' },
          { name: 'email', label: 'Email' },
          { name: 'phone', label: 'Phone Number' },
          { name: 'address', label: 'Address' },
          { name: 'city', label: 'City' },
          { name: 'state', label: 'State' },
          { name: 'zip', label: 'Zip Code' },
          { name: 'cardNumber', label: 'Card Number' },
          { name: 'expiryDate', label: 'Expiry Date (MM/YY)', placeholder: 'MM/YY' },
          { name: 'cvv', label: 'CVV' },
        ].map(({ name, label, placeholder }) => (
          <div key={name}>
            <label>{label}</label>
           <input
  name={name}
  value={formData[name]}
  placeholder={placeholder}
  onChange={handleChange}
  disabled={submitting}
/>

            {errors[name] && <p className="error">{errors[name]}</p>}
          </div>
        ))}

        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.title} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Tax (10%): ₹{tax.toFixed(2)}</p>
        <p><strong>Total: ₹{total.toFixed(2)}</strong></p>

        {submitError && <p className="error">{submitError}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}

export default Checkout
