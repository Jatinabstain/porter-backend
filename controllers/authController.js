const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

const JWT_EXPIRES = '7d';

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'customer' } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });

    // Check existing by email if provided
    if (email) {
      const { rows: found } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (found.length) return res.status(400).json({ message: 'User already exists' });
    }

    const id = uuidv4();
    let hashed = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashed = await bcrypt.hash(password, salt);
    }

    await pool.query(
      `INSERT INTO users (id, name, email, phone, password, role, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())`,
      [id, name, email || null, phone || null, hashed, role]
    );

    const payload = { user: { id, role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({ token, user: { id, name, email, phone, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const { rows } = await pool.query('SELECT id, name, email, phone, password, role FROM users WHERE email = $1', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    if (!user.password) return res.status(400).json({ message: 'No local password for this user' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
