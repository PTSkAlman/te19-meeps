const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    await pool
    .promise()
    .query(`SELECT * FROM jolabn_meeps`)
    .then(([rows]) => {
        console.log(rows)
        if(rows.length === 0) {
            return res.json({
                error: 'No users found'
            });
        }
        return res.json({
            meeps: rows
        });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).json({
            error: 'Something went wrong'
        })
    });
})

module.exports = router;