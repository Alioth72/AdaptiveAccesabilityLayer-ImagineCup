import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Youtube, FileText, ArrowRight, Loader, User, Trophy, Zap } from 'lucide-react';

export default function Dashboard({ onStartLesson, onStartVideo, onOpenProfile, onStartMindMap }) {
    const [loading, setLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(null); // 'pdf' or 'video'
    const [videoUrl, setVideoUrl] = useState('');
    const [totalXp, setTotalXp] = useState(0);

    // Sync Total XP from localStorage
    useEffect(() => {
        const syncXp = () => {
            const saved = localStorage.getItem('aacl_skill_tree');
            if (saved) {
                try {
                    const skills = JSON.parse(saved);
                    const xp = skills.reduce((acc, s) => acc + (s.level * 100), 0);
                    setTotalXp(xp);
                } catch (e) {
                    console.error("Failed to parse skills", e);
                }
            }
        };
        syncXp();
        window.addEventListener('storage', syncXp);
        return () => window.removeEventListener('storage', syncXp);
    }, []);

    const handleFileUpload = (e) => {
        setLoading(true);
        setLoadingType('pdf');
        setTimeout(() => {
            setLoading(false);
            onStartLesson();
        }, 2500);
    };

    const handleVideoSubmit = (e) => {
        e.preventDefault();
        if (!videoUrl) return;
        setLoading(true);
        setLoadingType('video');
        setTimeout(() => {
            setLoading(false);
            onStartVideo(videoUrl);
        }, 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-primary mb-6"
                >
                    <Loader size={64} />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {loadingType === 'pdf' ? 'Analyzing Document Structured...' : 'Parsing Video Transcript...'}
                </h2>
                <p className="text-gray-500 max-w-sm">
                    Our AI is generating accessible summaries and simplified explanations just for you.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <header className="max-w-5xl mx-auto mb-12 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">
                        Ph
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Learning Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onStartMindMap()}
                        className="hidden lg:flex items-center gap-2 bg-indigo-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-800 transition-all border border-indigo-700"
                    >
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-sm font-bold">Concept Map</span>
                    </button>

                    <div className="hidden md:flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100 shadow-sm">
                        <Trophy size={16} className="text-yellow-600" />
                        <span className="text-sm font-bold text-yellow-700">{totalXp} XP Points</span>
                    </div>

                    <button
                        onClick={onOpenProfile}
                        className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary">
                            <User size={18} />
                        </div>
                        <div className="text-left hidden sm:block">
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Student</div>
                            <div className="text-sm font-bold text-gray-700 group-hover:text-primary">Aaarat</div>
                        </div>
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={120} />
                    </div>

                    <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-6">
                        <Upload size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Upload Study Material</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Upload any PDF (NCERT chapters, notes) and our AACL engine will instantly convert it into an interactive, step-by-step lesson.
                    </p>

                    <label className="block w-full cursor-pointer">
                        <div className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center gap-3 text-primary font-bold hover:bg-indigo-50 transition-colors">
                            <Upload size={20} /> Choose PDF File
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    </label>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Youtube size={120} className="text-red-500" />
                    </div>

                    <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                        <Youtube size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Video Analysis</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Paste a YouTube link. We'll extract the transcript, generate summary notes, and create key takeaways for you.
                    </p>

                    <form onSubmit={handleVideoSubmit} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Paste YouTube URL..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all outline-none bg-gray-50"
                        />
                        <button type="submit" className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg">
                            <ArrowRight size={24} />
                        </button>
                    </form>
                </motion.div>

                <div className="md:col-span-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-2">Accessibility Features Enabled</h3>
                        <p className="text-emerald-700">Dyslexia support, Reading Ruler, and High-Contrast modes are available in the toolbar.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-gray-600">OpenDyslexic Font</div>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-gray-600">Reading Ruler</div>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-gray-600">TTS Support</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
