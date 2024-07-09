import Contact from "../models/contactUsModel.js";

export const createContact = async (req,res) => {
    const {
        firstName,
        lastName,
        email,
        message
    } = req.body

    try {
        const newMessage = new Contact({
                firstName,
                lastName,
                email,
                message
        })

        await newMessage.save()

        return res.status(201).json({message:'Message sent succesfully',newMessage});
    } catch (error) {
        const response = {
            statusCode: 500,
            message: 'Internal server error',
            error: { message: error.message },
          };
          return res.status(500).json(response);
        }
}