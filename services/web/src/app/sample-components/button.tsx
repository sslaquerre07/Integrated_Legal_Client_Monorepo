import type { ReactNode } from "react";

type ButtonProps = {
    children: ReactNode;
    className?: string;
};

export default function Button({ children, className = "" }: ButtonProps) {
    return (
        <button
            type="button"
            className={`whitespace-nowrap rounded-lg bg-white/5 px-3 py-2 font-roboto-mono text-base font-bold text-white ${className}`}
        >
            {children}
        </button>
    );
}