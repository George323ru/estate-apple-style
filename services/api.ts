
import { CrmPayload, Property } from '../types';

// This would be your real backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to manage mock persistence
const getStoredProjects = () => {
  try {
    const stored = localStorage.getItem('estate_projects');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const api = {
  /**
   * Authenticates user by phone and syncs their browsing history
   */
  auth: async (phone: string, journeyData: any) => {
    console.log(`[API] Auth request for ${phone}`, journeyData);
    await delay(1000);
    // In a real app, this would return a JWT token and user profile
    return {
      token: 'mock-jwt-token-123',
      user: {
        id: 'u1',
        name: 'Александр',
        phone: phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }
    };
  },

  /**
   * Fetches user's dashboard data (Projects, Deals, Notifications)
   * This connects to your CRM to get real-time deal status
   */
  fetchDashboard: async (token: string) => {
    console.log(`[API] Fetching dashboard with token: ${token}`);
    await delay(800);

    // Get dynamically created projects from "DB"
    const dynamicProjects = getStoredProjects();

    // Returns the mock structure defined in Dashboard.tsx combined with dynamic ones
    return {
      projects: [
        ...dynamicProjects,
        // Static Mocks are managed in Dashboard.tsx state initialization usually, 
        // but we return them here to simulate a full DB response if needed, 
        // or the UI merges them. For this implementation, we return empty here 
        // and let Dashboard merge, or return dynamic ones.
      ]
    };
  },

  /**
   * Sends a new lead + User Journey to the CRM
   */
  submitLead: async (payload: CrmPayload) => {
    console.log('[API] Submitting Lead to CRM:', payload);
    // Integration point: POST /leads
    // Body: { phone, name, journey: { visits: [...] } }
    await delay(1200);
    return { success: true, leadId: `lead_${Date.now()}` };
  },

  /**
   * Handles AI Smart Match completion:
   * 1. Creates a CRM Deal/Lead with requirements.
   * 2. Creates a Project in the user's dashboard.
   */
  submitSmartMatch: async (answers: Record<string, string>, result: { text: string, primary: Property[], secondary: Property[] }) => {
    console.log('[API] Processing Smart Match Result...');
    console.log('--- CRM DATA ---');
    console.log('User Requirements:', answers);
    console.log('AI Recommendations:', result.primary.map(p => p.id), result.secondary.map(p => p.id));
    console.log('----------------');

    await delay(1000);

    // Create a new Project for the Dashboard
    // Category is DEAL because it's a purchase process
    const newProject = {
      id: `sm-${Date.now()}`,
      type: 'BUYER',
      category: 'DEAL',
      title: `AI Подбор: ${answers['location'] === 'center' ? 'Центр' : answers['location'] === 'park' ? 'Зеленый район' : 'Москва'}`,
      subtitle: `Этап: Подборка готова`, // Simplified for pill
      progress: 20,
      status: 'Подборка готова',
      manager: { name: "Ирина В.", role: "Ипотечный брокер", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
      coreStats: [
        { label: 'Бюджет', value: answers['budget'] === 'high' ? '25+ млн' : 'до 15 млн' },
        { label: 'Цель', value: answers['goal'] === 'live_now' ? 'Жить' : 'Инвест' }
      ],
      stages: [
        { id: 0, label: 'Анкета', status: 'completed', stats: [] },
        { id: 1, label: 'AI Подбор', status: 'current', stats: [{ label: 'Вариантов', value: `${result.primary.length + result.secondary.length}` }] },
        { id: 2, label: 'Просмотры', status: 'pending', stats: [] },
        { id: 3, label: 'Сделка', status: 'pending', stats: [] }
      ],
      tasks: [
        {
          id: `act-${Date.now()}`,
          title: 'Изучить подборку',
          desc: 'Нейросеть подобрала объекты под ваши критерии. Изучите отчет.',
          type: 'urgent',
          actionType: 'REVIEW_AI_SELECTION',
          buttonText: 'Смотреть',
          isCompleted: false,
          date: 'Сегодня',
          isViewed: false,
          payload: {
            aiVerdict: result.text,
            properties: [...result.primary, ...result.secondary]
          }
        }
      ],
      history: [],
      documents: []
    };

    // Save to "DB"
    const currentProjects = getStoredProjects();
    localStorage.setItem('estate_projects', JSON.stringify([newProject, ...currentProjects]));

    return { success: true };
  },

  /**
   * Updates a specific task/action state in the CRM
   */
  updateAction: async (projectId: string, actionId: string, status: 'completed' | 'rejected', payload?: any) => {
    console.log(`[API] Updating action ${actionId} for project ${projectId}`, status, payload);

    // Update "DB"
    const projects = getStoredProjects();
    const updated = projects.map((p: any) => {
      if (p.id === projectId) {
        // Simplified update logic for mock
        const newTasks = p.tasks.map((t: any) => t.id === actionId ? { ...t, isCompleted: true } : t);
        return { ...p, tasks: newTasks, progress: Math.min(100, p.progress + 10) };
      }
      return p;
    });
    localStorage.setItem('estate_projects', JSON.stringify(updated));

    await delay(500);
    return { success: true };
  },

  /**
   * Fetches dynamic content for the site (Properties, Blog posts)
   * Allows CMS integration.
   */
  fetchContent: async (type: 'properties' | 'blog' | 'reviews') => {
    console.log(`[API] Fetching content: ${type}`);

    if (type === 'properties') {
      const { fetchWpEstates } = await import('./wpApi');
      return fetchWpEstates();
    }

    await delay(200);
    // Return [] or mock data. Ideally, this checks a headless CMS (Strapi, Contentful)
    return [];
  }
};
