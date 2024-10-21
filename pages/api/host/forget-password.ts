import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { promisify } from "util";
import axios from "axios";
import Host from "../../../models/Host"; // Assuming your Host model is in the models folder
import dbConnect from "../../../lib/mongoose"; // Assuming you have a db connection utility

// Generate a random token
const randomBytesAsync = promisify(crypto.randomBytes);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, captchaToken } = req.body;

  
  try {
    await dbConnect(); // Connect to the database

  
    // Check if a user with the given email exists
    const host = await Host.findOne({ email });
    if (!host) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random reset token (32 bytes for a secure token)
    const resetToken = (await randomBytesAsync(32)).toString("hex");

    // Set token expiration time (e.g., 1 hour from now)
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds

    // Save the reset token and expiry in the user's record
    host.resetCode = resetToken;
    host.resetCodeExpiry = resetTokenExpiry;
    await host.save();

    // Create the reset URL (this URL should point to your frontend reset page)
    const resetURL = `${process.env.MYWEBSITE}/reset-password?token=${resetToken}`;

    // Create the transporter for sending the email
    const transporter = nodemailer.createTransport({
      host: "node250-eu.n0c.com", // Your SMTP server
      port: 465, // Port for SSL
      secure: true, // true for 465, false for 587
      auth: {
        user: "contact@swurll.com", // Your SMTP username
        pass: "5pV$n2ot1J_ZR6f", // Your SMTP password from environment variables
      },
    });

    // Email content
    const mailOptions = {
      from: "contact@swurll.com", // Sender address
      to: email, // Receiver email
      subject: "Password Reset Request",
      text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request a password reset, please ignore this email.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
