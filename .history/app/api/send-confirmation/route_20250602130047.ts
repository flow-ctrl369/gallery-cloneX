import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Abstra Gallery <tickets@abstra.com>',
      to: booking.email,
      subject: 'Your Exhibition Tickets Confirmation',
      html: `
        <h1>Thank you for your booking!</h1>
        <p>Dear ${booking.name},</p>
        <p>Your booking for ${booking.quantity} ticket(s) has been confirmed.</p>
        <p>Total amount: $${booking.totalAmount}</p>
        <p>Booking ID: ${booking.id}</p>
        <p>We look forward to seeing you at the exhibition!</p>
      `,
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'confirmed' },
    });

    return NextResponse.json({ message: 'Confirmation email sent' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Error sending confirmation email' },
      { status: 500 }
    );
  }
} 