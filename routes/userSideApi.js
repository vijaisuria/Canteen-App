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


// JWT AUTHENTICATOR
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


// USER SIGNUP
router.post('/signUp',async function(req,res){
    const newlogin = new User({
        Name: req.body.Name,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        orgId: new mongoose.Types.ObjectId(req.body.orgId)
    });
    const existlogin= await User.findOne({phoneNumber: newlogin.phoneNumber});
    if(existlogin){
        res.json('Already user exists');
    }
    else{
        const org= await Organisation.findOne({_id: newlogin.orgId});
        if(org!=null){
          await newlogin.save();   
          const responseData = {
            Name: newlogin.Name,
            phoneNumber: newlogin.phoneNumber,
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

//USER LOGIN
router.post('/login',async function(req,res){
    const login= new User({
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
    });
    const exist= await User.findOne({phoneNumber:login.phoneNumber});
    if(exist!=null ){
        if(login.password==exist.password){
            const org= await Organisation.findOne({_id: exist.orgId});
            const responseData = {
                Name: exist.Name,
                phoneNumber: exist.phoneNumber,
                orgId: exist.orgId,
                orgIp: org.orgIp,
                token: jwt.sign({ userId: exist._id }, process.env.JWT_SECRET),
          };
          res.json(responseData);
        }
        else{
            return res.status(401).json({ message: 'password mismatch' });
        }
    } 
    else{
        return res.status(401).json({ message: 'phoneNumber not exist' });
    }
});

router.post('/update',authenticateToken,async function(req,res){
    const newupdate = {
        Name: req.body.Name,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        orgId: new mongoose.Types.ObjectId(req.body.orgId)
    };

    
    const org= await Organisation.findOne({_id: newupdate.orgId});

    if(org!=null){
      await User.findByIdAndUpdate(req.userId, {Name:newupdate.Name,phoneNumber: newupdate.phoneNumber,password:newupdate.password,orgId:newupdate.orgId});
    const responseData = {
        Name: newupdate.Name,
        phoneNumber: newupdate.phoneNumber,
        orgId: newupdate.orgId,
        orgIp: org.orgIp,
        token: jwt.sign({ userId: newupdate._id }, process.env.JWT_SECRET),
      };
      res.json(responseData);
    }
    else{
        res.status(401).json({ message: 'Invalid orgId' });
    }
});



// Get all contractors for a given organization
router.get('/getAllContractor/:orgId',  authenticateToken, async (req, res) => {
  try {
    const norgId = new mongoose.Types.ObjectId(req.params.orgId);
    const contractors = await Contractor.find({orgId: new mongoose.Types.ObjectId(req.params.orgId)});
    res.status(200).json( contractors.map(contractor => ({
        contractorId: contractor._id,
        contractorName: contractor.contractorName,
        contractorDescription: contractor.contractorDescription
      })));
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//Search Contractor using OrgId and ContractorName
router.post('/searchContractors', authenticateToken, async (req, res) => {
    try {
      const norgId = new mongoose.Types.ObjectId(req.body.orgId);
      const contractorName  = req.body.contractorName;

      const contractors = await Contractor.find({ orgId: norgId, contractorName });
      res.json(contractors.map(contractor => ({
        contractorId: contractor._id,
        contractorName: contractor.contractorName,
        contractorDescription: contractor.contractorDescription
      })));
    } catch (err) {
      res.status(500).json({ error: 'Failed to search contractors' });
    }
  });

// Get all food items for a given contractorId
router.get('/getAllfood/:contractorId', async (req, res) => {
    try {
        const ncontractorId = new mongoose.Types.ObjectId(req.params.contractorId);
      const foods = await Food.find({ contractId: ncontractorId });
      res.json(foods.map(food => ({
        foodId: food._id,
        name: food.name,
        price: food.price,
        status: food.status
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
    status: food.status
    })));
} catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to search food items' });
}
});


module.exports = router;