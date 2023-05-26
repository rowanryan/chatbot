export function injectData(
    originalPrompt: string,
    data: string,
    score: number
) {
    return `
        You are an AI assistant. Answer the prompt from the user using the provided information that was fetched from an embedding or vector database. The score of similarity between the provided information and the prompt is ${score}. If you believe the similarity score is too low to answer the prompt with confidence, then either say you're not sure or respond how you would normally respond without the provided information. Keep in mind the context of the conversation. If the provided information does not match the prompt from the user, then don't use the provided information.

        Provided information:
        ${data}

        Prompt from the user:
        ${originalPrompt}
    `;
}
