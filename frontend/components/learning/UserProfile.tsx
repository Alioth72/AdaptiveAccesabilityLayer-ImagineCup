import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Users, GitBranch, Zap, CheckCircle } from 'lucide-react';

interface Skill {
    id: string;
    label: string;
    level: number;
    unlocked: boolean;
}

interface UserStats {
    name: string;
    rank: number;
    xp: number;
    classAverageXp: number;
}

interface UserProfileProps {
    onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [userStats, setUserStats] = useState<UserStats>({
        name: 'Aaarat',
        rank: 12,
        xp: 0,
        classAverageXp: 450,
    });

    // Init / Load Logic
    useEffect(() => {
        const initialSkills: Skill[] = [
            { id: 'motion', label: 'Motion Basics', level: 0, unlocked: true },
            { id: 'velocity', label: 'Velocity', level: 0, unlocked: false },
            { id: 'acceleration', label: 'Acceleration', level: 0, unlocked: false },
            { id: 'equations', label: 'Equations', level: 0, unlocked: false },
            { id: 'freefall', label: 'Free Fall', level: 0, unlocked: false },
        ];

        const saved = localStorage.getItem('aacl_skill_tree');
        if (saved) {
            setSkills(JSON.parse(saved));
        } else {
            setSkills(initialSkills);
        }
    }, []);

    // Update stats on skills change
    useEffect(() => {
        const totalXp = skills.reduce((acc, s) => acc + s.level * 100, 0);
        setUserStats((prev) => ({ ...prev, xp: totalXp }));
    }, [skills]);

    const resetProgress = () => {
        const freshStart: Skill[] = [
            { id: 'motion', label: 'Motion Basics', level: 0, unlocked: true },
            { id: 'velocity', label: 'Velocity', level: 0, unlocked: false },
            { id: 'acceleration', label: 'Acceleration', level: 0, unlocked: false },
            { id: 'equations', label: 'Equations', level: 0, unlocked: false },
            { id: 'freefall', label: 'Free Fall', level: 0, unlocked: false },
        ];
        setSkills(freshStart);
        localStorage.setItem('aacl_skill_tree', JSON.stringify(freshStart));
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-medium"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Identity Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white shadow-lg">
                                A
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{userStats.name}</h2>
                            <p className="text-gray-500 text-sm mb-6">Class 11-B • Physics Scholar</p>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Rank</div>
                                    <div className="text-xl font-bold text-gray-800">#{userStats.rank}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">XP</div>
                                    <div className="text-xl font-bold text-primary">{userStats.xp}</div>
                                </div>
                            </div>
                        </div>

                        {/* Class Comparison */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Users size={18} /> Class Proficiency
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-600">You</span>
                                        <span className="font-bold text-primary">{userStats.xp} XP</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (userStats.xp / 1000) * 100)}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-600">Class Avg</span>
                                        <span className="font-bold text-gray-400">{userStats.classAverageXp} XP</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gray-300 w-[45%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={resetProgress}
                            className="w-full py-4 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} /> Reset All Progress
                        </button>
                    </div>

                    {/* Right: Skill Tree */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <GitBranch size={200} />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                <Trophy className="text-yellow-500" /> Knowledge Graph
                            </h2>

                            <div className="relative z-10 space-y-8 pl-4 border-l-4 border-gray-100 ml-4">
                                {skills.map((skill) => (
                                    <div key={skill.id} className="relative">
                                        <div
                                            className={`absolute -left-[29px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors duration-500
                                           ${skill.unlocked
                                                    ? skill.level >= 3
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-indigo-500 text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}
                                        >
                                            {skill.level >= 3 ? <CheckCircle size={16} /> : <Zap size={16} />}
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-6 rounded-2xl border-2 transition-all ${
                                                skill.unlocked
                                                    ? skill.level >= 3
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-indigo-50 border-indigo-200'
                                                    : 'bg-gray-50 border-gray-100 grayscale opacity-70'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-lg">{skill.label}</h3>
                                                {skill.unlocked && (
                                                    <span
                                                        className={`text-xs font-bold px-2 py-1 rounded shadow-sm ${
                                                            skill.level >= 3
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-indigo-100 text-indigo-700'
                                                        }`}
                                                    >
                                                        {skill.level >= 3 ? 'MASTERED' : `Level ${skill.level}`}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${skill.level >= 3 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(skill.level / 3) * 100}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
