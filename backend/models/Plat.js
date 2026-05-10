const mongoose = require('mongoose');

const platSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  nom: {
    type: String,
    required: [true, 'Plat name is required'],
    maxlength: 150
  },
  description: {
    type: String,
    default: null
  },
  prix: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  image: {
    type: String,
    default: null
  },
  categorie: {
    type: String,
    required: [true, 'Category is required'],
    maxlength: 100
  },
  is_available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plat', platSchema);