import pool from '../models/db.js'
import transporter from '../utils/mailer.js'

export const createOrder = async (req, res) => {
  const { customer, items, total, transactionStatus, orderNumber } = req.body

  if (!customer || !items || !total || !orderNumber) {
    return res.status(400).json({ error: 'Missing required order data' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Insert order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        order_number, full_name, email, phone, address, city, state, zip, total_amount, transaction_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customer.fullName,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
        customer.state,
        customer.zip,
        total,
        transactionStatus,
      ]
    )

    const orderId = orderResult.insertId
    console.log('Inserted order ID:', orderId)

    // Insert items
    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
        throw new Error(`Invalid item data: ${JSON.stringify(item)}`)
      }

      await connection.execute(
        `INSERT INTO order_items (
          order_id, product_id, quantity, price_per_item
        ) VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price]
      )
    }

    await connection.commit()

    // Email setup
    const isApproved = transactionStatus === 'approved'
    const subject = isApproved
      ? `Order Confirmation - ${orderNumber}`
      : `Order Failed - ${orderNumber}`

    const productList = items
      .map(
        (item) =>
          `• Product ID: ${item.id} | Quantity: ${item.quantity} | ₹${item.price.toFixed(2)}`
      )
      .join('\n')

    const text = isApproved
      ? `Hi ${customer.fullName},

Thank you for shopping with us! Your order has been confirmed.

 Order Number: ${orderNumber}

 Products:
${productList}

 Total Amount: ₹${total.toFixed(2)}

 Shipping Address:
${customer.address}, ${customer.city}, ${customer.state} - ${customer.zip}

We'll notify you once your items are shipped.

Best regards,  
Your Store Team`
      : `Hi ${customer.fullName},

Unfortunately, your order (Order Number: ${orderNumber}) could not be processed due to a failed transaction.

You can try again or contact our support team if you need help.

Best,  
Your Store Team`

    // Send email
    try {
      await transporter.sendMail({
        from: '"Your Store" <no-reply@yourstore.com>',
        to: customer.email,
        subject,
        text,
      })
      console.log('Email sent to:', customer.email)
    } catch (emailErr) {
      console.error('Failed to send email:', emailErr.message)
    }

    res.status(201).json({ message: 'Order placed successfully', orderNumber })
  } catch (error) {
    await connection.rollback()
    console.error('Error creating order:', error.message)
    res.status(500).json({ error: error.message })
  } finally {
    connection.release()
  }
}
