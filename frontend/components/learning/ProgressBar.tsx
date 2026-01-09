import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score }) => {
    // 5 concepts, max 10 points each = 50 points total target
    const progress = Math.min(100, Math.max(0, (score / 50) * 100));

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-500">
                <span>Mastery Progress</span>
                <span>{score} pts</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#247BA0] to-[#247BA0]/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            {score < 0 && (
                <div className="text-xs text-center mt-1 text-orange-400">
                    Keep going! You are learning.
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
