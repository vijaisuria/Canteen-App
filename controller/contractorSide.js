const mongoose = require("mongoose");
const { Contractor } = require("../models/contractorSchema");
const { User } = require("../models/userSchemma");
const { Organisation } = require("../models/organisationSchemma");
const { Food } = require("../models/foodSchemma");
const jwt = require("jsonwebtoken");
// @desc    Fetch all Food from the contractor
// @route   POST /api/products
// @access  Public
const loginContractors = async function (req, res) {
  const { contractorCode, contractorPhoneNumber, contractorPassword } =
    req.body;
  const exist = await Contractor.findOne({
    contractorPhoneNumber: contractorPhoneNumber,
    contractorCode: contractorCode,
  });
  console.log(exist);
  if (exist != null) {
    if (contractorPassword == exist.contractorPassword) {
      const org = await Organisation.findOne({ _id: exist.orgId });
      const responseData = {
        contractorName: exist.contractorName,
        phoneNumber: exist.contractorPhoneNumber,
        orgId: exist.orgId,
        orgIp: org.orgIp,
        token: jwt.sign({ contractorId: exist._id }, process.env.JWT_SECRET),
      };
      res.json(responseData);
    } else {
      return res.status(401).json({ message: "password mismatch" });
    }
  } else {
    return res.status(401).json({ message: "Contractor not exist" });
  }
};
// @desc    Fetch all Food from the contractor
// @route   POST /api/products
// @access  Public
const signUpContractor = async function (req, res) {
  const newlogin = new Contractor({
    orgId: new mongoose.Types.ObjectId(req.body.orgId),
    contractorName: req.body.contractorName,
    contractorCode: req.body.contractorCode,
    contractorPhoneNumber: req.body.contractorPhoneNumber,
    contractorPassword: req.body.contractorPassword,
    contractorDescription: req.body.contractorDescription,
    contractorUPI: req.body.contractorUPI,
    status: req.body.status,
  });
  const existlogin = await Contractor.findOne({
    contractorPhoneNumber: newlogin.contractorPhoneNumber,
    contractorCode: newlogin.contractorCode,
  });
  if (existlogin) {
    res.json("Already Contractor exists");
  } else {
    const org = await Organisation.findOne({ _id: newlogin.orgId });
    if (org != null) {
      await newlogin.save();
      const responseData = {
        contractorName: newlogin.contractorName,
        contractorPhoneNumber: newlogin.contractorPhoneNumber,
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
// @desc    Fetch all Food from the contractor
// @route   POST /api/products
// @access  Private
const addFoodByContractorId = async function (req, res) {
  console.log(req.contractorId);
  const newFood = new Food({
    contractId: new mongoose.Types.ObjectId(req.contractorId),
    name: req.body.name,
    price: req.body.price,
    status: req.body.status,
    threshold: req.body.threshold,
  });
  const existFood = await Food.findOne({
    contractId: newFood.contractId,
    name: newFood.name,
  });
  if (existFood) {
    res.json("Already Food exists");
  } else {
    const cont = await Contractor.findOne({ _id: newFood.contractId });
    if (cont != null) {
      await newFood.save();
      const responseData = {
        foodId: newFood._id,
        name: newFood.name,
        price: newFood.price,
        status: newFood.status,
        threshold: newFood.threshold,
      };
      res.json(responseData);
    } else {
      res.json("Invalid contractorId");
    }
  }
};
// @desc    Fetch all Food from the contractor
// @route   GET /api/products
// @access  Private
const getAllFoodByContractorsId = async (req, res) => {
  try {
    const ncontractorId = new mongoose.Types.ObjectId(req.contractorId);
    console.log(ncontractorId);
    const foods = await Food.find({ contractId: ncontractorId }).select(
      "-contractId"
    );
    console.log(foods);
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to get food items" });
  }
};

//Not-Working
// @desc    Search Food from the contractor
// @route   GET /api/products
// @access  Private
const searchFood = async (req, res) => {
  try {
    console.log(req.contractorId);
    const ncontractId = new mongoose.Types.ObjectId(req.contractorId);
    const foodName = req.body.foodName;
    console.log(ncontractId);
    console.log(foodName);
    const foods = await Food.find({
      contractId: ncontractId,
      name: { $regex: foodName },
    });
    console.log(foods);
    res.json(foods);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to search food items" });
  }
};

// @desc    Update Food by Id from the contractor
// @route   GET /api/products
// @access  Private
const updateFoodDetails = async (req, res) => {
  try {
    const newFood = {
      foodId: new mongoose.Types.ObjectId(req.body.foodId),
      name: req.body.foodName,
      price: req.body.price,
      status: req.body.status,
      threshold: req.body.threshold,
    };

    const food = await Food.findByIdAndUpdate(newFood.foodId, {
      name: newFood.name,
      price: newFood.price,
      status: newFood.status,
      threshold: newFood.threshold,
    });
    res.status(200).json({
      foodId: newFood.foodId,
      name: newFood.name,
      price: newFood.price,
      status: newFood.status,
      threshold: newFood.threshold,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
// @desc    Delete Food by Id from the contractor
// @route   GET /api/products
// @access  Private
const deleteFoodById = async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params.foodId),
    });
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }
    res.json({ msg: "Food deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  signUpContractor,
  loginContractors,
  getAllFoodByContractorsId,
  updateFoodDetails,
  deleteFoodById,
  searchFood,
  addFoodByContractorId,
};
