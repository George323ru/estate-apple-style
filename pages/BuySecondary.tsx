
import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import PropertyModal from '../components/PropertyModal';
import LeadForm from '../components/LeadForm';
import SEO from '../components/SEO';
import ReviewsSection from '../components/ReviewsSection';
import FAQ from '../components/FAQ';
import ComparisonBlock from '../components/ComparisonBlock';
import ExpertsSection from '../components/ExpertsSection';
import ProcessTimeline from '../components/ProcessTimeline';
import AIHeroCarousel from '../components/AIHeroCarousel';
import { Property } from '../types';
import { PAGE_CONTENT } from '../services/contentData';
import { MapPin, Search, FileText, ArrowRight, Shield, Scale, SearchCheck, FileSearch, ChevronDown, Sun, Leaf, ShieldCheck, TrendingUp, Calculator, BrainCircuit, Sparkles, Handshake, Clock, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../services/blogData';
import { SchemaMarkup } from '../components/SchemaMarkup';
import Modal from '../components/Modal';

// --- MOCK DATA ---
const MOCK_PROPERTIES_SECONDARY: Property[] = [
    { id: 's1', title: "Сталинка на Ленинском", price: "28.5 млн ₽", image: "https://picsum.photos/600/400?random=11", location: "Москва, ЮЗАО", specs: "3-к кв, 85 м²", tags: ["Высокие потолки", "Ремонт"], type: 'apartment', area: 85, priceVal: 28.5, district: 'ЮЗАО', city: 'Москва' },
    { id: 's2', title: "Студия у метро", price: "8.1 млн ₽", image: "https://picsum.photos/600/400?random=12", location: "Москва, СВАО", specs: "Студия, 22 м²", tags: ["Под сдачу", "Мебель"], type: 'apartment', area: 22, priceVal: 8.1, district: 'СВАО', city: 'Москва' },
    { id: 's3', title: "Коттедж в черте города", price: "35.0 млн ₽", image: "https://picsum.photos/600/400?random=13", location: "Казань, Авиастрой", specs: "Дом 180 м²", tags: ["ИЖС", "Газ"], type: 'house', area: 180, plotArea: 8, priceVal: 35, district: 'Авиастроительный', city: 'Казань' },
    { id: 's4', title: "Ритейл с арендатором", price: "40.0 млн ₽", image: "https://picsum.photos/600/400?random=14", location: "Санкт-Петербург", specs: "80 м²", tags: ["Доходность 10%"], type: 'commercial', area: 80, priceVal: 40, floor: 1, district: 'Центральный', city: 'Санкт-Петербург' },
    { id: 's5', title: "Дом у моря", price: "65.0 млн ₽", image: "https://picsum.photos/600/400?random=15", location: "Сочи, Хоста", specs: "Дом 300 м²", tags: ["Вид", "Бассейн"], type: 'house', area: 300, plotArea: 15, priceVal: 65, district: 'Хостинский', city: 'Сочи' },
];

const CITIES = ["Москва", "Санкт-Петербург", "Сочи", "Казань", "Екатеринбург"];
const DISTRICTS: Record<string, string[]> = {
    "Москва": ["ЦАО", "ЗАО", "ЮЗАО", "САО", "СВАО", "ЮАО", "ЮВАО", "ВАО", "СЗАО", "Новая Москва", "Одинцовский"],
    "Санкт-Петербург": ["Центральный", "Петроградский", "Василеостровский", "Приморский", "Московский"],
    "Сочи": ["Центральный", "Адлерский", "Хостинский", "Лазаревский"],
    "Казань": ["Вахитовский", "Ново-Савиновский", "Приволжский", "Авиастроительный"],
    "Екатеринбург": ["Центр", "Уралмаш", "Академический"]
};

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('buy-sec-')).slice(0, 6);

const BuySecondary: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/estates`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
                setProperties(MOCK_PROPERTIES_SECONDARY);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // Filter State
    const [selectedType, setSelectedType] = useState<'apartment' | 'apartments' | 'house' | 'commercial' | 'parking' | 'land'>('apartment');
    const [city, setCity] = useState('Москва');
    const [district, setDistrict] = useState('');

    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');

    const [areaMin, setAreaMin] = useState('');
    const [areaMax, setAreaMax] = useState('');

    const [plotMin, setPlotMin] = useState(''); // For land/houses
    const [plotMax, setPlotMax] = useState('');

    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

    const toggleRoom = (room: string) => {
        setSelectedRooms(prev => prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]);
    };

    const filteredProperties = useMemo(() => {
        const source = properties.length > 0 ? properties : MOCK_PROPERTIES_SECONDARY;
        return source.filter(p => {
            // Type Filter
            if (selectedType === 'apartments' && p.type === 'apartment') { /* allow */ }
            else if (selectedType !== p.type && !(selectedType === 'apartments' && p.type === 'apartment')) return false;

            // City Filter
            if (p.city && p.city !== city) return false;

            // District Filter
            if (district && p.district && p.district !== district) return false;

            // Price Filter
            if (priceMin && p.priceVal && p.priceVal < parseFloat(priceMin)) return false;
            if (priceMax && p.priceVal && p.priceVal > parseFloat(priceMax)) return false;

            // Area Filter
            if (areaMin && p.area && p.area < parseFloat(areaMin)) return false;
            if (areaMax && p.area && p.area > parseFloat(areaMax)) return false;

            // Plot Area Filter (Houses/Land)
            if (plotMin && p.plotArea && p.plotArea < parseFloat(plotMin)) return false;
            if (plotMax && p.plotArea && p.plotArea > parseFloat(plotMax)) return false;

            // Search Query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!p.title.toLowerCase().includes(query) && !p.location.toLowerCase().includes(query)) return false;
            }

            return true;
        });
    }, [selectedType, city, district, priceMin, priceMax, areaMin, areaMax, plotMin, plotMax, searchQuery, selectedRooms]);

    const showRoomSelector = selectedType === 'apartment' || selectedType === 'apartments';
    const showPlotInputs = selectedType === 'house' || selectedType === 'land';
    const showAreaInputs = selectedType !== 'land' && selectedType !== 'parking';

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Покупка вторичной недвижимости",
        "description": PAGE_CONTENT.BUY_SECONDARY.seo.description,
        "provider": {
            "@type": "RealEstateAgent",
            "name": "Estate AI"
        },
        "areaServed": "RU"
    };

    return (
        <div className="pt-24 min-h-screen">
            <SEO
                title="Купить вторичку в Москве | Юридическая чистота | Estate AI"
                description={PAGE_CONTENT.BUY_SECONDARY.seo.description}
                keywords={PAGE_CONTENT.BUY_SECONDARY.seo.keywords}
            />
            <SchemaMarkup schema={schemaData} />

            <Section className="py-8">
                <div className="mb-8 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-4">{PAGE_CONTENT.BUY_SECONDARY.hero.badge}</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{PAGE_CONTENT.BUY_SECONDARY.hero.title}</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">{PAGE_CONTENT.BUY_SECONDARY.hero.subtitle}</p>
                    {/* HEADER CONVERSION BUTTON - SERVICE */}
                    <button
                        onClick={() => setIsLeadFormOpen(true)}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-lg"
                    >
                        <Search size={20} />
                        Подобрать объект
                    </button>
                </div>

                {/* --- FILTERS --- */}
                {/* Mobile: relative (scrolls), Tablet/Desktop (md+): sticky (fixes) */}
                <GlassCard className="mb-12 relative md:sticky md:top-24 z-30 p-6 border border-indigo-100 shadow-xl bg-white/90 backdrop-blur-xl">
                    <div className="flex flex-col gap-4">

                        {/* Row 1: Type Selector */}
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-gray-100">
                            {[
                                { id: 'apartment', label: 'Квартиры' },
                                { id: 'apartments', label: 'Апартаменты' },
                                { id: 'house', label: 'Дома' },
                                { id: 'land', label: 'Участки' },
                                { id: 'commercial', label: 'Коммерция' },
                                { id: 'parking', label: 'Паркинг' },
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id as any)}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${selectedType === type.id ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Row 2: Location & Search */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* City */}
                            <div className="md:col-span-3 relative">
                                <select
                                    value={city}
                                    onChange={e => { setCity(e.target.value); setDistrict(''); }}
                                    className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* District */}
                            <div className="md:col-span-3 relative">
                                <select
                                    value={district}
                                    onChange={e => setDistrict(e.target.value)}
                                    className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-200"
                                    disabled={!city}
                                >
                                    <option value="">Любой район</option>
                                    {city && DISTRICTS[city]?.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* Search */}
                            <div className="md:col-span-6 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Улица, метро..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 p-3 rounded-xl bg-gray-50 text-sm font-medium outline-none focus:bg-white focus:shadow-inner transition-all"
                                />
                            </div>
                        </div>

                        {/* Row 3: Specifics */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                            {/* Rooms (Only for Apartments) */}
                            {showRoomSelector && (
                                <div className="md:col-span-4 bg-gray-50 p-1 rounded-xl flex justify-between items-center">
                                    {['Студия', '1', '2', '3', '4+'].map(room => (
                                        <button
                                            key={room}
                                            onClick={() => toggleRoom(room)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selectedRooms.includes(room) ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {room}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Area Inputs */}
                            {showAreaInputs && (
                                <div className={`${showRoomSelector ? 'md:col-span-4' : 'md:col-span-3'} grid grid-cols-2 gap-2`}>
                                    <input type="number" placeholder="Метраж от" value={areaMin} onChange={e => setAreaMin(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:shadow-inner" />
                                    <input type="number" placeholder="до м²" value={areaMax} onChange={e => setAreaMax(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:shadow-inner" />
                                </div>
                            )}

                            {/* Plot Inputs (Houses/Land) */}
                            {showPlotInputs && (
                                <div className="md:col-span-3 grid grid-cols-2 gap-2">
                                    <input type="number" placeholder="Участок от" value={plotMin} onChange={e => setPlotMin(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:shadow-inner" />
                                    <input type="number" placeholder="до сот." value={plotMax} onChange={e => setPlotMax(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:shadow-inner" />
                                </div>
                            )}

                            {/* Price Range */}
                            <div className={`${showRoomSelector ? 'md:col-span-4' : 'md:col-span-3'} grid grid-cols-2 gap-2`}>
                                <input type="number" placeholder="Цена от" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:shadow-inner" />
                                <input type="number" placeholder="до млн ₽" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 text-sm outline-none focus:bg-white focus:shadow-inner" />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map(property => (
                        <div key={property.id} onClick={() => setSelectedProperty(property)} className="group cursor-pointer">
                            <GlassCard className="p-0 overflow-hidden h-full hover:shadow-xl transition-all border border-gray-200/50">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={property.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={property.title} />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        {property.type === 'apartment' ? 'Вторичка' : property.type === 'house' ? 'Дом' : 'Коммерция'}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <div className="text-white font-bold text-xl">{property.price}</div>
                                        <div className="text-white/80 text-sm flex items-center gap-1"><MapPin size={12} /> {property.location}</div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{property.title}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {property.tags.map(tag => (
                                            <span key={tag} className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                                        <span>{property.specs}</span>
                                        <span className="text-indigo-600 font-bold">Подробнее →</span>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </Section>

            {/* AI TOOLS HERO BLOCK - CAROUSEL */}
            <AIHeroCarousel />

            <Section title="Почему выбирают вторичку?">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Shield size={24} />, title: "Юридическая чистота", desc: "Мы проверяем каждый объект по 15 базам перед внесением аванса.", color: "bg-indigo-100 text-indigo-600", link: "/blog/buy-sec-2" },
                        { icon: <MapPin size={24} />, title: "Инфраструктура", desc: "Зеленые дворы, школы и сады с историей — всё уже работает.", color: "bg-purple-100 text-purple-600", link: "/blog/buy-sec-3" },
                        { icon: <FileText size={24} />, title: "Без сюрпризов", desc: "Вы видите, что покупаете: виды из окон, соседей и состояние подъезда.", color: "bg-blue-100 text-blue-600", link: "/blog/buy-sec-1" },
                        { icon: <Handshake size={24} />, title: "Торг", desc: "Используем аргументы о состоянии и рыночной ситуации, чтобы снизить цену.", color: "bg-green-100 text-green-600", link: "/blog/buy-sec-4" },
                        { icon: <Clock size={24} />, title: "Быстрый заезд", desc: "Получите ключи в день сделки и сразу начинайте жить или сдавать.", color: "bg-orange-100 text-orange-600", link: "/blog/buy-sec-1" },
                        { icon: <Hammer size={24} />, title: "Ремонт", desc: "Поможем оценить качество ремонта и найти скрытые дефекты до покупки.", color: "bg-pink-100 text-pink-600", link: "/blog/buy-sec-5" }
                    ].map((item, i) => (
                        <Link key={i} to={item.link} className="block h-full group cursor-pointer">
                            <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                                <div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color} group-hover:bg-black group-hover:text-white transition-colors`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Section>

            <ComparisonBlock items={PAGE_CONTENT.BUY_SECONDARY.comparison} theme="indigo" />

            <Section title="Как мы работаем">
                <ProcessTimeline steps={PAGE_CONTENT.BUY_SECONDARY.timeline} colorTheme="indigo" />
            </Section>

            {/* Packages - Standardized */}
            <Section title="Пакеты услуг">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Юрист", price: "50 000 ₽", feats: ["Проверка объекта", "Составление ДКП", "Сделка в банке"] },
                        { title: "Подбор", price: "2-3%", feats: ["Поиск вариантов", "Торг до 10%", "Полное сопровождение"], popular: true },
                        { title: "Трейд-ин", price: "0 ₽", feats: ["Обмен старой на новую", "Оценка за 1 день", "Быстрый выход"] }
                    ].map((pkg, i) => (
                        <GlassCard key={i} className={`relative flex flex-col hover:scale-[1.02] transition-transform duration-300 ${pkg.popular ? 'border-2 border-indigo-500 shadow-xl' : 'border border-indigo-100'}`}>
                            {pkg.popular && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ХИТ</div>}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                                <div className="text-2xl font-bold text-gray-800">{pkg.price} <span className="text-xs text-gray-400 font-normal">от цены</span></div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {pkg.feats.map(f => (
                                    <li key={f} className="flex gap-3 text-sm text-gray-600 items-center">
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                            <SearchCheck size={12} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                                Выбрать
                            </button>
                        </GlassCard>
                    ))}
                </div>
            </Section>

            <ExpertsSection
                title="Команда вторичного рынка"
                colorTheme="indigo"
            />

            {/* Useful in Blog - Standardized */}
            <Section title="Полезное в блоге">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {RELEVANT_POSTS.map((art, i) => (
                        <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                            <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                            <FileText size={24} />
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                            Статья
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">{art.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                                        {art.excerpt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Section>

            <Section>
                <FAQ items={PAGE_CONTENT.BUY_SECONDARY.faq} />
            </Section>

            <Section id="form" className="pb-32">
                <LeadForm title="Нужна помощь с проверкой?" subtitle="Юрист бесплатно проконсультирует по рискам выбранной квартиры." buttonText="Заказать проверку" />
            </Section>

            <Modal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} title="Подобрать объект">
                <LeadForm embedded={true} />
            </Modal>
        </div>
    );
};

export default BuySecondary;
