const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/', auth, requestController.createRequest); // customer creates
router.get('/', auth, requestController.listRequests); // list/filter
router.get('/:id', auth, requestController.getRequest);
router.post('/:id/accept', auth, requestController.acceptRequest); // driver accepts
router.post('/:id/status', auth, requestController.updateStatus); // driver updates status

module.exports = router;
