import pool from '../models/db.js';

export const getProducts = async (req, res) => {
  const { sort_by, category, title_search, rating } = req.query;

  let query = 'SELECT * FROM products WHERE 1';
  const params = [];

  if (category) {
    query += ' AND category_id = ?';
    params.push(category);
  }

  if (title_search) {
    query += ' AND title LIKE ?';
    params.push(`%${title_search}%`);
  }

  if (rating) {
    query += ' AND rating >= ?';
    params.push(parseFloat(rating));
  }

  if (sort_by === 'PRICE_LOW') {
    query += ' ORDER BY price ASC';
  } else if (sort_by === 'PRICE_HIGH') {
    query += ' ORDER BY price DESC';
  }

  try {
    const [rows] = await pool.execute(query, params);

    const products = rows.map(p => ({
      title: p.title,
      brand: p.brand,
      price: p.price,
      id: p.id,
      image_url: p.image_url,
      rating: p.rating.toString(),
    }));

    res.json({ products, total: products.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 

export const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    console.log('Requested Product ID:', productId);

    if (!productId) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const [productRows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productRows[0];
    product.rating = product.rating?.toString?.() ?? '0';

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Server error' });
  }
};
