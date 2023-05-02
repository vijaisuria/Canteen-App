// Import required modules
const express = require("express");
const userSideApi = require("./routes/userSideApi");
const contractorSideApi = require("./routes/contractorSideApi");
const mongooseConnect = require("./dbConnect");
require("dotenv").config();
// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using Mongoose
mongooseConnect();

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount the routers for the APIs
app.use("/api/v1/User", userSideApi);
app.use("/api/v1/Contractors", contractorSideApi);

// Start the server
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:5000`)
);
