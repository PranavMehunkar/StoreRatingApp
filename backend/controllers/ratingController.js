import db from '../config/db.js';

export const submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [user_id, store_id, rating, rating]
    );
    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Store owner dashboard
export const getStoreRatings = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const [store] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [owner_id]);
    if (store.length === 0) return res.status(404).json({ message: 'Store not found' });

    const store_id = store[0].id;
    const [ratings] = await db.query(
      `SELECT u.name, r.rating FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store_id]
    );

    const [avg] = await db.query('SELECT AVG(rating) as avg_rating FROM ratings WHERE store_id = ?', [store_id]);

    res.json({ ratings, avg_rating: avg[0].avg_rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
