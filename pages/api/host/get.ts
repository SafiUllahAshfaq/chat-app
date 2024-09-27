// pages/api/host/get.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Host from "../../../models/Host";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const host = await Host.findOne({ email });
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    const image = host.image ? host.image.toString("base64") : null;

    return res.status(200).json({
      firstName: host.firstName,
      lastName: host.lastName,
      email: host.email,
      address: host.address,
      zipCode: host.zipCode,
      city: host.city,
      country: host.country,
      image,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
