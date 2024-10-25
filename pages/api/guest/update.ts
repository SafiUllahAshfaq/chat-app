import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Guest from "../../../models/Guest";

// Configuring the request body parser to allow up to 3.5 MB payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "3.5mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { guestId } = req.body;

  if (!guestId) {
    return res.status(400).json({ message: "Guest ID is required" });
  }

  try {
    const updateData: any = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      address: req.body.address,
      zipCode: req.body.zipCode,
      city: req.body.city,
      country: req.body.country,
    };

    if (req.body.image) {
      updateData.image = Buffer.from(req.body.image, "base64");
    }

    const updatedGuest = await Guest.findOneAndUpdate(
      { guestId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    return res.status(200).json(updatedGuest);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}
