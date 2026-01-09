import React from "react";
import { BookOpen, Clock, ChevronRight, Play } from "lucide-react";

const topics = [
    { name: "Linear Equations", time: "2h ago", progress: 85 },
    { name: "Trigonometry Basics", time: "5h ago", progress: 60 },
    { name: "Newton's Laws", time: "1d ago", progress: 100 },
    { name: "Chemical Bonding", time: "2d ago", progress: 45 },
];

export function RecentTopicsCard() {
    return (
        <div className="rounded-2xl p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#247BA0]/10 text-[#247BA0]">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-display text-foreground">Recently Studied</h2>
                        <p className="text-sm text-muted-foreground">Continue where you left off</p>
                    </div>
                </div>
                <button className="text-sm text-[#247BA0] hover:text-[#247BA0]/80 transition-colors flex items-center gap-1 font-medium">
                    See all <ChevronRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic) => (
                    <div
                        key={topic.name}
                        className="group relative flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{topic.name}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Clock size={12} />
                                <span>{topic.time}</span>
                                <span className="text-border">•</span>
                                <span>{topic.progress}% complete</span>
                            </div>
                            <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#247BA0]/50 rounded-full"
                                    style={{ width: `${topic.progress}%` }}
                                />
                            </div>
                        </div>

                        <button className="p-2 rounded-lg bg-[#247BA0]/10 text-[#247BA0] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Play size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
