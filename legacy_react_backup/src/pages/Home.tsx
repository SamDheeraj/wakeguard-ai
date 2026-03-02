import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Brain, Eye, Cpu, Network, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { NeonButton } from '../components/NeonButton';
import { GlowingCard } from '../components/GlowingCard';
import { CurvedText } from '../components/CurvedText';

const StatCard = ({ value, label, delay }: { value: string, label: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="text-center p-6 border border-cyan-500/20 bg-black/50 backdrop-blur-sm relative group overflow-hidden"
    >
        <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <div className="text-5xl md:text-7xl font-bold text-cyan-500 mb-2 font-mono neon-text-cyan relative z-10">
            {value}
        </div>
        <div className="text-gray-400 font-bold tracking-widest uppercase text-sm md:text-base relative z-10 group-hover:text-white transition-colors">
            {label}
        </div>
    </motion.div>
);

const StepCard = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
    <div className="relative pl-12 md:pl-0 group">
        <div className="absolute left-0 top-0 md:relative md:mb-6 w-16 h-16 flex items-center justify-center text-2xl font-bold text-black bg-cyan-500 shadow-[0_0_20px_#06b6d4] group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
            {number}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 mt-2 md:mt-0 font-['Orbitron'] tracking-wide group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-mono text-sm group-hover:text-gray-300 transition-colors">{desc}</p>
    </div>
);

export const Home = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse parallax effect - Debounced/Simplified for Lite Mode
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        let frameId: number;
        const handleMouseMove = (e: MouseEvent) => {
            // Use requestAnimationFrame to throttle updates
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                setMousePosition({
                    x: (e.clientX / window.innerWidth - 0.5) * 10, // Reduced intensity
                    y: (e.clientY / window.innerHeight - 0.5) * 10
                });
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative bg-black min-h-screen overflow-hidden selection:bg-cyan-500 selection:text-black">
            {/* Background Grid Animation */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 cyber-grid opacity-20 animate-[pulse_4s_ease-in-out_infinite]"
                    style={{ transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />

                {/* Floating Particles - Reduced Count for Lite Mode */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-500 rounded-full"
                        initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden perspective-1000">
                <motion.div
                    style={{ y, opacity, rotateX: mousePosition.y * 0.1, rotateY: mousePosition.x * 0.1 }}
                    className="relative z-10 text-center px-6 max-w-7xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-3 px-6 py-2 mb-12 border border-cyan-500/50 bg-cyan-900/20 backdrop-blur-md skew-x-[-10deg]"
                    >
                        <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                        <span className="text-sm font-bold text-cyan-400 tracking-[0.3em] uppercase skew-x-[10deg]">System Online v2.0</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mb-8"
                    >
                        <CurvedText text="STAY AWAKE" radius={300} color="cyan" className="w-full max-w-4xl mx-auto h-48 md:h-64" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-mono leading-relaxed"
                    >
                        &gt; INITIALIZING NEURAL LINK... <span className="animate-pulse">_</span><br className="hidden md:block" />
                        &gt; ADVANCED DRIVER MONITORING SYSTEM ACTIVE.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-8"
                    >
                        <Link to="/monitor">
                            <NeonButton color="cyan" className="w-full md:w-auto hover:shadow-[0_0_50px_#06b6d4] transition-shadow duration-500">
                                Initialize System
                            </NeonButton>
                        </Link>
                        <Link to="/about">
                            <NeonButton color="magenta" className="w-full md:w-auto hover:shadow-[0_0_50px_#d946ef] transition-shadow duration-500">
                                System Data
                            </NeonButton>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Hero Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            </section>

            {/* Stats Section - The Silent Killer */}
            <section className="py-32 px-6 relative z-10 border-y border-cyan-500/20 bg-black/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[shimmer_2s_infinite]" />
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 neon-text-magenta font-['Orbitron']">CRITICAL ALERT</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-mono">
                            // FATAL ERROR: DROWSINESS DETECTED
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard value="100K+" label="Crashes/Year" delay={0} />
                        <StatCard value="1,550" label="Fatalities" delay={0.2} />
                        <StatCard value="71K" label="Injuries" delay={0.4} />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <GlowingCard color="cyan" delay={0} className="hover:-translate-y-2">
                            <Eye className="w-12 h-12 text-cyan-400 mb-6 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">Computer Vision</h3>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                60fps facial landmark tracking detects micro-sleeps instantly using WebAssembly.
                            </p>
                        </GlowingCard>
                        <GlowingCard color="magenta" delay={0.2} className="hover:-translate-y-2">
                            <Brain className="w-12 h-12 text-fuchsia-400 mb-6 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">Neural Engine</h3>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                On-device AI processes biometrics locally. No data leaves your secure environment.
                            </p>
                        </GlowingCard>
                        <GlowingCard color="green" delay={0.4} className="hover:-translate-y-2">
                            <Zap className="w-12 h-12 text-green-400 mb-6 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">Instant Alert</h3>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                Multi-sensory alarms trigger the moment vigilance drops below 80%.
                            </p>
                        </GlowingCard>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 px-6 relative z-10 bg-white/5 backdrop-blur-md border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
                        <p className="text-xl text-gray-400 max-w-2xl">
                            Advanced protection in three simple steps. No hardware required.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />

                        <StepCard
                            number="01"
                            title="Initialize"
                            desc="Grant camera access. Our secure system processes everything locally on your device."
                        />
                        <StepCard
                            number="02"
                            title="Monitor"
                            desc="AI tracks 468 facial landmarks to calculate your Eye Aspect Ratio (EAR) in real-time."
                        />
                        <StepCard
                            number="03"
                            title="Alert"
                            desc="If your eyes close for too long, an instant audio-visual alarm triggers to wake you."
                        />
                    </div>
                </div>
            </section>

            {/* Neural Architecture (Tech Specs) */}
            <section className="py-32 px-6 relative z-10 bg-gradient-to-b from-black to-cyan-900/10">
                <div className="max-w-7xl mx-auto">
                    <div className="neon-box p-8 md:p-16 rounded-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20">
                            <Cpu className="w-96 h-96 text-cyan-500 animate-[spin_10s_linear_infinite]" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/50 mb-8 bg-black">
                                <Network className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Neural Architecture</span>
                            </div>

                            <h2 className="text-4xl md:text-7xl font-bold text-white mb-12 max-w-3xl leading-none font-['Orbitron']">
                                POWERED BY <span className="text-cyan-400 neon-text-cyan">MEDIAPIPE</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <p className="text-xl text-gray-300 leading-relaxed font-mono">
                                        WakeGuard utilizes Google's MediaPipe framework to perform sub-millisecond face tracking. The model estimates 468 3D face landmarks in real-time.
                                    </p>
                                    <ul className="space-y-4 font-mono text-sm text-cyan-300">
                                        {[
                                            "> TensorFlow Lite backend",
                                            "> Sub-millisecond inference",
                                            "> Privacy-first architecture",
                                            "> Robust lighting adaptation"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className="w-2 h-2 bg-cyan-500 animate-pulse" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border border-white/10 bg-black/50 p-8 font-mono text-sm hover:border-cyan-500/50 transition-colors duration-300">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                                        <span className="text-gray-500">MODEL_PRECISION</span>
                                        <span className="text-cyan-400">FLOAT16</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                                        <span className="text-gray-500">TRACKING_POINTS</span>
                                        <span className="text-cyan-400">468_LANDMARKS</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                                        <span className="text-gray-500">LATENCY</span>
                                        <span className="text-green-400">~15ms</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">BACKEND</span>
                                        <span className="text-cyan-400">WEBGL_WASM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 px-6 relative z-10 bg-gradient-to-b from-transparent to-black/40">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">Trusted by Night Owls</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Saved me during a long haul drive from Texas to California. The alarm is impossible to ignore.",
                                author: "Marcus R.",
                                role: "Truck Driver"
                            },
                            {
                                quote: "I use it for late night study sessions. Keeps me focused and awake when I need to cram.",
                                author: "Sarah L.",
                                role: "Med Student"
                            },
                            {
                                quote: "Incredible technology running right in the browser. The privacy aspect is a huge plus for me.",
                                author: "David K.",
                                role: "Software Engineer"
                            }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 rounded-3xl"
                            >
                                <div className="mb-6 text-cyan-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className="inline-block mr-1">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 leading-relaxed">"{t.quote}"</p>
                                <div>
                                    <div className="font-bold text-white">{t.author}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to drive safer?</h2>
                    <p className="text-xl text-gray-400 mb-12">
                        Join thousands of users who trust WakeGuard for their journey.
                    </p>
                    <Link
                        to="/monitor"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <Zap className="w-5 h-5" />
                        Start Monitoring Now
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};
