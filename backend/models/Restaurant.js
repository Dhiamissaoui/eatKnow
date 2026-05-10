const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Restaurant name is required'],
    maxlength: 150
  },
  description: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  adresse: {
    type: String,
    required: [true, 'Address is required']
  },
  horaires: {
    type: String,
    maxlength: 100,
    default: null
  },
  type_cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    maxlength: 100
  },
  note_moyenne: {
    type: Number,
    default: 0.00,
    min: 0,
    max: 5
  },
  temps_livraison_estime: {
    type: Number,
    required: true,
    comment: 'en minutes'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);