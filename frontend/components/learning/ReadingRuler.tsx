import React, { useEffect, useState } from 'react';

interface ReadingRulerProps {
    enabled: boolean;
    mode: 'ruler' | 'focus'; // 'focus' is ADHD mode
}

interface Position {
    x: number;
    y: number;
}

const ReadingRuler: React.FC<ReadingRulerProps> = ({ enabled, mode }) => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        if (enabled || mode === 'focus') {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [enabled, mode]);

    if (!enabled && mode !== 'focus') return null;

    // ADHD Focus Mode (Spotlight)
    if (mode === 'focus') {
        return (
            <div
                className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-hard-light"
                style={{
                    background: `radial-gradient(circle 120px at ${position.x}px ${position.y}px, transparent 0%, rgba(0,0,0,0.85) 100%)`
                }}
            />
        );
    }

    // Standard Reading Ruler
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            aria-hidden="true"
        >
            <div
                className="absolute w-full bg-black/40 backdrop-blur-[1px] transition-all duration-75 ease-out"
                style={{ top: 0, height: Math.max(0, position.y - 40) }}
            />

            <div
                className="absolute w-full h-20 border-y-2 border-yellow-400/50 bg-yellow-100/10 transition-all duration-75 ease-out"
                style={{ top: position.y - 40 }}
            />

            <div
                className="absolute w-full bottom-0 bg-black/40 backdrop-blur-[1px] transition-all duration-75 ease-out"
                style={{ top: position.y + 40 }}
            />
        </div>
    );
};

export default ReadingRuler;
