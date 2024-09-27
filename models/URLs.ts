import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  hostEmail: string;
  urls: { url: string; isActive: boolean }[]; // Update this line
}

const UrlSchema: Schema = new Schema({
  hostEmail: { type: String, required: true },
  urls: [
    {
      url: { type: String, required: true },
      isActive: { type: Boolean, required: true, default: true },
    },
  ],
});

const Url = mongoose.models.Url || mongoose.model<IUrl>("Url", UrlSchema);
export default Url;
