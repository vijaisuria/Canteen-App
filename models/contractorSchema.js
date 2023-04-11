const mongoose = require('mongoose');

// Create Contractor schema
const contractorSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true
  },
  contractorId: {
    type: String,
    required: true
  },
  contractorName: {
    type: String,
    required: true
  },
  contractorCode: {
    type: String,
    required: true
  },
  contractorPhoneNumber: {
    type: Number,
    required: true
  },
  contractorPassword: {
    type: String,
    required: true
  },
  contractorDescription: {
    type: String
  },
  contractorUPI: {
    type: String
  },
  status: {
    type: String,
    required: true
  }
});

// Create Contractor model
const Contractor = mongoose.model('Contractor', contractorSchema);

module.exports = { Contractor };