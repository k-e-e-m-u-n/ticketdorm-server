import User from "../models/usermodel.js";
import Ticket from "../models/ticketsmodel.js";
import Event from "../models/eventmodel.js";
import cloudinaryMediaUpload from "../config/cloudinary.js";

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    profilePhoto,
    phoneNumber,
    accountNumber,
    accountName,
    bank,
    facebookLink,
    twitterLink,
    instagramLink,
  } = req.body;

  const files = req.files;

  try {
    if (!files || files.length === 0) {
      const response = {
        statusCode: 400,
        message: "At least one photo is required",
      };
      return res.status(400).json(response);
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinaryMediaUpload(file.path, "user_photos");
        return result.url;
      })
    );

    const user = await User.findById(id);
    if (!user) {
      const response = {
        statusCode: 404,
        message: "User not found",
      };
      return res.status(404).json(response);
    }

    user.profilePhoto = uploadedImages[0];
    user.phoneNumber = phoneNumber;
    user.accountNumber = accountNumber;
    user.accountName = accountName;
    user.bank = bank;
    user.facebookLink = facebookLink;
    user.twitterLink = twitterLink;
    user.instagramLink = instagramLink;

    await user.save();

    const response = {
      statusCode: 200,
      message: "User profile updated successfully",
      data: { user },
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

export const getTicketsSold  = async (req,res) => {

  const userId = req.params.id;
  try {
    const ticketsSoldCount = await Ticket.countDocuments({ postedBy: userId });
    const tickets = await Ticket.find({ postedBy: userId });

    res.status(200).json({ ticketsSold: ticketsSoldCount, tickets });
  } catch (error) {
    console.error("Error fetching tickets sold:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }

}

export const getEventsMade = async (req, res) => {
  const userId = req.params.id;
  try {
  
    const eventsmadeCount = await Event.countDocuments({ postedBy: userId });
    const events = await Event.find({ postedBy: userId });

    res.status(200).json({ eventsMade: eventsmadeCount,events});
  } catch (error) {
    console.error("Error fetching events made:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

