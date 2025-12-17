import type { ScryfallCard } from '../types';

const BASE_URL = 'https://api.scryfall.com';

// Simple in-memory cache to avoid rate limiting
const cache: Record<string, ScryfallCard> = {};

export const getCardByName = async (cardName: string): Promise<ScryfallCard | null> => {
    if (cache[cardName]) {
        return cache[cardName];
    }

    try {
        // Fuzzy search for flexibility, or exact for precision. Exact is better for banlists.
        const response = await fetch(`${BASE_URL}/cards/named?exact=${encodeURIComponent(cardName)}`);
        if (!response.ok) {
            console.error(`Error fetching card ${cardName}:`, response.statusText);
            return null;
        }
        const data = await response.json();
        cache[cardName] = data;
        return data;
    } catch (error) {
        console.error(`Error fetching card ${cardName}:`, error);
        return null;
    }
};

export const getCardsByNames = async (names: string[]): Promise<ScryfallCard[]> => {
    // We should be careful with rate limiting. Scryfall asks for 50-100ms delay.
    const cards: ScryfallCard[] = [];

    for (const name of names) {
        const card = await getCardByName(name);
        if (card) {
            cards.push(card);
        }
        // Small artificial delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return cards;
};
