import mongoose from 'mongoose';

const eventTypeEnum = [
  'Party',
  'Comedy',
  'Concert',
  'Health & Wellbeing',
  'Food & drinks',
  'Nightlife',
  'Sports & Fitness',
  'Religion',
];

const ticketSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: eventTypeEnum,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  eventCoverPhotos: [{
    type: String,
    required: true,
  }],
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
