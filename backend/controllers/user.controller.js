import db from "../config/db.js";
import bcrypt from "bcryptjs";

// 🧩 Get all stores (with avg rating & current user's rating)
export const getAllStores = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        s.id, s.name, s.address,
        COALESCE(ROUND(AVG(r.rating),1), 0) AS avg_rating,
        (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY avg_rating DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching stores" });
  }
};

// 🧩 Submit or update a rating
export const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { store_id, rating, review } = req.body;

    if (!store_id || !rating)
      return res.status(400).json({ error: "Store and rating are required" });

    // Check if rating exists
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE store_id = ? AND user_id = ?",
      [store_id, userId]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE ratings SET rating = ?, review = ? WHERE id = ?",
        [rating, review, existing[0].id]
      );
    } else {
      await db.query(
        "INSERT INTO ratings (store_id, user_id, rating, review) VALUES (?, ?, ?, ?)",
        [store_id, userId, rating, review]
      );
    }

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error submitting rating" });
  }
};

// 🧩 Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ error: "Password required" });

    const hashed = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating password" });
  }
};
