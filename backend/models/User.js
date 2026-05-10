const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: 150
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    maxlength: 150
  },
  telephone: {
    type: String,
    required: [true, 'Phone is required'],
    maxlength: 20
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    maxlength: 255
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  adresse: {
    type: String,
    default: null
  }
}, {
  timestamps: true  // Creates created_at and updated_at automatically
});

module.exports = mongoose.model('User', userSchema);