import paystack from 'paystack';
import dotenv from 'dotenv'
dotenv.config()

const paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY);

export const initializePayment = async (email, amount) => {
    try {
      const response = await paystackInstance.transaction.initialize({
        email, // The email of the user making the payment
        amount, // The amount to be paid
        callback_url: 'http://ticketdorm.netlify.app/payment/callback', // The URL to redirect to after payment
      //   headers: {
      //     'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
      // }
      });
      return response;
    } catch (error) {
      throw new Error(error.message); // Handle any errors that occur
    }
  };

  export const verifyPayment = async (reference) => {
    try {
      const response = await paystackInstance.transaction.verify(reference);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  