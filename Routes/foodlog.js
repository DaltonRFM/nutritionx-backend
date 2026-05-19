const express = require('express');
const router = express.Router();
const FoodLog = require('../models/FoodLog');
const auth = require('../middleware/auth');

// Get log for a specific date
router.get('/:date', auth, async (req, res) => {
    try {
        const log = await FoodLog.findOne({ userId: req.userId, date: req.params.date });
        res.json(log ? log.items : []);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Save log for a specific date
router.post('/:date', auth, async (req, res) => {
    try {
        const { items } = req.body;

        let log = await FoodLog.findOne({ userId: req.userId, date: req.params.date });

        if (log) {
            log.items = items;
            await log.save();
        } else {
            log = new FoodLog({ userId: req.userId, date: req.params.date, items });
            await log.save();
        }

        res.json(log.items);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all dates that have logs (for calendar)
router.get('/', auth, async (req, res) => {
    try {
        const logs = await FoodLog.find({ userId: req.userId, 'items.0': { $exists: true } });
        const dates = logs.map(log => log.date);
        res.json(dates);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;