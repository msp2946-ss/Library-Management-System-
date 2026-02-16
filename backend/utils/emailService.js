import nodemailer from 'nodemailer';

/**
 * Create reusable email transporter
 */
const createTransporter = () => {
  // Some users paste the 16-char Gmail app password with spaces (shown as groups).
  // Normalize by removing internal spaces if present (won't affect valid passwords
  // that legitimately contain spaces).
  const rawPass = process.env.EMAIL_PASS || '';
  const normalizedPass = rawPass.includes(' ') ? rawPass.replace(/\s+/g, '') : rawPass;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false otherwise
    auth: {
      user: process.env.EMAIL_USER,
      pass: normalizedPass,
    },
  });

  // Optional: surface SMTP connection problems early in logs (non-fatal)
  transporter.verify().then(() => {
    console.log('✅ SMTP transporter is ready');
  }).catch((err) => {
    console.warn('⚠️ SMTP transporter verification failed:', err && err.message ? err.message : err);
  });

  return transporter;
};

/**
 * Send email for book issue
 */
export const sendBookIssueEmail = async (memberEmail, memberName, bookTitle, issueDate) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: memberEmail,
      subject: 'Book Issued Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #2563eb;">Book Issued Successfully</h2>
            <p>Hello <strong>${memberName}</strong>,</p>
            <p>Your book "<strong>${bookTitle}</strong>" has been successfully issued.</p>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Issue Date:</strong> ${new Date(issueDate).toLocaleDateString()}</p>
            </div>
            <p style="color: #dc2626;"><strong>⚠️ Please return the book on time to avoid penalties.</strong></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">Thank you,<br/>Library Management Team @msp</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Issue email sent successfully');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw error - email failure shouldn't stop the transaction
  }
};

/**
 * Send email for book return
 */
export const sendBookReturnEmail = async (memberEmail, memberName, bookTitle, returnDate) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: memberEmail,
      subject: 'Book Returned Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #16a34a;">Book Returned Successfully</h2>
            <p>Hello <strong>${memberName}</strong>,</p>
            <p>The book "<strong>${bookTitle}</strong>" has been successfully returned.</p>
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Return Date:</strong> ${new Date(returnDate).toLocaleDateString()}</p>
            </div>
            <p>Thank you for using our library services.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">Thank you,<br/>Library Management Team @msp</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Return email sent successfully');
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};
