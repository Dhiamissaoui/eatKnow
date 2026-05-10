const express = require('express');
const {
  createCommande,
  getAllCommandes,
  getCommandeById,
  updateCommandeStatus
} = require('../controllers/commandeController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createCommande);
router.get('/', auth, getAllCommandes);
router.get('/:id', auth, getCommandeById);
router.put('/:id/statut', auth, isAdmin, updateCommandeStatus);

module.exports = router;