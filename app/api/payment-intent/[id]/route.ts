import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(params.id);

    return NextResponse.json({
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    return NextResponse.json(
      { error: "Error retrieving payment intent" },
      { status: 500 }
    );
  }
} 