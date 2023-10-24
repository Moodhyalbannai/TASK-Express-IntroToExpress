const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_DB);
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to Database");
  } catch (error) {
    console.log("There was error with connecting to DB");
  }
};

module.exports = connectDB;
