import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import { categorizeEmail } from "../Controllers/openaiController";
import {
  applyLabelToEmail,
  categorizeAndReply,
} from "../Controllers/emailController";

dotenv.config();

const router = express.Router();


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI =process.env.REDIRECT_URI;
export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

router.get("/auth/google", (req: Request, res: Response) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.send",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
});

router.get("/auth/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Error: Missing authorization code");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const emailResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 3,
    });

    const emails = emailResponse.data.messages || [];
    const results = await Promise.all(
      emails.map(async (email) => {
        const emailData = await gmail.users.messages.get({
          userId: "me",
          id: email.id,
        });

        const subject =
          emailData.data.payload?.headers?.find((h) => h.name === "Subject")
            ?.value || "";
        const body = emailData.data.snippet || "";
        const recipientEmail =
          emailData.data.payload?.headers?.find((h) => h.name === "From")
            ?.value || "";
        const threadId = emailData.data.threadId || "";

        await categorizeAndReply(
          email.id,
          threadId,
          recipientEmail,
          subject,
          body
        );

        const category = await categorizeEmail(subject, body);

        let labelName;
        if (category === "Interested") {
          labelName = "Interested";
        } else if (category === "Not Interested") {
          labelName = "Not Interested";
        } else if (category === "More Information") {
          labelName = "More Information";
        } else {
          labelName = "Uncategorized";
        }

        await applyLabelToEmail(email.id, labelName, oauth2Client);

        return {
          id: email.id,
          subject: subject,
          snippet: body,
          category: category,
        };
      })
    );

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Error during Google OAuth2 callback:", error);
    res.status(500).send("Authentication failed");
  }
});
export { router as googleRouter };