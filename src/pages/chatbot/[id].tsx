import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";

import { IconRefresh } from "@tabler/icons-react";

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

    const sendMessage = () => {
        if (message !== "") {
            setChatHistory((history) => [
                ...history,
                {
                    message,
                    actor: "user",
                    timestamp: new Date(),
                },
            ]);

            return setMessage("");
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

                <main className="flex-grow bg-white p-4">
                    <div className="grid gap-y-1">
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
                    </div>
                </main>

                <footer className="border-t-2 border-slate-100 bg-white px-4 py-3">
                    <div className="flex gap-x-3">
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
                            className="rounded-md bg-slate-800 px-4 py-1 text-white transition-colors duration-100 ease-linear hover:bg-slate-900 active:bg-slate-950"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Page;
