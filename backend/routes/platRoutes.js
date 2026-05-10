const express = require('express');
const {
  getAllPlats,
  getPlatById,
  createPlat,
  updatePlat,
  deletePlat
} = require('../controllers/platController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllPlats);
router.get('/:id', getPlatById);
router.post('/', auth, isAdmin, createPlat);
router.put('/:id', auth, isAdmin, updatePlat);
router.delete('/:id', auth, isAdmin, deletePlat);

module.exports = router;