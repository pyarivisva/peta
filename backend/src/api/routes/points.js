const express = require('express');
const router = express.Router();
const pointController = require('../../controllers/pointController');
const { verifyToken } = require('../../middleware/auth');

// --- Rute Publik (Tanpa Login) ---

router.get('/public/objects', pointController.getPoints);
router.get('/types', pointController.getTypes);


// --- Rute Admin (Perlu Login/Token) ---
router.post('/objects', verifyToken, pointController.createPoint);
router.delete('/objects/:id', verifyToken, pointController.deletePoint);

module.exports = router;