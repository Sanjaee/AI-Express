import { Groq } from "groq-sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const requestToGroqApi = async (content) => {
  try {
    const reply = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `jawab dengan singkat${content}`,
        },
      ],
      model: "llama3-8b-8192",
    });
    return reply;
  } catch (error) {
    console.error("Error with Groq API request:", error);
    throw error;
  }
};

app.post("/ai", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const reply = await requestToGroqApi(content);
    res.json(reply);
    console.log(reply);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
