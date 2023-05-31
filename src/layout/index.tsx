import Head from "next/head";
import type { ReactNode } from "react";
import { env } from "@/env.mjs";

import Navbar from "./Navbar";

export type LayoutProps = {
    title?: string;
    children: ReactNode;
};

export default function Layout(props: LayoutProps) {
    return (
        <>
            <Head>
                <title>{props.title || env.NEXT_PUBLIC_AI_NAME}</title>
            </Head>

            <Navbar />

            <main className="container max-w-screen-md">{props.children}</main>
        </>
    );
}
