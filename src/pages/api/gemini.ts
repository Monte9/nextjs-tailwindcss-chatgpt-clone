import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

import { GoogleGenerativeAI } from "@google/generative-ai";
// Get your environment variables
dotenv.config();

// Gemini configuration creation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const historyMessages = body?.historyMessages;
    const message = body?.message;

    const chat = model.startChat({
      history: historyMessages,
    });

    const result = await chat.sendMessage(message.parts);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ message: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during ping to OpenAI. Please try again.",
    });
  }
}
