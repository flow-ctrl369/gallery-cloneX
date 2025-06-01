import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, artworkTitle, price, orderId } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Art Gallery <noreply@yourdomain.com>",
      to: email,
      subject: "Your Art Purchase Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank You for Your Purchase!</h1>
          <p>We're excited to confirm your recent art purchase.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #444; margin-top: 0;">Order Details</h2>
            <p><strong>Artwork:</strong> ${artworkTitle}</p>
            <p><strong>Amount Paid:</strong> $${price.toFixed(2)}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
          </div>

          <p>Your artwork will be carefully packaged and shipped within 3-5 business days. You'll receive a tracking number once it's on its way.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
} 