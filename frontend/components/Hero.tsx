"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Check, Users, ShieldCheck, Bot } from "lucide-react";
import { Globe } from "../components/ui/globe";

const Hero: React.FC = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column */}
                    <div className="max-w-4xl z-20 relative">
                        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800 mb-8 hover:bg-gray-200 transition-colors cursor-pointer">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            New: Autonomous Research Agents
                            <ArrowRight size={12} />
                        </div> */}

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-8">
                            Agentic outreach <br className="hidden sm:block" />
                            <span className="text-gray-500">for modern teams.</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                            Use AI agents to find leads, research prospects, and draft hyper-personalized emails.
                            Built-in approval workflows ensure you maintain full control over your digital workforce.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            {/* <div className="flex-grow max-w-md relative">
                                <input
                                    type="email"
                                    placeholder="work@company.com"
                                    className="w-full h-14 pl-6 pr-36 rounded-full border-2 border-gray-200 focus:border-black focus:ring-0 text-lg transition-colors outline-none placeholder:text-gray-400"
                                />
                                <button className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-full font-medium hover:bg-gray-800 transition-transform active:scale-95">
                                    Use Agents
                                </button>
                            </div> */}

                            {/* Avatar group
                            <div className="flex items-center gap-2 px-4 py-2">
                                <div className="flex -space-x-2 overflow-hidden">
                                    <Image
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                        src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt="avatar 1"
                                        width={40}
                                        height={40}
                                    />
                                    <Image
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt="avatar 2"
                                        width={40}
                                        height={40}
                                    />
                                    <Image
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                                        alt="avatar 3"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                    Join 10,000+ teams
                                </span>
                            </div> */}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-8 text-sm font-medium text-gray-500">
                            <div className="flex items-center gap-2">
                                <Check className="text-black" size={16} />
                                <span>Bulk CSV Sending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bot className="text-black" size={16} />
                                <span>Autonomous Agents</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="text-black" size={16} />
                                <span>Admin & User Roles</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-black" size={16} />
                                <span>Human-in-the-loop</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Globe */}
                    <div className="hidden lg:block relative h-[600px] w-full -mr-20 pointer-events-none select-none">
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/5 z-10" />
                        <Globe className="scale-125 translate-x-12" />
                    </div>

                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-transparent rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>
        </section>
    );
};

export default Hero;
