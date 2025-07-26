const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const main = require("./app");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",         // Local dev
  "https://hopebott.netlify.app"   // Deployed frontend
];

// ✅ CORS setup — only apply once
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

// ✅ Handle preflight requests
app.options("*", cors());

// Routes
app.use("/api", main);

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
