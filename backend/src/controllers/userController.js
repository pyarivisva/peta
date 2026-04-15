const UserService = require('../services/UserService');

const userController = {
  // Ambil daftar ID Saved
  getSaved: async (req, res) => {
    try {
      const savedIds = await UserService.getSavedLocations(req.user.id);
      res.json(savedIds);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengambil data saved.' });
    }
  },

  // Toggle sebuah ID ke list Saved
  toggleSaved: async (req, res) => {
    try {
      const { pointId } = req.params;
      if (!pointId || isNaN(pointId)) return res.status(400).json({ message: 'Invalid point ID' });
      
      const result = await UserService.toggleSavedLocation(req.user.id, parseInt(pointId));
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengubah status saved.' });
    }
  },

  // Ambil daftar ID History
  getHistory: async (req, res) => {
    try {
      const historyIds = await UserService.getHistoryLocations(req.user.id);
      res.json(historyIds);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengambil data history.' });
    }
  },

  // Tambah ID ke list History
  addHistory: async (req, res) => {
    try {
      const { pointId } = req.params;
      if (!pointId || isNaN(pointId)) return res.status(400).json({ message: 'Invalid point ID' });

      const result = await UserService.addToHistory(req.user.id, parseInt(pointId));
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal menambah history.' });
    }
  }
};

module.exports = userController;
