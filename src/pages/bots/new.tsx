import { type NextPage } from "next";
import { Tab } from "@headlessui/react";
import classNames from "@/utils/classNames";

import Layout from "@/layout";
import AddText from "@/components/AddText";

const Page: NextPage = () => {
    // const historyQuery = api.content.getHistory.useQuery(undefined, {
    //     onError: () => {
    //         return toast.error("Something went wrong. Please try again.");
    //     },
    // });

    return (
        <Layout title="New chatbot">
            <div className="mb-6 max-w-lg md:mb-8">
                <h1 className="text-3xl font-bold">Create a chatbot</h1>
            </div>

            <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold">Add content</h2>

                <Tab.Group>
                    <Tab.List className="space-x-6">
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "py-1 text-sm font-medium outline-none transition-colors duration-100 ease-linear",
                                    selected
                                        ? "border-b-2 border-slate-800"
                                        : "text-slate-400 hover:text-slate-600"
                                )
                            }
                        >
                            Raw text
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "py-1 text-sm font-medium outline-none transition-colors duration-100 ease-linear",
                                    selected
                                        ? "border-b-2 border-slate-800"
                                        : "text-slate-400 hover:text-slate-600"
                                )
                            }
                        >
                            File
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                classNames(
                                    "py-1 text-sm font-medium outline-none transition-colors duration-100 ease-linear",
                                    selected
                                        ? "border-b-2 border-slate-800"
                                        : "text-slate-400 hover:text-slate-600"
                                )
                            }
                        >
                            YouTube video
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel className="pt-4">
                            <AddText />
                        </Tab.Panel>
                        <Tab.Panel className="pt-4">Content 2</Tab.Panel>
                        <Tab.Panel className="pt-4">Content 3</Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </Layout>
    );
};

export default Page;
