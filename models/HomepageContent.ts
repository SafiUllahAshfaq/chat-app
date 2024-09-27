import mongoose, { Schema, Document, Model } from "mongoose";

interface IHomepageContent extends Document {
  backgroundImage: string;
  textFre: string;
  textEng: string;
  titleFre: string;
  titleEng: string;
}

const HomepageContentSchema: Schema = new Schema({
  backgroundImage: { type: String, required: true }, // base64 encoded string
  textFre: { type: String, required: true },
  textEng: { type: String, required: true },
  titleFre: { type: String, required: true },
  titleEng: { type: String, required: true },
});

const HomepageContent: Model<IHomepageContent> =
  mongoose.models.HomepageContent ||
  mongoose.model<IHomepageContent>("HomepageContent", HomepageContentSchema);

export default HomepageContent;
