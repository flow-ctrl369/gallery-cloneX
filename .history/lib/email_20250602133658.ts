import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface OfferEmailData {
  artworkTitle: string;
  name: string;
  email: string;
  phone: string;
  offerAmount: number;
  message?: string;
}

export async function sendOfferEmail(data: OfferEmailData) {
  const { artworkTitle, name, email, phone, offerAmount, message } = data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'flipperzeronz@gmail.com',
    subject: `New Artwork Offer: ${artworkTitle}`,
    html: `
      <h2>New Artwork Offer Received</h2>
      <p><strong>Artwork:</strong> ${artworkTitle}</p>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Offer Amount:</strong> $${offerAmount.toFixed(2)}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <hr>
      <p><small>This is an automated message from your gallery website.</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Offer notification email sent successfully');
  } catch (error) {
    console.error('Failed to send offer notification email:', error);
    throw error;
  }
} 