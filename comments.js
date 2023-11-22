// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const db = require('../db');
const { check, validationResult } = require('express-validator');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await db.query('SELECT * FROM comments');
        res.json(comments.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get a comment
router.get('/:id', async (req, res) => {
    try {
        const comment = await db.query('SELECT * FROM comments WHERE id = $1', [req.params.id]);
        res.json(comment.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Create a comment
router.post('/', [
    check('comment', 'Comment is required').not().isEmpty(),
    check('comment', 'Comment must be less than 100 characters').isLength({ max: 100 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    } else {
        try {
            const { comment } = req.body;
            const newComment = await db.query('INSERT INTO comments (comment) VALUES ($1) RETURNING *', [comment]);
            res.json(newComment.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    }
});

// Update a comment
router.put('/:id', [
    check('comment', 'Comment is required').not().isEmpty(),
    check('comment', 'Comment must be less than 100 characters').isLength({ max: 100 })
], async (req, res) => {
    try {
        const { comment } = req.body;
        const updateComment = await db.query('UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *', [comment, req.params.id]);
        res.json(updateComment.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try {
        const deleteComment = await db.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
        res.json('Comment was deleted');
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

// End of file