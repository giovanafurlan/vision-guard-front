import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, images } = await req.json();

    if (!email || !images || images.length === 0) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "giovananelofurlan@gmail.com",
      to: email,
      subject: "Sharp objects detected in your video",
      html: `<p>Hello,</p>

      <p>During the analysis of your video, we detected objects that may be of interest to you. Below, you’ll find links to the detected images:</p>

      ${images.map((img: string) => 
        `<a href="${img}" target="_blank">🔗 View Image</a><br/>`
      ).join("")}

      <p>If you have any questions or need further assistance, feel free to contact us.</p>

      <p>Best regards,<br/>Your Detection Team</p>`,
    };         

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Failed to send email", error }, { status: 500 });
  }
}
