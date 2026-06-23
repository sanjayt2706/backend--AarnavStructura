const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Low-level helper that calls Brevo's transactional email API.
// Throws if the request fails so callers can handle/log the error.
const sendBrevoEmail = async ({ to, subject, htmlContent, replyTo }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set in .env");
  }

  const payload = {
    sender: {
      name: process.env.SENDER_NAME || "Website Enquiry",
      email: process.env.SENDER_EMAIL
    },
    to: [{ email: to }],
    subject,
    htmlContent
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }

  return response.json();
};

// Quick check on startup that the API key looks present.
// Brevo has no lightweight "verify" endpoint, so this just checks config,
// not that the key is actually valid — the first real send will confirm that.
const verifyMailConfig = async () => {
  if (!process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
    console.error(
      "Brevo is not configured. Set BREVO_API_KEY and SENDER_EMAIL in your .env file."
    );
    return;
  }
  console.log("Brevo email config looks present. (Validity confirmed on first send.)");
};

module.exports = { sendBrevoEmail, verifyMailConfig };
