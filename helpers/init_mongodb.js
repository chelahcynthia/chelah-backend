const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("database is connected 😃");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
