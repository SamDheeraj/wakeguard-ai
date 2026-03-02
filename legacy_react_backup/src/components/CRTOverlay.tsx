import { useEffect, useState } from 'react';

export const CRTOverlay = () => {
    // Only render on larger screens to avoid mobile usability issues
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkSize = () => {
            setIsVisible(window.innerWidth > 768);
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
            {/* Screen Curvature & Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.8) 100%)',
                    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)',
                }}
            />

            {/* Scanlines */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    pointerEvents: 'none',
                }}
            />

            {/* Flicker Animation */}
            <div className="absolute inset-0 bg-white opacity-[0.02] animate-[pulse_0.1s_infinite]" />
        </div>
    );
};
