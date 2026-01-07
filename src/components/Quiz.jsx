import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, HelpCircle, ArrowRight, Star, AlertCircle, TrendingUp, XCircle } from 'lucide-react';

export default function Quiz({ concept, onAnswer, level }) {
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Determine which question set to use based on level
    const questionData = concept.questions[level] || concept.questions.standard;

    useEffect(() => {
        // Reset state when concept OR level changes
        setSelected(null);
        setSubmitted(false);
    }, [concept.id, level]);

    const handleSelect = (index) => {
        if (submitted) return;
        setSelected(index);
    };

    const handleSubmit = () => {
        if (selected === null) return;
        setSubmitted(true);
        const isCorrect = selected === questionData.correctAnswer;

        // Slight delay to show visual feedback before notifying parent
        setTimeout(() => {
            onAnswer(isCorrect);
        }, 2000); // 2 seconds to read feedback
    };

    const getFeedbackMessage = () => {
        if (selected === questionData.correctAnswer) {
            if (level === 'advanced') return "Advanced Mastery Unlocked! " + questionData.feedback;
            return "Correct! " + questionData.feedback;
        } else {
            // Wrong Answer
            return "Not quite. " + questionData.feedback;
        }
    };

    return (
        <div className={`
      relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-500
      ${level === 'advanced' ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white border-2 border-yellow-400/30' :
                level === 'remedial' ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100' :
                    'bg-white/70 backdrop-blur-md border border-white/50'
            }
    `}>
            {/* Decorative Badges based on mode */}
            <div className="absolute top-4 right-4">
                {level === 'advanced' && (
                    <span className="flex items-center gap-1 bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-400/30">
                        <Star size={12} fill="currentColor" /> Mastery Challenge
                    </span>
                )}
                {level === 'remedial' && (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        <TrendingUp size={12} /> Guided Practice
                    </span>
                )}
            </div>

            <h3 className={`text-2xl font-semibold mb-6 flex items-center gap-3 ${level === 'advanced' ? 'text-white' : 'text-gray-800'}`}>
                <span className={`p-2 rounded-xl ${level === 'advanced' ? 'bg-white/10' : 'bg-indigo-100 text-primary'}`}>
                    <HelpCircle />
                </span>
                {level === 'advanced' ? 'Proving Mastery' : level === 'remedial' ? 'Let\'s Try Again' : 'Check Understanding'}
            </h3>

            <p className={`text-xl mb-8 font-medium leading-relaxed ${level === 'advanced' ? 'text-indigo-100' : 'text-gray-700'}`}>
                {questionData.text}
            </p>

            <div className="grid gap-4 mb-8">
                {questionData.options.map((option, idx) => {
                    const isSelected = selected === idx;
                    const isCorrectIndex = idx === questionData.correctAnswer;

                    let cardClass = "w-full text-left p-5 rounded-2xl text-lg font-medium transition-all duration-200 border-2 relative overflow-hidden ";

                    if (!submitted) {
                        // Unsubmitted
                        if (level === 'advanced') {
                            cardClass += isSelected
                                ? "border-yellow-400 bg-yellow-400/20 text-white shadow-lg"
                                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20";
                        } else {
                            cardClass += isSelected
                                ? "border-primary bg-indigo-50 text-primary shadow-md transform scale-[1.01]"
                                : "border-transparent bg-white hover:bg-gray-50 text-gray-600 shadow-sm hover:shadow";
                        }
                    } else {
                        // Submitted
                        if (isCorrectIndex) {
                            // Always highlight the correct answer Green
                            cardClass += "border-green-500 bg-green-500 text-white scale-[1.01] shadow-lg z-10";
                        } else if (isSelected && !isCorrectIndex) {
                            // Highlight selected wrong answer Red/Orange
                            cardClass += "border-red-400 bg-red-50 text-red-500 opacity-90";
                        } else {
                            // Others fade out
                            cardClass += "border-transparent opacity-30 bg-gray-100";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={submitted}
                            className={cardClass}
                        >
                            <div className="flex items-center gap-4 relative z-10 w-full">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${isSelected ? (submitted && isCorrectIndex ? 'border-white bg-white text-green-600' : (submitted && !isCorrectIndex ? 'border-red-500 text-red-500' : 'border-current')) : 'border-gray-300/50 text-transparent'}
                `}>
                                    {/* Icon Logic */}
                                    {submitted && isCorrectIndex && <CheckCircle size={18} />}
                                    {submitted && isSelected && !isCorrectIndex && <XCircle size={18} />}
                                    {!submitted && isSelected && <div className="w-3 h-3 bg-current rounded-full" />}
                                </div>
                                <span className="flex-1">{option}</span>
                            </div>
                        </button>
                    )
                })}
            </div>

            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
            ${level === 'advanced'
                            ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'
                            : 'bg-primary text-white hover:bg-indigo-700'
                        }
          `}
                >
                    {level === 'advanced' ? 'Claim Mastery Badge' : 'Check Answer'} <ArrowRight size={20} />
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-center font-bold text-lg border-2
            ${selected === questionData.correctAnswer
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : 'text-red-700 bg-red-50 border-red-200'}
          `}
                >
                    {getFeedbackMessage()}
                </motion.div>
            )}
        </div>
    );
}
