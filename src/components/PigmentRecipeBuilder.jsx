import { useEffect, useState } from 'react';
import { JESMONITE_PIGMENTS, getPigmentById } from '../data/pigmentLibrary';
import {
    calculateMixedColor,
    calculatePigmentWeights,
    getMaxPigmentPercentage,
    getTotalPigmentPercentage,
    rebalancePigments
} from '../utils/calculatePigment';

const PigmentRecipeBuilder = ({ selectedProduct, results }) => {
    const [pigments, setPigments] = useState([]);
    const [recipeName, setRecipeName] = useState('');
    const [recipeNotes, setRecipeNotes] = useState('');
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [showTooltip, setShowTooltip] = useState(null);

    const maxPercentage = getMaxPigmentPercentage(selectedProduct);
    const totalPercentage = getTotalPigmentPercentage(pigments);
    const pigmentsWithWeights = calculatePigmentWeights(pigments, results.base, results.liquid);
    const mixedColor = calculateMixedColor(pigments);

    // Load saved recipes from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('jesmonite_pigment_recipes');
        if (stored) {
            try {
                setSavedRecipes(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to load recipes:', e);
            }
        }
    }, []);

    // Save recipes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('jesmonite_pigment_recipes', JSON.stringify(savedRecipes));
    }, [savedRecipes]);

    const addPigment = () => {
        const defaultPigment = JESMONITE_PIGMENTS[0]; // White
        const newPigment = {
            id: crypto.randomUUID(),
            name: defaultPigment.name,
            pigmentId: defaultPigment.id,
            color: defaultPigment.hex,
            percentage: 0.5,
            isCustom: false
        };
        setPigments([...pigments, newPigment]);
    };

    const removePigment = (id) => {
        setPigments(pigments.filter(p => p.id !== id));
    };

    const updatePigmentSelection = (id, pigmentId) => {
        if (pigmentId === 'custom') {
            // Custom pigment - set to default gray
            setPigments(pigments.map(p => p.id === id ? {
                ...p,
                name: 'Custom',
                pigmentId: 'custom',
                color: '#808080',
                isCustom: true
            } : p));
        } else {
            // Commercial pigment
            const pigment = getPigmentById(pigmentId);
            if (pigment) {
                setPigments(pigments.map(p => p.id === id ? {
                    ...p,
                    name: pigment.name,
                    pigmentId: pigment.id,
                    color: pigment.hex,
                    isCustom: false
                } : p));
            }
        }
    };

    const updatePigmentColor = (id, color) => {
        setPigments(pigments.map(p => p.id === id ? { ...p, color } : p));
    };

    const updatePigmentPercentage = (id, value) => {
        const index = pigments.findIndex(p => p.id === id);
        if (index === -1) return;

        const numValue = parseFloat(value) || 0;
        const clampedValue = Math.max(0, Math.min(maxPercentage, numValue));

        const rebalanced = rebalancePigments(pigments, index, clampedValue, maxPercentage);
        setPigments(rebalanced);
    };

    const saveRecipe = () => {
        if (!recipeName.trim()) {
            alert('Please enter a recipe name');
            return;
        }

        if (pigments.length === 0) {
            alert('Please add at least one pigment');
            return;
        }

        const recipe = {
            id: crypto.randomUUID(),
            name: recipeName,
            product: selectedProduct,
            pigments: pigments.map(p => ({ ...p })),
            mixedColor: calculateMixedColor(pigments),
            notes: recipeNotes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setSavedRecipes([...savedRecipes, recipe]);
        setPigments([]);
        setRecipeName('');
        setRecipeNotes('');

        // Scroll to saved recipes section
        setTimeout(() => {
            const savedSection = document.querySelector('[data-saved-recipes]');
            if (savedSection) {
                savedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const loadRecipe = (recipe) => {
        setPigments(recipe.pigments.map(p => ({ ...p, id: crypto.randomUUID() })));
        setRecipeName(recipe.name);
        setRecipeNotes(recipe.notes || '');
    };

    const deleteRecipe = (id) => {
        if (confirm('Delete this recipe?')) {
            setSavedRecipes(savedRecipes.filter(r => r.id !== id));
        }
    };

    const clearCurrentRecipe = () => {
        setPigments([]);
        setRecipeName('');
        setRecipeNotes('');
    };

    const Tooltip = ({ id, text }) => (
        <div className="relative inline-block ml-2">
            <button
                type="button"
                onMouseEnter={() => setShowTooltip(id)}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </button>
            {showTooltip === id && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 px-3 py-2 text-sm text-white bg-stone-800 rounded-lg shadow-lg">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-800"></div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-white dark:bg-stone-950 py-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Pigment Recipe Builder */}
                <div className="bg-stone-50 dark:bg-stone-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
                            Pigment Recipe Builder
                        </h2>
                        <Tooltip
                            id="builder-info"
                            text="Create custom pigment recipes. Total percentage will auto-balance to stay within safe limits."
                        />
                    </div>

                    {/* Add Pigment Button */}
                    <div className="mb-6">
                        <button
                            onClick={addPigment}
                            className="w-full bg-white dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl px-6 py-4 text-stone-500 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Pigment
                        </button>
                    </div>

                    {/* Pigment List */}
                    {pigments.length > 0 && (
                        <div className="space-y-4 mb-6">
                            {pigmentsWithWeights.map((pigment, index) => (
                                <div
                                    key={pigment.id}
                                    className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Pigment Selection */}
                                            <div className="flex items-center gap-3">
                                                {/* Color Swatch */}
                                                <div
                                                    className="w-8 h-8 rounded-lg border-2 border-stone-300 dark:border-stone-600 shrink-0 shadow-sm"
                                                    style={{ backgroundColor: pigment.color }}
                                                    title={pigment.color}
                                                ></div>

                                                {/* Pigment Dropdown */}
                                                <select
                                                    value={pigment.pigmentId || 'custom'}
                                                    onChange={(e) => updatePigmentSelection(pigment.id, e.target.value)}
                                                    className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-800 dark:text-stone-100 focus:border-red-500 focus:ring-0 outline-none transition-colors"
                                                >
                                                    {JESMONITE_PIGMENTS.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                    <option value="custom">Custom Color</option>
                                                </select>

                                                {/* Custom Color Picker */}
                                                {pigment.isCustom && (
                                                    <input
                                                        type="color"
                                                        value={pigment.color}
                                                        onChange={(e) => updatePigmentColor(pigment.id, e.target.value)}
                                                        className="w-12 h-8 rounded border border-stone-300 dark:border-stone-600 cursor-pointer"
                                                        title="Pick custom color"
                                                    />
                                                )}
                                            </div>

                                            {/* Percentage Slider */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                                        Percentage
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={pigment.percentage}
                                                            onChange={(e) => updatePigmentPercentage(pigment.id, e.target.value)}
                                                            step="0.1"
                                                            min="0"
                                                            max={maxPercentage}
                                                            className="w-16 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded px-2 py-1 text-sm text-stone-800 dark:text-stone-100 focus:border-red-500 focus:ring-0 outline-none"
                                                        />
                                                        <span className="text-sm text-stone-500 dark:text-stone-400">%</span>
                                                    </div>
                                                </div>

                                                <input
                                                    type="range"
                                                    value={pigment.percentage}
                                                    onChange={(e) => updatePigmentPercentage(pigment.id, e.target.value)}
                                                    min="0"
                                                    max={maxPercentage}
                                                    step="0.1"
                                                    className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                                />

                                                {/* Intensity Bar - Opacity Gradient */}
                                                <div
                                                    className="h-6 rounded-lg overflow-hidden relative border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-100"
                                                    style={{
                                                        background: `white linear-gradient(to right, 
                                                            transparent, 
                                                            ${pigment.color}40 25%, 
                                                            ${pigment.color}80 50%, 
                                                            ${pigment.color}CC 75%, 
                                                            ${pigment.color})`
                                                    }}
                                                >
                                                </div>
                                                <div className="flex justify-between text-xs text-stone-400">
                                                    <span>0% (Clear)</span>
                                                    <span>{maxPercentage}% (Full)</span>
                                                </div>
                                            </div>

                                            {/* Weight Display */}
                                            <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900 rounded-lg px-3 py-2">
                                                <span className="text-sm text-stone-500 dark:text-stone-400">Weight for current mix:</span>
                                                <span className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                                    {pigment.weight}g
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removePigment(pigment.id)}
                                            className="text-stone-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Total Percentage Display */}
                    {pigments.length > 0 && (
                        <div className={`rounded-xl p-4 mb-6 ${totalPercentage > maxPercentage * 0.9
                            ? totalPercentage >= maxPercentage
                                ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                                : 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500'
                            : 'bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-stone-700 dark:text-stone-300">Total Pigment</span>
                                    {totalPercentage >= maxPercentage && (
                                        <span className="text-red-600 dark:text-red-400 text-sm font-bold">⚠️ At Maximum</span>
                                    )}
                                    {totalPercentage > maxPercentage * 0.9 && totalPercentage < maxPercentage && (
                                        <span className="text-amber-600 dark:text-amber-400 text-sm font-bold">⚠️ Approaching Limit</span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-stone-800 dark:text-stone-100">
                                        {totalPercentage}%
                                    </span>
                                    <span className="text-sm text-stone-500 dark:text-stone-400">
                                        / {maxPercentage}% max
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-stone-600 dark:text-stone-400">
                                Total weight: <span className="font-bold">{pigmentsWithWeights.reduce((sum, p) => sum + p.weight, 0).toFixed(1)}g</span>
                            </div>
                        </div>
                    )}

                    {/* Mixed Color Preview */}
                    {pigments.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-xl p-6 mb-6">
                            <div className="flex items-start gap-6">
                                {/* Color Swatch */}
                                <div className="shrink-0">
                                    <div
                                        className="w-28 h-28 rounded-xl border-3 border-stone-400 dark:border-stone-600 shadow-lg"
                                        style={{ backgroundColor: mixedColor }}
                                        title={mixedColor}
                                    ></div>
                                    <div className="text-center mt-2 text-xs font-mono text-stone-600 dark:text-stone-400">
                                        {mixedColor}
                                    </div>
                                </div>

                                {/* Disclaimer */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="text-2xl">⚠️</span>
                                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
                                            Color Preview - For Reference Only
                                        </h3>
                                    </div>
                                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                                        This approximation shows the estimated mix color.
                                        Actual results vary by percentage, material, and conditions.
                                        <strong className="block mt-2">Always test with a sample batch before final use.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recipe Name and Notes */}
                    {pigments.length > 0 && (
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
                                    Recipe Name
                                </label>
                                <input
                                    type="text"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    placeholder="e.g., Sky Blue Pastel"
                                    className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:border-red-500 focus:ring-0 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wider">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={recipeNotes}
                                    onChange={(e) => setRecipeNotes(e.target.value)}
                                    placeholder="e.g., Perfect for small vases, adjust by eye..."
                                    rows="3"
                                    className="w-full bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:border-red-500 focus:ring-0 outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={saveRecipe}
                                    className="flex-1 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl px-6 py-3 font-bold hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
                                >
                                    Save Recipe
                                </button>
                                <button
                                    onClick={clearCurrentRecipe}
                                    className="bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-2 border-stone-200 dark:border-stone-700 rounded-xl px-6 py-3 font-bold hover:border-stone-400 dark:hover:border-stone-500 transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Educational Info */}
                    <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                                <p><strong>💡 Tip:</strong> Start with 0.5% for pastel colors and adjust by eye during mixing.</p>
                                <p><strong>⚠️ Important:</strong> Exceeding {maxPercentage}% may prevent proper setting for {selectedProduct}.</p>
                                <p><strong>🎨 Best Practice:</strong> Add pigment to the liquid component first, mix thoroughly, then add base powder.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved Recipes */}
                {savedRecipes.length > 0 && (
                    <div data-saved-recipes className="bg-stone-50 dark:bg-stone-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-stone-200 dark:border-stone-800">
                        <h3 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6">
                            Saved Recipes
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            {savedRecipes.map((recipe) => {
                                const recipeTotal = getTotalPigmentPercentage(recipe.pigments);
                                const recipeWithWeights = calculatePigmentWeights(recipe.pigments, results.base, results.liquid);

                                return (
                                    <div
                                        key={recipe.id}
                                        className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">
                                                    {recipe.name}
                                                </h4>
                                                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                    {recipe.product}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => loadRecipe(recipe)}
                                                    className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors p-1"
                                                    title="Load recipe"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteRecipe(recipe.id)}
                                                    className="text-stone-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete recipe"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-3">
                                            {recipeWithWeights.map((pigment) => (
                                                <div key={pigment.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-stone-600 dark:text-stone-400">
                                                        {pigment.name || 'Unnamed pigment'}
                                                    </span>
                                                    <span className="font-medium text-stone-800 dark:text-stone-100">
                                                        {pigment.percentage}% ({pigment.weight}g)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-700">
                                            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">Total</span>
                                            <span className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                                {recipeTotal}%
                                            </span>
                                        </div>

                                        {recipe.notes && (
                                            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
                                                <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                                                    {recipe.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PigmentRecipeBuilder;
