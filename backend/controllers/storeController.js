import db from '../config/db.js';

// Admin: Add store
export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    res.json({ message: 'Store added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// All: Get store list + average rating
export const getStores = async (req, res) => {
  try {
    const [stores] = await db.query(`
      SELECT s.*, IFNULL(AVG(r.rating), 0) as avg_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
