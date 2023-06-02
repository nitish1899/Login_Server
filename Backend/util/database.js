const mongoose = require("mongoose");
// require('dotenv').config();
mongoose.set('strictQuery', false)
const URL = process.env.DATABASE;
// Connect to database
try {
  mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Database Connected Successfully");
} catch (err) {
  console.log("Database Not Connected");
}