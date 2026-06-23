const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const enquiryRoutes = require("./routes/enquiryRoutes");
const errorHandler = require("./middleware/errorHandler");
const { initDb } = require("./config/db");
const { verifyMailConfig } = require("./config/mail");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Construction website backend is running.");
});

app.use("/api/enquiry", enquiryRoutes);

// Keep this last — it only catches errors passed via next(err)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDb();
  await verifyMailConfig();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
