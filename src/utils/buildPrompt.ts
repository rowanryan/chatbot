export function injectData(
    originalPrompt: string,
    data: string,
    score: number
) {
    return `
        The following text, between the quotation marks is injected and given to you by the system operator, not by the user:

        """
        If needed, answer the prompt from the user based on the context below. If the context does not provide relevant information, just say you're not sure.

        Context:
        ${data}
        """

        Answe the prompt from the user:
        ${originalPrompt}
    `;
}
