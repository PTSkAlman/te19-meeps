const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM jolabn_meeps ORDER BY created_at DESC')
        .then(([rows, fields]) => {
            res.render('meeps.njk', {
                jolabn_meeps: rows,
                title: 'meeps',
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
    .query('INSERT INTO jolabn_meeps (body) VALUES(?)', [meep])
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
            jolabn_meeps: {
                error: 'Invalid meep'
            }
        })
    });
});

router.get('/:id', async (req,res,next) => {
    const id = req.params.id;
    await pool.promise()
    .query('SELECT * FROM jolabn_meeps WHERE id = ?', [id])
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
    .query('DELETE FROM jolabn_meeps WHERE id = ?', [id])
    .then((response) => {
        res.redirect('/_meeps');
    })
});

router.get('/:id/update', async (req,res,next) => {
    const body = req.params.body;
    await pool.promise()
    .query('ALTER TABLE jolabn_meeps MODIFY COLUMN body = ?',[body])
    .then((response) => {
        res.redirect('/meeps');
    });
});
module.exports = router;