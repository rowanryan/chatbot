import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";

import Layout from "@/layout";

const Page: NextPage = () => {
    const { isLoaded, user } = useUser();

    // const historyQuery = api.content.getHistory.useQuery(undefined, {
    //     onError: () => {
    //         return toast.error("Something went wrong. Please try again.");
    //     },
    // });

    return (
        <Layout>
            <div className="mb-6 max-w-lg md:mb-8">
                <h1 className="mb-1 text-3xl font-bold">
                    {isLoaded && user
                        ? `Hi, ${user.firstName as string}!`
                        : "Hi!"}
                </h1>
                <p className="font-medium text-slate-400">
                    Create your own AI assistants.
                </p>
            </div>

            <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold">Chatbots</h2>
            </div>
        </Layout>
    );
};

export default Page;
