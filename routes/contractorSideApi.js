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
            req.contractorId = decoded.contractorId;
              //Check if user exists in database
              const contractor = await Contractor.findById({_id: req.contractorId});
              if (!contractor) 
                return res.status(403).json({ message: 'Contractor Not Found' });
            next();
          });
    }
    
  };

  // CONTRACTOR SIGNUP
router.post('/signUp',async function(req,res){
  const newlogin = new Contractor({
    orgId: new mongoose.Types.ObjectId(req.body.orgId),
    contractorName : req.body.contractorName ,
    contractorCode: req.body.contractorCode, 
    contractorPhoneNumber: req.body.contractorPhoneNumber,
    contractorPassword: req.body.contractorPassword, 
    contractorDescription: req.body.contractorDescription,
    contractorUPI: req.body.contractorUPI, 
    status: req.body.status
  });
  const existlogin= await Contractor.findOne({contractorPhoneNumber: newlogin.contractorPhoneNumber, contractorCode: newlogin.contractorCode});
  if(existlogin){
      res.json('Already Contractor exists');
  }
  else{
      const org= await Organisation.findOne({_id: newlogin.orgId});
      if(org!=null){
        await newlogin.save();   
        const responseData = {
          contractorName: newlogin.contractorName,
          contractorPhoneNumber: newlogin.contractorPhoneNumber,
          orgId: newlogin.orgId,
          orgIp: org.orgIp,
          token: jwt.sign({ userId: newlogin._id }, process.env.JWT_SECRET),
        };
        res.json(responseData);
      }
      else{
        res.json('Invalid orgId');
      }
  }
});

//CONTRACTOR LOGIN
router.post('/login',async function(req,res){
  const { contractorCode, contractorPhoneNumber, contractorPassword } = req.body;
  const exist= await Contractor.findOne({contractorPhoneNumber: contractorPhoneNumber, contractorCode: contractorCode});
  console.log(exist);
  if(exist!=null ){
      if(contractorPassword==exist.contractorPassword){
          const org= await Organisation.findOne({_id: exist.orgId});
          const responseData = {
              contractorName: exist.contractorName,
              phoneNumber: exist.contractorPhoneNumber,
              orgId: exist.orgId,
              orgIp: org.orgIp,
              token: jwt.sign({ contractorId: exist._id }, process.env.JWT_SECRET),
        };
        res.json(responseData);
      }
      else{
          return res.status(401).json({ message: 'password mismatch' });
      }
  } 
  else{
      return res.status(401).json({ message: 'Contractor not exist' });
  }
});

// CONTRACTOR UPDATE
router.post('/updateDetails',authenticateToken,async function(req,res){
  const newupdate = {
      contractorName: req.body.contractorName,
      contractorDescription: req.body.contractorDescription,
      contractorPassword: req.body.password,
      contractorUPI : req.body.contractorUPI
  };
  
  const oldContractor = await Contractor.findOne({_id : req.contractorId });

  const org= await Organisation.findOne({_id: oldContractor.orgId});

  
    await Contractor.findByIdAndUpdate(req.contractorId, {
      contractorName:newupdate.contractorName,
      contractorPhoneNumber: newupdate.contractorPhoneNumber,
      contractorPassword:newupdate.contractorPassword,
      contractorUPI:newupdate.contractorUPI,
      contractorDescription: newupdate.contractorDescription
    });
  const responseData = {
      contractorName: newupdate.contractorName,
      contractorPhoneNumber: newupdate.contractorPhoneNumber,
      orgId: oldContractor.orgId,
      orgIp: org.orgIp,
      contractorUPI : newupdate.contractorUPI,
      token: jwt.sign({ userId: oldContractor._id }, process.env.JWT_SECRET),
    };
    res.json(responseData);
});


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