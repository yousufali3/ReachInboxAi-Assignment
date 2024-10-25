import { Worker } from "bullmq";
import { redisConnection } from "../Middlewares/redisClient";
import { oauth2Client } from "../Auth/googleAuth";
import { google } from "googleapis";
import { Queue } from "bullmq";
import { sendEmailReply } from "./emailController";

const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { emailId, threadId, recipientEmail, subject, replyText } = job.data;
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    await sendEmailReply(
      emailId,
      threadId,
      recipientEmail,
      subject,
      replyText,
      gmail
    );
  },
  {
    connection: redisConnection,
  }
);

export { emailQueue };
