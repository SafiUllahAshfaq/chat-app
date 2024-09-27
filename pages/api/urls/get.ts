import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Url from "../../../models/URLs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid email provided" });
  }

  try {
    // Find the URLs associated with the host email and filter out only the active ones
    const urlEntry = await Url.findOne({ hostEmail: email });

    if (!urlEntry || urlEntry.urls.length === 0) {
      return res
        .status(404)
        .json({ message: "No URLs found for the given host" });
    }

    const activeUrls = urlEntry.urls.filter((url: any) => url.isActive);

    if (activeUrls.length === 0) {
      return res
        .status(404)
        .json({ message: "No active URLs found for the given host" });
    }

    return res.status(200).json({ urls: activeUrls });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
