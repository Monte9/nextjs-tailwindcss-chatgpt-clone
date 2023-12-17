import { GoogleGenerativeAI } from "@google/generative-ai";

function fileToGenerativePart(path: string, mimeType: string) {
    return {
        inlineData: {
            data: path,
            mimeType
        },
    };
}

export default async function handler(body: any, callback: any) {
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
            const result = await model.generateContentStream([message.parts, ...imageParts]);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
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
            console.log(chunkText);
            text += chunkText;
            callback(text);
        }

        return text;
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred during ping to Gemini. Please try again.");
    }
}
