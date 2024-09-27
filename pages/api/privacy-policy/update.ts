import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import PrivacyPolicy from "../../../models/PrivacyPolicy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { contentEng, contentFre } = req.body;

  if (!contentEng || !contentFre) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const newPolicy = new PrivacyPolicy({ contentEng, contentFre });
    await newPolicy.save();
    res.status(201).json({ message: "Privacy policy updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
