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

  getClusters: async (req, res) => {
    try {
      const clusters = await TypesService.getAllClusters();
      res.json(clusters);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil data rumpun' });
    }
  },

  getFacilities: async (req, res) => {
    try {
      const facilities = await TypesService.getAllFacilities();
      res.json(facilities);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil fasilitas' });
    }
  },

  getHealthcareTypes: async (req, res) => {
    try {
      const hTypes = await TypesService.getAllHealthcareTypes();
      res.json(hTypes);
    } catch (err) {
      res.status(500).json({ message: 'Gagal mengambil tipe kesehatan' });
    }
  },

  createPoint: async (req, res) => {
    console.log("BODY DITERIMA:", req.body);
    const { error, value } = PointsValidator.validatePointPayload(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const imageUrls = req.files?.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
      const menuImageUrl = req.files?.menu_image ? `/uploads/${req.files.menu_image[0].filename}` : null;

      const newPoint = await PointsService.addPoint({
        ...value,
        image_urls: imageUrls,
        details: {
          ...value.details,
          menu_image_url: menuImageUrl
        },
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
    const { error, value } = PointsValidator.validatePointPayload(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      let keptImages = [];
      if (value.kept_images) {
        try {
          keptImages = typeof value.kept_images === 'string' ? JSON.parse(value.kept_images) : value.kept_images;
        } catch (e) {
          console.error("JSON Parse Error kept_images:", e);
        }
      }
      
      const uploadedUrls = req.files?.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
      const finalImageUrls = [...keptImages, ...uploadedUrls];

      // Handle menu image (only update if new one is uploaded, otherwise keep existing)
      let menuImageUrl = value.details?.menu_image_url || null;
      if (req.files?.menu_image) {
        menuImageUrl = `/uploads/${req.files.menu_image[0].filename}`;
      }

      const updatedPoint = await PointsService.updatePoint(id, {
        ...value,
        image_urls: finalImageUrls,
        details: {
          ...value.details,
          menu_image_url: menuImageUrl
        }
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