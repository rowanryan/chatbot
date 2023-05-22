import toast from "react-hot-toast";

export default async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);

        toast.success("Copied to clipboard!");
    } catch (error) {
        console.error("Failed to copy text to clipboard:", error);
    }
}
