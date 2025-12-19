import type { Format } from '../types';
import initialFormats from '../data/formats.json';

// In Dev mode (Vite), we might not have the API running on the same port unless proxied.
// For now, simple fetch. If fails, return initialFormats.

export const fetchFormats = async (): Promise<Format[]> => {
    try {
        const response = await fetch('/api/formats');
        if (!response.ok) {
            throw new Error('API not available');
        }
        return await response.json();
    } catch (error) {
        console.warn('Failed to fetch from API, falling back to static data:', error);
        return initialFormats as Format[];
    }
};

export const saveFormats = async (formats: Format[]): Promise<boolean> => {
    try {
        const response = await fetch('/api/formats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formats),
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to save formats:', error);
        return false;
    }
};
