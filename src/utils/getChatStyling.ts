import type { ChatMessage } from "@/server/schemas";

type Style = {
    justify: "justify-start" | "justify-end";
    styling: string;
};

const getChatStyling = (message: ChatMessage): Style => {
    if (message.actor === "bot") {
        return {
            justify: "justify-start",
            styling: message.error
                ? "bg-red-50 text-black border border-red-300"
                : "bg-slate-100 text-black",
        };
    }

    return {
        justify: "justify-end",
        styling: "bg-blue-600 text-white",
    };
};

export default getChatStyling;
