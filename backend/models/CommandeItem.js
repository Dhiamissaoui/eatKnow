const mongoose = require('mongoose');

const commandeItemSchema = new mongoose.Schema({
  commande_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commande',
    required: true
  },
  plat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plat',
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 1
  },
  prix_unitaire: {
    type: Number,
    required: true,
    min: 0
  },
  sous_total: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('CommandeItem', commandeItemSchema);