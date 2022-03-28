const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM meeps ORDER BY created_at DESC')
        .then(([rows, fields]) => {
            res.render('meeps.njk', {
                meeps: rows,
                title: 'Meeps',
                layout: 'layout.njk'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.post('/', async (req, res, next) => {
    const meep = req.body.meep;

    await pool.promise()
    .query('INSERT INTO meeps (body) VALUES(?)', [meep])
    .then((response) => {
        if (response[0].affectedRows == 1) {
            res.redirect('/meeps');
        } else {
            res.status(400).json({
                meep: {
                    error: 'Invalid meep'
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            meeps: {
                error: 'Invalid meep'
            }
        })
    });
});

router.get('/:id', async (req,res,next) => {
    const id = req.params.id;
    await pool.promise()
    .query('SELECT * FROM meeps WHERE id = ?', [id])
    .then(([rows, fields]) => {
        res.json({
            meeps: {
                data: rows
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            meeps: {
                error: 'Invalid meep'
            }
        })
    });
});

router.get('/:id/delete', async (req,res,next) => {
    const id = req.params.id;
    await pool.promise()
    .query('DELETE FROM meeps WHERE id = ?', [id])
    .then((response) => {
        res.redirect('/meeps');
    })
});
module.exports = router;