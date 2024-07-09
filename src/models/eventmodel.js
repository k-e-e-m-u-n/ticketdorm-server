import mongoose from "mongoose";

const eventCategoryEnum = [
  "Party",
  "Comedy",
  "Concert",
  "Health & Wellbeing",
  "Food & drinks",
  "Nightlife",
  "Sports & Fitness",
  "Religion",
];

const eventSchema = new mongoose.Schema(
  {
    eventCategory: {
      type: String,
      enum: eventCategoryEnum,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    eventCoverPhotos: [
      {
        type: String,
        // required: true,
      },
    ],
    refundPolicy: {
      type: String,
    },
    eventDescription: {
      type: String,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventCapacity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;