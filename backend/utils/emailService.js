import nodemailer from "nodemailer";
import crypto from "crypto";

// Generate a random token
export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Create transporter
const createTransporter = () => {
  // Validate required environment variables
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error(
      "Missing required email configuration. Please check your .env file for SMTP_HOST, SMTP_USER, and SMTP_PASS"
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Add connection timeout and other options
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
  });
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    return {
      success: false,
      message: `Email configuration error: ${error.message}`,
    };
  }
};

// Send verification email
export const sendVerificationEmail = async (email, token, name) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Firefly E-Commerce"}" <${
        process.env.FROM_EMAIL
      }>`,
      to: email,
      subject: "Verify Your Email Address - Firefly E-Commerce",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #f97316, #dc2626);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9fafb;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #f97316, #dc2626);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    font-size: 14px;
                    color: #6b7280;
                }
                .logo {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🔥 Firefly</div>
                <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                
                <p>Thank you for creating an account with Firefly E-Commerce! To complete your registration and start shopping, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
                
                <p><strong>Important:</strong> You need to verify your email address before you can place any orders on our platform.</p>
                
                <p>This verification link will expire in 24 hours for your security.</p>
                
                <div class="footer">
                    <p>If you didn't create an account with us, please ignore this email.</p>
                    <p>© ${new Date().getFullYear()} Firefly E-Commerce. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name},
        
        Thank you for creating an account with Firefly E-Commerce! 
        
        Please verify your email address by clicking this link: ${verificationUrl}
        
        Important: You need to verify your email address before you can place any orders on our platform.
        
        This verification link will expire in 24 hours for your security.
        
        If you didn't create an account with us, please ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, name) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Firefly E-Commerce"}" <${
        process.env.FROM_EMAIL
      }>`,
      to: email,
      subject: "Reset Your Password - Firefly E-Commerce",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #f97316, #dc2626);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9fafb;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #f97316, #dc2626);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .warning {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    font-size: 14px;
                    color: #6b7280;
                }
                .logo {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🔥 Firefly</div>
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                
                <p>We received a request to reset your password for your Firefly E-Commerce account. If you made this request, click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #4f46e5;">${resetUrl}</p>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <ul>
                        <li>This password reset link will expire in 1 hour</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Never share this link with anyone</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>If you're having trouble with the link above, copy and paste the URL into your web browser.</p>
                    <p>© ${new Date().getFullYear()} Firefly E-Commerce. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name},
        
        We received a request to reset your password for your Firefly E-Commerce account.
        
        If you made this request, click this link to reset your password: ${resetUrl}
        
        Security Notice:
        - This password reset link will expire in 1 hour
        - If you didn't request this reset, please ignore this email
        - Never share this link with anyone
        
        © ${new Date().getFullYear()} Firefly E-Commerce. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
