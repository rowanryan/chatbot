import { type NextPage } from "next";
import Head from "next/head";
import { UserButton, useUser } from "@clerk/nextjs";
import { Tab } from "@headlessui/react";
import classNames from "@/utils/classNames";
import { IconCopy } from "@tabler/icons-react";
import copyToClipboard from "@/utils/copyToClipboard";

import AddText from "@/components/AddText";

const Page: NextPage = () => {
    const { isLoaded, user } = useUser();

    return (
        <>
            <Head>
                <title>VerityAI</title>
            </Head>

            <header className="mb-6 border-b-2 border-slate-100 py-3 md:mb-8">
                <div className="container flex max-w-screen-md items-center justify-between">
                    <p className="text-xl font-extrabold">VerityAI</p>

                    <UserButton />
                </div>
            </header>

            <main className="container max-w-screen-md">
                <div className="mb-4 max-w-lg md:mb-4">
                    <h1 className="mb-1 text-3xl font-bold">
                        {isLoaded && user ? `Hi, ${user.firstName}!` : "Hi!"}
                    </h1>
                    <p className="font-medium text-slate-400">
                        Create your own AI assistant.
                    </p>
                </div>

                {user && (
                    <div className="mb-6 md:mb-8">
                        <p className="text-sm font-bold">Your identifier</p>
                        <div className="flex items-center gap-x-2">
                            <p>{user.id.replace("user_", "")}</p>

                            <button
                                onClick={() =>
                                    copyToClipboard(
                                        user.id.replace("user_", "")
                                    )
                                }
                            >
                                <IconCopy
                                    size={20}
                                    className="text-slate-400 transition-colors duration-100 ease-linear hover:text-slate-500"
                                />
                            </button>
                        </div>
                    </div>
                )}

                <div>
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
            </main>
        </>
    );
};

export default Page;
