import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message, captchaToken } = req.body;

  // if (!captchaToken) {
  //   return res.status(400).json({ message: "Captcha is required" });
  // }

  try {
    // const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Store your secret key in .env file
    // const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

    // // Verify the reCAPTCHA token
    // const { data } = await axios.post(verificationUrl);

    // if (!data.success) {
    //   return res.status(400).json({ message: "Captcha verification failed" });
    // }

    // Create a Nodemailer transporter using your custom SMTP settings
    const transporter = nodemailer.createTransport({
      host: "node250-eu.n0c.com", // SMTP server address
      port: 465, // SMTP port (for SSL)
      secure: true, // true for 465, false for 587
      auth: {
        user: "contact@swurll.com", // Your SMTP username
        pass: "5pV$n2ot1J_ZR6f", // Store your SMTP password in the environment variable
      },
    });

    // Email content
    const mailOptions = {
      from: email,
      to: "contact@swurll.com", // The email address you want to receive the messages
      subject: `New Contact Form Submission from ${name}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
