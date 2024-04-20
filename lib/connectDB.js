const mongoose = require("mongoose");

const connectDb = async () => {
  const URL = process.env.MONGO_URL;
  try {
    await mongoose.connect(URL);
    console.log("Mongoose Server Start");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  connectDb,
};
