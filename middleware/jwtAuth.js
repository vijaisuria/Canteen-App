const { User } = require("../models/userSchemma");
const { Contractor } = require("../models/contractorSchema");
const jwt = require("jsonwebtoken");
const authenticateTokenUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token expired" });
      }
      req.userId = decoded.userId;
      //Check if user exists in database
      const user = await User.findById({ _id: req.userId });
      if (!user) return res.status(403).json({ message: "User Not Found" });
      next();
    });
  }
};
const authenticateTokenContractor = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token expired" });
      }
      console.log("decoded " + decoded.contractorId);
      req.contractorId = decoded.contractorId;
      //Check if user exists in database
      const contractor = await Contractor.findById({ _id: req.contractorId });
      console.log(contractor);
      if (!contractor)
        return res.status(403).json({ message: "Contractor Not Found" });
      next();
    });
  }
};

module.exports = { authenticateTokenUser, authenticateTokenContractor };
