import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "1rem",
        },
        extend: {},
    },
    plugins: [],
} satisfies Config;
