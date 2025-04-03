import mongoose, { Model, Schema } from "mongoose";
const itinerarySchema = new Schema({
  main: {
    type: {
      title: { type: String, required: true },
      numberOfDays: { type: Number, required: true },
      emergencyContact: { type: String, required: false },
      emergencyNumber: { type: String, required: false },
    },

    required: true,
  },
  flights: {
    type: {
      arrivalFlightNumber: { type: String, required: true },
      departureFlightNumber: { type: String, required: true },
      departureTime: { type: String, required: true },
      arrivalTime: { type: String, required: true },
      arrivalCity: { type: String, required: true },
      departureCity: { type: String, required: true },
    },

    required: true,
  },
  emergencyContacts: {
    type: {
      emergencyContactKerala: { type: String, required: false },
      emergencyNumberUK: { type: String, required: false },
    },

    required: true,
  },
  transportation: {
    type: [
      {
        service: { type: String, required: true },
        status: { type: String, required: true },
        transfers: { type: String, required: true },
      },
    ],
    required: true,
  },
  hotelItinerary: {
    type: [
      {
        hotelName: { type: String, required: true },
        status: { type: String, required: true },
        mealPlan: { type: String, required: true },
        rooms: { type: String, required: true },
        duration: { type: Number, required: true },
        roomType: { type: String, required: true },
      },
    ],
    required: true,
  },
  groundItinerary: {
    type: [
      {
        dailyTasks: {
          type: [
            {
              time: { type: String, required: false }, // Optional as you left it blank in some entries
              task: { type: String, required: false },
              description: { type: String, required: false },
              bulletPoints: { type: String, required: false },
            },
          ],
          required: true,
        },
      },
    ],
    required: true,
  },
  importantPoints: {
    type: String,
    required: false,
  },
  travelTips: {
    type: String,
    required: false,
  },
  customBulletPoint: {
    type: {
      title: { type: String, required: false },
      bulletPoints: { type: String, required: false },
    },

    required: false,
  },
});

// module.exports = mongoose.model("Itinerary", itinerarySchema);
const Itinerary: Model<any> = mongoose.model<any>("Itinerary", itinerarySchema);

export default Itinerary;
