// Import the rate limiter used to prevent support form spam and abuse
const { supportLimiter } = require("../lib/rateLimit");

// Import the Resend SDK for sending support emails
const { Resend } = require("resend");

// Initialize the Resend client using the API key stored in environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    // Only allow POST requests for submitting the support form
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  // Determine the client's IP address for rate limiting
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";

  // Limit the number of support requests from the same IP
  const { success } = await supportLimiter.limit(ip);

  if (!success) {
    return res.status(429).json({
      message: "Too many support requests. Please try again later.",
    });
  }

  try {
    // Extract form data from the request body
    const { firstName, lastName, email, subject, message } = req.body;

    // Validate that all required fields contain values
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Ensure the support message is long enough to be meaningful
    if (message.trim().length < 10) {
      return res.status(400).json({
        message: "Message must be at least 10 characters.",
      });
    }

    // Send the support request to the configured support email address
    await resend.emails.send({
      from: "Movexa Support <onboarding@resend.dev>",

      to: process.env.SUPPORT_EMAIL,

      // Allow support staff to reply directly to the user's email
      replyTo: email,

      subject: `[${subject}] Support Request`,

      // Format the submitted information as an HTML email
      html: `
                <h2>New Support Request</h2>

                <p>
                    <strong>Name:</strong>
                    ${firstName} ${lastName}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${email}
                </p>

                <p>
                    <strong>Subject:</strong>
                    ${subject}
                </p>

                <p>
                    <strong>Message:</strong>
                </p>

                <p>${message}</p>
            `,
    });

    // Return a success response after the email is sent
    return res.status(200).json({
      message: "Support request sent",
    });
  } catch (error) {
    // Log the error for debugging and return a generic server error
    console.error(error);

    return res.status(500).json({
      message: "Failed to send support request",
    });
  }
};
