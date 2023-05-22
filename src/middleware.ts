import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/chatbot(.*)"],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
