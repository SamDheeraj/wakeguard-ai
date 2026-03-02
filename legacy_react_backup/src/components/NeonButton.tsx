import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
    children: ReactNode;
    onClick?: () => void;
    color?: 'cyan' | 'magenta' | 'green';
    className?: string;
}

export const NeonButton = ({ children, onClick, color = 'cyan', className = '' }: NeonButtonProps) => {
    const colors = {
        cyan: 'border-cyan-500 text-cyan-500 shadow-[0_0_10px_#06b6d4] hover:bg-cyan-500 hover:text-black',
        magenta: 'border-fuchsia-500 text-fuchsia-500 shadow-[0_0_10px_#d946ef] hover:bg-fuchsia-500 hover:text-black',
        green: 'border-green-500 text-green-500 shadow-[0_0_10px_#22c55e] hover:bg-green-500 hover:text-black'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                relative px-8 py-3 font-bold uppercase tracking-widest border-2 transition-all duration-300
                ${colors[color]}
                ${className}
            `}
        >
            <span className="relative z-10">{children}</span>
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-md bg-current" />
        </motion.button>
    );
};
