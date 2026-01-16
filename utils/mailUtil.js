const postmark = require("postmark");

// Initialize the client
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

const sendEmail = async (to, subject, body) => {
  try {
    await client.sendEmail({
      "From": process.env.POSTMARK_FROM_EMAIL,
      "To": to,
      "Subject": subject,
      "HtmlBody": body, // Use HtmlBody for formatted emails
      "MessageStream": "outbound" // Default stream for transactional emails
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Postmark Error:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;