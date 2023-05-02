import { useRef, useEffect, type MutableRefObject } from "react";

function useChatScroll<T>(dep: T): MutableRefObject<HTMLDivElement> {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dep]);

    return ref as MutableRefObject<HTMLDivElement>;
}

export default useChatScroll;
