import { motion } from 'framer-motion';
import { InputHTMLAttributes } from 'react';

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: any;
}

export const CyberInput = ({ label, icon: Icon, className = '', ...props }: CyberInputProps) => {
    return (
        <div className={`relative group ${className}`}>
            {label && (
                <label className="block text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    {...props}
                    className="w-full bg-black/50 border-b-2 border-white/20 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors duration-300 font-mono"
                />
                {Icon && (
                    <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                )}

                {/* Animated Bottom Line */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "0%" }}
                    whileFocus={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
};
