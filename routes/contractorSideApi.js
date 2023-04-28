// Import required modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose=require('mongoose');

const { Contractor } = require('../models/contractorSchema');
const { User } = require('../models/userSchemma');
const  { Organisation }  = require('../models/organisationSchemma');
const { Food } = require('../models/foodSchemma');


// JWT AUTHENTICATOR FOR CONTRACTOR
const authenticateToken =  (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    else{
        jwt.verify(token, process.env.JWT_SECRET,async (err, decoded) => {
            if (err) {
              return res.status(403).json({ message: 'Token expired' });
            }
            req.userId = decoded.userId;
              //Check if user exists in database
              const user = await User.findById({_id: req.userId});
              if (!user) 
                return res.status(403).json({ message: 'User Not Found' });
            next();
          });
    }
    
  };

// Get all food items for a given contractorId
router.get('/getAllfood/:contractorId',authenticateToken, async (req, res) => {
    try {
        const ncontractorId = new mongoose.Types.ObjectId(req.params.contractorId);
      const foods = await Food.find({ contractId: ncontractorId });
      res.json(foods.map(food => ({
        foodId: food._id,
        name: food.name,
        price: food.price,
        status: food.status,
        threshold: food.threshold
      })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to get food items' });
    }
});

// Search food items by contractorId and foodName
router.post('/searchFood', authenticateToken, async (req, res) => {
    try {
        const ncontractId = new mongoose.Types.ObjectId(req.body.contractId);
        const foodName = req.body.foodName;
    
        const foods = await Food.find({ contractId: ncontractId, name: foodName });
        res.json(foods.map(food => ({
        foodId: food._id,
        name: food.name,
        price: food.price,
        status: food.status,
        threshold: food.threshold
        })));
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to search food items' });
    }
});

//Updates the food details
router.post('/updateFoodDetails',authenticateToken, async (req, res) => {
    try {
      const newFood = {
        foodId: new mongoose.Types.ObjectId(req.body.foodId),
        name: req.body.foodName,
        price: req.body.price,
        status: req.body.status,
        threshold: req.body.threshold
      };

      const food = await Food.findByIdAndUpdate(
        newFood.foodId,
        { 
            name: newFood.name,
            price: newFood.price,
            status: newFood.status,
            threshold: newFood.threshold
       }
      );
      res.status(200).json({
          foodId: newFood.foodId,
          name: newFood.name,
          price: newFood.price,
          status: newFood.status,
          threshold: newFood.threshold
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
  

//deletes the food where the parameter is foodId
router.delete('/deleteFood/:foodId', authenticateToken, async (req, res) => {
try {
    const food = await Food.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.foodId) });
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