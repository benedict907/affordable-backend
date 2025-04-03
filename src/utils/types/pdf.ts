import mongoose, { Document } from "mongoose";

export interface PDFType extends Document {
  title: string;
  days?: number;
  emergencyContact: string;
  emergencyNumber: string;
  isDeleted: boolean;
  flightDetails?: mongoose.Types.ObjectId[];
  emergencyContacts?: mongoose.Types.ObjectId[];
}
