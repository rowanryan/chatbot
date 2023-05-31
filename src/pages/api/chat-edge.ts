import {
    type ChatGPTMessage,
    OpenAIStream,
    type OpenAIStreamPayload,
} from "@/utils/openAIStream";
import { ChatMessage, chatRequest } from "@/server/schemas";
import { env } from "@/env.mjs";
import { injectData } from "@/utils/buildPrompt";

export const config = {
    runtime: "edge",
};

export type ChatRequestbody = {
    identifier: string;
    history: ChatMessage[];
    newMessage: ChatMessage;
};

export default async function POST(req: Request): Promise<Response> {
    const body = (await req.json()) as ChatRequestbody;

    const parsed = chatRequest.safeParse(body);

    if (!parsed.success) {
        return new Response(null, {
            status: 400,
            statusText: "Bad request.",
        });
    }

    const history: ChatGPTMessage[] = body.history.map((message) => ({
        role: message.actor === "bot" ? "system" : "user",
        content: message.message,
    }));

    if (
        !body.identifier ||
        history.length < 1 ||
        !history.every((message) => {
            if (message.role === "user" && message.content.length > 500)
                return false;

            return true;
        })
    )
        return new Response(null, {
            status: 400,
            statusText: "Bad request.",
        });

    // Get embedding
    const embeddingResponse = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "text-embedding-ada-002",
                input: body.newMessage.message,
            }),
        }
    );

    const embeddingData = (await embeddingResponse.json()) as {
        data: { embedding: number[] }[];
    };

    const embedding = embeddingData.data[0]?.embedding as number[];

    // Get vector from Pinecone
    const vectorResponse = await fetch(`${env.PINECONE_URL}/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Api-Key": env.PINECONE_API_KEY,
        },
        body: JSON.stringify({
            topK: 1,
            includeMetadata: true,
            vector: embedding,
            filter: {
                identifier: body.identifier,
            },
        }),
    });

    const vectorData = (await vectorResponse.json()) as {
        matches: {
            score: number;
            values: number[];
            metadata: { identifier: string; text: string };
        }[];
    };

    // Insert prompt
    let prompt = "";

    if (vectorData.matches[0] && vectorData.matches[0].score >= 0.8) {
        prompt = injectData(
            body.newMessage.message,
            vectorData.matches[0].metadata.text,
            vectorData.matches[0].score
        );
    } else {
        prompt = body.newMessage.message;
    }

    const messages: ChatGPTMessage[] = [
        {
            role: "system",
            content:
                "This is a friendly conversation between an AI assistant and a user. The goal is for the AI assistant to answer the prompts from the user as accurately as possible. If needed, answer the prompts from the user based on the given context. If the context does not provide relevant information, just say you're not sure.",
        },
        ...history,
        {
            role: "user",
            content: prompt,
        },
    ];

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
