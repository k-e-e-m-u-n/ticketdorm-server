import Ticket from '../models/ticketmodel.js';
import cloudinaryMediaUpload from '../config/cloudinary.js';


export const createTicket = async (req, res) => {
    const { eventType, eventName, eventDate, eventTime, duration } = req.body;
    const files = req.files;
  
    try {
      if (!files || files.length === 0) {
        const response = {
          statusCode: 400,
          message: 'At least one event cover photo is required',
        };
        return res.status(400).json(response);
      }
  
      const uploadedImages = await Promise.all(files.map(async (file) => {
        const result = await cloudinaryMediaUpload(file.path, 'event_cover_photos');
        return result.url;
      }));
  
      const ticket = new Ticket({
        eventType,
        eventName,
        eventDate,
        eventTime,
        duration,
        eventCoverPhotos: uploadedImages,
      });
  
      await ticket.save();
  
      const response = {
        statusCode: 201,
        message: 'Ticket created successfully',
        data: { ticket },
      };
      return res.status(201).json(response);
    } catch (error) {
      const response = {
        statusCode: 500,
        message: 'Internal server error',
        error: { message: error.message },
      };
      return res.status(500).json(response);
    }
  };

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const response = {
      statusCode: 200,
      message: 'Tickets fetched successfully',
      data: { tickets },
    };
    return res.status(200).json(response);
  } catch (error) {
    const response = {
      statusCode: 500,
      message: 'Internal server error',
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};

export const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      const response = {
        statusCode: 404,
        message: 'Ticket not found',
      };
      return res.status(404).json(response);
    }
    const response = {
      statusCode: 200,
      message: 'Ticket fetched successfully',
      data: { ticket },
    };
    return res.status(200).json(response);
  } catch (error) {
    const response = {
      statusCode: 500,
      message: 'Internal server error',
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { eventType, eventName, eventDate, eventTime, duration } = req.body;
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      const response = {
        statusCode: 404,
        message: 'Ticket not found',
      };
      return res.status(404).json(response);
    }

    ticket.eventType = eventType;
    ticket.eventName = eventName;
    ticket.eventDate = eventDate;
    ticket.eventTime = eventTime;
    ticket.duration = duration;

    await ticket.save();

    const response = {
      statusCode: 200,
      message: 'Ticket updated successfully',
      data: { ticket },
    };
    return res.status(200).json(response);
  } catch (error) {
    const response = {
      statusCode: 500,
      message: 'Internal server error',
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      const response = {
        statusCode: 404,
        message: 'Ticket not found',
      };
      return res.status(404).json(response);
    }

    const publicId = ticket.eventCoverPhotos.split('/').pop().split('.')[0];
    await cloudinaryMediaUpload.destroy(publicId);

    await ticket.remove();

    const response = {
      statusCode: 200,
      message: 'Ticket deleted successfully',
      data: { ticket },
    };
    return res.status(200).json(response);
  } catch (error) {
    const response = {
      statusCode: 500,
      message: 'Internal server error',
      error: { message: error.message },
    };
    return res.status(500).json(response);
  }
};
