
import React, { useState, useEffect, useRef } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import { 
  MessageSquare, FileText, User, Upload, Send, Clock, CheckCircle, 
  LogOut, Bell, Home, ChevronRight, AlertCircle, FileCheck, 
  TrendingUp, Key, Wallet, Building, ChevronDown, Calendar, CreditCard, ArrowRight, Plus, Layout, Shield, Paintbrush, Repeat, Droplets, Zap, Eye, CheckCircle2, X, Camera, History, Loader2, MapPin, Sparkles, PenTool, Hammer, FileSearch, ShieldCheck, PieChart, PhoneCall, Download, FolderOpen, Check, BrainCircuit, Sun
} from 'lucide-react';
import { useTracking } from '../context/TrackingContext';
import { api } from '../services/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Property } from '../types';
import PropertyModal from '../components/PropertyModal';

// --- Types ---

type RoleType = 'SELLER' | 'BUYER' | 'LANDLORD' | 'TENANT' | 'STAGING' | 'RENOVATION' | 'AI_TOOL';
type ProjectCategory = 'DEAL' | 'AI_SERVICE';
type ActionType = 'METER_READINGS' | 'PHOTO_REPORT' | 'CONFIRM_VIEWING' | 'SIGN_DOC' | 'UPLOAD_DOC' | 'GENERAL' | 'REVIEW_AI_SELECTION' | 'APPROVE_ESTIMATE' | 'REVIEW_RISK' | 'DOWNLOAD_PDF' | 'VIEW_GENERATED_CONTENT' | 'VIEW_INVEST_REPORT' | 'SCHEDULE_VISIT' | 'APPROVE_ADDITIONAL_WORKS' | 'SIGN_ACT' | 'VIEW_WEEKLY_REPORT' | 'VIEW_ECO_REPORT';

type TabType = 'TASKS' | 'DOCS' | 'HISTORY' | 'CHAT';

interface DocItem {
  id: string;
  name: string;
  date: string;
  type: 'pdf' | 'img';
  status: 'pending' | 'pending_review' | 'approved' | 'signed' | 'rejected';
  isViewed?: boolean;
}

interface Task {
    id: string;
    title: string;
    desc: string;
    type: 'urgent' | 'info' | 'success';
    actionType: ActionType;
    buttonText?: string;
    payload?: any; 
    isCompleted: boolean;
    date: string;
    isViewed?: boolean;
}

interface StatItem {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
    subtext?: string;
}

interface HistoryItem {
    id: string;
    date: string;
    type: 'METERS' | 'PHOTO' | 'DOC' | 'AI' | 'REPORT';
    title: string;
    summary: string;
    payload: any;
    isViewed?: boolean;
}

interface Stage {
    id: number;
    label: string;
    status: 'completed' | 'current' | 'pending';
    stats: StatItem[]; // Specific stats for this stage
}

interface ProjectManager {
    name: string;
    avatar: string;
    role: string;
}

interface Project {
  id: string;
  type: RoleType;
  category: ProjectCategory;
  title: string;
  subtitle: string;
  progress: number;
  status: string;
  manager: ProjectManager;
  coreStats: StatItem[]; // Always visible stats
  stages: Stage[]; 
  tasks: Task[]; 
  documents: DocItem[];
  history: HistoryItem[];
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'agent' | 'system';
  text: string;
  time: string;
  projectId?: string;
}

// --- MOCK DATA ---
const MOCK_INITIAL_PROJECTS: Project[] = [
  // 1. SELLER
  {
    id: 'p_sell',
    type: 'SELLER',
    category: 'DEAL',
    title: 'Продажа: Ленинский 45',
    subtitle: 'Этап: Показы',
    progress: 65,
    status: 'Идут показы',
    manager: { name: "Анна К.", role: "Ведущий брокер", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
    coreStats: [
        { label: 'Цена', value: '25.5 млн' },
        { label: 'Срок', value: '14 дней' }
    ],
    stages: [
        { id: 0, label: 'Оценка', status: 'completed', stats: [{ label: 'Оценка AI', value: '24.5 млн' }, { label: 'Аналогов', value: '12 шт' }] },
        { id: 1, label: 'Упаковка', status: 'completed', stats: [{ label: 'Фото', value: 'Готово' }, { label: 'Хоумстейджинг', value: 'Сделан' }] },
        { id: 2, label: 'Маркетинг', status: 'completed', stats: [{ label: 'Площадки', value: '32' }, { label: 'Охват', value: '15k' }] },
        { id: 3, label: 'Показы', status: 'current', stats: [{ label: 'Звонков', value: '12', trend: 'up' }, { label: 'Показов', value: '4' }] },
        { id: 4, label: 'Торг', status: 'pending', stats: [{ label: 'Офферы', value: '0' }, { label: 'Лучшая цена', value: '-' }] },
        { id: 5, label: 'Сделка', status: 'pending', stats: [{ label: 'Документы', value: 'Сбор' }, { label: 'Дата', value: 'TBD' }] }
    ],
    tasks: [
        {
            id: 't_s1', title: 'Отчет за неделю', desc: 'Посмотрите статистику звонков и обратную связь.', 
            type: 'info', actionType: 'VIEW_WEEKLY_REPORT', buttonText: 'Открыть отчет', isCompleted: false, date: 'Сегодня', isViewed: false,
            payload: {
                calls: 12, views: 4, 
                feedback: ["Клиенту понравилась гостиная.", "Семья с ипотекой, думают."],
                sites: { cian: 450, avito: 320, domclick: 110 }
            }
        }
    ],
    history: [
        { 
            id: 'h_rep1', date: '20 Окт', type: 'REPORT', title: 'Еженедельный отчет', summary: '12 звонков, 4 показа', isViewed: true,
            payload: { calls: 12, views: 4, feedback: ["Все идет по плану."], sites: { cian: 450, avito: 320 } } 
        }
    ],
    documents: [{ id: 'd1', name: "Договор с агентством.pdf", date: "01 Окт", type: "pdf", status: "signed" }]
  },

  // 2. RENOVATION
  {
    id: 'p_renov',
    type: 'RENOVATION',
    category: 'DEAL',
    title: 'Ремонт: Студия Лофт',
    subtitle: 'Этап: Черновые работы',
    progress: 40,
    status: 'В работе',
    manager: { name: "Дмитрий С.", role: "Инженер", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" },
    coreStats: [
        { label: 'Смета', value: '1.2 млн' },
        { label: 'Оплачено', value: '350к' }
    ],
    stages: [
        { id: 0, label: 'Замер', status: 'completed', stats: [{ label: 'Площадь', value: '45 м²' }, { label: 'Высота', value: '2.8 м' }] },
        { id: 1, label: 'Дизайн', status: 'completed', stats: [{ label: 'Проект', value: 'Готов' }, { label: 'Стиль', value: 'Лофт' }] },
        { id: 2, label: 'Черновые', status: 'current', stats: [{ label: 'Выполнено', value: '35%' }, { label: 'След. платеж', value: '25 Окт' }] },
        { id: 3, label: 'Чистовые', status: 'pending', stats: [{ label: 'Материалы', value: 'Закупка' }, { label: 'Срок', value: '1 мес' }] },
        { id: 4, label: 'Мебель', status: 'pending', stats: [{ label: 'Бюджет', value: '500к' }] },
        { id: 5, label: 'Сдача', status: 'pending', stats: [{ label: 'Приемка', value: '-' }] }
    ],
    tasks: [
        {
            id: 't_r1', title: 'Согласовать доп. работы', desc: 'Найден скрытый дефект проводки.', 
            type: 'urgent', actionType: 'APPROVE_ADDITIONAL_WORKS', buttonText: 'Согласовать (+15к)', isCompleted: false, date: 'Сегодня', isViewed: false,
            payload: { 
                docName: 'Доп. соглашение №2.pdf',
                reason: "Требуется замена вводного кабеля.",
                price: 15000
            }
        },
        {
            id: 't_r3', title: 'Назначить визит', desc: 'Проверка завершения штукатурки.', 
            type: 'info', actionType: 'SCHEDULE_VISIT', buttonText: 'Выбрать время', isCompleted: false, date: 'Сегодня', isViewed: false
        }
    ],
    history: [
        { id: 'hr1', date: '01 Сен', type: 'DOC', title: 'Старт работ', summary: 'Договор подписан', payload: {}, isViewed: true }
    ],
    documents: [{ id: 'd3', name: "Дизайн-проект.pdf", date: "01 Сен", type: "pdf", status: "approved" }]
  },

  // 3. BUYER (NEW)
  {
    id: 'p_ai_match',
    type: 'BUYER',
    category: 'DEAL', 
    title: 'AI Подбор: Центр',
    subtitle: 'Статус: Ипотека одобрена',
    progress: 60,
    status: 'Подготовка к сделке',
    manager: { name: "Ирина В.", role: "Ипотечный брокер", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    coreStats: [
        { label: 'Бюджет', value: '25 млн' },
        { label: 'Цель', value: 'Инвест' }
    ],
    stages: [
        { id: 0, label: 'Стратегия', status: 'completed', stats: [{ label: 'Срок', value: '3 года' }, { label: 'Доход', value: '15%' }] },
        { id: 1, label: 'Подбор', status: 'completed', stats: [{ label: 'Вариантов', value: '3 шт' }, { label: 'Локации', value: 'ЦАО' }] },
        { id: 2, label: 'Экскурсия', status: 'completed', stats: [{ label: 'Посмотрено', value: '2 ЖК' }] },
        { id: 3, label: 'Ипотека', status: 'current', stats: [{ label: 'Одобрено', value: '25 млн' }, { label: 'Ставка', value: '5.0%' }] },
        { id: 4, label: 'ДДУ', status: 'pending', stats: [{ label: 'Договор', value: 'На проверке' }] },
        { id: 5, label: 'Ключи', status: 'pending', stats: [{ label: 'Срок', value: 'IV кв 2025' }] }
    ],
    tasks: [
        {
            id: 't_ai_sign', title: 'Загрузить полис', desc: 'Для выдачи кредита нужна страховка.', 
            type: 'urgent', actionType: 'UPLOAD_DOC', buttonText: 'Загрузить', isCompleted: false, date: 'Сегодня', isViewed: false,
            payload: {}
        }
    ],
    history: [],
    documents: []
  },

  // 4. RENTING (LANDLORD)
  {
    id: 'p_rent',
    type: 'LANDLORD',
    category: 'DEAL',
    title: 'Сдача: Апартаменты Сити',
    subtitle: 'Управление: Жилец проживает',
    progress: 100,
    status: 'Активная аренда',
    manager: { name: "Виктория М.", role: "Управляющая", avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80" },
    coreStats: [
        { label: 'Аренда', value: '120к' },
        { label: 'Депозит', value: '120к' }
    ],
    stages: [
        { id: 0, label: 'Подготовка', status: 'completed', stats: [{ label: 'Фото', value: 'Сделаны' }, { label: 'Клининг', value: 'Готов' }] },
        { id: 1, label: 'Маркетинг', status: 'completed', stats: [{ label: 'Звонков', value: '45' }, { label: 'Цена', value: '120к' }] },
        { id: 2, label: 'Показы', status: 'completed', stats: [{ label: 'Просмотров', value: '8' }] },
        { id: 3, label: 'Скрининг', status: 'completed', stats: [{ label: 'Проверено', value: '3 чел' }] },
        { id: 4, label: 'Договор', status: 'completed', stats: [{ label: 'Подписан', value: '12 мес' }] },
        { id: 5, label: 'Управление', status: 'current', stats: [{ label: 'След. оплата', value: '25 Окт' }, { label: 'Рейтинг', value: '5.0' }] }
    ],
    tasks: [
        {
            id: 't_l1', title: 'Показания счетчиков', desc: 'Проверьте данные за Октябрь.', 
            type: 'urgent', actionType: 'METER_READINGS', buttonText: 'Проверить', isCompleted: false, date: 'Сегодня', isViewed: false,
            payload: { water: '1243', light: '560', photo: 'https://picsum.photos/400/600?random=meters' }
        }
    ],
    history: [
        { id: 'h1', date: '25 Сен', type: 'METERS', title: 'Счетчики: Сентябрь', summary: 'Вода: 1240, Свет: 550', payload: { water: 1240, light: 550, photo: 'https://picsum.photos/400/600?random=m1' }, isViewed: true },
    ],
    documents: [{ id: 'd5', name: "Договор аренды.pdf", date: "01 Сен", type: "pdf", status: "signed" }]
  },

  // 5. PREPARATION (STAGING)
  {
    id: 'p_stage',
    type: 'STAGING',
    category: 'DEAL',
    title: 'Стейджинг: Тверская',
    subtitle: 'Этап: Декор',
    progress: 80,
    status: 'Декорирование',
    manager: { name: "Алиса Ф.", role: "Стейджер", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
    coreStats: [
        { label: 'Бюджет', value: '150к' },
        { label: 'Прирост', value: '+1.2 млн', trend: 'up' }
    ],
    stages: [
        { id: 0, label: 'Аудит', status: 'completed', stats: [{ label: 'Оценка', value: 'Сделана' }] },
        { id: 1, label: 'Расхламление', status: 'completed', stats: [{ label: 'Вывезено', value: '2 машины' }] },
        { id: 2, label: 'Ремонт', status: 'completed', stats: [{ label: 'Покраска', value: 'Готово' }] },
        { id: 3, label: 'Мебель', status: 'completed', stats: [{ label: 'Доставка', value: 'Принята' }] },
        { id: 4, label: 'Декор', status: 'current', stats: [{ label: 'Текстиль', value: 'Закупка' }, { label: 'Свет', value: 'Монтаж' }] },
        { id: 5, label: 'Съемка', status: 'pending', stats: [{ label: 'Фотограф', value: 'Заказан' }] }
    ],
    tasks: [
        {
            id: 't_st1', title: 'Принять доставку', desc: 'Текстиль и вазы.', 
            type: 'info', actionType: 'CONFIRM_VIEWING', buttonText: 'Подтвердить', isCompleted: false, date: 'Сегодня', isViewed: false,
            payload: { time: '10:00', date: 'Завтра (22 Окт)' }
        }
    ],
    history: [],
    documents: [{ id: 'd4', name: "Смета декора.pdf", date: "05 Окт", type: "pdf", status: "approved" }]
  },

  // --- AI SERVICES HISTORY (Mocks) ---
  {
    id: 'ai_eco_1',
    type: 'AI_TOOL',
    category: 'AI_SERVICE',
    title: 'Эко-сканер: Кутузовский',
    subtitle: 'Результат: 88/100',
    progress: 100,
    status: 'Завершен',
    manager: { name: "Estate AI", role: "Алгоритм", avatar: "https://images.unsplash.com/photo-1675426513525-e76a0732a3a5?auto=format&fit=crop&w=100&q=80" },
    coreStats: [],
    stages: [],
    tasks: [
        {
            id: 't_ai_eco', title: 'Скачать отчет', desc: 'PDF версия доступна.', 
            type: 'success', actionType: 'VIEW_ECO_REPORT', buttonText: 'Смотреть', isCompleted: false, date: 'Вчера', isViewed: false,
            payload: { score: 88, address: "Кутузовский 32" }
        }
    ],
    history: [],
    documents: []
  },
  {
    id: 'ai_gen_1',
    type: 'AI_TOOL',
    category: 'AI_SERVICE',
    title: 'Генератор описаний',
    subtitle: 'Адрес: Тверская 15',
    progress: 100,
    status: 'Завершен',
    manager: { name: "Estate AI", role: "Алгоритм", avatar: "https://images.unsplash.com/photo-1675426513525-e76a0732a3a5?auto=format&fit=crop&w=100&q=80" },
    coreStats: [],
    stages: [],
    tasks: [
        {
            id: 't_ai_gen', title: 'Текст готов', desc: 'Объявление сгенерировано.', 
            type: 'success', actionType: 'VIEW_GENERATED_CONTENT', buttonText: 'Открыть', isCompleted: false, date: '20 Окт', isViewed: true,
            payload: { text: "Продается светлая квартира..." }
        }
    ],
    history: [],
    documents: []
  }
];

const Dashboard: React.FC = () => {
  const { getJourney } = useTracking();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [projects, setProjects] = useState<Project[]>(MOCK_INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('TASKS');
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  const [activeActionModal, setActiveActionModal] = useState<Task | null>(null);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserProfile>({
    name: 'Гость',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'agent', text: 'Добрый день! Я ваш менеджер. Если возникнут вопросы по документам, пишите сюда.', time: '10:00', projectId: 'p_rent' },
  ]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('estate_auth');
    if (savedAuth) {
        setIsLoggedIn(true);
        fetchDashboardData();
    }
  }, []);

  // Set initial active project after data load
  useEffect(() => {
      if (!activeProject && projects.length > 0) {
          // Prefer a DEAL project first
          const firstDeal = projects.find(p => p.category === 'DEAL');
          setActiveProject(firstDeal || projects[0]);
      }
  }, [projects, activeProject]);

  // Reset selected stage when project changes
  useEffect(() => {
      if (activeProject) {
          const currentStage = activeProject.stages.find(s => s.status === 'current');
          setSelectedStageId(currentStage ? currentStage.id : null);
      }
  }, [activeProject]);

  const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
          const data = await api.fetchDashboard('mock-token');
          if (data && data.projects && data.projects.length > 0) {
              // Merge API projects (e.g. from Smart Match) with existing mocks
              setProjects(prev => {
                  const combined = [...prev, ...data.projects];
                  const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                  return unique;
              });
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoadingData(false);
      }
  };

  const handleLogin = async (phone: string) => {
    try {
        await api.auth(phone, getJourney());
        localStorage.setItem('estate_auth', 'true');
        setUser({ name: 'Александр', phone: phone, email: '', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80' });
        setIsLoggedIn(true);
        const returnUrl = new URLSearchParams(location.search).get('returnUrl');
        if (returnUrl) navigate(returnUrl);
    } catch (e) {}
  };

  const sendMessage = (text?: string, isSystem: boolean = false) => {
    if (!activeProject) return;
    const msgText = text || chatInput;
    if (!msgText.trim()) return;
    
    const newMsg: ChatMessage = { 
        id: Date.now(), 
        sender: isSystem ? 'system' : 'user', 
        text: msgText, 
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), 
        projectId: activeProject.id 
    };
    
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    
    setTimeout(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, 100);

    if (!isSystem) {
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now()+1, sender: 'agent', text: 'Принято, занимаюсь этим.', time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), projectId: activeProject.id }]);
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 1000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && activeProject) {
          const newDoc: DocItem = {
              id: `d_${Date.now()}`,
              name: file.name,
              date: new Date().toLocaleDateString('ru-RU', {day:'2-digit', month:'short'}),
              type: file.type.includes('image') ? 'img' : 'pdf',
              status: 'pending_review',
              isViewed: true
          };
          
          const updatedProjects = projects.map(p => {
              if (p.id === activeProject.id) {
                  return { ...p, documents: [...p.documents, newDoc] };
              }
              return p;
          });
          setProjects(updatedProjects);
          setActiveProject(updatedProjects.find(p => p.id === activeProject.id)!);
          
          if (activeActionModal) {
              handleCompleteAction(`Загружен документ: ${file.name}`);
          } else {
              setActiveTab('DOCS');
          }
      }
  };

  const handleCompleteAction = (logMsg?: string) => {
      if (!activeActionModal || !activeProject) return;
      
      // 1. User action message
      sendMessage(`Выполнено действие: ${activeActionModal.buttonText || 'Подтвердить'}`, false);

      const updatedProjects = projects.map(p => {
          if (p.id === activeProject.id) {
              const newTasks = p.tasks.map(t => t.id === activeActionModal.id ? { ...t, isCompleted: true, isViewed: true } : t);
              // Simplified progress logic for demo
              return { ...p, tasks: newTasks, progress: Math.min(100, p.progress + 5) };
          }
          return p;
      });
      
      setProjects(updatedProjects);
      setActiveProject(updatedProjects.find(p => p.id === activeProject.id)!);
      
      // 2. System confirmation
      setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: logMsg || `Статус задачи "${activeActionModal.title}" обновлен.`, time: 'Сейчас', projectId: activeProject.id }]);
      }, 500);
      
      setActiveActionModal(null);
  };

  const markAsViewed = (item: Task | HistoryItem) => {
      // Update local state to remove blue dot
      if (item.isViewed || !activeProject) return;
      
      const updatedProjects = projects.map(p => {
          if (p.id === activeProject.id) {
              // Check if it's a task or history item
              let newTasks = p.tasks;
              let newHistory = p.history;
              
              if ('actionType' in item) {
                  newTasks = p.tasks.map(t => t.id === item.id ? { ...t, isViewed: true } : t);
              } else {
                  newHistory = p.history.map(h => h.id === item.id ? { ...h, isViewed: true } : h);
              }
              
              return { ...p, tasks: newTasks, history: newHistory };
          }
          return p;
      });
      setProjects(updatedProjects);
      setActiveProject(updatedProjects.find(p => p.id === activeProject.id)!);
  };

  const getProjectIcon = (type: RoleType) => {
    switch (type) {
      case 'SELLER': return <Wallet />;
      case 'BUYER': return <Key />;
      case 'LANDLORD': return <Building />;
      case 'RENOVATION': return <Hammer />;
      case 'STAGING': return <Sparkles />;
      case 'AI_TOOL': return <BrainCircuit />;
      default: return <Home />;
    }
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;
  if (!activeProject) return <div className="flex items-center justify-center h-screen">Загрузка...</div>;

  const themeColor = activeProject.type === 'LANDLORD' ? 'green' : activeProject.type === 'RENOVATION' ? 'orange' : 'blue';
  
  // Determine stats to show based on selected stage
  const currentStageStats = selectedStageId !== null 
      ? activeProject.stages.find(s => s.id === selectedStageId)?.stats 
      : activeProject.stages.find(s => s.status === 'current')?.stats;

  const displayedStats = [...(activeProject.coreStats || []), ...(currentStageStats || [])];

  // Split Projects
  const activeDeals = projects.filter(p => p.category === 'DEAL');
  const aiHistory = projects.filter(p => p.category === 'AI_SERVICE');

  // Common function to render report content (used in Task Modal and History Modal)
  const renderWeeklyReport = (data: any) => (
      <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                  <div className="text-xs text-gray-500 uppercase font-bold flex justify-center items-center gap-1"><PhoneCall size={12}/> Звонки</div>
                  <div className="text-3xl font-bold text-blue-600 mt-1">{data.calls}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                  <div className="text-xs text-gray-500 uppercase font-bold flex justify-center items-center gap-1"><Eye size={12}/> Показы</div>
                  <div className="text-3xl font-bold text-green-600 mt-1">{data.views}</div>
              </div>
          </div>

          <div>
              <h4 className="font-bold text-gray-900 mb-2">Активность площадок</h4>
              <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ЦИАН</span>
                      <span className="font-bold">{data.sites.cian} просмотров</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Авито</span>
                      <span className="font-bold">{data.sites.avito} просмотров</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{width: '50%'}}></div>
                  </div>
              </div>
          </div>

          <div>
              <h4 className="font-bold text-gray-900 mb-2">Обратная связь</h4>
              <div className="space-y-2">
                  {data.feedback.map((fb: string, i: number) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 border border-gray-100">
                          "{fb}"
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="pt-24 pb-32 min-h-screen bg-[#F5F5F7]">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      <Section className="py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-4">
            <img src={user.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Кабинет</h1>
              <p className="text-gray-500 text-sm">{user.name}</p>
            </div>
          </div>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500" onClick={() => { localStorage.removeItem('estate_auth'); setIsLoggedIn(false); }}>
            <LogOut size={20} />
          </button>
        </div>

        {/* --- ACTIVE DEALS SLIDER --- */}
        <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Ваши проекты</h2>
            <div className="overflow-x-auto hide-scrollbar flex gap-4 px-2 py-2 snap-x">
                {activeDeals.map(p => {
                    const activeTaskCount = p.tasks.filter(t => !t.isCompleted).length;
                    const isSelected = activeProject.id === p.id;
                    const pTheme = p.type === 'LANDLORD' ? 'green' : p.type === 'RENOVATION' ? 'orange' : 'blue';
                    
                    return (
                        <div 
                            key={p.id} 
                            onClick={() => setActiveProject(p)}
                            className={`
                                min-w-[300px] p-6 rounded-[2.5rem] cursor-pointer transition-all border snap-center relative group flex flex-col justify-between h-[220px]
                                ${isSelected 
                                    ? 'bg-[#1c1c1e] text-white shadow-2xl scale-[1.02] border-transparent' 
                                    : 'bg-white text-gray-600 border-gray-100 hover:shadow-xl hover:border-gray-200'}
                            `}
                        >
                            {/* Header: Icon & Status */}
                            <div className="flex justify-between items-start">
                                <div className={`relative p-3.5 rounded-2xl transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-900 group-hover:bg-gray-100'}`}>
                                    {React.cloneElement(getProjectIcon(p.type), { size: 24, strokeWidth: 2.5 })}
                                    
                                    {/* Notification Badge on Icon */}
                                    {activeTaskCount > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full border-[3px] border-[#F5F5F7] shadow-sm z-10 animate-scale-in">
                                            {activeTaskCount}
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                                    {p.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="font-bold text-xl mb-4 leading-snug">{p.title}</h3>
                                
                                {/* Highlighted Stage Pill - Color Coded */}
                                <div className={`
                                    inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md shadow-sm transition-colors
                                    ${isSelected 
                                        ? 'bg-white/20 text-white border border-white/10' 
                                        : `bg-${pTheme}-50 text-${pTheme}-700 border border-${pTheme}-100`
                                    }
                                `}>
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-green-400 animate-pulse' : `bg-${pTheme}-500`}`}></div>
                                    {p.subtitle.replace(/Этап: |Статус: |Управление: /i, '')}
                                </div>
                            </div>
                        </div>
                    )
                })}
                
                {/* New Project Card */}
                <div 
                onClick={() => setIsCreateModalOpen(true)}
                className="min-w-[300px] p-6 rounded-[2.5rem] cursor-pointer transition-all border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 snap-center group h-[220px]"
                >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-white group-hover:shadow-md">
                    <Plus size={32} />
                </div>
                <span className="font-bold text-lg">Новый проект</span>
                </div>
            </div>
        </div>

        {/* --- AI HISTORY SECTION --- */}
        {aiHistory.length > 0 && (
            <div className="mb-8 px-2">
                <h2 className="text-lg font-bold text-gray-900 mb-4">История AI запросов</h2>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                    {aiHistory.map(p => (
                        <div 
                            key={p.id}
                            onClick={() => setActiveProject(p)}
                            className={`
                                min-w-[260px] p-5 rounded-3xl cursor-pointer border transition-all
                                ${activeProject.id === p.id 
                                    ? 'bg-black text-white border-black shadow-lg' 
                                    : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}
                            `}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeProject.id === p.id ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
                                    <BrainCircuit size={18}/>
                                </div>
                                <div className="text-xs font-bold uppercase opacity-70">{p.status}</div>
                            </div>
                            <h4 className="font-bold text-sm mb-1">{p.title}</h4>
                            <p className={`text-xs ${activeProject.id === p.id ? 'text-gray-400' : 'text-gray-500'}`}>{p.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Main Project Area */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
            
            {/* Progress & Stages Header - ONLY FOR DEALS */}
            {activeProject.category === 'DEAL' && (
                <div className="px-6 pt-6 pb-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Прогресс выполнения</span>
                        <span className={`text-sm font-bold ${activeProject.type === 'LANDLORD' ? 'text-green-600' : activeProject.type === 'RENOVATION' ? 'text-orange-600' : 'text-blue-600'}`}>{activeProject.progress}%</span>
                    </div>
                    
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${activeProject.type === 'LANDLORD' ? 'bg-green-500' : activeProject.type === 'RENOVATION' ? 'bg-orange-500' : 'bg-blue-600'}`} 
                            style={{ width: `${activeProject.progress}%` }}
                        ></div>
                    </div>

                    {/* Stages Visualization - Clickable */}
                    <div className="relative px-4 pb-4">
                        <div className="absolute left-4 right-4 top-[15px] h-0.5 bg-gray-100 -z-10 hidden md:block"></div>
                        
                        <div className="flex justify-between items-start gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 hide-scrollbar">
                            {activeProject.stages.map((stage, index) => {
                                const isCompleted = stage.status === 'completed';
                                const isCurrent = stage.status === 'current';
                                const isSelected = selectedStageId === stage.id;
                                
                                const colorClass = activeProject.type === 'LANDLORD' ? 'green' : activeProject.type === 'RENOVATION' ? 'orange' : 'blue';
                                const activeColor = activeProject.type === 'LANDLORD' ? 'bg-green-500 border-green-500' : activeProject.type === 'RENOVATION' ? 'bg-orange-500 border-orange-500' : 'bg-blue-600 border-blue-600';
                                const activeText = activeProject.type === 'LANDLORD' ? 'text-green-600' : activeProject.type === 'RENOVATION' ? 'text-orange-600' : 'text-blue-600';

                                return (
                                    <div 
                                        key={index} 
                                        onClick={() => setSelectedStageId(stage.id)}
                                        className={`flex flex-col items-center gap-3 min-w-[60px] flex-1 group cursor-pointer transition-opacity ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all z-10 bg-white
                                            ${isCompleted ? `${activeColor} text-white` : 
                                            isCurrent ? `border-${colorClass}-500 ${activeText} scale-110 shadow-lg` : 
                                            'border-gray-200 text-gray-300'}
                                            ${isSelected && !isCurrent && !isCompleted ? 'ring-2 ring-offset-2 ring-gray-300' : ''}
                                            ${isSelected && isCurrent ? `ring-2 ring-offset-2 ring-${colorClass}-500` : ''}
                                        `}>
                                            {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
                                        </div>
                                        <span className={`text-[9px] text-center font-bold uppercase leading-tight max-w-[100px] ${isCurrent || isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {stage.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Bar - Dynamic based on Stage */}
            {displayedStats.length > 0 && (
                <div className="p-6 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 mt-2 border-t">
                    {displayedStats.map((stat, i) => (
                        <div key={i} className="animate-fade-in">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            <div className={`text-lg font-bold text-gray-900 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : ''}`}>
                                {stat.value} {stat.trend === 'up' && <TrendingUp size={14}/>}
                            </div>
                            {stat.subtext && <div className="text-[10px] text-gray-500">{stat.subtext}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="flex p-2 bg-white border-b border-gray-100 sticky top-0 z-20">
                {[
                    { id: 'TASKS', label: activeProject.category === 'AI_SERVICE' ? 'Результат' : 'Задачи', icon: <CheckCircle2 size={18}/>, count: activeProject.tasks.filter(t => !t.isCompleted && !t.isViewed).length },
                    { id: 'DOCS', label: 'Документы', icon: <FolderOpen size={18}/>, count: 0 },
                    { id: 'HISTORY', label: 'История', icon: <History size={18}/>, count: activeProject.history.filter(h => !h.isViewed).length },
                    { id: 'CHAT', label: 'Чат', icon: <MessageSquare size={18}/>, count: 0 }
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab.icon} 
                        <span className="hidden md:inline">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {/* TASKS TAB */}
                {activeTab === 'TASKS' && (
                    <div className="space-y-3">
                        {activeProject.tasks.length > 0 ? (
                            activeProject.tasks.map(task => (
                                <div key={task.id} className={`p-5 rounded-2xl border flex items-center gap-4 ${task.type === 'urgent' ? 'bg-red-50 border-red-100' : task.type === 'success' ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${task.type === 'urgent' ? 'bg-red-100 text-red-500' : task.type === 'success' ? 'bg-green-100 text-green-600' : `bg-${themeColor}-50 text-${themeColor}-600`}`}>
                                        {task.type === 'urgent' ? <AlertCircle size={24}/> : <Bell size={24}/>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900">{task.title}</h4>
                                            {!task.isViewed && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                                        </div>
                                        <p className="text-sm text-gray-500">{task.desc}</p>
                                    </div>
                                    <button 
                                        onClick={() => { setActiveActionModal(task); markAsViewed(task); }}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform hover:scale-105 ${task.type === 'urgent' ? 'bg-red-500' : task.type === 'success' ? 'bg-green-600' : 'bg-black'}`}
                                    >
                                        {task.buttonText || 'Открыть'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <CheckCircle size={48} className="mx-auto mb-4 opacity-20"/>
                                <p>Нет активных задач</p>
                            </div>
                        )}
                    </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === 'DOCS' && (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <button onClick={() => fileInputRef.current?.click()} className="aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                                <Upload size={32} className="mb-2"/>
                                <span className="text-sm font-bold">Загрузить</span>
                            </button>
                            {activeProject.documents.map(doc => (
                                <div key={doc.id} className="aspect-[4/3] p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                                    <FileText size={32} className="text-gray-400 group-hover:text-black transition-colors"/>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900 truncate">{doc.name}</div>
                                        <div className={`text-[10px] font-bold uppercase mt-1 ${doc.status === 'signed' || doc.status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>
                                            {doc.status === 'pending_review' ? 'На проверке' : doc.status === 'signed' ? 'Подписан' : doc.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'HISTORY' && (
                    <div className="space-y-4">
                        {activeProject.history && activeProject.history.length > 0 ? (
                            activeProject.history.map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => { setActiveHistoryItem(item); markAsViewed(item); }}
                                    className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm relative">
                                            {item.type === 'METERS' ? <Droplets size={20}/> : item.type === 'PHOTO' ? <Camera size={20}/> : item.type === 'REPORT' ? <PieChart size={20}/> : <FileText size={20}/>}
                                            {!item.isViewed && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{item.title}</div>
                                            <div className="text-xs text-gray-500">{item.summary}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
                                        {item.date} <ChevronRight size={16}/>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">История пуста</div>
                        )}
                    </div>
                )}

                {/* CHAT TAB */}
                {activeTab === 'CHAT' && (
                    <div className="flex flex-col h-[500px]">
                        {/* HEADER WITH MANAGER AVATAR */}
                        <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                            <div className="relative">
                                <img src={activeProject.manager.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="Manager" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-lg">{activeProject.manager.name}</div>
                                <div className="text-xs text-gray-500 font-medium">{activeProject.manager.role} • Online</div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar p-4" ref={chatContainerRef}>
                            {messages.filter(m => !m.projectId || m.projectId === activeProject.id).map(msg => (
                                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                                    
                                    {/* Manager Avatar */}
                                    {msg.sender === 'agent' && (
                                        <img src={activeProject.manager.avatar} alt="Manager" className="w-8 h-8 rounded-full mr-2 mt-1 object-cover border border-gray-200" />
                                    )}

                                    {msg.sender === 'system' ? (
                                        <span className="text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase">{msg.text}</span>
                                    ) : (
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                                            {msg.text}
                                            <div className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-white' : 'text-gray-500'}`}>{msg.time}</div>
                                        </div>
                                    )}

                                    {/* User Avatar */}
                                    {msg.sender === 'user' && (
                                        <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full ml-2 mt-1 object-cover border border-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex gap-2 pt-2 border-t border-gray-50">
                            <input 
                                value={chatInput} 
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder={`Написать ${activeProject.manager.name}...`} 
                                className="flex-1 p-3 bg-gray-50 rounded-xl outline-none text-sm border border-transparent focus:border-gray-300 focus:bg-white transition-all"
                            />
                            <button onClick={() => sendMessage()} className="p-3 bg-black text-white rounded-xl"><Send size={20}/></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </Section>

      {/* --- MODALS --- */}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Создать новый проект">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link to="/sell" className="p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all text-center group cursor-pointer border border-transparent hover:border-blue-200">
                  <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-blue-600">
                      <Wallet size={28} />
                  </div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Продать</div>
              </Link>
              <Link to="/buy-new" className="p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all text-center group cursor-pointer border border-transparent hover:border-blue-200">
                  <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-blue-600">
                      <Key size={28} />
                  </div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Купить</div>
              </Link>
              <Link to="/rent-out" className="p-6 bg-gray-50 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all text-center group cursor-pointer border border-transparent hover:border-green-200">
                  <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-green-600">
                      <Building size={28} />
                  </div>
                  <div className="font-bold text-gray-900 group-hover:text-green-600">Сдать</div>
              </Link>
              <Link to="/renovation" className="p-6 bg-gray-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all text-center group cursor-pointer border border-transparent hover:border-orange-200">
                  <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-orange-600">
                      <Hammer size={28} />
                  </div>
                  <div className="font-bold text-gray-900 group-hover:text-orange-600">Ремонт</div>
              </Link>
              <Link to="/preparation" className="p-6 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-pink-600 transition-all text-center group cursor-pointer border border-transparent hover:border-pink-200">
                  <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-pink-600">
                      <Sparkles size={28} />
                  </div>
                  <div className="font-bold text-gray-900 group-hover:text-pink-600">Стейджинг</div>
              </Link>
              <Link to="/ai" className="p-6 bg-gray-50 rounded-2xl hover:bg-purple-50 hover:text-purple-600 transition-all text-center group cursor-pointer border border-transparent hover:border-purple-200">
                  <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-purple-600">
                      <BrainCircuit size={28} />
                  </div>
                  <div className="font-bold text-gray-900 group-hover:text-purple-600">AI Сервисы</div>
              </Link>
          </div>
      </Modal>

      <Modal isOpen={!!activeActionModal} onClose={() => setActiveActionModal(null)} title={activeActionModal?.title}>
          <div className="space-y-6">
              <p className="text-gray-600 text-lg">{activeActionModal?.desc}</p>
              
              {activeActionModal?.actionType === 'APPROVE_ADDITIONAL_WORKS' && activeActionModal.payload && (
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                      <div className="font-bold text-red-800 mb-2">Причина:</div>
                      <p className="text-red-700 mb-4">{activeActionModal.payload.reason}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-red-200 font-bold text-gray-900">
                          <span>Стоимость работ:</span>
                          <span className="text-xl">{activeActionModal.payload.price} ₽</span>
                      </div>
                      <div className="mt-4 p-3 bg-white rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-sm">
                          <FileText className="text-gray-400"/>
                          <span className="text-sm underline">{activeActionModal.payload.docName}</span>
                      </div>
                  </div>
              )}

              {activeActionModal?.actionType === 'SIGN_ACT' && (
                  <div className="p-4 bg-gray-50 rounded-2xl border flex items-center gap-4">
                      <FileCheck size={32} className="text-green-600"/>
                      <div>
                          <div className="font-bold">{activeActionModal.payload.docName}</div>
                          <div className="text-xs text-gray-500">Требуется ваша подпись</div>
                      </div>
                  </div>
              )}

              {activeActionModal?.actionType === 'VIEW_WEEKLY_REPORT' && activeActionModal.payload && renderWeeklyReport(activeActionModal.payload)}

              {activeActionModal?.actionType === 'VIEW_ECO_REPORT' && activeActionModal.payload && (
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                      <Sun size={48} className="mx-auto text-green-500 mb-4" />
                      <h3 className="text-2xl font-bold text-green-800 mb-1">{activeActionModal.payload.score}/100</h3>
                      <p className="text-green-700 font-medium">Экологический рейтинг</p>
                      <p className="text-xs text-green-600 mt-2">Адрес: {activeActionModal.payload.address}</p>
                  </div>
              )}

              {activeActionModal?.actionType === 'VIEW_GENERATED_CONTENT' && activeActionModal.payload && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-60 overflow-y-auto text-sm">
                      {activeActionModal.payload.text}
                  </div>
              )}

              {activeActionModal?.actionType === 'METER_READINGS' && (
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                          <div className="text-xs text-gray-500 uppercase">Вода</div>
                          <div className="text-2xl font-bold">{activeActionModal.payload.water}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                          <div className="text-xs text-gray-500 uppercase">Свет</div>
                          <div className="text-2xl font-bold">{activeActionModal.payload.light}</div>
                      </div>
                      <div className="col-span-2 h-48 bg-gray-200 rounded-2xl overflow-hidden">
                          <img src={activeActionModal.payload.photo} className="w-full h-full object-cover" />
                      </div>
                  </div>
              )}

              {activeActionModal?.actionType === 'CONFIRM_VIEWING' && activeActionModal.payload && (
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Clock size={20}/></div>
                          <div>
                              <div className="font-bold text-lg text-gray-900">Дата доставки</div>
                              <div className="text-blue-600 font-medium">{activeActionModal.payload.date}</div>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Clock size={20}/></div>
                          <div>
                              <div className="font-bold text-lg text-gray-900">Время</div>
                              <div className="text-blue-600 font-medium">{activeActionModal.payload.time}</div>
                          </div>
                      </div>
                  </div>
              )}

              {activeActionModal?.actionType === 'SCHEDULE_VISIT' && (
                  <div className="grid grid-cols-2 gap-4">
                      <input type="date" className="p-4 bg-gray-50 rounded-xl border outline-none" onChange={e => setSelectedDate(e.target.value)} />
                      <input type="time" className="p-4 bg-gray-50 rounded-xl border outline-none" onChange={e => setSelectedTime(e.target.value)} />
                  </div>
              )}

              {activeActionModal?.actionType === 'REVIEW_AI_SELECTION' && activeActionModal.payload && (
                  <div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 text-blue-900 text-sm">
                          {activeActionModal.payload.aiVerdict}
                      </div>
                      <div className="grid gap-4">
                          {activeActionModal.payload.properties.map((p: any, i: number) => (
                              <div key={i} className="flex gap-3 border p-3 rounded-xl">
                                  <img src={p.image} className="w-20 h-20 object-cover rounded-lg"/>
                                  <div>
                                      <div className="font-bold">{p.title}</div>
                                      <div className="text-sm text-gray-500">{p.specs}</div>
                                      <div className="font-bold text-blue-600 mt-1">{p.price}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div className="grid gap-3">
                  <button 
                    onClick={() => handleCompleteAction()} 
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform"
                  >
                      {activeActionModal?.buttonText || 'Выполнить'}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => { setActiveTab('CHAT'); setActiveActionModal(null); }} className="py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200">Обсудить</button>
                      <button onClick={() => setActiveActionModal(null)} className="py-3 border rounded-xl font-bold text-gray-400 hover:text-black">Закрыть</button>
                  </div>
              </div>
          </div>
      </Modal>

      <Modal isOpen={!!activeHistoryItem} onClose={() => setActiveHistoryItem(null)} title={activeHistoryItem?.title}>
          <div className="space-y-6">
              {activeHistoryItem?.type === 'REPORT' && renderWeeklyReport(activeHistoryItem.payload)}

              {activeHistoryItem?.type === 'METERS' && (
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-2xl text-center">
                          <div className="text-xs text-gray-500 uppercase font-bold">Вода</div>
                          <div className="text-2xl font-bold text-blue-600">{activeHistoryItem.payload.water}</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-2xl text-center">
                          <div className="text-xs text-gray-500 uppercase font-bold">Свет</div>
                          <div className="text-2xl font-bold text-yellow-600">{activeHistoryItem.payload.light}</div>
                      </div>
                      <div className="col-span-2 rounded-2xl overflow-hidden">
                          <img src={activeHistoryItem.payload.photo} className="w-full object-cover" />
                      </div>
                  </div>
              )}
              
              {activeHistoryItem?.type === 'PHOTO' && (
                  <div>
                      <p className="text-lg font-medium mb-4">"{activeHistoryItem.payload.comment}"</p>
                      <div className="grid grid-cols-2 gap-2">
                          {activeHistoryItem.payload.photos.map((ph: any, i: number) => (
                              <div key={i} className="relative">
                                  <img src={ph.url} className="rounded-xl w-full h-32 object-cover" />
                                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">{ph.label}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <button onClick={() => setActiveHistoryItem(null)} className="w-full py-4 bg-gray-100 rounded-xl font-bold">Закрыть</button>
          </div>
      </Modal>

    </div>
  );
};

const LoginScreen: React.FC<{ onLogin: (phone: string) => void }> = ({ onLogin }) => {
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center p-4 bg-[#F5F5F7]">
            <GlassCard className="max-w-md w-full p-10 text-center shadow-2xl">
                <div className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg"><User size={40}/></div>
                <h2 className="text-3xl font-bold mb-3 text-gray-900">Estate AI</h2>
                <p className="text-gray-500 mb-8 text-lg">Единый кабинет для сделок и AI сервисов</p>
                <input value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && onLogin(phone)} placeholder="+7 (999) 000-00-00" className="w-full p-5 rounded-2xl bg-[#F2F2F7] text-center text-xl font-bold outline-none mb-4 focus:ring-2 focus:ring-blue-500 transition-all" autoFocus />
                <button onClick={() => { setIsLoading(true); setTimeout(() => onLogin(phone), 800); }} disabled={isLoading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin"/> : "Войти"}
                </button>
            </GlassCard>
        </div>
    );
}

export default Dashboard;
