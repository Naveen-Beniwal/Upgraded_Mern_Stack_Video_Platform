import mailjet from "node-mailjet";
import { ENV_VARS } from "../config/envVars.js";
// Configure Mailjet

const mailjetClient = mailjet.apiConnect(
  ENV_VARS.MAILJET_API_KEY,
  ENV_VARS.MAILJET_API_SECRET
);

export default mailjetClient;
