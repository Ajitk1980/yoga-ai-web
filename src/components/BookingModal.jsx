import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Check } from 'lucide-react';
import { bookClass } from '../api/n8nClient';

export default function BookingModal({ isOpen, onClose, classData }) {
    const [step, setStep] = useState('form'); // form | success
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        timeSlot: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await bookClass({ ...formData, classId: classData.id });
        setIsSubmitting(false);
        setStep('success');
    };

    const resetAndClose = () => {
        setStep('form');
        setFormData({ name: '', email: '', timeSlot: '' });
        onClose();
    };

    return (
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
                        className="fixed z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="relative p-6 md:p-8">
                            <button
                                onClick={resetAndClose}
                                className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-800 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {step === 'form' ? (
                                <>
                                    <h2 className="text-2xl font-serif text-charcoal-900 mb-2">Book Your Flow</h2>
                                    <p className="text-charcoal-500 mb-6 text-sm">
                                        {classData?.title}
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-charcoal-500 uppercase tracking-wide mb-1">
                                                Select Time
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {classData?.schedule.map((time) => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, timeSlot: time })}
                                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${formData.timeSlot === time
                                                                ? 'border-sage-500 bg-sage-50 text-sage-800 ring-1 ring-sage-500'
                                                                : 'border-charcoal-200 text-charcoal-600 hover:border-sage-300'
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-charcoal-500 uppercase tracking-wide mb-1">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-charcoal-200 focus:border-sage-500 focus:ring-1 focus:ring-sage-500 outline-none transition-all"
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
                                                className="w-full px-4 py-2 rounded-lg border border-charcoal-200 focus:border-sage-500 focus:ring-1 focus:ring-sage-500 outline-none transition-all"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !formData.timeSlot}
                                            className="w-full py-3 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? 'Confirming...' : 'Complete Booking'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-xl font-serif text-charcoal-900 mb-2">Booking Confirmed!</h3>
                                    <p className="text-charcoal-500 text-sm mb-6">
                                        We've sent the details to {formData.email}.
                                    </p>
                                    <button
                                        onClick={resetAndClose}
                                        className="px-6 py-2 bg-charcoal-900 text-white rounded-lg text-sm hover:bg-charcoal-800 transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
