const express = require('express');
const { getDashboardStats } = require('../controllers/statsController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', auth, isAdmin, getDashboardStats);

module.exports = router;