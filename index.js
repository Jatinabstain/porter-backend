// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/admin', require('./routes/admin')); // optional admin utilities

app.get('/', (req, res) => res.json({ message: 'Porter API Running Successfully' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server running on port', PORT));
