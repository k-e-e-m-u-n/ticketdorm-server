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
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
