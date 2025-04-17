import mongoose, { Model, Schema } from "mongoose";
const itinerarySchema = new Schema({
  confirmationDetails: {
    type: {
      confirmationNumber: { type: String, required: true },
      passengerList: {
        type: [String],
        required: true,
      },
      selectedEndDate: { type: String, required: false },
      selectedStartDate: { type: String, required: false },
    },
    required: false,
  },
  imageName: {
    type: String,
    required: false,
  },
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
      arrivalFlightNumber: { type: String, required: false },
      departureFlightNumber: { type: String, required: false },
      departureTime: { type: String, required: false },
      arrivalTime: { type: String, required: false },
      arrivalCity: { type: String, required: false },
      departureCity: { type: String, required: false },
    },

    required: false,
  },
  emergencyContacts: {
    type: {
      emergencyContactKerala: { type: String, required: false },
      emergencyNumberUK: { type: String, required: false },
    },

    required: false,
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
