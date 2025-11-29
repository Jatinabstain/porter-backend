const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.createRequest = async (req, res) => {
  try {
    const { pickup, dropoff, items, price } = req.body;
    if (!pickup || !dropoff) return res.status(400).json({ message: 'pickup and dropoff required' });

    const id = uuidv4();
    await pool.query(
      `INSERT INTO requests (id, customer_id, pickup, dropoff, items, price, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,'open',NOW())`,
      [id, req.user.id, pickup, dropoff, items || null, price || null]
    );

    const { rows } = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT r.*, u.name as customer_name, u.phone as customer_phone FROM requests r LEFT JOIN users u ON r.customer_id = u.id';
    const params = [];
    if (status) {
      query += ' WHERE r.status = $1';
      params.push(status);
    }
    query += ' ORDER BY r.created_at DESC LIMIT 200';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT r.*, u.name as customer_name FROM requests r LEFT JOIN users u ON r.customer_id = u.id WHERE r.id = $1', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Request not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // check request
    const { rows } = await pool.query('SELECT status FROM requests WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Request not found' });
    if (rows[0].status !== 'open') return res.status(400).json({ message: 'Request not open' });

    await pool.query('UPDATE requests SET driver_id = $1, status = $2, accepted_at = NOW() WHERE id = $3', [req.user.id, 'accepted', id]);
    const { rows: updated } = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['accepted', 'in_progress', 'completed', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    await pool.query('UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    const { rows } = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
