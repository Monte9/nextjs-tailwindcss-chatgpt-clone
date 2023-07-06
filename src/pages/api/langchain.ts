import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorStoreIndex } from "langchain/indexes";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RetrievalQAChain } from "langchain/chains";
import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

// Get your environment variables
dotenv.config();

// Set up the OpenAIEmbeddings
const embeddings = new OpenAIEmbeddings({ api_key: process.env.OPENAI_API_KEY });

// Set up the VectorStoreIndex
const index = new VectorStoreIndex();

// Set up the RetrievalQAChain
const chain = new RetrievalQAChain({ embeddings, index });

// OpenAI configuration creation
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI instance creation
const openai = new OpenAIApi(openaiConfig);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const messages = (body?.messages || []) as ChatCompletionRequestMessage[];
  const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;
  const systemPrompt = (body?.systemPrompt || "Default prompt message") as string;

  try {
    const promptMessage: ChatCompletionRequestMessage = {
      role: "system",
      content: systemPrompt,
    };

    const initialMessages: ChatCompletionRequestMessage[] = messages.splice(0, 3);
    const latestMessages: ChatCompletionRequestMessage[] = messages
      .slice(-5)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    // Get relevant information from LangChain
    const contextText = [...initialMessages, ...latestMessages]
      .map((message) => message.content)
      .join("\n");
    const { question, answer } = await getHelpfulInformation(contextText);

    // Add the relevant information to the system prompt
    const systemPromptWithInfo = `${systemPrompt}\n\nQ: ${question}\nA: ${answer}`;

    const completion = await openai.createChatCompletion({
      model: model.id,
      temperature: 0.5,
      messages: [promptMessage, ...initialMessages, ...latestMessages],
      systemPrompt: systemPromptWithInfo,
    });

    const responseMessage = completion.data.choices[0].message?.content.trim();

    if (!responseMessage) {
      res
        .status(400)
        .json({ error: "Unable to get a response from OpenAI. Please try again." });
    }

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during the request. Please try again.",
    });
  }
}

async function getHelpfulInformation(contextText: string) {
  // Assuming you have a pre-populated index and embeddings from LangChain
  const question = "What is the main topic of the conversation?";
  const answer = await chain.answer
