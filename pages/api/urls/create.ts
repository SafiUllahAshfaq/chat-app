import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library
import dbConnect from "../../../lib/mongoose";
import Host from "../../../models/Host";
import Url from "../../../models/URLs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { hostEmail, quantity } = req.body;

  if (!hostEmail || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Check if the host exists
    const host = await Host.findOne({ email: hostEmail });
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    // Generate the URLs with UUID and set isActive to true
    const newUrls = Array.from({ length: quantity }, () => ({
      url: `${process.env.MYWEBSITE}/${uuidv4()}`,
      isActive: true, // Set the isActive property to true by default
    }));

    // Check if the host already has URLs stored
    let urlEntry = await Url.findOne({ hostEmail });
    if (urlEntry) {
      // If URLs exist, append the new URLs to the existing array
      urlEntry.urls = [...urlEntry.urls, ...newUrls];
    } else {
      // If no entry exists, create a new one
      urlEntry = new Url({ hostEmail, urls: newUrls });
    }

    await urlEntry.save();
    return res.status(201).json({
      message: "URLs generated and stored successfully",
      urls: newUrls.map((urlObj) => urlObj.url),
    });
  } catch (error) {
    console.error("Error generating URLs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
