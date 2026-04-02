const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// Middleware Global
app.use(cors());
app.use(express.json());

// Import Rute
const pointRoutes = require('./routes/points');
const authRoutes = require('./routes/auth');

app.use('/api', pointRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});