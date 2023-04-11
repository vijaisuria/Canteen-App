const mongoose = require('mongoose');

// Create Food schema
const foodSchema = new mongoose.Schema({
  contractId: {
    type: String,
    required: true
  },
  foodId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  }
});


// Create Food model
const Food = mongoose.model('Food', foodSchema);

module.exports = { Food };
