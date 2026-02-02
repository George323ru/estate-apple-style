import { Property } from '../types';

const envUrl = import.meta.env.VITE_API_URL;
const BASE_URL = envUrl
    ? (envUrl.includes('wp-json') ? envUrl : `${envUrl.replace(/\/$/, '')}/wp-json`)
    : 'https://realtorvspb.ru/wp-json'; // Fallback to production if env var missing
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

export interface WPPost {
    id: number;
    date: string;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    acf: {
        related_service_link?: string;
        related_service_label?: string;
    };
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
        }>;
    };
}

import { BlogPost } from '../types';

export const mapWpPostToBlogPost = (wpItem: WPPost): BlogPost => {
    const featuredMedia = wpItem._embedded?.['wp:featuredmedia']?.[0];
    const image = featuredMedia?.source_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80';

    // Format date: 2024-01-21T... -> 21 Jan 2024
    const dateObj = new Date(wpItem.date);
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const date = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    // Clean excerpt from HTML
    const excerpt = wpItem.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160) + '...';

    const post: BlogPost = {
        id: wpItem.slug, // Use slug for SEO-friendly URLs
        title: wpItem.title.rendered,
        excerpt,
        date,
        image,
        content: wpItem.content.rendered,
    };

    if (wpItem.acf?.related_service_link) {
        post.relatedService = {
            link: wpItem.acf.related_service_link,
            label: wpItem.acf.related_service_label || 'Подробнее',
        };
    }

    return post;
};

export const fetchWpEstates = async (): Promise<Property[]> => {
    try {
        const res = await fetch(`${WP_API_URL}/estates?_embed&per_page=100`);
        if (!res.ok) throw new Error('Failed to fetch from WP');
        const data: WPEstate[] = await res.json();
        return data.map(mapWpEstateToProperty);
    } catch (error) {
        console.error('WP Fetch Error:', error);
        return [];
    }
};

export const fetchWpPosts = async (params: string = ''): Promise<BlogPost[]> => {
    try {
        const res = await fetch(`${WP_API_URL}/posts?_embed&per_page=100${params}`);
        if (!res.ok) throw new Error('Failed to fetch posts from WP');
        const data: WPPost[] = await res.json();
        return data.map(mapWpPostToBlogPost);
    } catch (error) {
        console.error('WP Posts Fetch Error:', error);
        return [];
    }
};

export const fetchWpPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const res = await fetch(`${WP_API_URL}/posts?_embed&slug=${slug}`);
        if (!res.ok) throw new Error('Failed to fetch post from WP');
        const data: WPPost[] = await res.json();
        if (data.length === 0) return null;
        return mapWpPostToBlogPost(data[0]);
    } catch (error) {
        console.error('WP Single Post Fetch Error:', error);
        return null;
    }
};
