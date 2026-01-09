import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { BionicText } from "./BionicText";
import { Volume2, Info } from 'lucide-react';

interface Concept {
    id: string | number;
    title: string;
    explanation: string;
    diagram: string;
    additionalVisual?: string;
}

interface ConceptCardProps {
    concept: Concept;
    level: 'remedial' | 'standard' | 'advanced';
    bionicMode: boolean;
}

interface BionicTextProps {
    text: string;
    enabled: boolean;
}

const BionicText: React.FC<BionicTextProps> = ({ text, enabled }) => {
    if (!enabled) return <>{text}</>;

    return (
        <>
            {text.split(' ').map((word, i) => {
                if (!word) return null;
                const mid = Math.ceil(word.length / 2);
                return (
                    <span key={i} className="inline-block mr-[0.25em]">
                        <span className="font-extrabold text-gray-900">{word.substring(0, mid)}</span>
                        <span>{word.substring(mid)}</span>
                    </span>
                );
            })}
        </>
    );
};

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, level, bionicMode }) => {
    const [imgError, setImgError] = useState(false);

    // Reset error state when concept changes
    useEffect(() => {
        setImgError(false);
    }, [concept.id]);

    const speak = () => {
        window.speechSynthesis.cancel();
        const text =
            level === 'remedial' && concept.additionalVisual
                ? `${concept.title}. ${concept.explanation}. ${concept.additionalVisual}`
                : `${concept.title}. ${concept.explanation}`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl mb-8 relative overflow-hidden border border-white/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
        >
            {/* Dynamic Header Gradient */}
            <div
                className={`absolute top-0 left-0 w-full h-2 ${level === 'advanced'
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                    }`}
            />

            <div className="flex justify-between items-start mb-6 w-full">
                <div className="flex-1">
                    {level === 'remedial' && (
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wide mb-2">
                            Simplified View
                        </span>
                    )}
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight leading-tight">
                        <BionicText text={concept.title} enabled={bionicMode} />
                    </h2>
                </div>
                <button
                    onClick={speak}
                    className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition-colors text-primary shadow-sm group"
                    title="Read Aloud"
                >
                    <Volume2 size={28} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <p className="text-xl md:text-2xl text-gray-700 leading-loose font-medium">
                        <BionicText text={concept.explanation} enabled={bionicMode} />
                    </p>

                    {(level === 'remedial' || level === 'standard') && concept.additionalVisual && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-yellow-50/80 p-5 rounded-2xl border border-yellow-100 flex gap-4 items-start"
                        >
                            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mt-1">
                                <Info size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm uppercase tracking-wide mb-1">
                                    Visual Analogy
                                </h4>
                                <p className="text-yellow-900 font-medium leading-relaxed">
                                    <BionicText text={concept.additionalVisual} enabled={bionicMode} />
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="aspect-video rounded-2xl overflow-hidden bg-white border-2 border-indigo-50 flex items-center justify-center relative shadow-inner z-10">
                        {!imgError ? (
                            <img
                                src={concept.diagram}
                                alt={`Diagram for ${concept.title}`}
                                className="w-full h-full object-contain p-2"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="text-center p-6 text-gray-400">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                                    🖼️
                                </div>
                                <p className="font-semibold text-lg text-gray-500">Visual Placeholder</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ConceptCard;
