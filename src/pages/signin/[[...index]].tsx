import Head from "next/head";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <>
            <Head>
                <title>Sign in - VerityAI</title>
            </Head>

            <div className="flex h-screen flex-col items-center justify-center px-4">
                <SignIn />
            </div>
        </>
    );
}
