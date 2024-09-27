import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import HomepageContent from "../../../models/HomepageContent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const content = await HomepageContent.findOne(); // Assuming there's only one entry
    if (!content) {
      return res.status(404).json({ message: "Homepage content not found" });
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
