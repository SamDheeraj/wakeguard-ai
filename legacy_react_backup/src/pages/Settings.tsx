import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { Bell, Eye, Shield } from 'lucide-react';
import { useState } from 'react';

export const Settings = () => {
    return (
        <PageTransition className="min-h-screen bg-[#F5F5F7] pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-semibold text-[#1D1D1F] mb-4">Settings</h1>
                    <p className="text-[#86868B] text-lg">Customize your WakeGuard experience.</p>
                </div>

                <div className="space-y-8">
                    <SettingsSection title="Monitoring" icon={Eye}>
                        <Toggle label="High Sensitivity Mode" desc="Increases detection rate but may cause false positives." defaultChecked />
                        <Toggle label="Glasses Correction" desc="Adjusts algorithm for reflective lenses." />
                        <Toggle label="Low Light Enhancement" desc="Boosts exposure for night driving." defaultChecked />
                    </SettingsSection>

                    <SettingsSection title="Alerts" icon={Bell}>
                        <Toggle label="Audio Alarm" desc="Play loud sound upon drowsiness detection." defaultChecked />
                        <Toggle label="Visual Flash" desc="Screen flashes red during critical alerts." defaultChecked />
                        <Toggle label="Haptic Feedback" desc="Vibrate device (mobile only)." />
                    </SettingsSection>

                    <SettingsSection title="Privacy" icon={Shield}>
                        <Toggle label="Local Processing Only" desc="Ensure video never leaves this device." defaultChecked disabled />
                        <Toggle label="Anonymous Analytics" desc="Share non-personal usage stats to improve AI." />
                    </SettingsSection>
                </div>
            </div>
        </PageTransition>
    );
};

const SettingsSection = ({ title, icon: Icon, children }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-[32px] p-8 shadow-sm"
    >
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 text-[#0071E3] rounded-xl">
                <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-[#1D1D1F]">{title}</h2>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.div>
);

const Toggle = ({ label, desc, defaultChecked, disabled }: any) => {
    const [isOn, setIsOn] = useState(defaultChecked || false);

    return (
        <div className={`flex items-center justify-between ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
                <div className="font-medium text-[#1D1D1F] mb-1">{label}</div>
                <div className="text-sm text-[#86868B]">{desc}</div>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-[#34C759]' : 'bg-gray-200'}`}
            >
                <motion.div
                    animate={{ x: isOn ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                />
            </button>
        </div>
    );
};
