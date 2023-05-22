import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ClerkProvider {...pageProps}>
            <div className={inter.className}>
                <Component {...pageProps} />
                <Toaster />
            </div>
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
