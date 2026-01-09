import React, { useState } from 'react';
import {
    Settings, X, Type, Sun, Moon, MoveHorizontal, Eye, Activity, Palette, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AccessibilitySettings {
    adhdMode: boolean;
    readingRuler: boolean;
    bionicMode: boolean;
    fontSize: number;
    font: string;
    theme: 'default' | 'dark' | 'high-contrast';
    colorBlindness?: string;
    lineHeight?: number;
}

interface AccessibilityToolbarProps {
    settings: AccessibilitySettings;
    updateSettings: (updated: Partial<AccessibilitySettings>) => void;
}

export default function AccessibilityToolbar({ settings, updateSettings}: AccessibilityToolbarProps) {
    // const [isOpen, setIsOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // if (variant === "sidebar") {
    //     return (
    //         <div className="flex flex-col items-center gap-3 mt-6">
    //         <button
    //             onClick={() => updateSettings({ adhdMode: !settings.adhdMode })}
    //             className={`w-12 h-12 rounded-xl flex items-center justify-center
    //             ${settings.adhdMode ? "bg-indigo-500 text-white" : "bg-white/60 text-gray-500 hover:bg-white"}`}
    //             title="ADHD Focus Mode"
    //         >
    //             <Activity size={22} />
    //         </button>

    //         <button
    //             onClick={() => updateSettings({ readingRuler: !settings.readingRuler })}
    //             className={`w-12 h-12 rounded-xl flex items-center justify-center
    //             ${settings.readingRuler ? "bg-emerald-500 text-white" : "bg-white/60 text-gray-500 hover:bg-white"}`}
    //             title="Reading Ruler"
    //         >
    //             <MoveHorizontal size={22} />
    //         </button>

    //         <button
    //             onClick={() => updateSettings({ bionicMode: !settings.bionicMode })}
    //             className={`w-12 h-12 rounded-xl flex items-center justify-center
    //             ${settings.bionicMode ? "bg-indigo-500 text-white" : "bg-white/60 text-gray-500 hover:bg-white"}`}
    //             title="Bionic Reading"
    //         >
    //             <Zap size={22} />
    //         </button>
    //         </div>
    //     );
    //     }

    return (
        <>
            <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-4">
                {/* Main Trigger */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-4 bg-primary text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    aria-label="Open Accessibility Menu"
                >
                    <div className="relative">
                        <Activity size={28} />
                        {settings.adhdMode && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary"></span>
                        )}
                    </div>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        className="fixed bottom-24 left-6 z-[100] bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 w-80 max-h-[80vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                <span className="bg-indigo-100 p-2 rounded-lg text-primary"><Settings size={20} /></span>
                                Assistant
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* ADHD / Cognitive Load */}
                            <section>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <TargetIcon /> Focus Tools
                                </label>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => updateSettings({ adhdMode: !settings.adhdMode })}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${settings.adhdMode ? 'border-primary bg-indigo-50 text-indigo-900' : 'border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${settings.adhdMode ? 'bg-indigo-200' : 'bg-gray-100'}`}>
                                                <Eye size={18} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm">ADHD Focus Mode</div>
                                                <div className="text-[10px] opacity-70">Dim distractions, spotlight cursor</div>
                                            </div>
                                        </div>
                                        <Switch isOn={settings.adhdMode} />
                                    </button>

                                    <button
                                        onClick={() => updateSettings({ readingRuler: !settings.readingRuler })}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${settings.readingRuler ? 'border-secondary bg-emerald-50 text-emerald-900' : 'border-gray-200 hover:border-emerald-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${settings.readingRuler ? 'bg-emerald-200' : 'bg-gray-100'}`}>
                                                <MoveHorizontal size={18} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm">Reading Ruler</div>
                                                <div className="text-[10px] opacity-70">Guide line for reading</div>
                                            </div>
                                        </div>
                                        <Switch isOn={settings.readingRuler} />
                                    </button>

                                    <button
                                        onClick={() => updateSettings({ bionicMode: !settings.bionicMode })}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${settings.bionicMode ? 'border-primary bg-indigo-50 text-indigo-900' : 'border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${settings.bionicMode ? 'bg-indigo-200' : 'bg-gray-100'}`}>
                                                <Zap size={18} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm">Bionic Reading</div>
                                                <div className="text-[10px] opacity-70">Bold initial letters for better focus</div>
                                            </div>
                                        </div>
                                        <Switch isOn={settings.bionicMode} />
                                    </button>
                                </div>
                            </section>

                            {/* Typography */}
                            <section>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Type size={14} /> Text Experience
                                </label>

                                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                                            <span>Font Size</span>
                                            <span>{Math.round(settings.fontSize * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.8"
                                            max="1.5"
                                            step="0.05"
                                            value={settings.fontSize || 1}
                                            onChange={(e) => updateSettings({ fontSize: parseFloat(e.target.value) })}
                                            className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                                            <span>Font Type</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => updateSettings({ font: 'lexend' })}
                                                className={`text-sm py-2 px-3 rounded-lg border-2 font-sans ${settings.font === 'lexend' ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-200'}`}
                                            >
                                                Lexend
                                            </button>
                                            <button
                                                onClick={() => updateSettings({ font: 'opendyslexic' })}
                                                className={`text-sm py-2 px-3 rounded-lg border-2 ${settings.font === 'opendyslexic' ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-200'}`}
                                                style={{ fontFamily: 'OpenDyslexic, sans-serif' }}
                                            >
                                                Dyslexic
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Color & Theme */}
                            <section>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Palette size={14} /> Visual Engine
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <ThemeBtn
                                        name="Default"
                                        active={settings.theme === 'default'}
                                        onClick={() => updateSettings({ theme: 'default' })}
                                        color="bg-[#FAF9F6]"
                                    />
                                    <ThemeBtn
                                        name="Dark"
                                        active={settings.theme === 'dark'}
                                        onClick={() => updateSettings({ theme: 'dark' })}
                                        color="bg-slate-900"
                                    />
                                    <ThemeBtn
                                        name="High Vis"
                                        active={settings.theme === 'high-contrast'}
                                        onClick={() => updateSettings({ theme: 'high-contrast' })}
                                        color="bg-black border-2 border-yellow-400"
                                    />
                                </div>

                                {/* Color Blindness Filters */}
                                <div className="mt-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Color Blindness Filter</label>
                                    <select
                                        value={settings.colorBlindness || 'none'}
                                        onChange={(e) => updateSettings({ colorBlindness: e.target.value })}
                                        className="w-full p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="none">None</option>
                                        <option value="protanopia">Protanopia (Red-Blind)</option>
                                        <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                                        <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                                        <option value="achromatopsia">Achromatopsia (Monochrome)</option>
                                    </select>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

interface SwitchProps {
    isOn: boolean;
}

function Switch({ isOn }: SwitchProps) {
    return (
        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-gray-300'}`}>
            <motion.div
                animate={{ x: isOn ? 16 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
        </div>
    )
}

interface ThemeBtnProps {
    name: string;
    active: boolean;
    onClick: () => void;
    color: string;
}

function ThemeBtn({ name, active, onClick, color }: ThemeBtnProps) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${active ? 'border-primary bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
        >
            <div className={`w-full h-8 rounded-lg shadow-inner ${color}`}></div>
            <span className="text-xs font-semibold text-gray-600">{name}</span>
        </button>
    )
}

function TargetIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}
