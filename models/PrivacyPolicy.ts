import mongoose, { Schema, Document } from "mongoose";

interface IPrivacyPolicy extends Document {
  contentEng: string;
  contentFre: string;
  createdAt: Date;
}

const PrivacyPolicySchema: Schema = new Schema({
  contentEng: {
    type: String,
    required: true,
  },
  contentFre: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PrivacyPolicy ||
  mongoose.model<IPrivacyPolicy>("PrivacyPolicy", PrivacyPolicySchema);
