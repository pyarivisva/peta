const PointsService = require('../services/PointsService');
const TypesService = require('../services/TypesService');
const PointsValidator = require('../validator/PointsValidator');

const pointController = {
  // Ambil semua titik (Public)
  getPoints: async (req, res) => {
    try {
      const points = await PointsService.getAllPoints();
      res.json(points);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengambil data peta' });
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
    // Validasi Input
    const { error } = PointsValidator.validatePointPayload(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const newPoint = await PointsService.addPoint({
        ...req.body,
        created_by: req.user.id 
      });
      res.status(201).json(newPoint);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal menyimpan lokasi' });
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