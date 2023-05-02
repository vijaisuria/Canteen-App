// Import required modules
const {
  searchContractors,
  searchFoodByContractorId,
  updateUser,
  loginUser,
  signUpUser,
  getAllContractorByOrgId,
  getAllFoodByContractorId,
} = require("../controller/userSide");
const express = require("express");
const router = express.Router();
// JWT AUTHENTICATOR FOR CONTRACTOR
const { authenticateTokenUser } = require("../middleware/jwtAuth");

// USER SIGNUP
router.post("/signUp", signUpUser);

//USER LOGIN
router.post("/login", loginUser);

//Update userDetails
router.post("/update", authenticateTokenUser, updateUser);

// Get all contractors for a given organization
router.get(
  "/getAllContractor/:orgId",
  authenticateTokenUser,
  getAllContractorByOrgId
);

//Search Contractor using OrgId and ContractorName
router.post("/searchContractors", authenticateTokenUser, searchContractors);

// Get all food items for a given contractorId
router.get(
  "/getAllfood/:contractorId",
  authenticateTokenUser,
  getAllFoodByContractorId
);

// Search food items by contractorId and foodName
router.post("/searchFood", authenticateTokenUser, searchFoodByContractorId);

module.exports = router;
