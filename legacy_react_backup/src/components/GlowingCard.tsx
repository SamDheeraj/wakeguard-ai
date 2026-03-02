import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingCardProps {
    children: ReactNode;
    color?: 'cyan' | 'magenta' | 'green';
    className?: string;
    delay?: number;
}

export const GlowingCard = ({ children, color = 'cyan', className = '', delay = 0 }: GlowingCardProps) => {
    const borderColors = {
        cyan: 'border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]',
        magenta: 'border-fuchsia-500/50 hover:border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]',
        green: 'border-green-500/50 hover:border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={`
                relative bg-black/80 backdrop-blur-xl border p-6 rounded-xl transition-all duration-500 group
                ${borderColors[color]}
                ${className}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {children}
        </motion.div>
    );
};
