const pool = require('../db');

exports.getAllPoints = async (req, res) => {
    try {
        const query = `
        SELECT op.*, ot.name AS type_name, ot.icon_url
        FROM object_points op
        JOIN object_types ot ON op.type_id = ot.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({error: err.message});
    }
};

exports.createPoint = async (req, res) => {
    const { name, address, latitude, longitude, type_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO object_points (name, address, latitude, longitude, type_id, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, address, latitude, longitude, type_id, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}