import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Guest from "../../../models/Guest";
import Url from "../../../models/URLs";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { guestId } = req.query;

  if (!guestId || typeof guestId !== "string") {
    return res.status(400).json({ message: "Invalid guestId" });
  }

  await dbConnect();

  if (method === "POST") {
    try {
      // Find the host ID based on the URL
      const urlEntry = await Url.findOne({
        "urls.url": `http://localhost:3000/${guestId}`,
      });

      if (!urlEntry) {
        return res
          .status(404)
          .json({ message: "Host not found for the provided guestId" });
      }
      const hostId = urlEntry.hostEmail;

      // Update the isActive property to false for the opened URL
      await Url.updateOne(
        { hostEmail: hostId, "urls.url": `http://localhost:3000/${guestId}` },
        { $set: { "urls.$.isActive": false } }
      );

      // Check if guest already exists
      let guest = await Guest.findOne({ guestId });

      const guestCount = await Guest.countDocuments({ hostId: hostId });
      const lastName = (guestCount + 1).toString();
      if (!guest) {
        // Create the guest
        guest = new Guest({
          guestId,
          firstname: "Guest",
          lastname: lastName,
          email: "unknown",
          address: "unknown",
          zipCode: "0000",
          city: "unknown",
          country: "unknown",
          hostId,
        });
        await guest.save();
      }

      // Ensure the guest document exists under the host's document
      const guestDocRef = doc(db, `chats/${hostId}/guests/${guestId}`);
      const guestSnapshot = await getDoc(guestDocRef);
      if (!guestSnapshot.exists()) {
        await setDoc(guestDocRef, {
          guestId,
          hostId,
          createdAt: new Date(),
        });
      }

      res
        .status(201)
        .json({ message: "Guest created and chat initiated", guest });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  } else if (method === "GET") {
    try {
      const guest = await Guest.findOne({ guestId });
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }

      res.status(200).json(guest);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
