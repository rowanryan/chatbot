import type { RouterOutputs } from "@/utils/api";

type HistoryProps = {
    entries: RouterOutputs["content"]["getHistory"];
};

export default function History(props: HistoryProps) {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th className="px-2 text-left text-sm font-semibold">
                            Added on
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {props.entries.map((entry, index) => (
                        <tr key={index}>
                            <td className="px-2 py-1">
                                {Intl.DateTimeFormat("en-US", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                }).format(entry.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
