import { useMemo } from 'react';

const Splash = ({ onScrollClick }) => {
    // Generate random Terrazzo chips
    const chips = useMemo(() => {
        const colors = [
            'bg-orange-400', 'bg-blue-400', 'bg-red-400', 'bg-yellow-400',
            'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400'
        ];

        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 10}px`,
            height: `${Math.random() * 40 + 10}px`,
            rotation: `${Math.random() * 360}deg`,
            color: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% / ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`,
            opacity: Math.random() * 0.5 + 0.1
        }));
    }, []);

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-stone-100 dark:bg-stone-900 transition-colors duration-300">
            {/* Randomized Terrazzo Pattern Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Large soft blobs for depth */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-300/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>

                {/* Random Chips */}
                {chips.map((chip) => (
                    <div
                        key={chip.id}
                        className={`absolute ${chip.color}`}
                        style={{
                            left: chip.left,
                            top: chip.top,
                            width: chip.width,
                            height: chip.height,
                            transform: `rotate(${chip.rotation})`,
                            borderRadius: chip.borderRadius,
                            opacity: chip.opacity,
                        }}
                    />
                ))}
            </div>

            <div className="z-10 text-center px-4 backdrop-blur-sm bg-white/10 dark:bg-black/10 p-8 rounded-3xl border border-white/20 shadow-xl">
                <h1 className="text-5xl md:text-7xl font-bold text-stone-800 dark:text-stone-100 mb-6 tracking-tight drop-shadow-sm">
                    Jesmonite <span className="text-red-600 dark:text-red-500">Calculator</span>
                </h1>
                <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 mb-12 max-w-2xl mx-auto drop-shadow-sm">
                    Precision mix ratios for your creative projects.
                </p>

                <button
                    onClick={onScrollClick}
                    className="group relative px-8 py-4 bg-red-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                    Start Calculating
                    <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-600 dark:text-red-500">
                        ↓
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Splash;
