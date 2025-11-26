
export interface Property {
  id: string;
  title: string;
  price: string;
  image: string;
  images?: string[]; // Added for carousel
  location: string;
  specs: string;
  tags: string[];
  type?: 'apartment' | 'house' | 'commercial' | 'parking' | 'land'; // Added for filters
  area?: number; // Added for filters
  plotArea?: number;
  floor?: number;
  deadline?: string;
  priceVal?: number;
  district?: string;
  city?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content: string;
  relatedService?: {
    link: string;
    label: string;
  };
}

export enum ServiceType {
  SELL = 'SELL',
  BUY_NEW = 'BUY_NEW',
  BUY_RESALE = 'BUY_RESALE',
  RENT_OUT = 'RENT_OUT',
  STAGING = 'STAGING',
}

export interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  fullText?: string; 
  ctaText?: string; // Text for the button inside the review
  ctaLink?: string; // Link/Action for the button
}

export type ModalType = 'PROPERTY' | 'FORM' | 'BLOG' | 'QUIZ' | 'API_KEY' | 'REVIEW' | null;

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
}

// --- TRACKING & CRM TYPES ---

export interface PageVisit {
  path: string;
  timestamp: number;
  referrer?: string;
}

export interface UserJourney {
  sessionId: string;
  visits: PageVisit[];
  userAgent: string;
  deviceType: 'mobile' | 'desktop';
}

export interface CrmPayload {
  phone: string;
  name?: string;
  source: string; // e.g., "web_lead_form"
  journey: UserJourney;
  metadata?: any;
}