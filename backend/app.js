import express from 'express'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js' 
import orderRoutes from './routes/orderRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes )

app.listen(8000, () => {
  console.log('Server running on port 8000')
})

export default app
