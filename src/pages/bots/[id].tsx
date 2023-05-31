import { type NextPage } from "next";
import copyToClipboard from "@/utils/copyToClipboard";

import Layout from "@/layout";

import { IconCopy } from "@tabler/icons-react";

const Page: NextPage = () => {
    // const historyQuery = api.content.getHistory.useQuery(undefined, {
    //     onError: () => {
    //         return toast.error("Something went wrong. Please try again.");
    //     },
    // });

    return (
        <Layout>
            <div className="mb-6 max-w-lg md:mb-8">
                <h1 className="text-3xl font-bold">Chatbot</h1>
            </div>

            <div className="mb-6 md:mb-8">
                <p className="text-sm font-bold">Your identifier</p>
                <div className="flex items-center gap-x-2">
                    <p>1234abcd</p>

                    <button onClick={() => copyToClipboard("1234abcd")}>
                        <IconCopy
                            size={20}
                            className="text-slate-400 transition-colors duration-100 ease-linear hover:text-slate-500"
                        />
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold">Content</h2>
            </div>
        </Layout>
    );
};

export default Page;
