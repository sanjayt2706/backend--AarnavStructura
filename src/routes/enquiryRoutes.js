const express = require("express");
const router = express.Router();
const { createEnquiry } = require("../controllers/enquiryController");

// POST /api/enquiry
router.post("/", createEnquiry);

module.exports = router;
