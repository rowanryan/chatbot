import { env } from "@/env.mjs";
import { createInnerTRPCContext } from "@/server/api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export const config = {
    runtime: "edge",
};

// export API handler
export default async function handler(req: NextRequest) {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        router: appRouter,
        req,
        createContext: () => {
            const { userId } = getAuth(req);

            return createInnerTRPCContext({
                userId,
                identifier: userId ? userId.replace("user_", "") : null,
            });
        },
        onError:
            env.NODE_ENV === "development"
                ? ({ path, error }) => {
                      console.error(
                          `❌ tRPC failed on ${path ?? "<no-path>"}: ${
                              error.message
                          }`
                      );
                  }
                : undefined,
    });
}
