import { Response } from "express";

import CustomRequest from "../utils/types/express";
import Itinerary from "../models/pdf.model";

const create = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const newItinerary = new Itinerary(req.body); // Create a new itinerary document
    const savedItinerary = await newItinerary.save(); // Save to MongoDB
    res.status(201).json({
      message: "Itinerary created successfully",
      data: savedItinerary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save itinerary" });
  }
};

export default {
  create,
};
