import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textEntry } from "@/server/schemas";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import cn from "@/utils/cn";

import { IconLoader2 } from "@tabler/icons-react";

export default function AddText() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(textEntry),
    });

    const mutation = api.content.addRawText.useMutation({
        onSuccess: () => {
            toast.success("Successfully added text!");

            return reset();
        },
        onError: () => {
            return toast.error("Something went wrong. Please try again.");
        },
    });

    const onSubmit = (data: FieldValues) => {
        return mutation.mutate({
            text: data.text as string,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <fieldset>
                    <textarea
                        rows={10}
                        placeholder="Write or paste text here..."
                        className={cn(
                            "w-full rounded-md border-2 border-slate-200 px-3 py-2 outline-none placeholder:text-slate-300 focus:border-slate-800",
                            {
                                "border-red-500 focus:border-red-500": Boolean(
                                    errors.text
                                ),
                            }
                        )}
                        {...register("text")}
                    />

                    {errors.text ? (
                        <p className="text-sm text-red-500">
                            {errors.text.message?.toString()}
                        </p>
                    ) : (
                        <p className="text-sm">
                            {watch("text")
                                ? Intl.NumberFormat("en-US").format(
                                      (watch("text") as string).length
                                  )
                                : "0"}{" "}
                            / 50,000 characters
                        </p>
                    )}
                </fieldset>

                <button
                    type="submit"
                    className="flex items-center justify-center rounded-md bg-slate-800 px-4 py-2 text-white transition-colors duration-100 ease-linear hover:bg-slate-900 active:bg-slate-950"
                >
                    {mutation.isLoading ? (
                        <IconLoader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        "Save"
                    )}
                </button>
            </form>
        </>
    );
}
