import { Conversation } from "./Conversation";
import { AIModel } from "./Model";

export type GeminiHandler = {
    apiKey: string;
    model: AIModel;
    historyMessages: Conversation[];
    message: Conversation;
}
