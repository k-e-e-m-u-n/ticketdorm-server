import Event from "../models/eventmodel.js";
import User from "../models/usermodel.js";
import cloudinaryMediaUpload from "../config/cloudinary.js";

export const createEvent = async (req, res) => {
  const {
    eventCategory,
    eventName,
    eventDate,
    eventTime,
    duration,
    eventDescription,
    ticketPrice,
    eventLocation,
    eventCapacity,
    aboutEvent,
    firstname,
    eventCoverPhotos,
  } = req.body;

  const files = req.files;

  try {
    const postedBy = req.user;

    const {firstname,lastname} = await User.findById(postedBy, { firstname: 1,lastname: 1 });

    if (!files || files.length === 0) {
      const response = {
        statusCode: 400,
        message: "At least one event cover photo is required",
      };
      return res.status(400).json(response);
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinaryMediaUpload(
          file.path,
          "event_cover_photos"
        );
        return result.url;
      })
    );

    const policy = "Contact organizer for refund";
    const event = await Event.findOne({ eventName });
    if (event) {
      const response = {
        statusCode: 409,
        message: "Event name already exists",
      };
      return res.status(409).json(response);
    }
    const newEvent = new Event({
      firstname: firstname,
      postedBy,
      eventCategory,
      eventName,
      eventDate,
      eventTime,
      duration,
      refundPolicy: policy,
      eventDescription,
      ticketPrice,
      eventLocation,
      eventCapacity,
      aboutEvent,
      eventCoverPhotos: uploadedImages,
    });

    await newEvent.save();
    console.log(newEvent);
    const response = {
      statusCode: 201,
      message: "Event created successfully",
      data: { newEvent },
    };
    return res.status(201).json(response);
  } catch (error) {
    const response = {
      statusCode: 500,
      message: "Internal server error",
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const response = {
      statusCode: 200,
      message: "events fetched successfully",
      data: { events },
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

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      const response = {
        statusCode: 404,
        message: "Event not found",
      };
      return res.status(404).json(response);
    }
    const response = {
      statusCode: 200,
      message: "Event fetched successfully",
      data: { event },
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

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    eventCategory,
    eventName,
    eventDate,
    eventTime,
    duration,
    refundPolicy,
    eventDescription,
    ticketPrice,
    eventLocation,
    eventCapacity,
  } = req.body;
  try {
    const event = await Event.findById(id);
    if (!event) {
      const response = {
        statusCode: 404,
        message: "Event not found",
      };
      return res.status(404).json(response);
    }

    event.eventCategory = eventCategory;
    event.eventName = eventName;
    event.eventDate = eventDate;
    event.eventTime = eventTime;
    event.duration = duration;
    event.refundPolicy = refundPolicy;
    event.eventDescription = eventDescription;
    event.ticketPrice = ticketPrice;
    event.eventLocation = eventLocation;
    event.eventCapacity = eventCapacity;

    await event.save();

    const response = {
      statusCode: 200,
      message: "Event updated successfully",
      data: { event },
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

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      const response = {
        statusCode: 404,
        message: "Event not found",
      };
      return res.status(404).json(response);
    }

    const publicId = event.eventCoverPhotos.split("/").pop().split(".")[0];
    await cloudinaryMediaUpload.destroy(publicId);

    await event.remove();

    const response = {
      statusCode: 200,
      message: "Event deleted successfully",
      data: { event },
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

export const deleteAllEvent = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) {
      const response = {
        statusCode: 404,
        message: "Events not found",
      };
      return res.status(404).json(response);
    }

    // const publicId = events.eventCoverPhotos.split("/").pop().split(".")[0];
    // await cloudinaryMediaUpload.destroy(publicId);

    // await events.remove();

    const response = {
      statusCode: 200,
      message: "Events deleted successfully",
      data: { events },
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
