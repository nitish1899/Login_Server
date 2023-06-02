const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOTPverificationSchema = new Schema({
  userId : { type: String, required : true },
  otp: { type: String, required : true },
  createdAt : Date,
  expiresAt : Date
});

module.exports = mongoose.model('userOTPverification',userOTPverificationSchema);