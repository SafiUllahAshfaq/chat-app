import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import Host from "../../../models/Host"; // Import the Host model
import dbConnect from "../../../lib/mongoose"; // Assuming you have a db connection utility

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { password, token } = req.body;

  if (!password || !token) {
    return res
      .status(400)
      .json({ message: "Password and token are required." });
  }

  try {
    await dbConnect(); // Ensure the database is connected

    // Find the host by the reset token
    const host = await Host.findOne({
      resetCode: token,
      resetCodeExpiry: { $gt: Date.now() }, // Ensure the token has not expired
    });

    if (!host) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the host's password and clear the resetCode and resetCodeExpiry
    host.password = hashedPassword;
    host.resetCode = null;
    host.resetCodeExpiry = null;

    await host.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
