import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { Award, Shield, Star } from 'lucide-react';

export const Profile = () => {
    return (
        <PageTransition className="min-h-screen bg-[#F5F5F7] pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] p-10 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
                >
                    <div className="w-32 h-32 bg-gradient-to-br from-[#0071E3] to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        SD
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-2">Sam Dheeraj</h1>
                        <p className="text-[#86868B] text-lg mb-6">Pro Driver • Member since 2024</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Badge icon={Shield} label="Safety First" color="bg-green-100 text-green-600" />
                            <Badge icon={Star} label="Top 10%" color="bg-amber-100 text-amber-600" />
                            <Badge icon={Award} label="Night Owl" color="bg-indigo-100 text-indigo-600" />
                        </div>
                    </div>
                    <div className="text-center px-8 py-4 bg-gray-50 rounded-3xl">
                        <div className="text-sm text-[#86868B] uppercase tracking-wider font-medium mb-1">Driver Score</div>
                        <div className="text-5xl font-bold text-[#0071E3]">98</div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[32px] p-8 shadow-sm"
                    >
                        <h3 className="text-xl font-semibold text-[#1D1D1F] mb-6">Achievements</h3>
                        <div className="space-y-6">
                            <Achievement title="Marathon Runner" desc="Drive 5 hours without fatigue" progress={80} />
                            <Achievement title="Early Bird" desc="10 morning sessions" progress={100} completed />
                            <Achievement title="Perfect Week" desc="No alerts for 7 days" progress={45} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[32px] p-8 shadow-sm"
                    >
                        <h3 className="text-xl font-semibold text-[#1D1D1F] mb-6">Account</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[#1D1D1F] font-medium">Email</span>
                                <span className="text-[#86868B]">samdheeraj@gmail.com</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[#1D1D1F] font-medium">Plan</span>
                                <span className="text-[#0071E3] font-medium">Pro (Active)</span>
                            </div>
                            <button className="w-full py-4 text-red-500 font-medium hover:bg-red-50 rounded-2xl transition-colors">
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

const Badge = ({ icon: Icon, label, color }: any) => (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        <span>{label}</span>
    </div>
);

const Achievement = ({ title, desc, progress, completed }: any) => (
    <div>
        <div className="flex justify-between mb-2">
            <span className={`font-medium ${completed ? 'text-[#1D1D1F]' : 'text-gray-500'}`}>{title}</span>
            {completed && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>
        <p className="text-xs text-[#86868B] mb-3">{desc}</p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${completed ? 'bg-green-500' : 'bg-[#0071E3]'}`} style={{ width: `${progress}%` }} />
        </div>
    </div>
);

import { CheckCircle } from 'lucide-react';
