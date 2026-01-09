import React from "react";
import { Sparkles } from "lucide-react";

export function QuizCard() {
    return (
        <div className="rounded-2xl p-6 bg-[#fafdff] border border-gray-200">
            <div className="flex flex-col gap-5 h-full">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#247BA0]/10 text-[#247BA0]">
                        <Sparkles size={24} />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-foreground">Take a Quiz</h2>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                    Test your knowledge with an AI-generated quiz based on all topics you've studied so far.
                </p>

                {/* Centered Button */}
                <div className="mt-auto flex justify-center">
                    <button className="group/btn bg-[#247BA0] hover:bg-[#247BA0]/90 text-white font-semibold px-16 py-3 rounded-xl transition-all duration-300">
                        Start Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
