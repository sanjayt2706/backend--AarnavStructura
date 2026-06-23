const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const enquiryRoutes = require("./routes/enquiryRoutes");
const errorHandler = require("./middleware/errorHandler");
const { initDb } = require("./config/db");
const { verifyMailConfig } = require("./config/mail");

dotenv.config();

const app = express();

// Allows the configured production URL (CLIENT_URL) plus any Vercel
// preview deployment URL for this project (they look like
// https://aarnav-structura-frontend-3id2-<hash>.vercel.app), and localhost
// for local development. Vercel generates a new preview URL on every
// deploy, so an exact string match alone would break on each new preview.
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // non-browser requests (curl, server-to-server)
  if (origin === allowedOrigin) return true;
  if (origin === "http://localhost:5173") return true;
  // Matches any *.vercel.app preview URL belonging to this project
  if (/^https:\/\/aarnav-structura-frontend-3id2(-[\w]+)?\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
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
