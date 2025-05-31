import React from 'react'
import { useParams, Link } from 'react-router-dom'

const ThankYou = () => {
  const { orderId } = useParams()

  return (
    <div className="thank-you-container" style={styles.container}>
      <h1 style={styles.title}>🎉 Thank You for Your Purchase!</h1>
      <p style={styles.message}>Your order has been successfully placed.</p>
      <p style={styles.order}>Order Number: <strong>{orderId}</strong></p>
      <Link to="/products" style={styles.link}>Continue Shopping</Link>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  order: {
    fontSize: '20px',
    marginBottom: '30px',
  },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
  }
}

export default ThankYou
