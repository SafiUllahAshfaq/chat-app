import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongoose";
import Host from "../../../models/Host";
import bcrypt from "bcryptjs";

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

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    address,
    zipCode,
    city,
    country,
    image,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !address ||
    !zipCode ||
    !city ||
    !country
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const host = new Host({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      zipCode,
      city,
      country,
      image: image ? Buffer.from(image, "base64") : null,
    });

    await host.save();
    return res.status(201).json({ message: "Host created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
