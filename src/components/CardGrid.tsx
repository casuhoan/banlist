import React, { useEffect, useState } from 'react';
import type { ScryfallCard } from '../types';
import { getCardByName } from '../services/scryfall';

interface CardGridProps {
    cardNames: string[];
}

const CardGrid: React.FC<CardGridProps> = ({ cardNames }) => {
    const [cards, setCards] = useState<ScryfallCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCards = async () => {
            setLoading(true);


            // Fetch in chunks or parallel with limits would be better, but for simplicity:
            // We start fetching and update as they come in for better perceived performance
            const promises = cardNames.map(async (name) => {
                const card = await getCardByName(name);
                if (isMounted && card) {
                    setCards(prev => {
                        // Avoid duplicates if strict mode causes double mounting or race conditions
                        if (prev.find(c => c.name === card.name)) return prev;
                        return [...prev, card].sort((a, b) => a.name.localeCompare(b.name));
                    });
                }
            });

            await Promise.allSettled(promises);
            if (isMounted) setLoading(false);
        };

        setCards([]); // Reset on new prop
        fetchCards();

        return () => { isMounted = false; };
    }, [cardNames]);

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cards.map((card) => (
                    <div key={card.id} className="relative group perspective">
                        <div className="aspect-[2.5/3.5] bg-slate-800 rounded-lg overflow-hidden shadow-md group-hover:shadow-indigo-500/30 transition-shadow">
                            {card.image_uris?.normal ? (
                                <img
                                    src={card.image_uris.normal}
                                    alt={card.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4 text-center text-gray-500">
                                    {card.name} (No Image)
                                </div>
                            )}
                        </div>

                        {/* Tooltip on hover (desktop) or tap (mobile) */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-0 pointer-events-none transition-opacity flex items-end p-2">
                            {/* Optional: Add price or other info here */}
                        </div>
                    </div>
                ))}

                {/* Loading Skeletons */}
                {loading && Array.from({ length: Math.max(0, cardNames.length - cards.length) }).slice(0, 5).map((_, i) => (
                    <div key={`skeleton-${i}`} className="aspect-[2.5/3.5] bg-slate-800 animate-pulse rounded-lg border border-white/5" />
                ))}
            </div>

            {!loading && cards.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nessuna carta bannata in questo formato.</p>
            )}
        </div>
    );
};

export default CardGrid;
