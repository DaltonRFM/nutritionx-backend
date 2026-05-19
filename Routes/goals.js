const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// Get goals
router.get('/', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({ userId: req.userId });
        res.json(goal || null);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Save goals
router.post('/', auth, async (req, res) => {
    try {
        const { calories, protein, carbs, fat } = req.body;

        let goal = await Goal.findOne({ userId: req.userId });

        if (goal) {
            goal.calories = calories;
            goal.protein = protein;
            goal.carbs = carbs;
            goal.fat = fat;
            await goal.save();
        } else {
            goal = new Goal({ userId: req.userId, calories, protein, carbs, fat });
            await goal.save();
        }

        res.json(goal);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;