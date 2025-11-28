const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'driver', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);