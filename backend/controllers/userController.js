import bcrypt from "bcryptjs";
import db from "../config/db.js";

// Update Password (for user or owner)
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(oldPassword, rows[0].password);
    if (!valid) return res.status(400).json({ message: "Incorrect old password" });

    // Validate new password format (8–16 chars, 1 uppercase, 1 special)
    const validPass = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(newPassword);
    if (!validPass)
      return res.status(400).json({ message: "Password must have 8–16 chars, 1 uppercase, 1 special char." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin — list users with optional filters
export const listUsers = async (req, res) => {
  const { name, email, address, role } = req.query;
  let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
  const params = [];

  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    query += " AND email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    query += " AND address LIKE ?";
    params.push(`%${address}%`);
  }
  if (role) {
    query += " AND role = ?";
    params.push(role);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin — list stores with filters
export const listStores = async (req, res) => {
  const { name, email, address } = req.query;
  let query = `
    SELECT s.id, s.name, s.email, s.address, u.name AS owner_name, IFNULL(AVG(r.rating), 0) AS avg_rating
    FROM stores s
    LEFT JOIN users u ON s.owner_id = u.id
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const params = [];

  if (name) {
    query += " AND s.name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    query += " AND s.email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    query += " AND s.address LIKE ?";
    params.push(`%${address}%`);
  }

  query += " GROUP BY s.id ORDER BY s.name ASC";

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
