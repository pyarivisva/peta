const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Akses ditolak, silakan login terlebih dahulu'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Sesi kadaluarsa atau token tidak valid'
      });
    }
    
    req.user = user;
    next();
  });
};

module.exports = { verifyToken };