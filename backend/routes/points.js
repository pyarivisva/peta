const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');
const authenticateToken = require('../middleware/auth');

router.get('/public/objects', pointController.getAllPoints);

router.post('/objects', authenticateToken, pointController.createPoint);

module.exports = router;