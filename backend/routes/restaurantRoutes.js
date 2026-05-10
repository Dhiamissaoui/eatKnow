const express = require('express');
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', auth, isAdmin, createRestaurant);
router.put('/:id', auth, isAdmin, updateRestaurant);
router.delete('/:id', auth, isAdmin, deleteRestaurant);

module.exports = router;