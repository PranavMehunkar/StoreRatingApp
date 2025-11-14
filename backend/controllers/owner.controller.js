import db from "../config/db.js";

// 🏪 Get store and ratings for this owner
export const getOwnerDashboard = async (req, res) => {
  try {
    console.log("Owner ID from token:", req.user.id);
    
    const ownerId = req.user.id;
    
    const [[store]] = await db.query(
      "SELECT id, name, address FROM stores WHERE owner_id = ?",
      [ownerId]
    );

    if (!store) return res.status(404).json({ error: "Store not found" });

    const [ratings] = await db.query(
      `SELECT r.id, r.rating, r.review, u.name AS user_name, u.email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store.id]
    );

    const [[{ avg_rating }]] = await db.query(
      "SELECT ROUND(AVG(rating),1) AS avg_rating FROM ratings WHERE store_id = ?",
      [store.id]
    );

    res.json({ store, avg_rating, ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching owner dashboard" });
  }

  console.log("Owner ID from token:", req.user.id);
};

export const changeOwnerPassword = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Fetch owner
    const [[owner]] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [ownerId]
    );

    if (!owner)
      return res.status(404).json({ message: "Owner not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, owner.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, ownerId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating password" });
  }
};
