import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { getAIRecommendation } from '../api/n8nClient';
import BookingModal from './BookingModal';

export default function AIConcierge() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [debugLog, setDebugLog] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setRecommendations(null);
        setDebugLog({ type: 'info', message: 'Sending request to n8n webhook...' });

        // Call API
        const { data, error } = await getAIRecommendation(input);

        if (error) {
            setDebugLog({ type: 'error', message: `Error: ${error}` });
            setRecommendations(null);
        } else {
            setRecommendations(data);
            setDebugLog({ type: 'success', message: `Success! Received ${data.length} recommendations.` });
        }

        setLoading(false);
    };

    return (
        <section className="py-24 px-6 bg-charcoal-900 text-white overflow-hidden relative">
            {/* Decorative ambient background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-charcoal-800/30 blur-3xl rounded-l-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-charcoal-800 rounded-full mb-6">
                        <Sparkles className="text-sage-400" size={24} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">Your Personal AI Concierge</h2>
                    <p className="text-charcoal-300 text-lg">
                        Not sure where to start? Tell us your goals—like "I want to destress" or "touch my toes"—and we'll curate the perfect practice for you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mb-8 relative z-20">
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., I've had a long week and need to relax..."
                            className="w-full p-6 pr-16 bg-charcoal-800/50 backdrop-blur-md border border-charcoal-700 rounded-2xl text-xl text-white placeholder:text-charcoal-500 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500 transition-all shadow-lg"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input}
                            className="absolute right-3 top-3 p-3 bg-sage-600 rounded-xl text-white hover:bg-sage-500 disabled:opacity-50 disabled:hover:bg-sage-600 transition-colors"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send size={24} />
                            )}
                        </button>
                    </div>
                </form>

                {/* Debug Log for User */}
                <div className="max-w-2xl mx-auto mb-16">
                    {debugLog && (
                        <div className={`p-4 rounded-lg text-sm font-mono border ${debugLog.type === 'error'
                            ? 'bg-red-900/20 border-red-800 text-red-200'
                            : 'bg-charcoal-800/50 border-charcoal-700 text-sage-300'
                            }`}>
                            <p className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${debugLog.type === 'error' ? 'bg-red-500' : 'bg-sage-500'
                                    }`} />
                                {debugLog.message}
                            </p>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {recommendations && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <h3 className="text-center text-sage-300 font-medium uppercase tracking-widest text-sm">
                                Recommended For You
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommendations.map((rec) => (
                                    <div
                                        key={rec.id}
                                        className="flex bg-charcoal-800/80 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-charcoal-800 transition-colors border border-charcoal-700 p-1"
                                    >
                                        <div className="w-1/3 min-w-[120px]">
                                            <img
                                                src={rec.image}
                                                alt={rec.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="w-2/3 p-4 flex flex-col justify-between ml-2">
                                            <div>
                                                <h4 className="text-xl font-serif mb-1">{rec.title}</h4>
                                                <p className="text-charcoal-400 text-sm line-clamp-2">
                                                    {rec.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedClass(rec)}
                                                className="mt-4 flex items-center text-sage-400 text-sm font-medium hover:text-sage-300 transition-colors group"
                                            >
                                                Book Now
                                                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <BookingModal
                isOpen={!!selectedClass}
                onClose={() => setSelectedClass(null)}
                classData={selectedClass}
            />
        </section>
    );
}
