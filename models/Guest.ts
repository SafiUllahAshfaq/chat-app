// models/Guest.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IGuest extends Document {
  guestId: string;
  hostId: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  image?: Buffer; // Add image field
}

const GuestSchema: Schema = new Schema({
  guestId: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: Buffer }, // Add image field
});

const Guest =
  mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);
export default Guest;
