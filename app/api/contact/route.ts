import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, or message' },
        { status: 400 }
      );
    }

    // Check for environment variables
    if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
      console.error('Missing Mailtrap credentials in environment variables');
      console.error('Available env vars:', {
        hasUser: !!process.env.MAILTRAP_USER,
        hasPass: !!process.env.MAILTRAP_PASS,
        hasHost: !!process.env.MAILTRAP_HOST,
        hasPort: !!process.env.MAILTRAP_PORT
      });
      return NextResponse.json(
        { error: 'Server configuration error: Missing SMTP credentials' },
        { status: 500 }
      );
    }

    // Configure Nodemailer transporter
    // Note: Mailtrap recommends port 587 or 2525 for SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: '"Contact Form" <contact@mydomain.com>', // Sender address
      to: process.env.CONTACT_EMAIL || 'my-personal-email@example.com', // Recipient
      replyTo: email, // Allow replying directly to the user
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
