import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import HomepageContent from "../../../models/HomepageContent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { backgroundImage, textFre,textEng, titleFre, titleEng } = req.body;

  if (!backgroundImage || !textFre || !textEng || !titleFre || !titleEng) {
    return res
      .status(400)
      .json({ message: "All fields are required" });
  }

  try {
    let content = await HomepageContent.findOne();

    if (content) {
      content.backgroundImage = backgroundImage;
      content.textFre = textFre;
      content.textEng = textEng;
      content.titleFre = titleFre;
      content.titleEng = titleEng;
      await content.save();
    } else {
      content = new HomepageContent({ backgroundImage, textFre, textEng, titleFre, titleEng });
      await content.save();
    }

    res.status(201).json({ message: "Homepage content updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
