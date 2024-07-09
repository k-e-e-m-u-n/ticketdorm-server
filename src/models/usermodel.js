import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstname: {
        type : String,
        required : true
    },
    lastname: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    confirmPassword: {
        type : String,
        // required : true
    },
    email: {
        type : String,
        required : true,
        unique: true
    },
    isVerified: {
        type : Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date
})

const User = mongoose.model('User',userSchema)
export default User