// mailTemplates.js

export const emailVerificationTemplate = (verificationLink) => {
  return {
    textPart: `Hello,\n\nPlease verify your email by clicking the following link: ${verificationLink}\n\nThank you!`,
    htmlPart: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #0073e6;">Email Verification</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #555;">
                Hello,<br><br>
                Thank you for signing up! To complete your registration, please verify your email address by clicking the link below.
              </p>
              <p style="text-align: center; margin: 20px 0;">
                <a href="${verificationLink}" style="font-size: 16px; color: #fff; background-color: #0073e6; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
              </p>
              <p style="font-size: 14px; color: #777; text-align: center;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
            <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;">
              <p>&copy; 2024 Mern Stack Video Platform</p>
            </footer>
          </div>
        </body>
      </html>
    `,
  };
};
