import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/chat(.*)"],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
