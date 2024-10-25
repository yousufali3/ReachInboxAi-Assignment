import { openai } from "../Middlewares/openaiClient";

async function categorizeEmail(subject: string, body: string): Promise<string> {
  const prompt = `
        Categorize the following email content into one of the following categories:
        
        1. 'Interested': Use this category if the email is related to job opportunities, professional communication (like meetings, project discussions), or relevant personal topics.
        2. 'Not Interested': Use this category if the email is about sales, offers, marketing promotions, advertisements, or anything generally considered spam.
        3. 'More Information': Use this category if the email seems important but lacks sufficient details, requires action or clarification, or asks for more information (e.g., billing issues, password resets).
    
        Subject: ${subject}
        Body: ${body}
    
        Focus on keywords like "offer", "sale", "free", and similar to classify emails as 'Not Interested'. Use words like "meeting", "schedule", "job", "opportunity", and "project" to identify emails as 'Interested'. Emails about renewal, security, or missing information should be categorized as 'More Information'.
      `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.5,
    });

    if (response.choices && response.choices.length > 0) {
      // Trim and remove any unnecessary prefixes like "Category:"
      const completion =
        response.choices[0]?.message?.content?.trim() || "No response";
      return completion.replace("Category: ", ""); // Remove the "Category: " part
    } else {
      return "No response";
    }
  } catch (error) {
    console.error("Error interacting with OpenAI API:", error);
    return "Error";
  }
}

async function generateReply(
  category: string,
  subject: string,
  body: string
): Promise<string> {
  switch (category) {
    case "Interested":
      return ` Thank you for your interest in the subject "${subject}". We would love to set up a demo call. How about [suggest date and time]?
        This is an automated testing email. We apologize for any inconvenience if this message reached you by mistake.`;

    case "Not Interested":
      return `Thank you for your email regarding "${subject}", but we are not interested at this time.
        This is an automated testing email. We apologize for any inconvenience if this message reached you by mistake .`;

    case "More Information":
      return ` We received your email regarding "${subject}". Could you clarify what additional details you'd like?
        This is an automated testing email. We apologize for any inconvenience if this message reached you by mistake.`;

    default:
      return ` Thank you for reaching out regarding "${subject}".
        This is an automated testing email. We apologize for any inconvenience if this message reached you by mistake.`;
  }
}

export { generateReply, categorizeEmail };
