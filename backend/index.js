const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const main = require("./app");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS: Allow Netlify frontend
app.use(cors({
  origin: 'https://hopebott.netlify.app',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.options("*", cors());
app.use("/api", main);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
