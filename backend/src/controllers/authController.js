const AuthService = require('../services/AuthService');
const AuthValidator = require('../validator/AuthValidator');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    const { error } = AuthValidator.validateRegisterPayload(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const { username, password, email } = req.body;
      
      // Cek apakah username sudah ada
      const existingUser = await AuthService.getUserByUsername(username);
      if (existingUser) return res.status(400).json({ message: 'Username sudah terdaftar' });

      const newUser = await AuthService.createUser(username, password, email);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    const { error } = AuthValidator.validateLoginPayload(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const { username, password } = req.body;
      const user = await AuthService.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ message: 'Username tidak ditemukan' });
      }

      const isValid = await AuthService.verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Password salah' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ 
        token, 
        user: { id: user.id, username: user.username } 
      });
    } catch (err) {
      res.status(500).json({ message: 'Gagal melakukan login' });
    }
  }
};

module.exports = authController;