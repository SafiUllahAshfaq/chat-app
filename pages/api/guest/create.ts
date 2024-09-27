// pages/api/guests/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Guest from "../../../models/Guest";
import Host from "../../../models/Host";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { hostEmail } = req.body;

  if (!hostEmail) {
    return res.status(400).json({ message: "Host email is required" });
  }

  try {
    const host = await Host.findOne({ email: hostEmail });
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    const guestCount = await Guest.countDocuments({ hostId: host._id });
    const lastName = (guestCount + 1).toString();

    const chatId = uuidv4();
    const newGuest = new Guest({
      hostId: host._id,
      firstName: "Guest",
      lastName,
      chatId,
    });

    await newGuest.save();

    return res.status(201).json({ chatId, guestId: newGuest._id });
  } catch (error) {
    console.error("Error creating guest:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
