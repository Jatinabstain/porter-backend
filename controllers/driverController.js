const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) return res.status(400).json({ message: 'latitude and longitude required' });

    const id = uuidv4();
    await pool.query(
      `INSERT INTO driver_locations (id, driver_id, latitude, longitude, recorded_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, req.user.id, latitude, longitude]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Very basic: find open requests (no geospatial indexing). You can later enhance with PostGIS.
exports.findNearby = async (req, res) => {
  try {
    // returns latest open requests
    const { rows } = await pool.query(`SELECT r.*, u.name as customer_name FROM requests r LEFT JOIN users u ON r.customer_id = u.id WHERE r.status = 'open' ORDER BY r.created_at DESC LIMIT 50`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
