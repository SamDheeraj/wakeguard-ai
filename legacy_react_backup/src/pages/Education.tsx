import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { Footer } from '../components/Footer';

const CircadianRhythm = () => {
    const [time, setTime] = useState(12);

    // Calculate alertness based on time (simplified circadian model)
    // Dip at 3 PM (15) and 3 AM (3)
    const getAlertness = (t: number) => {
        const hour = t % 24;
        if ((hour >= 1 && hour <= 5) || (hour >= 13 && hour <= 16)) return 'LOW';
        if ((hour >= 9 && hour <= 12) || (hour >= 18 && hour <= 21)) return 'HIGH';
        return 'MODERATE';
    };

    const alertness = getAlertness(time);
    const color = alertness === 'HIGH' ? 'text-green-500' : alertness === 'MODERATE' ? 'text-yellow-500' : 'text-red-500';
    const glow = alertness === 'HIGH' ? 'shadow-green-500/50' : alertness === 'MODERATE' ? 'shadow-yellow-500/50' : 'shadow-red-500/50';

    return (
        <div className="neon-box p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-cyan-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 font-['Orbitron'] flex items-center gap-3">
                <Clock className="text-cyan-400" />
                CIRCADIAN RHYTHM SIMULATOR
            </h3>

            <div className="relative h-48 mb-8 bg-black/40 rounded-xl overflow-hidden border border-white/10">
                {/* Day/Night Cycle Background */}
                <div
                    className="absolute inset-0 transition-colors duration-500"
                    style={{
                        background: `linear-gradient(to right, 
                            rgba(0,0,0,0.8) 0%, 
                            rgba(6,182,212,0.2) 25%, 
                            rgba(255,255,0,0.2) 50%, 
                            rgba(6,182,212,0.2) 75%, 
                            rgba(0,0,0,0.8) 100%)`
                    }}
                />

                {/* Waveform */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path
                        d="M0,100 C100,100 100,20 200,20 C300,20 300,150 400,150 C500,150 500,20 600,20 C700,20 700,100 800,100"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        vectorEffect="non-scaling-stroke"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="25%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="75%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Time Indicator */}
                <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white] z-10"
                    animate={{ left: `${(time / 24) * 100}%` }}
                />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="w-full">
                    <label className="text-cyan-400 text-sm font-bold tracking-widest mb-2 block">TIME OF DAY: {Math.floor(time)}:00</label>
                    <input
                        type="range"
                        min="0"
                        max="24"
                        step="0.1"
                        value={time}
                        onChange={(e) => setTime(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                <div className={`text-center p-4 rounded-xl border border-white/10 bg-black/40 min-w-[200px] ${glow} shadow-lg transition-all duration-300`}>
                    <div className="text-gray-400 text-xs font-bold tracking-widest mb-1">ALERTNESS LEVEL</div>
                    <div className={`text-3xl font-black font-['Orbitron'] ${color} transition-colors duration-300`}>
                        {alertness}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MicroSleepSim = () => {
    const [isSleeping, setIsSleeping] = useState(false);

    return (
        <div className="neon-box p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-magenta-500/30 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-white mb-6 font-['Orbitron'] flex items-center gap-3">
                <Brain className="text-magenta-400" />
                MICRO-SLEEP SIMULATOR
            </h3>

            <div className="relative h-64 bg-gray-900 rounded-xl overflow-hidden mb-6 group">
                <img
                    src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2070&auto=format&fit=crop"
                    alt="Driving View"
                    className={`w-full h-full object-cover transition-all duration-1000 ${isSleeping ? 'blur-md brightness-50 scale-110' : 'blur-0 brightness-100 scale-100'}`}
                />

                {isSleeping && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-6xl font-black text-red-500 animate-pulse font-['Orbitron'] tracking-tighter drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                            WAKE UP!
                        </div>
                    </div>
                )}

                {/* Glitch Overlay */}
                {isSleeping && (
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay animate-pulse pointer-events-none" />
                )}
            </div>

            <p className="text-gray-400 mb-6 text-sm">
                Press and hold the button below to simulate the visual effects of a micro-sleep event while driving.
            </p>

            <button
                onMouseDown={() => setIsSleeping(true)}
                onMouseUp={() => setIsSleeping(false)}
                onMouseLeave={() => setIsSleeping(false)}
                onTouchStart={() => setIsSleeping(true)}
                onTouchEnd={() => setIsSleeping(false)}
                className="w-full py-4 bg-magenta-600 hover:bg-magenta-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_40px_rgba(217,70,239,0.6)]"
            >
                HOLD TO SIMULATE FATIGUE
            </button>
        </div>
    );
};

const StatCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
    return (
        <div className="text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-['Orbitron'] mb-2"
            >
                {value}{suffix}
            </motion.div>
            <div className="text-cyan-400 font-bold tracking-widest text-sm uppercase">{label}</div>
        </div>
    );
};

const QuizCard = ({ question, answer, isMyth }: { question: string, answer: string, isMyth: boolean }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="relative h-64 w-full cursor-pointer perspective-1000"
            onClick={() => setFlipped(!flipped)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: flipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-black/40 border border-cyan-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-cyan-900/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                        <BookOpen className="text-cyan-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white">{question}</h4>
                    <p className="text-cyan-500 text-sm mt-4 font-bold tracking-widest uppercase">Tap to Reveal</p>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 backface-hidden bg-black/80 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isMyth ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        {isMyth ? <XCircle className="w-8 h-8 text-red-500" /> : <CheckCircle className="w-8 h-8 text-green-500" />}
                    </div>
                    <div className={`text-2xl font-black mb-2 font-['Orbitron'] ${isMyth ? 'text-red-500' : 'text-green-500'}`}>
                        {isMyth ? 'MYTH' : 'FACT'}
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{answer}</p>
                </div>
            </motion.div>
        </div>
    );
};

export const Education = () => {
    return (
        <PageTransition className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-20" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block mb-6 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-sm"
                    >
                        NEURAL RESEARCH DIVISION
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 font-['Orbitron'] tracking-tighter">
                        THE SCIENCE OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">
                            SLEEP & SAFETY
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Understanding the biological mechanisms behind driver fatigue is the first step towards prevention. Explore the data below.
                    </p>
                </div>
            </section>

            {/* Interactive Modules */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <CircadianRhythm />
                    <MicroSleepSim />
                </div>
            </section>

            {/* Stats Grid */}
            <section className="py-32 px-6 bg-white/5 border-y border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <StatCounter value={37} suffix="%" label="Drivers admit to sleeping at wheel" />
                        <StatCounter value={6000} suffix="+" label="Annual Fatal Crashes" />
                        <StatCounter value={4} suffix="x" label="Higher Risk than Sober Driving" />
                    </div>
                </div>
            </section>

            {/* Quiz Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-white mb-16 text-center font-['Orbitron']">
                        MYTH <span className="text-cyan-500">VS</span> FACT
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <QuizCard
                            question="Coffee can cure drowsiness instantly."
                            answer="Caffeine takes 30 minutes to enter the bloodstream. It is a temporary fix, not a cure for sleep debt."
                            isMyth={true}
                        />
                        <QuizCard
                            question="Rolling down windows helps you stay awake."
                            answer="Cold air provides only a momentary shock. It does not reduce the biological drive to sleep."
                            isMyth={true}
                        />
                        <QuizCard
                            question="Micro-sleeps can last just 2 seconds."
                            answer="Even a 2-second lapse at 60mph means driving the length of a football field completely blind."
                            isMyth={false}
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </PageTransition>
    );
};
