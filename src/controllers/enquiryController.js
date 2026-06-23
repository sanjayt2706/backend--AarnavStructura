const { sendEnquiryMail, sendAutoReply } = require("../services/emailService");
const { saveEnquiry } = require("../models/Enquiry");

const createEnquiry = async (req, res, next) => {
  try {
    console.log("Incoming Request Body:", req.body);

    const {
      fullName,
      phoneNumber,
      email,
      projectType,
      location,
      plotSize,
      budget,
      startDate,
      projectBrief
    } = req.body;

    if (!fullName || !phoneNumber || !projectType || !location || !projectBrief) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const enquiryData = {
      fullName,
      phoneNumber,
      email,
      projectType,
      location,
      plotSize,
      budget,
      startDate,
      projectBrief
    };

    try {
      await saveEnquiry(enquiryData);
      console.log("Enquiry saved to database");
    } catch (dbError) {
      console.error("Database Error:", dbError);
    }

    console.log("Sending enquiry email...");
    await sendEnquiryMail(enquiryData);
    console.log("Enquiry email sent");

    if (email) {
      try {
        console.log("Sending auto reply...");
        await sendAutoReply(email, fullName);
        console.log("Auto reply sent");
      } catch (autoReplyError) {
        console.error("Auto Reply Error:", autoReplyError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully."
    });

  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

module.exports = { createEnquiry };