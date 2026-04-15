const express = require('express');
const router = express.Router();
const pointController = require('../../controllers/pointController');
const { verifyToken } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rute Publik (Tanpa Login)

router.get('/public/objects', pointController.getPoints);
router.get('/types', pointController.getTypes);


// Rute Admin (Perlu Login)
router.get('/objects', verifyToken, pointController.getPoints);
router.post('/objects', verifyToken, upload.array('images', 5), pointController.createPoint);
router.put('/objects/:id', verifyToken, upload.array('images', 5), pointController.updatePoint);
router.delete('/objects/:id', verifyToken, pointController.deletePoint);

module.exports = router;