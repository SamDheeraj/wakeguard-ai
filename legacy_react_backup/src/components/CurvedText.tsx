import { motion } from 'framer-motion';

interface CurvedTextProps {
    text: string;
    radius?: number;
    className?: string;
    color?: string;
}

export const CurvedText = ({ text, radius = 400, className = "", color = "cyan" }: CurvedTextProps) => {
    // Calculate path based on radius
    // A simple arc path
    const pathId = `curve-${text.replace(/\s/g, '-')}-${Math.random()}`;

    return (
        <div className={`relative flex justify-center items-center ${className}`}>
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <path
                    id={pathId}
                    d={`M 50,100 Q 250,${100 - radius / 5} 450,100`}
                    fill="transparent"
                />
                <text width="500">
                    <textPath
                        href={`#${pathId}`}
                        startOffset="50%"
                        textAnchor="middle"
                        className={`fill-current ${color === 'cyan' ? 'text-cyan-400' : 'text-magenta-500'} font-black tracking-widest uppercase`}
                        style={{ fontSize: '3rem', fontFamily: 'Orbitron' }}
                    >
                        {text}
                    </textPath>
                </text>
            </svg>

            {/* Glow Effect Duplicate */}
            <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full overflow-visible blur-sm opacity-50 pointer-events-none">
                <text width="500">
                    <textPath
                        href={`#${pathId}`}
                        startOffset="50%"
                        textAnchor="middle"
                        className={`fill-current ${color === 'cyan' ? 'text-cyan-400' : 'text-magenta-500'} font-black tracking-widest uppercase`}
                        style={{ fontSize: '3rem', fontFamily: 'Orbitron' }}
                    >
                        {text}
                    </textPath>
                </text>
            </svg>
        </div>
    );
};
