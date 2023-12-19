import { GEMINI_PRO_VISION_MODEL } from "@/shared/Constants";
import { Content, GenerateContentRequest, GenerativeContentBlob, GoogleGenerativeAI, InlineDataPart, Part, TextPart } from "@google/generative-ai";

function fileToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64,
            mimeType
        } as GenerativeContentBlob,
    };
}

export default async function handler(body: any, callback: any) {
    try {

        const historyMessages = body?.historyMessages.filter((x: any) => ["user", "model"].includes(x.role));
        const message = body?.message;
        const apiKey = body?.apiKey;
        const apiModel = body?.model;

        if (apiModel.id == GEMINI_PRO_VISION_MODEL.id) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: apiModel.id });
            const parts = historyMessages.map((x:any) => {
                if (x.image) {
                    return fileToGenerativePart(x.image.base64, x.image.mimeType) as InlineDataPart;
                }
                return {
                    text: x.parts
                } as TextPart;
            }) as Part[];
            parts.push({
                text: message.parts
            })
            const content = {
                parts: parts
            } as Content;
            const contentRequest = {
                contents: [content]
            } as GenerateContentRequest
            const result = await model.generateContentStream(contentRequest);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
                callback(text);
            }
            return text;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: apiModel.id });
        const chat = model.startChat({
            history: historyMessages,
        });

        const result = await chat.sendMessageStream(message.parts);
        let text = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            text += chunkText;
            callback(text);
        }

        return text;
    } catch (error: any) {
        console.error(error);
        throw new Error(`An error occurred during ping to Gemini. Please refresh your browser and try again.\n ${error.message}` );
    }
}
