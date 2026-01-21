import nodemailer from 'nodemailer';

// Create reusable transporter
function createTransporter(port, secure) {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 1,
  });
}

let transporter = createTransporter(587, false);

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `Task-1 <${process.env.VALID_EMAIL}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <h2>Your One-Time Password (OTP)</h2>
      <p>Use the following code to verify your identity:</p>
      <h1 style="color: #007bff;">${otp}</h1>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', email);
  } catch (error) {
    console.error('Error sending email with port 587:', error.message);

    // Retry with port 465 if 587 fails
    console.log('Retrying with port 465...');
    transporter = createTransporter(465, true);

    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent via port 587 to:', email);
    } catch (retryError) {
      console.error('Retry also failed:', retryError.message);
    }
  }
}

export { sendOTPEmail };
