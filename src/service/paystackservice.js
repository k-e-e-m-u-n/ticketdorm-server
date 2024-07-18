import axios from "axios";
import Event from "../models/eventmodel.js";
import dotenv from "dotenv";

dotenv.config();

// Create an axios instance to interact with Paystack's API
const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Function to create a subaccount
// export const createSubaccount = async (
//   businessName,
//   settlementBank,
//   accountNumber
// ) => {
//   const payload = {
//     business_name: businessName,
//     settlement_bank: settlementBank,
//     account_number: accountNumber,
//     percentage_charge: 0.0
//   };

//   try {
//     const response = await paystack.post("/subaccount", payload);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Subaccount creation failed");
//   }
// };

// Function to initialize a payment
export const initializePayment = async (
  email,amount
) => {

  
  const payload = {
    email,
    amount:amount * 100,
    callback_url: "http://ticketdorm.netlify.app/payment/callback", // Change this URL based on your environment
  };

  try {
    const response = await paystack.post("/transaction/initialize", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Payment initialization failed");
  }
};

// Function to verify a payment
export const verifyPayment = async (reference) => {
  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Payment verification failed");
  }
};
















// import paystack from 'paystack';
// import dotenv from 'dotenv'
// dotenv.config()

// const paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY);

// export const initializePayment = async (email, amount) => {
//     try {
//       const response = await paystackInstance.transaction.initialize({
//         email, // The email of the user making the payment
//         amount, // The amount to be paid
//         callback_url: 'http://ticketdorm.netlify.app/payment/callback', // The URL to redirect to after payment
//       //   headers: {
//       //     'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
//       // }
//       });
//       return response;
//     } catch (error) {
//       throw new Error(error.message); // Handle any errors that occur
//     }
//   };

//   export const verifyPayment = async (reference) => {
//     try {
//       const response = await paystackInstance.transaction.verify(reference);
//       return response;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   };
  