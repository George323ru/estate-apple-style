
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ServiceLanding from '../components/ServiceLanding';
import { GoogleGenAI } from "@google/genai";
import { 
  BrainCircuit, ArrowLeft, CheckCircle2, 
  Coffee, Building2, Trees, Car, Wallet, Laptop, 
  Users, Sparkles, ArrowRight, MapPin, Home,
  Briefcase, Baby, GraduationCap, Train, Clock,
  Hammer, Key, Layers, DollarSign, PieChart, Paintbrush, User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyModal from '../components/PropertyModal';
import { Property } from '../types';
import { api } from '../services/api';

// --- EXTENDED MOCK DATA ---
const MOCK_PRIMARY: Property[] = [
    { id: 'p1', title: "ЖК 'Футурист'", price: "18.5 млн ₽", image: "https://picsum.photos/600/400?random=1", location: "Москва, ЦАО", specs: "2-к кв, 65 м²", tags: ["Бизнес", "Парк", "Центр"], type: 'apartment', deadline: '2025' },
    { id: 'p2', title: "ЖК 'Символ'", price: "14.1 млн ₽", image: "https://picsum.photos/600/400?random=2", location: "Москва, ЮВАО", specs: "1-к кв, 42 м²", tags: ["Комфорт+", "Метро", "Парк"], type: 'apartment', deadline: '2024' },
    { id: 'p3', title: "ЖК 'Level Мичуринский'", price: "16.0 млн ₽", image: "https://picsum.photos/600/400?random=3", location: "Москва, ЗАО", specs: "2-к евро, 55 м²", tags: ["Бизнес", "У воды", "Семья"], type: 'apartment', deadline: '2026' },
    { id: 'p4', title: "ЖК 'Shagal'", price: "13.5 млн ₽", image: "https://picsum.photos/600/400?random=4", location: "Москва, ЮАО", specs: "Студия, 30 м²", tags: ["Бизнес", "Набережная", "Инвест"], type: 'apartment', deadline: '2025' },
    { id: 'p5', title: "ЖК 'Остров'", price: "25.0 млн ₽", image: "https://picsum.photos/600/400?random=5", location: "Москва, СЗАО", specs: "3-к кв, 80 м²", tags: ["Премиум", "Экология", "Семья"], type: 'apartment', deadline: '2025' },
];

const MOCK_SECONDARY: Property[] = [
    { id: 's1', title: "Сталинка на Ленинском", price: "22.5 млн ₽", image: "https://picsum.photos/600/400?random=11", location: "Москва, ЮЗАО", specs: "3-к кв, 78 м²", tags: ["История", "Потолки 3.2м", "Центр"], type: 'apartment' },
    { id: 's2', title: "Студия у метро", price: "9.1 млн ₽", image: "https://picsum.photos/600/400?random=12", location: "Москва, СВАО", specs: "Студия, 25 м²", tags: ["Готовый ремонт", "Аренда", "Метро"], type: 'apartment' },
    { id: 's3', title: "Видовая на Котельнической", price: "45.0 млн ₽", image: "https://picsum.photos/600/400?random=13", location: "Москва, ЦАО", specs: "2-к кв, 60 м²", tags: ["Элит", "Вид", "Центр"], type: 'apartment' },
    { id: 's4', title: "Трешка в спальном", price: "16.5 млн ₽", image: "https://picsum.photos/600/400?random=14", location: "Москва, Ясенево", specs: "3-к кв, 72 м²", tags: ["Тишина", "Семья", "Лес"], type: 'apartment' },
    { id: 's5', title: "Лофт на Даниловской", price: "19.0 млн ₽", image: "https://picsum.photos/600/400?random=15", location: "Москва, ЮАО", specs: "Апарт, 45 м²", tags: ["Стиль", "Тусовка", "Молодежь"], type: 'apartment' },
];

// Helper Icons
const HelpCircleIcon = ({size}: {size:number}) => <div style={{width: size, height: size, border: '2px solid currentColor', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>?</div>;
const HistoryIcon = ({size}: {size:number}) => <Clock size={size} />;
const ActivityIcon = ({size}: {size:number}) => <Sparkles size={size} />;
const RefreshCwIcon = ({size}: {size:number}) => <ArrowRight size={size} />; // Placeholder

// --- QUIZ CONFIG ---
interface Question {
    id: string;
    text: string;
    options: {
        value: string;
        label: string;
        desc?: string;
        icon?: React.ReactNode;
    }[];
}

const QUESTIONS: Question[] = [
    {
        id: 'residents',
        text: "Кто будет жить в квартире?",
        options: [
            { value: 'single', label: 'Я один(а)', desc: 'Свобода и эгоизм', icon: <Users size={20} /> },
            { value: 'couple', label: 'Пара', desc: 'Романтика и комфорт', icon: <Users size={20} /> },
            { value: 'family_kids', label: 'Семья с детьми', desc: 'Безопасность и школы', icon: <Baby size={20} /> },
            { value: 'invest', label: 'Никто (под сдачу)', desc: 'Пассивный доход', icon: <PieChart size={20} /> }
        ]
    },
    {
        id: 'budget',
        text: "На какой бюджет рассчитываете?",
        options: [
            { value: 'low', label: 'До 12 млн ₽', desc: 'Старт / Эконом', icon: <DollarSign size={20} /> },
            { value: 'mid', label: '12 - 20 млн ₽', desc: 'Комфорт / Бизнес-лайт', icon: <DollarSign size={20} /> },
            { value: 'high', label: '20 - 40 млн ₽', desc: 'Бизнес / Премиум', icon: <DollarSign size={20} /> },
            { value: 'lux', label: '40+ млн ₽', desc: 'Элитная недвижимость', icon: <Sparkles size={20} /> }
        ]
    },
    {
        id: 'goal',
        text: "Главная цель покупки?",
        options: [
            { value: 'live_now', label: 'Заехать сразу', desc: 'Не хочу ждать стройку', icon: <Key size={20} /> },
            { value: 'wait', label: 'Готов подождать', desc: 'Ради выгоды в цене', icon: <Clock size={20} /> },
            { value: 'save', label: 'Сохранить деньги', desc: 'Инвестиция в бетон', icon: <Wallet size={20} /> },
            { value: 'status', label: 'Подтвердить статус', desc: 'Локация и престиж', icon: <Sparkles size={20} /> }
        ]
    },
    {
        id: 'location',
        text: "Что важно в локации?",
        options: [
            { value: 'center', label: 'Центр / Движ', desc: 'Рестораны, театры, офисы', icon: <Building2 size={20} /> },
            { value: 'park', label: 'Парки и тишина', desc: 'Экология и прогулки', icon: <Trees size={20} /> },
            { value: 'metro', label: 'У метро', desc: 'Мобильность без авто', icon: <Train size={20} /> },
            { value: 'suburb', label: 'Загород / МО', desc: 'Больше метров за те же деньги', icon: <Home size={20} /> }
        ]
    },
    {
        id: 'transport',
        text: "Как вы передвигаетесь?",
        options: [
            { value: 'car', label: 'Автомобиль', desc: 'Нужен паркинг и выезд на шоссе', icon: <Car size={20} /> },
            { value: 'public', label: 'Метро / Такси', desc: 'Пешая доступность до станции', icon: <Train size={20} /> },
            { value: 'mix', label: '50/50', desc: 'И то, и другое', icon: <MapPin size={20} /> },
            { value: 'remote', label: 'Работаю из дома', desc: 'Транспорт не важен', icon: <Laptop size={20} /> }
        ]
    },
    {
        id: 'readiness',
        text: "Стадия готовности дома?",
        options: [
            { value: 'ready', label: 'Сдан / Вторичка', desc: 'Ключи сразу', icon: <CheckCircle2 size={20} /> },
            { value: 'soon', label: 'Сдача в этом году', desc: 'Почти готово', icon: <Clock size={20} /> },
            { value: 'pit', label: 'Котлован', desc: 'Максимальная выгода', icon: <Layers size={20} /> },
            { value: 'any', label: 'Не важно', desc: 'Смотрю всё', icon: <HelpCircleIcon size={20} /> }
        ]
    },
    {
        id: 'floor',
        text: "Предпочтения по этажу?",
        options: [
            { value: 'low', label: 'Ниже 5-го', desc: 'Ближе к земле', icon: <ArrowRight className="rotate-90" size={20} /> },
            { value: 'mid', label: 'Средний (5-15)', desc: 'Золотая середина', icon: <Layers size={20} /> },
            { value: 'high', label: 'Высокий / Видовой', desc: 'Панорама города', icon: <ArrowRight className="-rotate-90" size={20} /> },
            { value: 'any', label: 'Не имеет значения', desc: 'Главное - планировка', icon: <CheckCircle2 size={20} /> }
        ]
    },
    {
        id: 'renovation',
        text: "Готовность к ремонту?",
        options: [
            { value: 'full', label: 'Под ключ', desc: 'Заезжай и живи', icon: <Key size={20} /> },
            { value: 'whitebox', label: 'White Box', desc: 'Только чистовая отделка', icon: <Paintbrush size={20} /> },
            { value: 'rough', label: 'Без отделки', desc: 'Сделаю под себя', icon: <Hammer size={20} /> },
            { value: 'tired', label: 'Бабушкин ремонт', desc: 'Под снос (дешевле)', icon: <HistoryIcon size={20} /> }
        ]
    },
    {
        id: 'amenities',
        text: "Что обязательно рядом?",
        options: [
            { value: 'kids', label: 'Школы и сады', desc: 'Образование', icon: <GraduationCap size={20} /> },
            { value: 'shop', label: 'ТЦ и магазины', desc: 'Шоппинг', icon: <Wallet size={20} /> },
            { value: 'sport', label: 'Фитнес / Спорт', desc: 'Активный образ жизни', icon: <ActivityIcon size={20} /> },
            { value: 'bar', label: 'Кафе и бары', desc: 'Гастрономия', icon: <Coffee size={20} /> }
        ]
    },
    {
        id: 'finance',
        text: "Способ оплаты?",
        options: [
            { value: 'cash', label: '100% Наличные', desc: 'Возможна вторичка', icon: <Wallet size={20} /> },
            { value: 'mortgage_gov', label: 'Ипотека с гос.поддержкой', desc: 'Только новостройки', icon: <Building2 size={20} /> },
            { value: 'mortgage_std', label: 'Рыночная ипотека', desc: 'Любой объект', icon: <Building2 size={20} /> },
            { value: 'tradein', label: 'Trade-in / Обмен', desc: 'Вместо старой', icon: <RefreshCwIcon size={20} /> }
        ]
    }
];

const AISmartMatch: React.FC = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ 
        text: string, 
        primary: Property[], 
        secondary: Property[] 
    } | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('estate_auth');
        if (auth === 'true') setIsAuthorized(true);
    }, []);

    const handleAnswer = (value: string) => {
        const currentQ = QUESTIONS[step];
        const newAnswers = { ...answers, [currentQ.id]: value };
        setAnswers(newAnswers);

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            generateResult(newAnswers);
        }
    };

    const generateResult = async (finalAnswers: Record<string, string>) => {
        setLoading(true);
        
        // --- LOGIC: SPLIT MARKETS ---
        const payment = finalAnswers['finance'];
        const isGovMortgage = payment === 'mortgage_gov';
        const showSecondary = !isGovMortgage; // Only show secondary if NOT restricted to Gov Mortgage (which is Primary only)

        // --- MOCK FILTERING (Primary) ---
        let primaryMatches = [...MOCK_PRIMARY];
        // Filter by budget (Simple mock logic)
        if (finalAnswers['budget'] === 'low') primaryMatches = primaryMatches.filter(p => parseFloat(p.price) < 15);
        if (finalAnswers['budget'] === 'high' || finalAnswers['budget'] === 'lux') primaryMatches = primaryMatches.filter(p => parseFloat(p.price) > 15);
        // Filter by location
        if (finalAnswers['location'] === 'center') primaryMatches = primaryMatches.filter(p => p.location.includes('ЦАО') || p.tags.includes('Центр'));
        if (finalAnswers['location'] === 'park') primaryMatches = primaryMatches.filter(p => p.tags.includes('Парк') || p.tags.includes('Экология'));

        // --- MOCK FILTERING (Secondary) ---
        let secondaryMatches: Property[] = [];
        if (showSecondary) {
            secondaryMatches = [...MOCK_SECONDARY];
            if (finalAnswers['budget'] === 'low') secondaryMatches = secondaryMatches.filter(p => parseFloat(p.price) < 12);
            if (finalAnswers['budget'] === 'high') secondaryMatches = secondaryMatches.filter(p => parseFloat(p.price) > 15);
            
            if (finalAnswers['renovation'] === 'tired') secondaryMatches = secondaryMatches.filter(p => parseFloat(p.price) < 15); // Cheap ones
            if (finalAnswers['renovation'] === 'full') secondaryMatches = secondaryMatches.filter(p => p.tags.includes('Готовый ремонт') || p.tags.includes('Элит'));
        }

        // Fallbacks to ensure non-empty
        if (primaryMatches.length === 0) primaryMatches = [MOCK_PRIMARY[0], MOCK_PRIMARY[2]];
        if (showSecondary && secondaryMatches.length === 0) secondaryMatches = [MOCK_SECONDARY[0], MOCK_SECONDARY[1]];

        // Limit
        primaryMatches = primaryMatches.slice(0, 3);
        secondaryMatches = secondaryMatches.slice(0, 3);

        // --- AI INSIGHT ---
        let aiText = "Мы подобрали варианты, идеально подходящие под ваш ритм жизни."; 
        try {
            const apiKey = process.env.API_KEY;
            if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                const prompt = `
                    Role: Real Estate Matchmaker.
                    User Profile:
                    - Residents: ${QUESTIONS[0].options.find(o => o.value === finalAnswers['residents'])?.label}
                    - Budget: ${QUESTIONS[1].options.find(o => o.value === finalAnswers['budget'])?.label}
                    - Goal: ${QUESTIONS[2].options.find(o => o.value === finalAnswers['goal'])?.label}
                    - Location Priority: ${QUESTIONS[3].options.find(o => o.value === finalAnswers['location'])?.label}
                    - Payment: ${QUESTIONS[9].options.find(o => o.value === finalAnswers['finance'])?.label}

                    Task: Write a short summary (Russian, max 3 sentences).
                    1. Acknowledge their situation (e.g. "Для семьи с детьми важна экология...").
                    2. Explain strategy (e.g. "Мы выбрали ЖК с готовой инфраструктурой...").
                    3. If Payment allows Secondary, mention it (e.g. "Так как у вас наличные, мы добавили лучшие варианты вторички в центре.").
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                if (response.text) aiText = response.text;
            }
        } catch (e) {
            console.error("AI Error", e);
        }

        const finalResult = {
            text: aiText,
            primary: primaryMatches,
            secondary: secondaryMatches
        };

        // Submit data to backend (and save to dashboard)
        await api.submitSmartMatch(finalAnswers, finalResult);

        setResult(finalResult);
        setLoading(false);
    };

    if (!isAuthorized) {
        return (
            <ServiceLanding 
                title="AI Умный подбор"
                subtitle="Найдите дом, который подходит именно вам."
                description="Забудьте о бесконечных фильтрах. Пройдите детальный тест (10 вопросов) о вашем образе жизни, и нейросеть подберет 3-5 идеальных вариантов из 500+ жилых комплексов и базы вторичной недвижимости."
                icon={<BrainCircuit />}
                colorTheme="purple"
                buttonText="Начать подбор"
                onStart={() => setIsAuthorized(true)}
                features={[
                    { title: "Глубокий анализ", desc: "Учитываем состав семьи, привычки, транспорт и планы на будущее.", icon: <Users className="text-purple-600"/> },
                    { title: "Два рынка сразу", desc: "Сравним новостройки и вторичку, если ваш способ оплаты это позволяет.", icon: <Layers className="text-purple-600"/> },
                    { title: "Честный отчет", desc: "Объясним выбор каждого объекта: почему он подходит именно вам.", icon: <Sparkles className="text-purple-600"/> }
                ]}
            />
        );
    }

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <Section className="py-8">
                <div className="mb-8">
                    <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                        <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
                    </Link>
                    <div className="text-center mb-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-4">Персонализация</span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Умный подбор</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            10 вопросов, чтобы найти идеальный дом.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    {!result && !loading && (
                        <GlassCard className="p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col">
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
                                <div 
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                                    style={{width: `${((step + 1) / QUESTIONS.length) * 100}%`}}
                                ></div>
                            </div>

                            <div className="mb-8">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Вопрос {step + 1} из {QUESTIONS.length}</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 leading-tight animate-fade-in">
                                    {QUESTIONS[step].text}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {QUESTIONS[step].options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleAnswer(opt.value)}
                                        className="text-left p-6 rounded-2xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-6 group bg-white shadow-sm hover:shadow-md"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0">
                                            {opt.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-gray-900 mb-1">{opt.label}</div>
                                            <div className="text-sm text-gray-500">{opt.desc}</div>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="text-purple-600" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {loading && (
                        <GlassCard className="p-12 min-h-[500px] flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 relative">
                                <BrainCircuit size={48} className="text-purple-600 z-10" />
                                <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping"></div>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Анализируем ваши ответы...</h3>
                            <p className="text-gray-500">Подбираем объекты, проверяем цены, фильтруем локации.</p>
                        </GlassCard>
                    )}

                    {result && (
                        <div className="space-y-12 animate-slide-up">
                            <div className="bg-green-100 text-green-800 p-4 rounded-2xl text-center font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> Результаты сохранены в Личный Кабинет. Менеджер уже подбирает дополнительные варианты.
                            </div>

                            {/* AI Insight */}
                            <GlassCard className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-none p-8 md:p-10">
                                <div className="flex items-start gap-4 mb-4">
                                    <Sparkles className="text-yellow-300 flex-shrink-0" size={24} />
                                    <h3 className="text-xl font-bold text-purple-100 uppercase tracking-wider">Вердикт AI</h3>
                                </div>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                                    "{result.text}"
                                </p>
                            </GlassCard>

                            {/* Primary List */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 px-2 mb-6 flex items-center gap-3">
                                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg"><Building2 size={24}/></span>
                                    Топ Новостроек
                                </h3>
                                <div className="grid gap-6">
                                    {result.primary.map(property => (
                                        <div key={property.id} onClick={() => setSelectedProperty(property)} className="cursor-pointer group">
                                            <GlassCard className="p-0 overflow-hidden hover:shadow-2xl transition-all border border-gray-200 flex flex-col md:flex-row h-full md:h-64">
                                                <div className="md:w-2/5 relative h-48 md:h-full overflow-hidden">
                                                    <img src={property.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={property.title} />
                                                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                        Сдача {property.deadline}
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-6 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-bold text-xl text-gray-900">{property.title}</h3>
                                                            <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{property.price}</span>
                                                        </div>
                                                        <p className="text-gray-500 text-sm flex items-center gap-1 mb-4"><MapPin size={14}/> {property.location}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {property.tags.map(tag => (
                                                                <span key={tag} className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                                                                    <CheckCircle2 size={10} /> {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                                        <span className="text-sm font-medium text-gray-500">{property.specs}</span>
                                                        <span className="text-black font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                            Смотреть <ArrowRight size={16} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary List (Conditional) */}
                            {result.secondary.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 px-2 mb-6 flex items-center gap-3">
                                        <span className="bg-indigo-100 text-indigo-700 p-2 rounded-lg"><Key size={24}/></span>
                                        Готовая Вторичка
                                    </h3>
                                    <div className="grid gap-6">
                                        {result.secondary.map(property => (
                                            <div key={property.id} onClick={() => setSelectedProperty(property)} className="cursor-pointer group">
                                                <GlassCard className="p-0 overflow-hidden hover:shadow-2xl transition-all border border-gray-200 flex flex-col md:flex-row h-full md:h-64">
                                                    <div className="md:w-2/5 relative h-48 md:h-full overflow-hidden">
                                                        <img src={property.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={property.title} />
                                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-black">
                                                            Вторичка
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="font-bold text-xl text-gray-900">{property.title}</h3>
                                                                <span className="text-lg font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{property.price}</span>
                                                            </div>
                                                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-4"><MapPin size={14}/> {property.location}</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {property.tags.map(tag => (
                                                                    <span key={tag} className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                                                                        <CheckCircle2 size={10} /> {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                                            <span className="text-sm font-medium text-gray-500">{property.specs}</span>
                                                            <span className="text-black font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                                Смотреть <ArrowRight size={16} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </GlassCard>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-center pt-8 flex flex-col md:flex-row gap-4 justify-center">
                                <button onClick={() => navigate('/dashboard')} className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-800 flex items-center justify-center gap-2">
                                    <User size={20}/> Перейтив в Кабинет
                                </button>
                                <button onClick={() => { setStep(0); setResult(null); setAnswers({}); }} className="text-gray-400 hover:text-black font-bold text-sm transition-colors py-4">
                                    Пройти заново
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Section>

            <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
        </div>
    );
};

export default AISmartMatch;
