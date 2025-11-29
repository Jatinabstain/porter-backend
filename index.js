const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db'); // PostgreSQL connection

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db: "connected", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));

app.get('/', (req, res) => res.json({ message: 'Porter API Running Successfully' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server running on port', PORT));
