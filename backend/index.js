const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        status: 'success',
        message: 'Hello from the backend!'
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});