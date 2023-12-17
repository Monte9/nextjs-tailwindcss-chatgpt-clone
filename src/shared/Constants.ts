import { OpenAIModel } from "@/types/Model";


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
  GEMINI_PRO_MODEL,
  GEMINI_PRO_VISION_MODEL
];
