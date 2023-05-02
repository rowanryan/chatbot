import { type AppType } from "next/app";
import { Open_Sans } from "next/font/google";
import { api } from "@/utils/api";
import "@/styles/globals.css";

const openSans = Open_Sans({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <div className={openSans.className}>
            <Component {...pageProps} />
        </div>
    );
};

export default api.withTRPC(MyApp);
