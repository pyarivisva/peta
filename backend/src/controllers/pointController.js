const PointsService = require('../services/PointsService');
const TypesService = require('../services/TypesService');
const PointsValidator = require('../validator/PointsValidator');

const pointController = {
  // Ambil semua titik (Public)
  getPoints: async (req, res) => {
    try {
      let points;
      // Jika ada req.user (artinya lewat middleware verifyToken), ambil data milik user tsb
      if (req.user) {
        points = await PointsService.getPointsByUser(req.user.id);
      } else {
        // Jika tidak ada user (Public), ambil semua
        points = await PointsService.getAllPoints();
      }
      res.json(points);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil data' });
    }
  },

  // Ambil semua tipe
  getTypes: async (req, res) => {
    try {
      const types = await TypesService.getAllTypes();
      res.json(types);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil tipe' });
    }
  },

  // Tambah titik baru (Admin Only)
  createPoint: async (req, res) => {
    // const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    // Validasi Input
    const { error } = PointsValidator.validatePointPayload(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const newPoint = await PointsService.addPoint({
        ...req.body,
        image_url: imageUrl,
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
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updatedPoint = await PointsService.updatePoint(id, {
        ...req.body,
        ...(imageUrl && { image_url: imageUrl })
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