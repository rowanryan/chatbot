import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { ChatMessage } from "@/server/schemas";
import { api } from "@/utils/api";
import useChatScroll from "@/hooks/useChatScroll";

import { IconLoader2, IconRefresh } from "@tabler/icons-react";

const originalChatState: ChatMessage[] = [
    {
        actor: "bot",
        message: "Hi! What can I help you with?",
        timestamp: new Date(),
    },
];

const Page: NextPage = () => {
    const [message, setMessage] = useState<string>("");
    const [chatHistory, setChatHistory] =
        useState<ChatMessage[]>(originalChatState);

    const ref = useChatScroll(chatHistory);
    const promptMutation = api.chat.prompt.useMutation({
        onSuccess: (data) =>
            setChatHistory((history) => [
                ...history,
                {
                    actor: "bot",
                    message: data,
                    timestamp: new Date(),
                },
            ]),
    });

    const sendMessage = () => {
        if (message !== "" && !promptMutation.isLoading) {
            const newHistory = [
                ...chatHistory,
                {
                    message,
                    actor: "user",
                    timestamp: new Date(),
                },
            ] as ChatMessage[];

            setChatHistory(newHistory);
            setMessage("");

            return promptMutation.mutate({
                messages: newHistory,
            });
        }
    };

    const resetHistory = () => {
        return setChatHistory(originalChatState);
    };

    return (
        <>
            <Head>
                <title>Chatbot</title>
            </Head>

            <div className="flex h-screen flex-col">
                <header className="flex items-center justify-between border-b-2 border-slate-100 bg-white px-4 py-2">
                    <p className="text-lg font-bold">Chatbot</p>

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
                                    chatMessage.actor === "bot"
                                        ? "justify-start"
                                        : "justify-end"
                                }`}
                            >
                                <div
                                    className={`mb-1 max-w-[80%] rounded-md px-3 py-2 md:max-w-[45%] ${
                                        chatMessage.actor === "bot"
                                            ? "bg-slate-100 text-black"
                                            : "bg-blue-600 text-white"
                                    }`}
                                >
                                    {chatMessage.message}
                                </div>
                            </div>
                        ))}

                        {promptMutation.isLoading && (
                            <div className="justify-start">
                                <div className="mb-1 max-w-[80%] rounded-md bg-slate-100 px-3 py-2 text-sm italic text-black md:max-w-[45%]">
                                    Chatbot is thinking...
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="border-t-2 border-slate-100 bg-white px-4 py-3">
                    <div className="flex gap-x-3">
                        <input
                            disabled={promptMutation.isLoading}
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
                            disabled={promptMutation.isLoading}
                            className="flex w-16 items-center justify-center rounded-md bg-slate-800 py-1 text-white transition-colors duration-100 ease-linear hover:bg-slate-900 active:bg-slate-950"
                            onClick={sendMessage}
                        >
                            {promptMutation.isLoading ? (
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
