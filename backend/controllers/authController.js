import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address, 'user']
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("➡️ Incoming login:", email, password);

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    console.log("🔍 Users found:", rows.length);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password (no user)" });
    }

    const user = rows[0];
    console.log("🧩 DB Password Hash:", user.password);

    const valid = await bcrypt.compare(password, user.password);
    console.log("✅ Password Match:", valid);

    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password (wrong password)" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
