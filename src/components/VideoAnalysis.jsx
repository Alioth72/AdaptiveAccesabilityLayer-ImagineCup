import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, MessageCircle, Volume2, X, Send, Sparkles, Loader } from 'lucide-react';

const BionicText = ({ text, enabled }) => {
    if (!enabled || !text) return <>{text}</>;

    // Handle HTML strings by removing tags for bionic processing (simplified for this demo)
    // In a real app, we'd use a parser to only process text nodes.
    const cleanText = typeof text === 'string' ? text.replace(/<[^>]*>?/gm, ' ') : text;

    return cleanText.split(' ').map((word, i) => {
        if (!word) return null;
        const mid = Math.ceil(word.length / 2);
        return (
            <span key={i} className="inline-block mr-[0.25em]">
                <span className="font-extrabold text-gray-900">{word.substring(0, mid)}</span>
                <span>{word.substring(mid)}</span>
            </span>
        );
    });
};

export default function VideoAnalysis({ onBack, videoUrl, bionicMode }) {
    const [data, setData] = useState({ summary: '', flashcards: [], raw_clean: '' });
    const [loadingStructure, setLoadingStructure] = useState(true);

    // Flashcard State
    const [selectedCard, setSelectedCard] = useState(null);

    // Queue Logic for Lazy Loading
    const processingRef = useRef(false);

    // Doubt Solver State
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi! I analyzed the video. Ask me anything.' }
    ]);
    const [chatLoading, setChatLoading] = useState(false);

    // Extract video ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const videoId = getYouTubeId(videoUrl) || '8iK8Q6iA8o4';

    // 1. Initial Fetch: get Structure (Timestamps) + Summary
    useEffect(() => {
        const fetchStructure = async () => {
            setLoadingStructure(true);
            try {
                const response = await fetch('http://localhost:5000/analyze_structure', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: videoUrl })
                });
                const result = await response.json();

                // Initialize cards with content=null
                const cards = result.flashcards.map(c => ({ ...c, content: null, loading: false }));
                setData({ ...result, flashcards: cards });
            } catch (err) {
                console.error("Structure Error", err);
                setData({
                    summary: "Error connecting to server.",
                    flashcards: [],
                    raw_clean: ''
                });
            } finally {
                setLoadingStructure(false);
            }
        };
        if (videoUrl) fetchStructure();
    }, [videoUrl]);

    // 2. Queue Processor: Fills in content one by one
    const processNextCard = useCallback(async () => {
        if (processingRef.current) return;

        // Use functional state update to get CLEANest latest state
        let nextIndex = -1;
        let currentContext = "";

        setData(prev => {
            nextIndex = prev.flashcards.findIndex(c => c.content === null && !c.loading);
            currentContext = prev.raw_clean;
            if (nextIndex !== -1) {
                // LOCK immediately
                processingRef.current = true;
                const newCards = [...prev.flashcards];
                newCards[nextIndex] = { ...newCards[nextIndex], loading: true };
                return { ...prev, flashcards: newCards };
            }
            return prev;
        });

        if (nextIndex === -1) return; // Nothing found to process

        // Actual API Call (outside setState to be async)
        try {
            // We need to re-read the card from state, but we know the index
            // Accessing the card title might require a ref or just trusting index is stable
            // Let's assume stability since we only append/modify.
            // Actually, safe way is to peek state again or just rely on closure if carefully managed?
            // Better: get title from the update call? No, let's keep it simple.

            // Wait for state update to propagate? 
            // Ideally we pass title IN the queueing logic
            // But here we need to read 'data.flashcards[nextIndex]' which might be stale in this closure
            // Refactor to use a ref for data or pass it?

            // Simplification: We already set loading=true in state. 
            // We can access 'data' in the effect dependency easily?
            // No, 'data' changes on every render.
        } catch (e) {
            processingRef.current = false;
        }
    }, []);

    // Corrected Effect for Sequential Processing
    useEffect(() => {
        const process = async () => {
            if (processingRef.current) return;

            const nextIndex = data.flashcards.findIndex(c => c.content === null && !c.loading);
            if (nextIndex === -1) return;

            console.log("Processing Card Index:", nextIndex);
            processingRef.current = true;

            // 1. Mark Loading
            const cardTitle = data.flashcards[nextIndex].title;
            setData(prev => {
                const copy = [...prev.flashcards];
                copy[nextIndex] = { ...copy[nextIndex], loading: true };
                return { ...prev, flashcards: copy };
            });

            // 2. Fetch
            try {
                const res = await fetch('http://localhost:5000/generate_card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: cardTitle,
                        context: data.raw_clean
                    })
                });

                if (res.status === 429) {
                    console.warn("Rate Limit Hit. Waiting 30s...");
                    // Revert loading state so we retry
                    setData(prev => {
                        const copy = [...prev.flashcards];
                        copy[nextIndex] = { ...copy[nextIndex], loading: false };
                        return { ...prev, flashcards: copy };
                    });
                    setTimeout(() => { processingRef.current = false; }, 30000);
                    return;
                }

                const json = await res.json();

                // 3. Update Success
                setData(prev => {
                    const copy = [...prev.flashcards];
                    copy[nextIndex] = {
                        ...copy[nextIndex],
                        loading: false,
                        content: json.content || "<p>Error</p>"
                    };
                    return { ...prev, flashcards: copy };
                });

                // 4. Unlock for next
                setTimeout(() => {
                    processingRef.current = false;
                    // Force a re-eval of the effect by bumping a hidden counter? 
                    // Or simply, since 'data' updated, this effect will re-run automatically!
                }, 6000);

            } catch (err) {
                console.error("Card Gen Error", err);
                processingRef.current = false;
            }
        };

        process();
    }, [data.flashcards]); // This is the key: when 'data' changes (card finished), look for next

    const handleSpeak = (text) => {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/<[^>]*>?/gm, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleAskDoubt = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setMessages([...messages, { role: 'user', text: query }]);
        setQuery('');
        setChatLoading(true);

        try {
            const res = await fetch('http://localhost:5000/solve_doubt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: query, context: data?.raw_clean })
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
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-white/50">
                            <div className="aspect-video bg-black">
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YT" frameBorder="0" allowFullScreen></iframe>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50 min-h-[400px]">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen className="text-primary" /> Smart Flashcards
                            </h2>

                            {loadingStructure ? (
                                <div className="flex justify-center p-10"><i className="animate-spin">🔄</i> Analyzing Structure...</div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {data.flashcards?.map((card, i) => (
                                        <motion.div
                                            key={i}
                                            layoutId={`card-${i}`}
                                            onClick={() => card.content && setSelectedCard(card)}
                                            className={`p-6 rounded-2xl shadow-sm border transition-all ${card.content ? 'bg-white border-indigo-50 hover:border-indigo-300 cursor-pointer hover:shadow-md' : 'bg-gray-50 border-gray-100 opacity-60'}`}
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

                    <div className="space-y-6">
                        <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">AI Summary</h3>
                            <p className="text-indigo-200 text-sm leading-relaxed relative z-10">
                                <BionicText text={data.summary || "Waiting for analysis..."} enabled={bionicMode} />
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
                                    <button onClick={(e) => { e.stopPropagation(); handleSpeak(selectedCard.content); }} className="p-2 text-primary bg-indigo-50 rounded-full hover:bg-indigo-100">
                                        <Volume2 size={24} />
                                    </button>
                                </div>
                                <div className="prose prose-lg text-gray-600 leading-loose">
                                    <BionicText text={selectedCard.content} enabled={bionicMode} />
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
}
