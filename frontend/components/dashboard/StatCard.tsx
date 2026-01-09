import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    variant: "blue" | "purple" | "pink" | "green";
    trend?: string;
}

const variantStyles = {
    blue: "bg-[#d2ebfa] border border-[#B7DEFF]",
    purple: "bg-[#e5cef5] border border-[#D7C3FF]",
    pink: "bg-[#bcebc9] border border-[#bcebc9]",
    green: "bg-[#53add4]/50 border border-[#53add4]/50",
};

export function StatCard({ icon, label, value, variant, trend }: StatCardProps) {
    return (
        <div
            className={`rounded-2xl p-6 ${variantStyles[variant]} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white/60 text-foreground/80">
                        {icon}
                    </div>
                    {trend && (
                        <span className="text-xs font-medium text-primary bg-white/60 px-2 py-1 rounded-full">
                            {trend}
                        </span>
                    )}
                </div>

                <div className="space-y-1 mt-2">
                    <p className="text-sm text-foreground/60 font-medium">{label}</p>
                    <p className="text-3xl font-bold font-display tracking-tight text-foreground">{value}</p>
                </div>
            </div>
        </div>
    );
}
