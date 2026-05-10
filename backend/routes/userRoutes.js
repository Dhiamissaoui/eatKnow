const express = require('express');
const {
  getAllUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, isAdmin, getAllUsers);
router.get('/:id', auth, getUserById);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;