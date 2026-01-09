import React from "react";
import { TrendingUp, ChevronRight } from "lucide-react";

const results = [
    { subject: "Algebra", score: 88, color: "bg-[#b2e1ed]" },
    { subject: "Calculus", score: 76, color: "bg-[#e8cdf7]" },
    { subject: "Physics", score: 92, color: "bg-[#c1e8d7]" },
];

export function QuizResultsCard() {
    return (
        <div className="rounded-2xl p-6 stat-card-blue">
            <div className="flex flex-col gap-5 h-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-white/60 text-[#247BA0]">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-xl font-bold font-display text-foreground">Recent Results</h2>
                    </div>
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        View all <ChevronRight size={16} />
                    </button>
                </div>

                <div className="space-y-3">
                    {results.map((result) => (
                        <div
                            key={result.subject}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{result.subject}</p>
                                <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${result.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${result.score}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-2xl font-bold font-display text-foreground/90">
                                {result.score}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
