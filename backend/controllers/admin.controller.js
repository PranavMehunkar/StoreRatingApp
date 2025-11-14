import bcrypt from "bcryptjs";
import db from "../config/db.js";

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Total users
    const [[{ total_users }]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    // Total stores
    const [[{ total_stores }]] = await db.query(
      "SELECT COUNT(*) AS total_stores FROM stores"
    );

    // Total ratings
    const [[{ total_ratings }]] = await db.query(
      "SELECT COUNT(*) AS total_ratings FROM ratings"
    );

    res.json({ total_users, total_stores, total_ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching stats" });
  }
};

// 📘 Get all users (with optional search & role filter)
export const getAllUsers = async (req, res) => {
  try {
    const { search = "", role = "" } = req.query;

    let query = "SELECT id, name, email, role, address FROM users WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// 📘 Get all stores (with average ratings)
export const getAllStores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.name, s.address, u.name AS owner_name,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address, u.name
      ORDER BY average_rating DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching stores" });
  }
};

// Add new user (normal or admin)
export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate role
    if (!["user", "admin", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, address, role]
    );

    res.json({ message: `${role} added successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new store
export const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Optional: verify owner exists
    if (owner_id) {
      const [owner] = await db.query("SELECT * FROM users WHERE id = ? AND role = 'owner'", [owner_id]);
      if (owner.length === 0) {
        return res.status(400).json({ message: "Owner not found or not valid" });
      }
    }

    await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    res.json({ message: "Store added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
