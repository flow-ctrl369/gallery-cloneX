import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOfferStatusEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminMessage } = await request.json();
    const offerId = parseInt(params.id);

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update offer status
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status },
    });

    // Send status update email
    try {
      await sendOfferStatusEmail({
        artworkTitle: updatedOffer.artworkTitle,
        name: updatedOffer.name,
        email: updatedOffer.email,
        offerAmount: updatedOffer.offerAmount,
        status: status as 'accepted' | 'rejected',
        adminMessage,
      });
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: 'Offer status updated successfully', offer: updatedOffer },
      { status: 200 }
    );

  } catch (error) {
    console.error('Offer status update error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update offer status' },
      { status: 500 }
    );
  }
} 