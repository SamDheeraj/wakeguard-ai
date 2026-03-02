import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { MapPin, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export const History = () => {
    const sessions = [
        { date: "Today, 8:30 AM", duration: "45m", route: "Home to Office", status: "Safe", alerts: 0 },
        { date: "Yesterday, 6:15 PM", duration: "1h 12m", route: "Office to Gym", status: "Warning", alerts: 2 },
        { date: "Nov 28, 9:00 AM", duration: "32m", route: "Home to Cafe", status: "Safe", alerts: 0 },
        { date: "Nov 27, 10:30 PM", duration: "2h 45m", route: "Highway 101", status: "Critical", alerts: 5 },
    ];

    return (
        <PageTransition className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Session History</h1>
                    <p className="text-gray-400 text-lg">Detailed logs of your monitored trips.</p>
                </div>

                <div className="space-y-6">
                    {sessions.map((session, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${session.status === 'Safe' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : session.status === 'Warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    {session.status === 'Safe' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{session.route}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Alerts</div>
                                    <div className="font-bold text-white text-lg">{session.alerts}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Score</div>
                                    <div className={`font-bold text-lg ${session.status === 'Safe' ? 'text-emerald-400' : session.status === 'Warning' ? 'text-amber-400' : 'text-red-400'}`}>
                                        {session.status === 'Safe' ? '98' : session.status === 'Warning' ? '85' : '62'}
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-medium transition-all border border-white/10 hover:border-white/30">
                                    Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
};
