import mongoose, { Document, Schema } from "mongoose";

export interface IHost extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  image: Buffer | null;
  resetCode: string | null; // New field for reset token
  resetCodeExpiry: Date | null; // Expiry time for reset token
}

const HostSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: Buffer, default: null }, // Ensure image is of type Buffer
  resetCode: { type: String, default: null }, // Reset token field
  resetCodeExpiry: { type: Date, default: null }, // Expiry time for reset token
});

const Host = mongoose.models.Host || mongoose.model<IHost>("Host", HostSchema);
export default Host;
