import { useEffect, useState } from 'react';
import { calculateMix } from '../utils/calculateMix';

const Calculator = () => {
    const [waterWeight, setWaterWeight] = useState('');
    const [wastePercentage, setWastePercentage] = useState(10);
    const [results, setResults] = useState(calculateMix(0, 10));

    useEffect(() => {
        const weight = parseFloat(waterWeight) || 0;
        const waste = parseFloat(wastePercentage) || 0;
        setResults(calculateMix(weight, waste));
    }, [waterWeight, wastePercentage]);

    return (
        <div id="calculator" className="min-h-screen w-full bg-white dark:bg-stone-950 py-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="bg-stone-50 dark:bg-stone-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-stone-200 dark:border-stone-800">
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center">
                        Mix Calculator
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        {/* Inputs */}
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
                                    Water Weight (g)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={waterWeight}
                                        onChange={(e) => setWaterWeight(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl px-4 py-4 text-2xl font-bold text-stone-800 dark:text-stone-100 focus:border-red-500 focus:ring-0 outline-none transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">g</span>
                                </div>
                                <p className="text-xs text-stone-400 mt-2">Weight of water filling your mold.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
                                    Waste Margin (%)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={wastePercentage}
                                        onChange={(e) => setWastePercentage(e.target.value)}
                                        className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl px-4 py-4 text-2xl font-bold text-stone-800 dark:text-stone-100 focus:border-red-500 focus:ring-0 outline-none transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">%</span>
                                </div>
                                <p className="text-xs text-stone-400 mt-2">Extra material for spillage/residue.</p>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 gap-4">
                            <ResultCard
                                label="Base (Powder)"
                                value={results.base}
                                unit="g"
                                color="bg-red-100 dark:bg-red-900/30"
                                textColor="text-red-600 dark:text-red-300"
                            />
                            <ResultCard
                                label="Liquid"
                                value={results.liquid}
                                unit="g"
                                color="bg-stone-200 dark:bg-stone-800"
                                textColor="text-stone-800 dark:text-stone-300"
                            />
                            <div className="h-px bg-stone-200 dark:bg-stone-700 my-2"></div>
                            <ResultCard
                                label="Total Wet Mix"
                                value={results.totalWet}
                                unit="g"
                                color="bg-stone-900 dark:bg-stone-100"
                                textColor="text-white dark:text-stone-900"
                                highlight
                            />
                            <ResultCard
                                label="Est. Dry Weight"
                                value={results.estimatedDry}
                                unit="g"
                                color="bg-transparent border-2 border-dashed border-stone-300 dark:border-stone-700"
                                textColor="text-stone-500 dark:text-stone-400"
                                small
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultCard = ({ label, value, unit, color, textColor, highlight = false, small = false }) => (
    <div className={`${color} rounded-xl p-4 flex justify-between items-center transition-all duration-300`}>
        <span className={`${small ? 'text-sm' : 'text-base'} font-medium ${textColor} opacity-80`}>{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`${highlight ? 'text-4xl' : small ? 'text-xl' : 'text-3xl'} font-bold ${textColor}`}>
                {value}
            </span>
            <span className={`text-sm font-medium ${textColor} opacity-60`}>{unit}</span>
        </div>
    </div>
);

export default Calculator;
