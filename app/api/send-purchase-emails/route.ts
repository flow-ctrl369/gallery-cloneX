import { NextResponse } from 'next/server';
import { sendPurchaseEmails } from '@/lib/email';
import { artworks, artists } from '@/lib/data';

interface PurchaseDetails {
  artworkId: string;
  buyerEmail: string;
  buyerName: string;
  transactionId: string;
}

export async function POST(request: Request) {
  try {
    const { artworkId, buyerEmail, buyerName, transactionId } = await request.json() as PurchaseDetails;

    if (!artworkId || !buyerEmail || !buyerName || !transactionId) {
      return NextResponse.json({ message: 'Missing required purchase details' }, { status: 400 });
    }

    const artwork = artworks.find(a => a.id === artworkId);
    const artist = artists.find(a => a.name === artwork?.artist);

    if (!artwork || !artist) {
      // This case should ideally not happen if artworkId is valid
      console.error(`Artwork or artist not found for artworkId: ${artworkId}`);
      return NextResponse.json({ message: 'Artwork or artist not found' }, { status: 404 });
    }

    const emailData = {
      buyerEmail,
      buyerName,
      artworkTitle: artwork.title,
      artistName: artist.name,
      artistEmail: artist.email || 'flipperzeronz@gmail.com', // Fallback
      price: artwork.price,
      purchaseDate: new Date().toLocaleDateString(),
      transactionId,
    };

    await sendPurchaseEmails(emailData);

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending purchase emails:', error);
    return NextResponse.json({ message: 'Failed to send emails', error: (error as Error).message }, { status: 500 });
  }
} 