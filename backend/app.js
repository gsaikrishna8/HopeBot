require("dotenv").config();
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const baseURL = process.env.AI_BASE_URL;
const apiKey = process.env.AI_API_KEY;
const api = new OpenAI({
  apiKey,
  baseURL,
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAIResponse = async (message) => {
  const maxRetries = 5;
  let attempt = 0;

  const systemPrompt = "You are an AI for Mental Wellness & Motivation.";

  while (attempt < maxRetries) {
    try {
      // Making the API call using your custom API client
      const response = await api.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });

      // Check if response has a status of 429 (rate limit error)
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After"); // Get retry time from response headers
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, attempt) * 1000; // Exponential backoff
        console.warn(
          `Rate limit hit. Retrying after ${waitTime / 1000} seconds...`
        );

        await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait before retrying
        attempt++;
        continue; // Retry after delay
      }

      // If the response is successful, return the completion text
      return response.choices[0].message.content; // Assuming `response` is the object returned by the API call
    } catch (error) {
      // Handle any other errors, including network errors
      console.error("Error occurred:", error);
      throw error;
    }
  }

  throw new Error("Max retries reached for API request");
};

router.post("/chat", async (req, res) => {
  const message = req.body.question;
  if (!message) {
    return res
      .status(400)
      .json({ error: "Missing 'question' in request body" });
  }

  try {
    const response = await fetchAIResponse(message);
    res.json({ response });
    console.log("AI:", response);
  } catch (error) {
    console.error("AI API error:", error?.message || error);
    res.status(500).json({ error: "AI service failed or quota exceeded" });
  }
});

module.exports = router;
