const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createRequest,
  listRequests,
  getRequest,
  acceptRequest,
  updateStatus,
} = require('../controllers/requestController');

router.post('/', auth, createRequest); // create by customer
router.get('/', auth, listRequests); // list all (with filters)
router.get('/:id', auth, getRequest);
router.post('/:id/accept', auth, acceptRequest); // driver accepts
router.post('/:id/status', auth, updateStatus); // update status

module.exports = router;
