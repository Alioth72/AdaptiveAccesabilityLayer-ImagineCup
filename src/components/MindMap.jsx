import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, CheckCircle, Info } from 'lucide-react';

export default function MindMap({ onBack }) {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('aacl_skill_tree');
        if (saved) {
            setSkills(JSON.parse(saved));
        }
    }, []);

    // Layout configuration
    const getNodePosition = (index, total) => {
        const radius = 250;
        const centerX = 400;
        const centerY = 350;

        // Center the first node
        if (index === 0) return { x: centerX, y: centerY };

        // Distribute others in a circle
        const angle = ((index - 1) / (total - 1)) * Math.PI * 2;
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        };
    };

    return (
        <div className="min-h-screen bg-indigo-950 text-white p-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Zap className="text-yellow-400" /> Knowledge Galaxy
                        </h1>
                        <p className="text-indigo-300">Visualize your learning journey through space.</p>
                    </div>
                    <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </header>

                <div className="relative h-[700px] w-full bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {skills.map((skill, i) => {
                            if (i === 0) return null;
                            const start = getNodePosition(0, skills.length);
                            const end = getNodePosition(i, skills.length);
                            return (
                                <motion.line
                                    key={`line-${i}`}
                                    x1={start.x} y1={start.y}
                                    x2={end.x} y2={end.y}
                                    stroke={skill.unlocked ? "rgba(99, 102, 241, 0.4)" : "rgba(255,255,255,0.05)"}
                                    strokeWidth={skill.unlocked ? "3" : "1"}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: i * 0.2 }}
                                />
                            );
                        })}
                    </svg>

                    {skills.map((skill, i) => {
                        const pos = getNodePosition(i, skills.length);
                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, x: pos.x - 70, y: pos.y - 70 }}
                                transition={{ type: 'spring', damping: 12, delay: i * 0.1 }}
                                className={`absolute w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center p-4 text-center border-4 transition-all duration-500 shadow-lg
                                    ${skill.unlocked
                                        ? (skill.level >= 3 ? 'bg-green-500 border-green-300 text-white shadow-green-500/20' : 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20')
                                        : 'bg-white/10 border-white/10 text-white/30 grayscale'}
                                `}
                            >
                                <div className="mb-2">
                                    {skill.level >= 3 ? <CheckCircle size={32} /> : <Zap size={32} />}
                                </div>
                                <div className="text-sm font-bold leading-tight uppercase font-mono tracking-tighter">
                                    {skill.label}
                                </div>
                                {skill.unlocked && (
                                    <div className="mt-2 text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                                        LVL {skill.level}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}

                    {/* Instruction Overlay */}
                    <div className="absolute bottom-10 left-10 flex items-center gap-3 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <Info size={20} />
                        </div>
                        <div className="text-xs">
                            <div className="font-bold">Visual Concept Map</div>
                            <div className="opacity-60">Complete mastery checks to unlock new stars.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
