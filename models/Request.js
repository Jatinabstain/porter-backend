const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  items: { type: String },
  price: { type: Number },
  status: { type: String, enum: ['open','accepted','in_progress','completed','cancelled'], default: 'open' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);