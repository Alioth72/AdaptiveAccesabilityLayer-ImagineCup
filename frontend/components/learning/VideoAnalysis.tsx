import React, { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, MessageCircle, Volume2, X, Send, Sparkles } from 'lucide-react';

interface Flashcard {
    title: string;
    timestamp?: string;
    content: string | null;
    loading?: boolean;
}

interface Message {
    role: 'user' | 'ai';
    text: string;
}

interface VideoAnalysisProps {
    onBack: () => void;
    videoUrl: string;
    bionicMode: boolean;
}

const BionicText: React.FC<{ text: string; enabled: boolean }> = ({ text, enabled }) => {
    if (!enabled || !text) return <>{text}</>;

    const cleanText = text.replace(/<[^>]*>?/gm, ' ');

    return (
        <>
            {cleanText.split(' ').map((word, i) => {
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

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ onBack, videoUrl, bionicMode }) => {
    const [data, setData] = useState<{ summary: string; flashcards: Flashcard[]; raw_clean: string }>({
        summary: '',
        flashcards: [],
        raw_clean: ''
    });
    const [loadingStructure, setLoadingStructure] = useState(true);
    const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
    const processingRef = useRef(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: 'Hi! I analyzed the video. Ask me anything.' }]);
    const [chatLoading, setChatLoading] = useState(false);

    const getYouTubeId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };
    const videoId = getYouTubeId(videoUrl) || '8iK8Q6iA8o4';

    // Fetch Structure
    useEffect(() => {
        const fetchStructure = async () => {
            setLoadingStructure(true);
            try {
                const res = await fetch('http://localhost:8000/analyze_structure', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: videoUrl })
                });
                const result = await res.json();
                const cards: Flashcard[] = result.flashcards.map((c: any) => ({ ...c, content: null, loading: false }));
                setData({ ...result, flashcards: cards });
            } catch (err) {
                console.error(err);
                setData({ summary: 'Error connecting to server.', flashcards: [], raw_clean: '' });
            } finally {
                setLoadingStructure(false);
            }
        };
        if (videoUrl) fetchStructure();
    }, [videoUrl]);

    // Sequential flashcard processing
    useEffect(() => {
        const processNext = async () => {
            if (processingRef.current) return;

            const nextIndex = data.flashcards.findIndex(c => c.content === null && !c.loading);
            if (nextIndex === -1) return;

            processingRef.current = true;
            const cardTitle = data.flashcards[nextIndex].title;

            setData(prev => {
                const copy = [...prev.flashcards];
                copy[nextIndex] = { ...copy[nextIndex], loading: true };
                return { ...prev, flashcards: copy };
            });

            try {
                const res = await fetch('http://localhost:8000/generate_card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: cardTitle, context: data.raw_clean })
                });

                if (res.status === 429) {
                    setData(prev => {
                        const copy = [...prev.flashcards];
                        copy[nextIndex] = { ...copy[nextIndex], loading: false };
                        return { ...prev, flashcards: copy };
                    });
                    setTimeout(() => { processingRef.current = false; }, 30000);
                    return;
                }

                const json = await res.json();
                setData(prev => {
                    const copy = [...prev.flashcards];
                    copy[nextIndex] = { ...copy[nextIndex], loading: false, content: json.content || '<p>Error</p>' };
                    return { ...prev, flashcards: copy };
                });
                setTimeout(() => { processingRef.current = false; }, 6000);
            } catch (err) {
                console.error(err);
                processingRef.current = false;
            }
        };

        processNext();
    }, [data.flashcards]);

    const handleSpeak = (text: string) => {
        window.speechSynthesis.cancel();
        const clean = text.replace(/<[^>]*>?/gm, '');
        const utter = new SpeechSynthesisUtterance(clean);
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
    };

    const handleAskDoubt = async (e: FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setMessages([...messages, { role: 'user', text: query }]);
        setQuery('');
        setChatLoading(true);

        try {
            const res = await fetch('http://localhost:8000/solve_doubt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: query, context: data.raw_clean })
            });
            const ans = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: ans.answer }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 font-medium">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Video + Flashcards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-white/50">
                            <div className="aspect-video bg-black">
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YT" frameBorder={0} allowFullScreen></iframe>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50 min-h-[400px]">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="text-primary" /> Smart Flashcards
                            </h2>

                            {loadingStructure ? (
                                <div className="flex justify-center p-10 animate-pulse">Analyzing Structure...</div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {data.flashcards.map((card, i) => (
                                        <motion.div
                                            key={i}
                                            layoutId={`card-${i}`}
                                            onClick={() => card.content && setSelectedCard(card)}
                                            className={`p-6 rounded-2xl shadow-sm border transition-all ${
                                                card.content
                                                    ? 'bg-white border-indigo-50 hover:border-indigo-300 cursor-pointer hover:shadow-md'
                                                    : 'bg-gray-50 border-gray-100 opacity-60'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-800 line-clamp-1">{card.title}</h3>
                                                {card.timestamp && <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{card.timestamp}</span>}
                                            </div>
                                            {card.loading ? (
                                                <div className="flex items-center gap-2 text-primary text-sm animate-pulse">
                                                    <Sparkles size={14} /> Generating AI Notes...
                                                </div>
                                            ) : card.content ? (
                                                <div className="text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: card.content }} />
                                            ) : (
                                                <div className="text-sm text-gray-400">Waiting in queue...</div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Summary + Doubt */}
                    <div className="space-y-6">
                        <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">AI Summary</h3>
                            <p className="text-indigo-200 text-sm leading-relaxed relative z-10">
                                <BionicText text={data.summary || 'Waiting for analysis...'} enabled={bionicMode} />
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col h-[500px]">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-3xl flex justify-between items-center">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <MessageCircle size={18} className="text-green-500" /> AI Doubt Solver
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && <div className="text-xs text-gray-400 p-2">AI is thinking...</div>}
                            </div>
                            <form onSubmit={handleAskDoubt} className="p-3 border-t border-gray-100 flex gap-2">
                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Ask a doubt..."
                                    className="flex-1 bg-gray-50 border-0 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button type="submit" className="p-3 bg-primary text-white rounded-xl hover:bg-indigo-700 transition">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedCard && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
                            <motion.div
                                layoutId={`card-${data.flashcards.indexOf(selectedCard)}`}
                                className="bg-white w-full max-w-lg p-8 rounded-[2rem] shadow-2xl relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <button onClick={() => setSelectedCard(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-3xl font-bold text-gray-800">{selectedCard.title}</h2>
                                    <button onClick={() => handleSpeak(selectedCard.content || '')} className="p-2 text-primary bg-indigo-50 rounded-full hover:bg-indigo-100">
                                        <Volume2 size={24} />
                                    </button>
                                </div>
                                <div className="prose prose-lg text-gray-600 leading-loose">
                                    <BionicText text={selectedCard.content || ''} enabled={bionicMode} />
                                </div>
                                {selectedCard.timestamp && (
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Timestamp</span>
                                        <span className="text-xl font-mono text-primary bg-indigo-50 px-3 py-1 rounded-lg">{selectedCard.timestamp}</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VideoAnalysis;
