// Import required modules
const express = require("express");
const router = express.Router();

const {
  getAllFoodByContractorsId,
  updateFoodDetails,
  deleteFoodById,
  searchFood,
  signUpContractor,
  loginContractors,
  addFoodByContractorId,
} = require("../controller/contractorSide");

// JWT AUTHENTICATOR FOR CONTRACTOR
const { authenticateTokenContractor } = require("../middleware/jwtAuth");

// CONTRACTOR SIGNUP
router.post("/signUp", signUpContractor);

//CONTRACTOR LOGIN
router.post("/login", loginContractors);

//Add food
router.post("/addFood", authenticateTokenContractor, addFoodByContractorId);

// Get all food items for a given contractorId
router.get(
  "/getAllfood",
  authenticateTokenContractor,
  getAllFoodByContractorsId
);

// Search food items by contractorId and foodName
router.post("/searchFood", authenticateTokenContractor, searchFood);

//Updates the food details
router.post(
  "/updateFoodDetails",
  authenticateTokenContractor,
  updateFoodDetails
);

//deletes the food where the parameter is foodId
router.delete(
  "/deleteFood/:foodId",
  authenticateTokenContractor,
  deleteFoodById
);

module.exports = router;
