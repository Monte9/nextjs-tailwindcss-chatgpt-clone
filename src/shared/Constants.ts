import { OpenAIModel } from "@/types/Model";

export const LS_UUID = "@ls/uuid";

export const DEFAULT_OPENAI_MODEL = {
  name: "Default (GPT-3.5)",
  id: "gpt-3.5-turbo",
  available: true,
};

export const GPT4_OPENAI_MODEL = {
  name: "GPT-4",
  id: "gpt-4",
  available: false,
};

export const GEMINI_PRO_MODEL = {
  name: "Gemini Pro",
  id: "gemini-pro",
  available: true,
};

export const GEMINI_PRO_VISION_MODEL = {
  name: "Gemini Pro Vision",
  id: "gemini-pro-vision",
  available: true,
};

export const OPENAI_MODELS: OpenAIModel[] = [
  GPT4_OPENAI_MODEL,
  DEFAULT_OPENAI_MODEL,
  GEMINI_PRO_MODEL,
  GEMINI_PRO_VISION_MODEL,
];
