import { type NextPage } from "next";
import Head from "next/head";

const Page: NextPage = () => {
    return (
        <>
            <Head>
                <title>Chatbot</title>
            </Head>

            <iframe
                src="http://localhost:3000/chatbot/1"
                width="700"
                height="500"
            ></iframe>
        </>
    );
};

export default Page;
