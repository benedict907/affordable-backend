import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import Itinerary from "../models/pdf.model";
const router = Router();

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
  [
    // Flights Validation
    body("flights")
      .exists()
      .withMessage("Flights are required.")
      .custom((flights: Flight) => {
        if (
          typeof flights.arrivalFlightNumber !== "string" ||
          typeof flights.departureFlightNumber !== "string" ||
          typeof flights.departureTime !== "string" ||
          typeof flights.arrivalTime !== "string" ||
          typeof flights.arrivalCity !== "string" ||
          typeof flights.departureCity !== "string"
        ) {
          throw new Error("Each flight must have valid fields.");
        }

        return true;
      }),

    // Emergency Contact Validation
    body("emergencyContacts")
      .exists()
      .withMessage("Emergency contact is required.")
      .custom((contact: EmergencyContact) => {
        if (
          typeof contact.emergencyContactKerala !== "string" ||
          typeof contact.emergencyNumberUK !== "string"
        ) {
          throw new Error("Each contact must have valid fields.");
        }

        return true;
      }),

    // Transportation Validation
    body("transportation")
      .exists()
      .withMessage("Transportation is required.")
      .isArray()
      .withMessage("Transportation must be an array.")
      .custom((transportation: Transportation[]) => {
        transportation.forEach((item: Transportation) => {
          if (
            typeof item.service !== "string" ||
            typeof item.status !== "string" ||
            typeof item.transfers !== "string"
          ) {
            throw new Error("Each transportation item must have valid fields.");
          }
        });
        return true;
      }),

    // Hotel Validation
    body("hotelItinerary")
      .exists()
      .withMessage("Hotel details are required.")
      .isArray()
      .withMessage("Hotel must be an array.")
      .custom((hotels) => {
        interface Hotel {
          hotelName: string;
          status: string;
          mealPlan: string;
          rooms: string;
          roomType: string;
          duration: number;
        }

        hotels.forEach((hotel: Hotel) => {
          if (
            typeof hotel.hotelName !== "string" ||
            typeof hotel.status !== "string" ||
            typeof hotel.mealPlan !== "string" ||
            typeof hotel.rooms !== "string" ||
            typeof hotel.roomType !== "string" ||
            typeof hotel.duration !== "number"
          ) {
            throw new Error("Each hotel must have valid fields.");
          }
        });
        return true;
      }),

    // Ground Itinerary Validation
    body("groundItinerary")
      .exists()
      .withMessage("Ground itinerary is required.")
      .isArray()
      .withMessage("Ground itinerary must be an array.")
      .custom((itineraries) => {
        interface DailyTask {
          task: string;
          time?: string;
          description: string;
          bulletPoints?: string;
        }

        interface GroundItinerary {
          dailyTasks: DailyTask[];
        }

        itineraries.forEach((itinerary: GroundItinerary) => {
          if (!Array.isArray(itinerary.dailyTasks)) {
            throw new Error("Daily tasks must be an array.");
          }
        });
        return true;
      }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const newItinerary = new Itinerary(req.body);
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
  [
    // Flights Validation
    body("flights")
      .exists()
      .withMessage("Flights are required.")
      .custom((flights: Flight) => {
        if (
          typeof flights.arrivalFlightNumber !== "string" ||
          typeof flights.departureFlightNumber !== "string" ||
          typeof flights.departureTime !== "string" ||
          typeof flights.arrivalTime !== "string" ||
          typeof flights.arrivalCity !== "string" ||
          typeof flights.departureCity !== "string"
        ) {
          throw new Error("Each flight must have valid fields.");
        }

        return true;
      }),

    // Emergency Contact Validation
    body("emergencyContacts")
      .exists()
      .withMessage("Emergency contact is required.")
      .custom((contact: EmergencyContact) => {
        if (
          typeof contact.emergencyContactKerala !== "string" ||
          typeof contact.emergencyNumberUK !== "string"
        ) {
          throw new Error("Each contact must have valid fields.");
        }

        return true;
      }),

    // Transportation Validation
    body("transportation")
      .exists()
      .withMessage("Transportation is required.")
      .isArray()
      .withMessage("Transportation must be an array.")
      .custom((transportation: Transportation[]) => {
        transportation.forEach((item: Transportation) => {
          if (
            typeof item.service !== "string" ||
            typeof item.status !== "string" ||
            typeof item.transfers !== "string"
          ) {
            throw new Error("Each transportation item must have valid fields.");
          }
        });
        return true;
      }),

    // Hotel Validation
    body("hotelItinerary")
      .exists()
      .withMessage("Hotel details are required.")
      .isArray()
      .withMessage("Hotel must be an array.")
      .custom((hotels) => {
        interface Hotel {
          hotelName: string;
          status: string;
          mealPlan: string;
          rooms: string;
          roomType: string;
          duration: number;
        }

        hotels.forEach((hotel: Hotel) => {
          if (
            typeof hotel.hotelName !== "string" ||
            typeof hotel.status !== "string" ||
            typeof hotel.mealPlan !== "string" ||
            typeof hotel.rooms !== "string" ||
            typeof hotel.roomType !== "string" ||
            typeof hotel.duration !== "number"
          ) {
            throw new Error("Each hotel must have valid fields.");
          }
        });
        return true;
      }),

    // Ground Itinerary Validation
    body("groundItinerary")
      .exists()
      .withMessage("Ground itinerary is required.")
      .isArray()
      .withMessage("Ground itinerary must be an array.")
      .custom((itineraries) => {
        interface DailyTask {
          task: string;
          time?: string;
          description: string;
          bulletPoints?: string;
        }

        interface GroundItinerary {
          dailyTasks: DailyTask[];
        }

        itineraries.forEach((itinerary: GroundItinerary) => {
          if (!Array.isArray(itinerary.dailyTasks)) {
            throw new Error("Daily tasks must be an array.");
          }
        });
        return true;
      }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const itineraryId = req.params.id;
    console.log("dsfsdf", itineraryId);
    try {
      // const updatedData = new Itinerary(req.body);
      const { _id, ...updatedData } = req.body;

      // Update the itinerary in the database
      const updatedItinerary = await Itinerary.findByIdAndUpdate(
        itineraryId,
        updatedData,
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
