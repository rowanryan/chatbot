import Head from "next/head";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <>
            <Head>
                <title>Sign up - VerityAI</title>
            </Head>

            <div className="flex h-screen flex-col items-center justify-center px-4">
                <SignUp />
            </div>
        </>
    );
}
