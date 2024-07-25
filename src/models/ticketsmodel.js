import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  event: {
    type: String,
  },
  buyer: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  ticketType: {
    type: String,
  },
  time: {
    type: String,
  },
  // location: {
  //   type: String,
  // },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  qrCode: {
    type: Buffer,
  },
  date: {
    type: String,
  },
  eventDetails: {
    type: Object,
  },
  qrCodeBuffer: {
    type: Buffer,
  },
  postedBy: {
    type: String,
  },
  pdfbytes: {
    type: Buffer,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  eventId: {
    type: String,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
