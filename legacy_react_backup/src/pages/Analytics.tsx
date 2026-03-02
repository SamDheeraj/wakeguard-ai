import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { Activity, Moon, Sun, Clock } from 'lucide-react';

export const Analytics = () => {
    const data = [65, 59, 80, 81, 56, 55, 40, 70, 75, 60, 85, 90];

    return (
        <PageTransition className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Analytics</h1>
                    <p className="text-gray-400 text-lg">Your vigilance trends over the last 30 days.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Avg. Vigilance", value: "87%", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
                        { label: "Night Driving", value: "12h", icon: Moon, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                        { label: "Day Driving", value: "45h", icon: Sun, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                        { label: "Total Monitored", value: "57h", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 rounded-3xl"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} border ${stat.border}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className="text-gray-400 font-medium">{stat.label}</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Simulated Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-8 rounded-[32px] mb-8"
                >
                    <h3 className="text-xl font-bold text-white mb-8">Vigilance History</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="w-full bg-cyan-500/10 rounded-t-lg relative group border-t border-x border-cyan-500/20"
                            >
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 bg-cyan-500/50 rounded-t-lg blur-sm"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% Vigilance
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-sm text-gray-500 font-medium">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};
