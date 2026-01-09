import React from "react";

interface BionicTextProps {
    text: string;
    enabled?: boolean;
}

export const BionicText: React.FC<BionicTextProps> = ({ text, enabled = true }) => {
    if (!enabled) return <>{text}</>;

    return (
        <>
            {text.split(" ").map((word, i) => {
                if (!word) return null;
                const mid = Math.ceil(word.length / 2);
                return (
                    <span key={i} className="inline-block mr-[0.25em]">
                        <span className="font-extrabold text-gray-900">{word.slice(0, mid)}</span>
                        <span>{word.slice(mid)}</span>
                    </span>
                );
            })}
        </>
    );
};
