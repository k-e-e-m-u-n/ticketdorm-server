import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    // required : true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpiry: Date,
  profilePhoto: {
    type: [String],
  },
  phoneNumber: {
    type: String,
  },
  accountNumber: {
    type: Number,
  },
  accountName: {
    type: String,
  },
  bank: {
    type: String,
  },
  facebookLink: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  instagramLink: {
    type: String,
  },
});

const User = mongoose.model('User',userSchema)
export default User