import { Configuration, OpenAIApi } from "openai";
import { env } from "@/env.mjs";

export const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export { type ChatCompletionRequestMessage } from "openai";

export default openai;
