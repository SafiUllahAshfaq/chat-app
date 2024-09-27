import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongoose";
import Host from "../../../models/Host";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Find the host by email
    const host = await Host.findOne({ email });
    if (!host) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, host.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { email: host.email, hostId: host._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // Extract host details
    const { firstName, lastName, city, country, address, zipcode } = host;

    // Return the token and host details
    return res.status(200).json({
      token,
      user: {
        email: host.email,
        firstName,
        lastName,
        city,
        country,
        address,
        zipcode,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
