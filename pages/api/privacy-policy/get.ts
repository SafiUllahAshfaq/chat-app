import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import PrivacyPolicy from "../../../models/PrivacyPolicy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  try {
    const policy = await PrivacyPolicy.findOne().sort({ createdAt: -1 }).exec();
    if (!policy) {
      return res.status(404).json({ message: "Privacy policy not found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
