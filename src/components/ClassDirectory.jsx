import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart, Target } from 'lucide-react';
import BookingModal from './BookingModal';
import { fetchClasses } from '../api/n8nClient';

export default function ClassDirectory() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const loadClasses = async () => {
            const data = await fetchClasses();
            setClasses(data);
            setLoading(false);
        };
        loadClasses();
    }, []);

    return (
        <section className="py-20 px-6 bg-white" id="classes">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-sage-600 font-medium tracking-wider text-sm uppercase mb-2 block">Our Offerings</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-4">Curated for Your Journey</h2>
                    <p className="text-charcoal-500 max-w-2xl mx-auto">
                        From vigorous flows to restorative stillness, find the practice that meets you where you are today.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-96 bg-charcoal-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {classes.map((cls, index) => (
                            <motion.div
                                key={cls.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-charcoal-100"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={cls.image}
                                        alt={cls.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-charcoal-800 uppercase tracking-wide">
                                        {cls.level}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-serif text-charcoal-900 mb-2 group-hover:text-sage-700 transition-colors">
                                        {cls.title}
                                    </h3>
                                    <p className="text-charcoal-500 text-sm mb-4 line-clamp-2">
                                        {cls.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {cls.goals.map(goal => (
                                            <span key={goal} className="inline-flex items-center px-2 py-1 bg-sage-50 text-sage-700 rounded text-xs">
                                                <Target size={12} className="mr-1" />
                                                {goal}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedClass(cls)}
                                        className="w-full py-3 border border-charcoal-200 rounded-lg text-charcoal-700 text-sm font-medium hover:bg-charcoal-900 hover:text-white hover:border-charcoal-900 transition-all duration-300"
                                    >
                                        View Schedule
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <BookingModal
                isOpen={!!selectedClass}
                onClose={() => setSelectedClass(null)}
                classData={selectedClass}
            />
        </section>
    );
}
