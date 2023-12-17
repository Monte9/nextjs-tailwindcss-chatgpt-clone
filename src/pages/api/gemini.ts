import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
dotenv.config();

function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: path,
      mimeType
    },
  };
}

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

    const historyMessages = body?.historyMessages.filter((x: any) => ["user", "model"].includes(x.role));
    const message = body?.message;
    const apiKey = body?.apiKey;
    const apiModel = body?.model;
    const images = body?.images;

    if (images?.length) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const imageParts = images.map((x: any) => fileToGenerativePart(x.image, x.mimeType));
      const result = await model.generateContent([message.parts, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      return res.status(200).json({ message: text });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: apiModel.id });
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
      error: "An error occurred during ping to Gemini. Please try again.",
    });
  }
}
