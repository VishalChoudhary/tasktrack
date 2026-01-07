const mongoose = require("mongoose");

const connetDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connection Successful");
    console.log(`Database: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.log("MongoDB Connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connetDB;
