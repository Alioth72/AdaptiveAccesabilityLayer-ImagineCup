"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import {
    Home,
    Trophy,
    Target,
    BookOpen,
    Eye,
    Crown,
    User,
    Settings,
    LogOut,
    Menu,
    Timer,
    BarChart3,
    Ear,
    Video,
    FileText,
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuizCard } from "@/components/dashboard/QuizCard";
import { QuizResultsCard } from "@/components/dashboard/QuizResultsCard";
import LearningDisabilityEngine from "@/components/LearningDisabilityEngine";
import { RecentTopicsCard } from "@/components/dashboard/RecentTopicsCard";
import AccessibilityToolbar from "@/components/learning/AccessibilityToolbar";
import { AccessibilitySettings } from "@/components/learning/AccessibilityToolbar";
import VisualDisability from "@/components/VisualDisability";

const topItems = [
    { name: "Home", icon: Home },
    { name: "Learning Disability", icon: BookOpen },
    { name: "Visual Impairment", icon: Eye },
    { name: "Hearing Impairment", icon: Ear },
    { name: "Profile", icon: User },
];

const bottomItems = [
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
];

export default function DashboardPage() {
    const [active, setActive] = useState("Home");
    const [expanded, setExpanded] = useState(false);
    const [accessSettings, setAccessSettings] = useState<AccessibilitySettings>({
        font: "lexend",
        theme: "default",
        readingRuler: false,
        adhdMode: false,
        bionicMode: false,
        fontSize: 1,
        lineHeight: 1.8,
        colorBlindness: "none",
    });

    const updateSettings = (newSettings: Partial<typeof accessSettings>) => {
        setAccessSettings((prev) => ({ ...prev, ...newSettings }));
    };
    useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    /* FONT */
    body.style.fontFamily =
        accessSettings.font === "opendyslexic"
        ? "OpenDyslexic, Arial, sans-serif"
        : "Lexend, system-ui, sans-serif";

    /* TEXT SIZE + LINE HEIGHT */
    html.style.fontSize = `${accessSettings.fontSize * 16}px`;
    body.style.lineHeight = String(accessSettings.lineHeight);

    /* RESET CLASSES */
    body.classList.remove(
        "dark-mode",
        "high-contrast",
        "adhd-mode",
        "bionic-mode"
    );

    /* THEMES */
    if (accessSettings.theme === "dark") {
        body.classList.add("dark-mode");
    }

    if (accessSettings.theme === "high-contrast") {
        body.classList.add("high-contrast");
    }

    /* ADHD MODE */
    if (accessSettings.adhdMode) {
        body.classList.add("adhd-mode");
    }

    /* BIONIC MODE (matches GitHub behavior) */
    if (accessSettings.bionicMode) {
        body.classList.add("bionic-mode");
    }
    }, [accessSettings]);




    return (
        <div className="flex h-screen w-full p-4 gap-4">
            <AccessibilityToolbar
                settings={accessSettings}
                updateSettings={updateSettings}
                />
            {/* ------------------ SIDEBAR (Original) ------------------ */}
            <div
                className={`bg-[#e8e8e8]/40 backdrop-blur-md rounded-2xl p-4 flex flex-col text-white
        ${expanded ? "w-64" : "w-20"} transition-all duration-300`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-12 h-12 flex items-center justify-center mb-6 rounded-xl hover:bg-[#247BA0]/40 text-[#959696]"
                    title="Toggle Sidebar"
                >
                    <Menu size={24} />
                </button>

                {/* Top Items */}
                <div className="flex flex-col items-center gap-4">
                    {topItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = active === item.name;

                        return (
                            <button
                                key={item.name}
                                onClick={() => setActive(item.name)}
                                className={`
                  flex items-center gap-4 rounded-xl transition-colors
                  ${isActive ? "bg-[#247BA0]/80 text-white" : "hover:bg-[#247BA0]/20 text-[#959696]"}
                  ${expanded ? "px-4 py-2 w-full justify-start" : "w-12 h-12 justify-center"}
                `}
                            >
                                <Icon size={24} />
                                {expanded && <span className="font-semibold">{item.name}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Spacer */}
                <div className="flex-grow" />

                {/* Bottom Items */}
                {/* Bottom Items */}
                <div className="flex flex-col items-center gap-4">
                    {/* Settings button stays */}
                    <button
                        onClick={() => setActive("Settings")}
                        className={`flex items-center gap-4 rounded-xl transition-colors
                            ${active === "Settings" ? "bg-[#247BA0]/80 text-white" : "hover:bg-[#247BA0]/20 text-[#959696]"}
                            ${expanded ? "px-4 py-2 w-full justify-start" : "w-12 h-12 justify-center"}`}
                    >
                        <Settings size={24} />
                        {expanded && <span className="font-semibold">Settings</span>}
                    </button>


                </div>

            </div>

            {/* ------------------ MAIN CONTENT ------------------ */}
            <div className="flex flex-col w-full h-full gap-6 overflow-y-auto pr-2">
                {active === "Home" && <HomeDashboard />}

                {active === "Learning Disability" && <LearningDisabilityEngine />}
                {active === "Visual Impairment" && <VisualDisability />}
                {active === "Hearing Impairment" && <div>Hearing Impairment Page Coming Soon</div>}
                {active === "Profile" && <div>Profile Page Coming Soon</div>}

            </div>
        </div>
    );
}

function HomeDashboard() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <Header />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Timer size={24} />}
                    label="Hours Studied"
                    value="12.4h"
                    variant="blue"
                    trend="+2.3h"
                />
                <StatCard
                    icon={<BarChart3 size={24} />}
                    label="Quizzes Taken"
                    value="18"
                    variant="purple"
                    trend="+5"
                />
                <StatCard
                    icon={<Video size={24} />}
                    label="Videos Watched"
                    value="34"
                    variant="pink"
                    trend="+12"
                />
                <StatCard
                    icon={<FileText size={24} />}
                    label="PDFs Viewed"
                    value="22"
                    variant="green"
                    trend="+8"
                />
            </div>

            {/* Middle Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuizCard />
                <QuizResultsCard />
            </div>

            {/* Recent Topics */}
            <RecentTopicsCard />
        </div>
    );
}

// function LearningDisabilityPage() {
//     return (
//         <div className="w-full h-full p-8">
//             <h1 className="text-3xl font-bold mb-4">Learning Disability</h1>
//             <p className="text-muted-foreground mb-6">
//                 This is your learning disability module page.
//             </p>

//             <div className="bg-white shadow rounded-2xl p-6 border">
//                 <h2 className="text-xl font-semibold mb-2">Upload Student Text</h2>
//                 <p className="text-sm text-muted-foreground mb-4">
//                     The AI will analyse difficulty, readability & learning challenges.
//                 </p>

//                 <textarea
//                     className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-[#247BA0]"
//                     placeholder="Paste the student's text here..."
//                 ></textarea>

//                 <button className="mt-4 px-6 py-3 bg-[#247BA0] text-white rounded-xl hover:bg-[#1f6b8c] transition">
//                     Analyse Difficulty
//                 </button>
//             </div>
//         </div>
//     );
// }
