import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
    const scrollToClasses = () => {
        document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1599447421405-0c3a11d283c1?q=80&w=2072&auto=format&fit=crop"
                    alt="Yoga Studio"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/30 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal-900/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sand-100 tracking-[0.2em] text-sm uppercase mb-4"
                >
                    Sanctuary for the Soul
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8"
                >
                    Find Your Flow
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-sand-200 max-w-lg text-lg md:text-xl font-light mb-12 leading-relaxed"
                >
                    Experience yoga reimagined. A luxury retreat for modern wellness, designed to restore balance and ignite potential.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    onClick={scrollToClasses}
                    className="px-8 py-4 bg-sage-600/90 backdrop-blur-sm text-white rounded-full hover:bg-sage-600 transition-all duration-300 transform hover:scale-105"
                >
                    Explore Classes
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-12 animate-bounce"
                >
                    <ArrowDown className="text-white/60" size={32} />
                </motion.div>
            </div>
        </section>
    );
}
