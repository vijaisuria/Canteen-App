const mongoose = require("mongoose");

// Create Contractor schema
const contractorSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organisation",
    required: true,
  },
  contractorName: {
    type: String,
    required: true,
  },
  contractorEmail: {
    type: String,
    unique: true,
    required: true,
  },
  resetPasswordOTP: {
    type: String,
    default: "1",
  },
  contractorCode: {
    type: String,
    required: true,
  },
  contractorPhoneNumber: {
    type: Number,
    required: true,
  },
  contractorPassword: {
    type: String,
    required: true,
  },
  contractorDescription: {
    type: String,
  },
  contractorUPI: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
});

// Create Contractor model
const Contractor = mongoose.model("Contractor", contractorSchema);

module.exports = { Contractor };
