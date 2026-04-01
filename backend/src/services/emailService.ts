import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"ShopNest" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your ShopNest Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">ShopNest</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Your favorite online store</p>
        </div>
        <div style="background: #ffffff; border-radius: 8px; padding: 32px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <p style="color: #334155; font-size: 16px; margin-bottom: 8px;">Your verification code is:</p>
          <div style="background: #eef2ff; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 16px;">
            This code expires in 5 minutes.<br/>
            If you didn't request this, please ignore this email.
          </p>
        </div>
        <p style="text-align: center; color: #cbd5e1; font-size: 12px; margin-top: 24px;">
          © 2025 ShopNest. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
