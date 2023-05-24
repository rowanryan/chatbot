import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { env } from "@/env.mjs";
import type { ChatMessage } from "@/server/schemas";
import useChatScroll from "@/hooks/useChatScroll";
import getChatStyling from "@/utils/getChatStyling";
import { BeatLoader } from "react-spinners";

import { IconLoader2, IconRefresh } from "@tabler/icons-react";

const originalChatState: ChatMessage[] = [
    {
        actor: "bot",
        message: "Hi! How can I assist you today?",
        timestamp: new Date(),
        error: false,
    },
];

const Page: NextPage = () => {
    const [streamLoading, setStreamLoading] = useState(false);
    const [streamResponse, setStreamResponse] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [chatHistory, setChatHistory] =
        useState<ChatMessage[]>(originalChatState);

    const ref = useChatScroll(chatHistory);

    const sendMessage = () => {
        setStreamLoading(true);

        if (message !== "" && !streamLoading) {
            const newHistory = [
                ...chatHistory,
                {
                    message,
                    actor: "user",
                    error: false,
                    timestamp: new Date(),
                },
            ] as ChatMessage[];

            setChatHistory(newHistory);
            setMessage("");

            return streamChat(newHistory);

            // return promptMutation.mutate({
            //     messages: newHistory,
            // });
        }
    };

    const streamChat = async (messages: ChatMessage[]) => {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages,
            }),
        });

        if (!response.ok) {
            return setChatHistory((history) => [
                ...history,
                {
                    actor: "bot",
                    message: "Sorry, something went wrong. Please try again.",
                    timestamp: new Date(),
                    error: true,
                },
            ]);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return setChatHistory((history) => [
                ...history,
                {
                    actor: "bot",
                    message: "Sorry, something went wrong. Please try again.",
                    timestamp: new Date(),
                    error: true,
                },
            ]);
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let chunkResponse = "";

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);

            chunkResponse += chunkValue;
            setStreamResponse((prev) =>
                prev === null ? chunkValue : prev + chunkValue
            );
        }

        return cleanUp(chunkResponse);
    };

    const cleanUp = (response: string) => {
        setChatHistory((history) => [
            ...history,
            {
                actor: "bot",
                message: response,
                timestamp: new Date(),
                error: false,
            },
        ]);

        setStreamLoading(false);
        return setStreamResponse(null);
    };

    const resetHistory = () => {
        return setChatHistory(originalChatState);
    };

    return (
        <>
            <Head>
                <title>Chat - {env.NEXT_PUBLIC_AI_NAME}</title>
            </Head>

            <div className="flex h-screen flex-col">
                <header className="flex items-center justify-between border-b-2 border-slate-100 bg-white px-4 py-2">
                    <p className="text-lg font-bold">
                        {env.NEXT_PUBLIC_AI_NAME}
                    </p>

                    <button
                        title="Reset chat"
                        className="rounded-md border border-slate-200 p-2 transition-colors duration-100 ease-linear hover:bg-slate-100 active:bg-slate-200"
                        onClick={resetHistory}
                    >
                        <IconRefresh className="h-5 w-5" />
                    </button>
                </header>

                <main
                    ref={ref}
                    className="flex-grow overflow-y-auto bg-white p-4"
                >
                    <div className="grid gap-y-3">
                        {chatHistory.map((chatMessage, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    getChatStyling(chatMessage).justify
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-md px-3 py-2 md:max-w-[45%] ${
                                        getChatStyling(chatMessage).styling
                                    }`}
                                >
                                    {chatMessage.message}
                                </div>
                            </div>
                        ))}

                        {streamResponse ? (
                            <div className="justify-start">
                                <div className="mb-1 w-fit max-w-[80%] rounded-md bg-slate-100 px-3 py-2 text-black md:max-w-[45%]">
                                    {streamResponse}
                                </div>
                            </div>
                        ) : streamLoading ? (
                            <div className="justify-start">
                                <div className="mb-1 w-fit rounded-md bg-slate-100 px-3 py-2 text-sm italic text-black md:max-w-[45%]">
                                    <BeatLoader
                                        size={10}
                                        margin={0}
                                        color="#adadad"
                                    />
                                </div>

                                <p className="px-1 text-xs italic text-black">
                                    Chatbot is thinking...
                                </p>
                            </div>
                        ) : null}
                    </div>
                </main>

                <footer className="border-t-2 border-slate-100 bg-white px-4 py-3">
                    <div className="flex gap-x-2 md:gap-x-3">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            className="flex-grow rounded-md border border-slate-200 px-3 py-2 shadow-sm outline-none focus:ring-1 focus:ring-slate-300"
                            value={message}
                            onChange={(evt) => setMessage(evt.target.value)}
                            onKeyDown={(evt) => {
                                if (evt.key === "Enter") {
                                    return sendMessage();
                                }
                            }}
                        />

                        <button
                            disabled={streamLoading}
                            className="flex w-16 items-center justify-center rounded-md bg-slate-800 py-1 text-white transition-colors duration-100 ease-linear hover:bg-slate-900 active:bg-slate-950"
                            onClick={sendMessage}
                        >
                            {streamLoading ? (
                                <IconLoader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Send"
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Page;
