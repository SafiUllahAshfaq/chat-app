import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Host from "../../../models/Host";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Adjust if needed
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, firstName, lastName, address, zipCode, city, country, image } =
    req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const updatedHost = await Host.findOneAndUpdate(
      { email },
      {
        firstName,
        lastName,
        address,
        zipCode,
        city,
        country,
        ...(image && { image: Buffer.from(image, "base64") }),
      },
      { new: true }
    );

    if (!updatedHost) {
      return res.status(404).json({ message: "Host not found" });
    }

    return res.status(200).json({ message: "Host updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
