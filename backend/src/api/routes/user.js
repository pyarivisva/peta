const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { verifyToken } = require('../../middleware/auth');

router.use(verifyToken);

router.get('/saved', userController.getSaved);
router.post('/saved/:pointId', userController.toggleSaved);

router.get('/history', userController.getHistory);
router.post('/history/:pointId', userController.addHistory);

module.exports = router;
