import { google } from "googleapis";
import { emailQueue } from "./bullmqController";
import { categorizeEmail, generateReply } from "./openaiController";

async function applyLabelToEmail(
  emailId: string,
  labelName: string,
  oauth2Client: any
) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    console.log(
      `Attempting to apply label "${labelName}" to email: ${emailId}`
    );

    const labelsResponse = await gmail.users.labels.list({ userId: "me" });
    const labels = labelsResponse.data.labels || [];
    console.log("Fetched Labels:", labels);

    let labelId = labels.find((label) => label.name === labelName)?.id;

    if (!labelId) {
      console.log(`Label "${labelName}" does not exist. Creating it.`);
      const createLabelResponse = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      labelId = createLabelResponse.data.id;
      console.log(`Label "${labelName}" created with ID: ${labelId}`);
    } else {
      console.log(`Label "${labelName}" already exists with ID: ${labelId}`);
    }

    const modifyResponse = await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      requestBody: {
        addLabelIds: [labelId],
      },
    });
    console.log("Modify Response:", modifyResponse);
    console.log(`Label "${labelName}" applied to email with ID: ${emailId}`);
  } catch (error) {
    console.error(`Error applying label "${labelName}" to email:`, error);
  }
}

function createEmailRawMessage(
  recipientEmail: string,
  subject: string,
  replyText: string
): string {
  const message = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    `to: ${recipientEmail}\n`,
    `subject: Re: ${subject}\n\n`,
    replyText,
  ].join("");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
async function sendEmailReply(
  emailId: string,
  threadId: string,
  recipientEmail: string,
  subject: string,
  replyText: string,
  gmailClient: any
) {
  const rawMessage = createEmailRawMessage(recipientEmail, subject, replyText);

  try {
    await gmailClient.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
        threadId: threadId,
      },
    });
    console.log(`Reply sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Error sending reply to ${recipientEmail}:`, error);
  }
}

async function categorizeAndReply(
  emailId: string,
  threadId: string,
  recipientEmail: string,
  subject: string,
  body: string
) {
  try {
    const category = await categorizeEmail(subject, body);
    const reply = await generateReply(category, subject, body);

    await emailQueue.add("sendEmailReply", {
      emailId,
      threadId,
      recipientEmail,
      subject,
      replyText: reply,
    });
  } catch (error) {
    console.error(
      `Error categorizing and replying to email ${emailId}:`,
      error
    );
  }
}
export { sendEmailReply, categorizeAndReply, applyLabelToEmail };
