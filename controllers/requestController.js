const Request = require('../models/Request');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
  const { pickup, dropoff, items, price } = req.body;
  try {
    const request = new Request({
      customer: req.user.id,
      pickup,
      dropoff,
      items,
      price,
    });
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.listRequests = async (req, res) => {
  try {
    const { status, role } = req.query;
    let query = {};
    if (status) query.status = status;
    // If driver: show open + assigned
    if (req.user.role === 'driver') {
      // drivers can filter but default show open
      if (!status) query.status = 'open';
    }
    const requests = await Request.find(query).populate('customer', 'name phone email').populate('driver', 'name phone email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('customer', 'name phone email').populate('driver', 'name phone email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'open') return res.status(400).json({ message: 'Request not open' });
    request.driver = req.user.id;
    request.status = 'accepted';
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    // Basic validation
    const allowed = ['accepted','in_progress','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
