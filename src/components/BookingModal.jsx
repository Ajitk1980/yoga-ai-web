import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Check, Clock, MapPin, User } from 'lucide-react';
import { bookClass, fetchClassSchedule } from '../api/n8nClient';

export default function BookingModal({ isOpen, onClose, classData }) {
    const [step, setStep] = useState('list'); // list | form | success
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (isOpen && classData) {
            setLoadingSessions(true);
            setStep('list');
            fetchClassSchedule(classData.title)
                .then(data => {
                    setSessions(data);
                    setLoadingSessions(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingSessions(false);
                });
        }
    }, [isOpen, classData]);

    const handleSessionSelect = (session) => {
        setSelectedSession(session);
        setStep('form');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const response = await bookClass({
            ...formData,
            classId: classData.id,
            sessionId: selectedSession.id,
            sessionDate: selectedSession.date,
            sessionTime: selectedSession.time
        });
        setIsSubmitting(false);

        if (response.success || response.status === 'success') {
            setSuccessMessage(response.message);
            setStep('success');
        } else {
            alert(response.message);
        }
    };

    const resetAndClose = () => {
        setStep('list');
        setFormData({ name: '', email: '' });
        setSelectedSession(null);
        onClose();
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="relative p-6 md:p-8 flex-1 overflow-y-auto">
                            <button
                                onClick={resetAndClose}
                                className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-800 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {step === 'list' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-2xl font-serif text-charcoal-900 mb-2">Available Sessions</h2>
                                    <p className="text-charcoal-500 mb-6 text-sm">
                                        Select a time for {classData?.title}
                                    </p>

                                    {loadingSessions ? (
                                        <div className="flex justify-center py-12">
                                            <div className="w-8 h-8 border-2 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {sessions.map((session) => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => handleSessionSelect(session)}
                                                    className="w-full bg-white border border-charcoal-200 rounded-xl p-4 hover:border-sage-400 hover:shadow-md transition-all text-left group"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-semibold text-charcoal-800 group-hover:text-sage-700 transition-colors">
                                                            {session.date}
                                                        </span>
                                                        <span className="bg-sage-50 text-sage-700 text-xs px-2 py-1 rounded-full font-medium">
                                                            {session.time}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-charcoal-500">
                                                        <div className="flex items-center gap-1">
                                                            <User size={14} />
                                                            {session.instructor}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {session.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            {session.location}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            {sessions.length === 0 && (
                                                <p className="text-center text-charcoal-400 py-8">No sessions available at this time.</p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {step === 'form' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <button
                                        onClick={() => setStep('list')}
                                        className="text-xs text-charcoal-400 hover:text-sage-600 mb-4 flex items-center gap-1"
                                    >
                                        ← Back to sessions
                                    </button>

                                    <h2 className="text-2xl font-serif text-charcoal-900 mb-2">Complete Booking</h2>
                                    <div className="bg-sage-50 p-4 rounded-xl mb-6 border border-sage-100">
                                        <p className="font-medium text-sage-800 text-sm mb-1">{classData?.title}</p>
                                        <p className="text-sage-600 text-xs flex items-center gap-2">
                                            <span>{selectedSession?.date} at {selectedSession?.time}</span>
                                            <span className="w-1 h-1 bg-sage-400 rounded-full"></span>
                                            <span>{selectedSession?.instructor}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-charcoal-500 uppercase tracking-wide mb-1">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-sage-500 focus:ring-1 focus:ring-sage-500 outline-none transition-all placeholder:text-charcoal-300"
                                                placeholder="e.g. Jane Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-charcoal-500 uppercase tracking-wide mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-charcoal-200 focus:border-sage-500 focus:ring-1 focus:ring-sage-500 outline-none transition-all placeholder:text-charcoal-300"
                                                placeholder="jane@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-sage-200 mt-2"
                                        >
                                            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="text-center py-10"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.1
                                        }}
                                        className="w-20 h-20 bg-sage-50 text-sage-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-sage-100"
                                    >
                                        <Check size={40} strokeWidth={1.5} />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-2xl font-serif text-charcoal-900 mb-3 tracking-tight">
                                            Booking Confirmed
                                        </h3>
                                        <p className="text-charcoal-500 text-base mb-8 px-6 leading-relaxed">
                                            {successMessage || `We've sent the details to ${formData.email}.`}
                                        </p>
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        onClick={resetAndClose}
                                        className="px-8 py-3 bg-charcoal-900 text-white rounded-full text-sm font-medium tracking-wide hover:bg-charcoal-800 transition-all hover:shadow-lg transform active:scale-95"
                                    >
                                        Return to Sanctuary
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
