const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length == 0) return res.status(400).json({
            message: 'Username tidak ditemukan'
        });
        
        const validPass = await bcrypt.compare(password, user.rows[0].password);
        if (!validPass) 
            return res.status(400).json({
                message: 'Password salah'
            });
        
            const token = jwt.sign(
                { id: user.rows[0].id, role: user.rows[0].role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};