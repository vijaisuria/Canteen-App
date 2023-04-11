// Import required modules
const express = require('express');
const router = express.Router();
const { Food } = require('../models/foodSchemma');

// Get all food items for a given contractorId
router.get('/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    console.log(contractId)
    const foods = await Food.find({ contractId });
    res.json(foods.map(food => ({
      foodId: food.foodId,
      name: food.name,
      price: food.price,
      status: food.status
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to get food items' });
  }
});

// Search food items by contractorId and foodName
router.post('/search', async (req, res) => {
  try {
    const { contractId, foodName } = req.body;
    const foods = await Food.find({ contractId, name: foodName });
    res.json(foods.map(food => ({
      foodId: food.foodId,
      name: food.name,
      price: food.price,
      status: food.status
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to search food items' });
  }
});

module.exports = router;
