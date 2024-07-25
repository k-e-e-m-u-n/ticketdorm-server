import nodemailer from "nodemailer";
import Ticket from "../models/ticketsmodel.js";
import Event from "../models/eventmodel.js";
import {
  initializePayment,
  verifyPayment,
} from "../service/paystackservice.js";
import generateQRCode from "../utils/qrcodegenerator.js";
import createTicketHTML from "../utils/createticketHtml.js";
import generateTicketPDF from "../utils/generateTicketPdf.js";
import generateUniqueCode from "../utils/generatecode.js";
import dotenv from "dotenv";
import { create } from "qrcode";

dotenv.config();

export const buyTicket = async (req, res) => {
  const eventId = req.params.id;
  const {
    eventName,
    eventLocation,
    eventTime,
    eventDate,
    ticketPrice,
    postedBy,
  } = await Event.findById(eventId, {
    eventLocation: 1,
    eventTime: 1,
    eventName: 1,
    eventDate: 1,
    ticketPrice: 1,
    postedBy: 1,
  });

  if (
    !eventName ||
    !eventLocation ||
    !eventTime ||
    !eventDate ||
    !ticketPrice ||
    !postedBy
  ) {
    return res.status(404).json({ message: "Event ticket not found" });
  }

  const { event, buyer, email, phoneNumber } = req.body;

  try {
    const paymentResponse = await initializePayment(email, ticketPrice);

    let qrCodeBuffer;
    const type = "General Admission";
    const uniqueCode = generateUniqueCode();

    const eventDetails = {
      event: eventName,
      date: eventDate,
      location: eventLocation,
      buyer,
      time: eventTime,
      ticketType: type,
      orderNumber: uniqueCode,
    };
    //  qrCodeBuffer = await generateQRCode(`${buyer}`, `${event}`);

    console.log(eventDetails);

    const newTicket = new Ticket({
      postedBy,
      event: eventName,
      buyer,
      email,
      phoneNumber,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      ticketType: type,
      orderNumber: uniqueCode,
      eventDetails: eventDetails,
      // qrCodeBuffer: qrCodeBuffer,
    });

    await newTicket.save();

    console.log(newTicket);

    res.status(200).json({
      success: newTicket,
      authorization_url: paymentResponse.data.authorization_url,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleCallback = async (req, res) => {
  const reference = req.query.reference;
  let qrCodeBuffer;
  try {
    const response = await verifyPayment(reference);

    console.log("Payment verification response:", response);
    if (response) {
      const { status } = response.data;
      const { customer } = response.data;

      const ticket = await Ticket.findOne({ email: customer.email });

      if (status !== "success") {
        return res.status(400).json({ message: "Payment not successful" });
      } else {
        ticket.isPaid = true;
      }
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
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
      qrCodeBuffer = await generateQRCode(`${ticket.buyer}`, `${ticket.event}`);
      // const eventDetails = {
      //   event: eventName,
      //   date: eventDate,
      //   location: eventLocation,
      //   buyer,
      //   time: eventTime,
      //   ticketType: type,
      //   orderNumber: uniqueCode,
      // };

      const eventDetails = {
        event: ticket.event,
        date: ticket.date,
        location: ticket.location,
        buyer: ticket.buyer,
        time: ticket.time,
        ticketType: ticket.ticketType,
        orderNumber: ticket.orderNumber,
      };
      // const eventDetails = {
      //   event: ticket.eventDetails.event,
      //   date: ticket.eventDetails.date,
      //   location: ticket.eventDetails.location,
      //   buyer: ticket.eventDetails.buyer,
      //   time: ticket.eventDetails.time,
      //   ticketType: ticket.eventDetails.ticketType,
      //   orderNumber: ticket.eventDetails.orderNumber,
      // };
      // qrCodeBuffer = await generateQRCode(`${eventDetails.buyer}`, `${eventDetails.event}`);
      // console.log(eventDetails);

      const pdfBytes = await generateTicketPDF(eventDetails, qrCodeBuffer);

      const ticketHTML = createTicketHTML(
        ticket.event,
        ticket.buyer,
        ticket.orderNumber
      );

      const mailOptions = {
        from: {
          name: "Ticketdorm",
          address: process.env.EMAIL_USER,
        },
        to: ticket.email,
        subject: "e-Ticket",
        html: ticketHTML,
        attachments: [
          {
            filename: "ticket.pdf",
            content: pdfBytes,
            contentType: "application/pdf",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);

      console.log("Email sent: " + info.response, mailOptions);
      res.status(200).json({
        success: info.response,
        ticket,
        response,
      });
    } else {
      // Log the unexpected response structure
      console.error("Unexpected response structure:", response);
      res.status(500).json({ error: "Unexpected response structure" });
    }

    // res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
