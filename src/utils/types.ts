type ChatMessage = {
    actor: "bot" | "user";
    message: string;
    timestamp: Date;
};
