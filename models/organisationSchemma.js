const mongoose = require("mongoose");

const organisationSchema = mongoose.Schema({
  orgName: {
    type: String,
    required: true,
  },
  orgPhoneNumber: {
    type: Number,
    required: true,
  },
  orgPassword: {
    type: String,
    required: true,
  },
  orgIp: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
});

const Organisation = mongoose.model("Organisation", organisationSchema);

module.exports = { Organisation };
