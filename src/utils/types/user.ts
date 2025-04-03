import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  userId: string;
  email: string;
  passwordHash: string;
  role: "AD" | "GU" | "MG" | "SO";
  permissions: string;
  profile: mongoose.Types.ObjectId;
  isActive: boolean;
  remarks: string;
  isDeleted: boolean;
  _id: mongoose.Types.ObjectId;
}

export interface ResetPasswordDto {
  oldPassword: string;
  newPassword: string;
}
