// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function sendEmail(
  email: string,
  subject: string,
  message: string,
) {
  if (!email || !subject || !message) {
    return NextResponse.json(
      { error: "Email, subject, and message are required" },
      { status: 400 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail email address
        pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
      },
    });

    const info = await transporter.sendMail({
      from: `<${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    });

    console.log(`Message sent to: ${email}`);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
