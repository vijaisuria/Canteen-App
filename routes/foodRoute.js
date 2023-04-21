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

//Updates the food details
router.post('/updateFoodDetails', async (req, res) => {
  try {
    const { foodId, name, price, status, threshold } = req.body;
    const food = await Food.findOneAndUpdate(
      { foodId: foodId },
      { name, price, status, threshold },
      { new: true }
    );
    res.json(food);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

//deletes the food where the parameter is foodId
router.delete('/deleteFood/:foodId', async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({ foodId: req.params.foodId });
    if (!food) {
      return res.status(404).json({ msg: 'Food not found' });
    }
    res.json({ msg: 'Food deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
});


module.exports = router;
