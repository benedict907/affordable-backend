import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import Itinerary from "../models/pdf.model";
import { upload } from "../utils/helpers/multer";
const router = Router();
const fs = require("fs");
const path = require("path");
import mime from "mime-types";

interface Flight {
  arrivalFlightNumber: string;
  departureFlightNumber: string;
  departureTime: string;
  arrivalTime: string;
  arrivalCity: string;
  departureCity: string;
}

interface EmergencyContact {
  emergencyContactKerala: string;
  emergencyNumberUK: string;
}

interface Transportation {
  service: string;
  status: string;
  transfers: string;
}

interface Hotel {
  hotelName: string;
  status: string;
  mealPlan: string;
  rooms: string;
  roomType: string;
  duration: number;
}

interface DailyTask {
  task: string;
  time?: string;
  description: string;
  bulletPoints?: string;
}

interface GroundItinerary {
  dailyTasks: DailyTask[];
}

router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "PDF Router is working" });
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json({
      message: "Itineraries fetched successfully",
      data: itineraries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

router.get(
  "/base64-image",
  async (req: Request, res: Response): Promise<void> => {
    const filename = req.query.filename;
    console.log("Filename:", filename);
    if (!filename) {
      res.status(400).json({ error: "Filename is required" });
    }
    console.log("__dirname:", process.cwd());

    const filePath = path.join(process.cwd(), "/uploads", filename);
    console.log("Uploads Directory:", filePath);
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
    }

    // Detect mime type
    const mimeType = mime.lookup(filePath);

    // Read file and encode
    fs.readFile(filePath, (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Failed to read file" });
      }

      const base64 = `data:${mimeType};base64,${data.toString("base64")}`;
      res.json({ filename, base64 });
    });
  }
);

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(id);
    if (!deletedItinerary) {
      res.status(404).json({ message: "Itinerary not found" });
      return;
    }
    res.status(200).json({
      message: "Itinerary deleted successfully",
      data: deletedItinerary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

router.post(
  "/",
  upload.single("image"), // Use multer to handle file uploads
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const imageString = req.body.image;
    const imageFile = typeof imageString === "string" ? imageString : req.file;

    // JSON fields
    const main = JSON.parse(req.body.main);
    const confirmationDetails = req.body.confirmationDetails
      ? JSON.parse(req.body.confirmationDetails)
      : null;
    const flights = JSON.parse(req.body.flights);
    const importantPoints = JSON.parse(req.body.importantPoints);
    const travelTips = JSON.parse(req.body.travelTips);
    const customBulletPoint = JSON.parse(req.body.customBulletPoint);

    const parseJSONArray = (field: string): object[] => {
      let arr: string | string[] = req.body[field] || [];
      if (typeof arr === "string") arr = [arr];
      return arr.map((item: string) => JSON.parse(item));
    };
    // Arrays: FormData appends these as strings, so they may come in as:
    // req.body['hotelItinerary[]'] -> string or array depending on count
    const hotelItinerary = parseJSONArray("hotelItinerary");
    const groundItinerary = parseJSONArray("groundItinerary");
    const transportation = parseJSONArray("transportation");

    try {
      const newItinerary = new Itinerary({
        main,
        confirmationDetails,
        flights,
        importantPoints,
        travelTips,
        customBulletPoint,
        hotelItinerary,
        groundItinerary,
        transportation,
        imageName:
          typeof imageFile === "string" ? imageFile : imageFile?.filename,
      });
      const savedItinerary = await newItinerary.save();
      res.status(201).json({
        message: "Itinerary created successfully",
        data: savedItinerary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save itinerary" });
    }
  }
);

router.put(
  "/:id",
  upload.single("image"), // Use multer to handle file uploads
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const itineraryId = req.params.id;

    try {
      // const updatedData = new Itinerary(req.body);

      const imageFile = req.file;

      // JSON fields
      const main = JSON.parse(req.body.main);
      const confirmationDetails = req.body.confirmationDetails
        ? JSON.parse(req.body.confirmationDetails)
        : null;
      const flights = JSON.parse(req.body.flights);
      const importantPoints = JSON.parse(req.body.importantPoints);
      const travelTips = JSON.parse(req.body.travelTips);
      const customBulletPoint = JSON.parse(req.body.customBulletPoint);

      const parseJSONArray = (field: string): object[] => {
        let arr: string | string[] = req.body[field] || [];
        if (typeof arr === "string") arr = [arr];
        return arr.map((item: string) => JSON.parse(item));
      };

      const hotelItinerary = parseJSONArray("hotelItinerary");
      const groundItinerary = parseJSONArray("groundItinerary");
      const transportation = parseJSONArray("transportation");

      // Update the itinerary in the database
      const updatedItinerary = await Itinerary.findByIdAndUpdate(
        itineraryId,
        {
          main,
          confirmationDetails,
          flights,
          importantPoints,
          travelTips,
          customBulletPoint,
          hotelItinerary,
          groundItinerary,
          transportation,
          imageName: imageFile?.filename,
        },
        { new: true, runValidators: true } // Options: return the updated document and validate the changes
      );

      // Check if the itinerary was found and updated
      if (!updatedItinerary) {
        res.status(404).json({ error: "Itinerary not found" });
      }

      res.status(200).json({
        message: "Itinerary updated successfully",
        data: updatedItinerary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save itinerary" });
    }
  }
);
export default router;
