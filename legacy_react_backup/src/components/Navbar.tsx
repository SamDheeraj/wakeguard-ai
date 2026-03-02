import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, BarChart2, Clock, User, Settings, ChevronDown, BookOpen, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            title: "Platform",
            items: [
                { label: "Monitor", path: "/monitor", icon: Activity, desc: "Real-time vigilance tracking" },
                { label: "Analytics", path: "/analytics", icon: BarChart2, desc: "Performance trends" },
                { label: "History", path: "/history", icon: Clock, desc: "Session timeline" }
            ]
        },
        {
            title: "Account",
            items: [
                { label: "Profile", path: "/profile", icon: User, desc: "Driver stats & badges" },
                { label: "Settings", path: "/settings", icon: Settings, desc: "App configuration" }
            ]
        },
        {
            title: "Support",
            items: [
                { label: "Education", path: "/education", icon: BookOpen, desc: "Sleep science" },
                { label: "Help Center", path: "/support", icon: HelpCircle, desc: "FAQs & guides" }
            ]
        }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/30 bg-black/80 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-50 transition-opacity" />
                        <Shield className="w-8 h-8 text-cyan-400 relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white tracking-tighter font-['Orbitron'] neon-text-cyan">
                            WAKEGUARD
                        </span>
                        <span className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase">
                            System Online
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`
                            flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all duration-300
                            ${isMenuOpen ? 'text-cyan-400 neon-text-cyan' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <span>System Menu</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <Link
                        to="/monitor"
                        className="relative px-6 py-2 bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                    >
                        Launch App
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-cyan-400"
                >
                    <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Mega Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-cyan-500/30 bg-black/95 backdrop-blur-2xl overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
                            {menuItems.map((section, idx) => (
                                <div key={idx} className="space-y-6">
                                    <h3 className="text-cyan-500 font-bold uppercase tracking-widest text-sm border-b border-cyan-500/20 pb-2">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-4">
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx}>
                                                <Link
                                                    to={item.path}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <div className="p-2 rounded bg-white/5 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                                        <item.icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm">{item.label}</div>
                                                        <div className="text-xs text-gray-600 group-hover:text-cyan-500/70">{item.desc}</div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
