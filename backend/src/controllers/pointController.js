const PointsService = require('../services/PointsService');
const TypesService = require('../services/TypesService');
const PointsValidator = require('../validator/PointsValidator');

const pointController = {
  getPoints: async (req, res) => {
    try {
      let points;
      if (req.user) {
        points = await PointsService.getPointsByUser(req.user.id);
      } else {
        points = await PointsService.getAllPoints();
      }
      res.json(points);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil data' });
    }
  },

  getTypes: async (req, res) => {
    try {
      const types = await TypesService.getAllTypes();
      res.json(types);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil tipe' });
    }
  },

  createPoint: async (req, res) => {
    console.log("BODY DITERIMA:", req.body);
    const { error } = PointsValidator.validatePointPayload(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const imageUrls = req.files && req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`) : [];
      const newPoint = await PointsService.addPoint({
        ...req.body,
        image_urls: imageUrls,
        created_by: req.user.id 
      });
      res.status(201).json(newPoint);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal menyimpan lokasi' });
    }
  },

  updatePoint: async (req, res) => {
  const { id } = req.params;
  const { error } = PointsValidator.validatePointPayload(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    let keptImages = [];
    if (req.body.kept_images) {
      try {
        keptImages = JSON.parse(req.body.kept_images);
      } catch (e) {
      }
    }
    const uploadedUrls = req.files && req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const finalImageUrls = [...keptImages, ...uploadedUrls];

    const updatedPoint = await PointsService.updatePoint(id, {
        ...req.body,
       image_urls: finalImageUrls
    });
    if (!updatedPoint) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
      res.json(updatedPoint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui lokasi' });
  }
},

  // Hapus titik
  deletePoint: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await PointsService.deletePoint(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
      res.json({ message: 'Berhasil menghapus lokasi', data: deleted });
    } catch (err) {
      res.status(500).json({ message: 'Gagal menghapus lokasi' });
    }
  }
};

module.exports = pointController;