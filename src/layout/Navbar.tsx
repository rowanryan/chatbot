import { env } from "@/env.mjs";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <>
            <header className="mb-6 border-b-2 border-slate-100 py-3 md:mb-8">
                <div className="container flex max-w-screen-md items-center justify-between">
                    <Link href="/">
                        <p className="text-xl font-extrabold">
                            {env.NEXT_PUBLIC_AI_NAME}
                        </p>
                    </Link>

                    <UserButton />
                </div>
            </header>
        </>
    );
}
