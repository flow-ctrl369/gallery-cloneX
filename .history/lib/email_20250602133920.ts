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

interface OfferStatusData {
  artworkTitle: string;
  name: string;
  email: string;
  offerAmount: number;
  status: 'accepted' | 'rejected';
  adminMessage?: string;
}

export async function sendOfferEmail(data: OfferEmailData) {
  const { artworkTitle, name, email, phone, offerAmount, message } = data;

  // Email to admin
  const adminMailOptions = {
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

  // Confirmation email to offerer
  const confirmationMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Offer Confirmation: ${artworkTitle}`,
    html: `
      <h2>Your Offer Has Been Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in "${artworkTitle}". We have received your offer of $${offerAmount.toFixed(2)}.</p>
      <p>Our team will review your offer and get back to you soon.</p>
      ${message ? `<p><strong>Your Message:</strong> ${message}</p>` : ''}
      <hr>
      <p><small>This is an automated message from the gallery website.</small></p>
    `,
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(confirmationMailOptions)
    ]);
    console.log('Offer notification emails sent successfully');
  } catch (error) {
    console.error('Failed to send offer notification emails:', error);
    throw error;
  }
}

export async function sendOfferStatusEmail(data: OfferStatusData) {
  const { artworkTitle, name, email, offerAmount, status, adminMessage } = data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Offer ${status === 'accepted' ? 'Accepted' : 'Declined'}: ${artworkTitle}`,
    html: `
      <h2>Your Offer Has Been ${status === 'accepted' ? 'Accepted' : 'Declined'}</h2>
      <p>Dear ${name},</p>
      <p>Regarding your offer of $${offerAmount.toFixed(2)} for "${artworkTitle}":</p>
      <p>We are pleased to inform you that your offer has been <strong>${status}</strong>.</p>
      ${adminMessage ? `<p><strong>Message from the gallery:</strong> ${adminMessage}</p>` : ''}
      ${status === 'accepted' ? `
        <p>Next steps:</p>
        <ol>
          <li>We will contact you shortly to arrange payment and collection details.</li>
          <li>Please have your payment method ready.</li>
          <li>If you have any questions, please don't hesitate to contact us.</li>
        </ol>
      ` : ''}
      <hr>
      <p><small>This is an automated message from the gallery website.</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Offer ${status} notification email sent successfully`);
  } catch (error) {
    console.error(`Failed to send offer ${status} notification email:`, error);
    throw error;
  }
} 