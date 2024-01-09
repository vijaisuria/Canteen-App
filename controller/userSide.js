const mongoose = require("mongoose");
const { Contractor } = require("../models/contractorSchema");
const { User } = require("../models/userSchemma");
const { Organisation } = require("../models/organisationSchemma");
const { Food } = require("../models/foodSchemma");
const jwt = require("jsonwebtoken");
// @desc    Sign Up User
// @route   POST /api/v1/User/signUp
// @access  Public
const signUpUser = async function (req, res) {
  const newlogin = new User({
    Name: req.body.Name,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    orgId: new mongoose.Types.ObjectId(req.body.orgId),
  });
  const existlogin = await User.findOne({ phoneNumber: newlogin.phoneNumber });
  if (existlogin) {
    res.json("Already user exists");
  } else {
    const org = await Organisation.findOne({ _id: newlogin.orgId });
    if (org != null) {
      await newlogin.save();
      const responseData = {
        Name: newlogin.Name,
        phoneNumber: newlogin.phoneNumber,
        orgId: newlogin.orgId,
        orgIp: org.orgIp,
        token: jwt.sign({ userId: newlogin._id }, process.env.JWT_SECRET),
      };
      res.json(responseData);
    } else {
      res.json("Invalid orgId");
    }
  }
};

// @desc    Login User
// @route   POST /api/v1/User/login
// @access  Public
const loginUser = async function (req, res) {
  const login = new User({
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  });
  const exist = await User.findOne({ phoneNumber: login.phoneNumber });
  if (exist != null) {
    if (login.password == exist.password) {
      const org = await Organisation.findOne({ _id: exist.orgId });
      const responseData = {
        Name: exist.Name,
        phoneNumber: exist.phoneNumber,
        orgId: exist.orgId,
        orgIp: org.orgIp,
        token: jwt.sign({ userId: exist._id }, process.env.JWT_SECRET),
      };
      res.json(responseData);
    } else {
      return res.status(401).json({ message: "password mismatch" });
    }
  } else {
    return res.status(401).json({ message: "phoneNumber not exist" });
  }
};
// @desc    Update User
// @route   POST /api/v1/User/update
// @access  Private
//Getting error while updating the user details duplicate error in phone number
const updateUser = async function (req, res) {
  const newupdate = new User({
    Name: req.body.Name,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    orgId: new mongoose.Types.ObjectId(req.body.orgId),
  });
  const org = await Organisation.findOne({ _id: newupdate.orgId });

  if (org != null) {
    await User.findByIdAndUpdate(req.userId, {
      Name: newupdate.Name,
      // phoneNumber: newupdate.phoneNumber,
      password: newupdate.password,
      orgId: newupdate.orgId,
    });
    const responseData = {
      Name: newupdate.Name,
      phoneNumber: newupdate.phoneNumber,
      orgId: newupdate.orgId,
      orgIp: org.orgIp,
      token: jwt.sign({ userId: newupdate._id }, process.env.JWT_SECRET),
    };
    res.json(responseData);
  } else {
    res.status(401).json({ message: "Invalid orgId" });
  }
};
// @desc    Get all the contractor using org ID
// @route   GET /api/v1/User/getAllContractor/:orgId
// @access  Private
const getAllContractorByOrgId = async (req, res) => {
  try {
    // const norgId = new mongoose.Types.ObjectId(req.params.orgId);
    const contractors = await Contractor.find({
      orgId: req.params.orgId,
    });
    res.status(200).json(
      contractors.map((contractor) => ({
        contractorId: contractor._id,
        contractorName: contractor.contractorName,
        contractorDescription: contractor.contractorDescription,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
// @desc    search the contractor using org ID and contractor name
// @route   POST /api/v1/User/searchContractors
// @access  Private
const searchContractors = async (req, res) => {
  try {
    const norgId = new mongoose.Types.ObjectId(req.body.orgId);
    const contractorName = req.body.contractorName;

    const contractors = await Contractor.find({
      orgId: norgId,
      contractorName,
    });
    res.json(
      contractors.map((contractor) => ({
        contractorId: contractor._id,
        contractorName: contractor.contractorName,
        contractorDescription: contractor.contractorDescription,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to search contractors" });
  }
};
// @desc    get all the food by contractorID
// @route   GET /api/v1/User/getAllfood/:contractorId
// @access  Private
const getAllFoodByContractorId = async (req, res) => {
  try {
    const ncontractorId = new mongoose.Types.ObjectId(req.params.contractorId);
    const foods = await Food.find({ contractId: ncontractorId });
    res.json(
      foods.map((food) => ({
        foodId: food._id,
        name: food.name,
        price: food.price,
        status: food.status,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to get food items" });
  }
};

// @desc    search the food by contractorID and food name
// @route   POST /api/v1/User/searchFood
// @access  Private
const searchFoodByContractorId = async (req, res) => {
  try {
    const ncontractId = new mongoose.Types.ObjectId(req.body.contractId);
    const foodName = req.body.foodName;

    const foods = await Food.find({ contractId: ncontractId, name: foodName });
    res.json(
      foods.map((food) => ({
        foodId: food._id,
        name: food.name,
        price: food.price,
        status: food.status,
      }))
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to search food items" });
  }
};

module.exports = {
  searchContractors,
  searchFoodByContractorId,
  updateUser,
  loginUser,
  signUpUser,
  getAllContractorByOrgId,
  getAllFoodByContractorId,
};
