import {
    ChatGPTMessage,
    OpenAIStream,
    OpenAIStreamPayload,
} from "@/utils/openAIStream";
import { ChatMessage } from "@/server/schemas";

export const config = {
    runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
    const body: { messages: ChatMessage[] } = await req.json();
    const messages: ChatGPTMessage[] = body.messages.map((message) => ({
        role: message.actor === "bot" ? "system" : "user",
        content: message.message,
    }));

    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
        n: 1,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
}
