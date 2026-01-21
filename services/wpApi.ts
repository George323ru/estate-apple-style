import { Property } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/wp-json';
const WP_API_URL = `${BASE_URL}/wp/v2`;
const AUTH_URL = `${BASE_URL}/jwt-auth/v1/token`;

export interface WPEstate {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    acf: {
        price?: string;
        price_val?: number;
        location?: string;
        city?: string;
        specs?: string; // JSON string
        image_urls?: string[]; // Gallery
        // Add other fields as needed
    };
    _embedded?: any;
}

export const mapWpEstateToProperty = (wpItem: WPEstate): Property => {
    const specs = wpItem.acf.specs || '[]';

    // Parse fields
    let price = wpItem.acf.price || '0 ₽';
    const priceVal = wpItem.acf.price_val || 0;
    const location = wpItem.acf.location || '';
    const city = wpItem.acf.city || '';

    // Use generic image placeholder if no gallery
    const image = wpItem.acf.image_urls?.[0] || 'https://images.unsplash.com/photo-1600596542815-6ad4c728fdbe?auto=format&fit=crop&q=80';
    const images = wpItem.acf.image_urls || [image];

    return {
        id: wpItem.id.toString(),
        title: wpItem.title.rendered,
        price,
        priceVal,
        location,
        city,
        specs, // It might be JSON string, component expects JSON string usually? Or parsed? 
        // In original Postgres it was JSON object or string? 
        // types.ts says `specs: string;` so we pass string.
        image,
        images,
        tags: [], // Tags need taxonomy mapping later
        type: 'apartment', // Default or map from taxonomy
        description: wpItem.content.rendered,
    } as unknown as Property; // Cast for now to satisfy strict checks if keys missing
};

export const loginWp = async (username: string, password: string): Promise<{ token: string; user_email: string; user_nicename: string; user_display_name: string } | null> => {
    try {
        const res = await fetch(AUTH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        return await res.json();
    } catch (error) {
        console.error('WP Login Error:', error);
        return null;
    }
};

export const fetchWpEstates = async (): Promise<Property[]> => {
    try {
        const res = await fetch(`${WP_API_URL}/estates?_embed&per_page=100`);
        if (!res.ok) throw new Error('Failed to fetch from WP');
        const data: WPEstate[] = await res.json();
        console.log('WP Items:', data);
        return data.map(mapWpEstateToProperty);
    } catch (error) {
        console.error('WP Fetch Error:', error);
        return [];
    }
};
