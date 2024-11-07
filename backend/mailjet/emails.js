import mailjet from "node-mailjet";
import { ENV_VARS } from "../config/envVars.js";
import mailjetClient from "./mailjet.config.js";
import { emailVerificationTemplate } from "./mailTemplates.js";
// Function to send verification email
export async function sendVerificationEmail(email, verificationLink) {
  const { textPart, htmlPart } = emailVerificationTemplate(verificationLink);
  const request = mailjetClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "naveenbeniwal00001@gmail.com",
          Name: "Mern Stack video platform",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Email Verification",
        TextPart: textPart,
        HTMLPart: htmlPart,
      },
    ],
  });

  return request
    .then((result) => {
      // console.log("Verification email sent:", result.body);
      console.log("Verification email sent");
    })
    .catch((err) => {
      console.error(
        "Error sending verification email:",
        err.statusCode,
        err.message
      );
    });
}
