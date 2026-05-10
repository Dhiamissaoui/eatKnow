const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  statut_livraison: {
    type: String,
    enum: ['en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree', 'annulee'],
    default: 'en_attente'
  },
  adresse_livraison: {
    type: String,
    required: true
  },
  mode_paiement: {
    type: String,
    enum: ['carte', 'livraison', 'mobile_money'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Commande', commandeSchema);