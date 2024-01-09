const mongoose = require("mongoose");
const mongooseConnect = () => {
  mongoose
    .connect(
      "mongodb+srv://vicky:vicky@cluster0.ydgfpxj.mongodb.net/Scanteen",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
};
module.exports = mongooseConnect;
