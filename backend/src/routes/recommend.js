const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Car = require('../models/Car');
const { getGroqRecommendations } = require('../services/groq');

router.post('/recommend', async (req, res) => {
  try {
    const {
      budget_min = 0,
      budget_max,
      age_group,
      profession,
      family_size,
      primary_use,
      fuel,
      car_personality,
      priorities = [],
    } = req.body;

    if (!budget_max) {
      return res.status(400).json({ error: 'budget_max is required' });
    }

    const where = {
      price_lakhs: { [Op.between]: [budget_min, budget_max] },
    }

    const seatMap = { alone: 2, couple: 4, small_family: 5, large_family: 7 };
    const minSeats = seatMap[family_size] || 4;
    where.seating_capacity = { [Op.gte]: minSeats };

    if (fuel && fuel !== 'no_preference') {
      where.fuel_type = fuel;
    }

    let cars = await Car.findAll({ where });

    if (cars.length < 4 && fuel && fuel !== 'no_preference') {
      delete where.fuel_type;
      cars = await Car.findAll({ where });
    }

    if (cars.length < 3) {
      delete where.seating_capacity;
      cars = await Car.findAll({ where });
    }

    if (cars.length === 0) {
      return res.status(404).json({ 
        error: 'No cars found in this price range in our current database. Try widening your budget range or check back as we keep adding new cars.'
      });
    }

    const userProfile = {
      budget_min, budget_max, age_group, profession,
      family_size, primary_use, fuel, car_personality, priorities,
    };

    const groqResult = await getGroqRecommendations(userProfile, cars);

    res.json({
      total_matches: cars.length,
      filters_applied: where,
      all_matches: cars, 
      ...groqResult,
    });
  } catch (err) {
    console.error('Recommend error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;