const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require('../middleware/auth');

// driver endpoints
router.post('/update-location', auth, driverController.updateLocation);
router.get('/nearby', auth, driverController.findNearby); // optional: list nearby open requests (basic)
module.exports = router;
