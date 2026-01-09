"use client";

import React, { useState, useEffect } from "react";
import { concepts } from "../data";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "../components/learning/ProgressBar";
import ConceptCard from "../components/learning/ConceptCard";
import Quiz from "../components/learning/Quiz";
import VideoAnalysis from "../components/learning/VideoAnalysis";
import UserProfile from "../components/learning/UserProfile";
import AccessibilityToolbar from "../components/learning/AccessibilityToolbar";
import ReadingRuler from "../components/learning/ReadingRuler";
import MindMap from "../components/learning/MindMap";
import {
    ChevronRight,
    ChevronLeft,
    Award,
    RotateCcw,
    Home,
    ArrowLeft,
    Map,
} from "lucide-react";

export default function LearningDisabilityEngine() {
    const [screen, setScreen] = useState("lesson");
    const [videoUrl, setVideoUrl] = useState("");

    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState("standard");
    const [quizState, setQuizState] = useState("pending");
    const [canProceed, setCanProceed] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const [accessSettings, setAccessSettings] = useState({
        font: "lexend",
        theme: "default",
        readingRuler: false,
        adhdMode: false,
        bionicMode: false,
        fontSize: 1,
        lineHeight: 1.8,
        colorBlindness: "none",
    });

    useEffect(() => {
        if (!localStorage.getItem("aacl_skill_tree")) {
            const initial = [
                { id: "motion", label: "Motion Basics", level: 0, unlocked: true },
                { id: "velocity", label: "Velocity", level: 0, unlocked: false },
                { id: "acceleration", label: "Acceleration", level: 0, unlocked: false },
                { id: "equations", label: "Equations", level: 0, unlocked: false },
                { id: "freefall", label: "Free Fall", level: 0, unlocked: false },
            ];
            localStorage.setItem("aacl_skill_tree", JSON.stringify(initial));
        }
    }, []);

    // Accessibility settings
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        body.style.fontFamily =
            accessSettings.font === "opendyslexic"
                ? "OpenDyslexic, sans-serif"
                : "Lexend, sans-serif";

        body.style.lineHeight = String(accessSettings.lineHeight);
        html.style.fontSize = `${accessSettings.fontSize * 16}px`;
        body.dataset.colorBlind = accessSettings.colorBlindness || "none";

        body.classList.remove("dark-mode", "high-contrast", "bionic");

        if (accessSettings.theme === "dark") {
            body.classList.add("dark-mode");
        } else if (accessSettings.theme === "high-contrast") {
            body.classList.add("high-contrast");
        }

        if (accessSettings.bionicMode) {
            body.classList.add("bionic");
        }
    }, [accessSettings]);


    const updateSettings = (newSettings: any) => {
        setAccessSettings((prev) => ({ ...prev, ...newSettings }));
    };

    const concept = concepts[currentStep];
    const bionicMode = accessSettings.bionicMode;

    const handleAnswer = (correct: boolean) => {
        setQuizState("answered");

        if (level === "standard") {
            if (correct) {
                setScore((s) => s + 10);
                setTimeout(() => {
                    setLevel("advanced");
                    setQuizState("pending");
                }, 1200);
            } else {
                setScore((s) => Math.max(0, s - 2));
                setTimeout(() => {
                    setLevel("remedial");
                    setQuizState("pending");
                }, 1500);
            }
        } else {
            setCanProceed(true);
        }
    };

    const nextStep = () => {
        if (currentStep < concepts.length - 1) {
            setCurrentStep((c) => c + 1);
            setLevel("standard");
            setQuizState("pending");
            setCanProceed(false);
        } else {
            setIsFinished(true);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((c) => c - 1);
            setLevel("standard");
            setQuizState("pending");
            setCanProceed(true);
        }
    };

    const restart = () => {
        setCurrentStep(0);
        setScore(0);
        setLevel("standard");
        setQuizState("pending");
        setCanProceed(false);
        setIsFinished(false);
    };



    if (isFinished) {
        return (
            <div className="p-10">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
                    <Award size={60} className="mx-auto text-yellow-500" />
                    <h1 className="text-3xl font-bold mt-4">Lesson Complete!</h1>
                    <p className="text-gray-600 mt-2">Your Mastery Score: {score}</p>

                    <button
                        onClick={restart}
                        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl"
                    >
                        Restart
                    </button>
                </div>
            </div>
        );
    }

    if (screen === "mindmap") {
        return <MindMap onBack={() => setScreen("lesson")} />;
    }

    return (
        <div className="p-6">
            <AccessibilityToolbar
                settings={accessSettings}
                updateSettings={updateSettings}
            />
            <ReadingRuler
                enabled={accessSettings.readingRuler}
                mode={accessSettings.adhdMode ? "focus" : "ruler"}
            />

            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="p-2 bg-white shadow rounded-xl">
                        <ArrowLeft size={20} />
                    </button>

                    <h1 className="text-3xl font-bold"><span className="text-[#247BA0]" >Learning Disability</span> Module</h1>
                </div>

                <button
                    onClick={() => setScreen("mindmap")}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-200 transition-colors"
                >
                    <Map size={20} />
                    View Map
                </button>
            </header>

            <ProgressBar score={score} />

            <main className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentStep}-${level}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >

                        <ConceptCard
                                    concept={concept}
                                    level={level}
                                    bionicMode={accessSettings.bionicMode}
                                />

                        <Quiz concept={concept} level={level} onAnswer={handleAnswer} />

                        
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="mt-10 flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-6 py-3 bg-gray-200 rounded-xl"
                >
                    Previous
                </button>

                <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={`px-8 py-3 rounded-xl text-white ${canProceed ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                >
                    Next
                </button>
            </footer>
        </div>
    );
}
