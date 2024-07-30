import cryptoHash from "crypto";
import User from "../models/usermodel.js";
import {
  signUpValidator,
  signInValidator,
} from "../validation/authValidation.js";
import { formatZodError } from "../utils/errorMessage.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function hashValue(value) {
  const hash = cryptoHash.createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
}

function comparePasswords(inputPassword, hashedPassword) {
  return hashValue(inputPassword) === hashedPassword;
}

function generateOTP() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNewMail = async (email, firstname, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: {
      name: "Ticketdorm",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "e-Ticket",
    text: `Welcome to Ticketdorm.`,
    html: `
            <h2>Welcome to Ticketdorm, ${firstname}!</h2>
            <p>Thank you for signing up for our platform. We are excited to have you on board.</p>
            <p>You can now explore events, buy tickets, and more.</p>
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            <p>Happy ticketing!</p>
            <p>Best regards,</p>
            <p>The Ticketdorm Team</p>
        `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent: " + info.response, mailOptions);
  //   res.status(200).json({message: 'User registered succesfully',newUser})
};

export const signUp = async (req, res) => {
  const registerResults = signUpValidator.safeParse(req.body);
  if (!registerResults) {
    return res.status(400).json(formatZodError(registerResults.error.issues));
  }
  try {
    const { email } = req.body;
    const user = await User.findOne({ $or: [{ email }] });
    if (user) {
      res.status(409).json({ messaage: "User already exists", user});
    } else {
      const { firstname, lastname, password, confirmPassword, email } =
        req.body;

      if (password !== confirmPassword) {
        return res
          .status(403)
          .json({ message: "Password and confirmPassword do not match" });
      }
      const encryption = hashValue(password);
      const otp = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000;

      const newUser = new User({
        firstname,
        lastname,
        password: encryption,
        email,
        isVerified: false,
        otp,
        otpExpiry,
      });

     
      await newUser.save();
    
         res.status(200).json({ message: "User saved successfully", newUser });
      console.log("User saved succesfully", newUser);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: {
          name: "Ticketdorm",
          address: process.env.EMAIL_USER,
        },
        to: email,
        subject: "e-Ticket",
        text: `Your OTP for two-step verification is ${otp}. It will expire in 1 hour.`,
        html: `
                      <h2>Welcome to Ticketdorm, ${firstname}!</h2>
                      <p>Your OTP for two-step verification is <strong>${otp}</strong>. It will expire in 1 hour.</p>
                  `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response, mailOptions);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("INTERNAL SERVER ERROR", error.message);
    console.error("Error sending email:", error);
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ messaage: "Invalid or expired OTP" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const accessToken = generateTokenAndSetCookie(user._id, res);

    sendNewMail(user.email, user.firstname);
    res
      .status(200)
      .json({ message: "OTP verified successfully.", accessToken,user });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPasswordMail = async (req, res) => {
  const { Id }= req.params;
  const userId = await User.findById(Id,{_id:1});

 

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

     const resetURL = `https://ticketdorm.netlify.app/reset-password/${user._id}`;
    if (!user) {
      const response = {
        statusCode: 404,
        message: "User not found",
      };
      res.status(404).json(response);
    }
    const mailOptions = {
      from: {
        name: "Ticketdorm",
        address: process.env.EMAIL_USER,
      },
      to: user.email,
      subject: "Account password reset",
      text: `Password Reset`,
      html: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetURL}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response, mailOptions);
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    const response = {
      statusCode: 500,
      message: "Internal server error",
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};

export const resetPassword = async (req, res) => {
  const {id}  = req.params;
  const { password } = req.body;
  try {
    const user = await User.findById(id);

    if (!user) {
      const response = {
        statusCode: 404,
        message: "User not found",
      };
      res.status(404).json(response);
    }
    const hashedPassword = hashValue(password);
    user.password = hashedPassword;

    await user.save();

    const response = {
      statusCode: 200,
      message: "password reset successfully",
      data: { user: user },
    };
    return res.status(200).json(response);
  } catch (error) {
    const response = {
      statusCode: 500,
      message: "Internal server error",
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};

export const signIn = async (req, res, next) => {
  const loginResults = signInValidator.safeParse(req.body);
  if (!loginResults) {
    return res.status(400).json(formatZodError(loginResults.error.issues));
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User with email not found" });
    }
    const comparePass = comparePasswords(password, user.password);
    if (!comparePass) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const accessToken = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({ message: "User Login successful", accessToken,user });
    console.log("User Login successful", accessToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("INTERNAL SERVER ERROR", error.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("INTERNAL SERVER ERROR", error.message);
  }
};
