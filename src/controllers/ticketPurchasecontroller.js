import nodemailer from "nodemailer";
import Ticket from "../models/ticketsmodel.js";
// import Payment from "../models/payment.js";
import eventTicket from "../models/eventmodel.js";
// import { initializePayment, verifyPayment } from '../service/paystackservice.js';
import generateQRCode from "../utils/qrcodegenerator.js";
import createTicketHTML from "../utils/createticketHtml.js";
import generateTicketPDF from "../utils/generateTicketPdf.js";
import generateUniqueCode from "../utils/generatecode.js";
import dotenv from "dotenv";

dotenv.config();

export const sendTicketMail = async (req, res) => {
  const eventId = req.params.id;
  const { eventName, eventLocation, eventTime, eventDate } =
    await eventTicket.findById(eventId, {
      eventLocation: 1,
      eventTime: 1,
      eventName: 1,
      eventDate: 1,
    });

  if (!eventName || !eventLocation || !eventTime || !eventDate) {
    return res.status(404).json({ message: "Event ticket not found" });
  }

  const { event, buyer, email, phoneNumber, date, time, location } = req.body;

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

  let qrCodeBuffer;
  try {
    const type = "General Admission";
    const uniqueCode = generateUniqueCode();
    qrCodeBuffer = await generateQRCode(`${buyer}`, `${event}`);

    const eventDetails = {
      event: eventName,
      date: eventDate,
      location: eventLocation,
      buyer,
      time: eventTime,
      ticketType: type,
      orderNumber: uniqueCode,
    };

    const pdfBytes = await generateTicketPDF(eventDetails, qrCodeBuffer);

    const newTicket = new Ticket({
      event: eventName,
      buyer,
      email,
      phoneNumber,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      ticketType: type,
      orderNumber: uniqueCode,
    });

    await newTicket.save();

    console.log(newTicket);

    const ticketHTML = createTicketHTML(event, buyer, uniqueCode);

    const mailOptions = {
      from: {
        name: "Ticketbooth",
        address: process.env.EMAIL_USER,
      },
      to: email,
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
    res.status(200).json({ success: info.response, newTicket });
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: error.message });
  }
};
