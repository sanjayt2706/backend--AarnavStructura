const { sendBrevoEmail } = require("../config/mail");

// Sends the enquiry notification to the business owner's inbox (RECEIVER_EMAIL).
// replyTo is set to the customer's email (if provided) so you can hit "Reply"
// in Gmail and it goes straight to them instead of your own sender address.
const sendEnquiryMail = async (data) => {
  const htmlContent = `
    <h2>New Enquiry Received</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      <tr><td><strong>Name</strong></td><td>${data.fullName}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${data.phoneNumber}</td></tr>
      <tr><td><strong>Email</strong></td><td>${data.email || "Not provided"}</td></tr>
      <tr><td><strong>Project Type</strong></td><td>${data.projectType}</td></tr>
      <tr><td><strong>Location</strong></td><td>${data.location}</td></tr>
      <tr><td><strong>Plot Size</strong></td><td>${data.plotSize || "Not provided"}</td></tr>
      <tr><td><strong>Budget</strong></td><td>${data.budget || "Not provided"}</td></tr>
      <tr><td><strong>Expected Start Date</strong></td><td>${data.startDate || "Not provided"}</td></tr>
    </table>
    <p><strong>Project Brief:</strong><br/>${data.projectBrief}</p>
  `;

  return sendBrevoEmail({
    to: process.env.RECEIVER_EMAIL,
    subject: `New Project Enquiry — ${data.projectType}`,
    htmlContent,
    replyTo: data.email || undefined
  });
};

// Sends a short confirmation email back to the person who filled the form,
// only called if they provided an email address.
const sendAutoReply = async (customerEmail, customerName) => {
  const htmlContent = `
    <h2>Thank you, ${customerName}</h2>
    <p>We've received your project enquiry and will get back to you shortly.</p>
    <p>If anything is urgent, feel free to call us directly.</p>
  `;

  return sendBrevoEmail({
    to: customerEmail,
    subject: "We've received your enquiry",
    htmlContent
  });
};

module.exports = { sendEnquiryMail, sendAutoReply };
