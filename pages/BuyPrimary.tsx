
import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import PropertyModal from '../components/PropertyModal';
import LeadForm from '../components/LeadForm';
import SEO from '../components/SEO';
import ComparisonBlock from '../components/ComparisonBlock';
import ExpertsSection from '../components/ExpertsSection';
import ProcessTimeline from '../components/ProcessTimeline';
import FAQ from '../components/FAQ';
import AIHeroCarousel from '../components/AIHeroCarousel';
import { Property } from '../types';
import { PAGE_CONTENT } from '../services/contentData';
import { Maximize, Coins, BrainCircuit, Ruler, ShieldCheck, Search, MapPin, ChevronDown, ArrowRight, FileText, TrendingUp, Sun, Leaf, Layout, DollarSign, Sparkles, Map, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../services/blogData';
import { SchemaMarkup } from '../components/SchemaMarkup';
import Modal from '../components/Modal';

// --- MOCK DATA ---
const MOCK_PROPERTIES: Property[] = [
    { id: 'p1', title: "ЖК 'Футурист'", price: "15.5 млн ₽", image: "https://picsum.photos/600/400?random=1", location: "Москва, ЦАО", specs: "2-к кв, 65 м²", tags: ["Бизнес", "Парк"], type: 'apartment', area: 65, priceVal: 15.5, district: 'ЦАО', city: 'Москва' },
    { id: 'p2', title: "ЖК 'Символ'", price: "12.1 млн ₽", image: "https://picsum.photos/600/400?random=2", location: "Москва, ЮВАО", specs: "1-к кв, 40 м²", tags: ["Комфорт+", "Метро"], type: 'apartment', area: 40, priceVal: 12.1, district: 'ЮВАО', city: 'Москва' },
    { id: 'p3', title: "Вилла 'Park Hill'", price: "45.0 млн ₽", image: "https://picsum.photos/600/400?random=3", location: "Подмосковье, Барвиха", specs: "Дом 250 м²", tags: ["Премиум", "Лес"], type: 'house', area: 250, plotArea: 12, priceVal: 45, district: 'Одинцовский', city: 'Москва' },
    { id: 'p4', title: "Офис в Сити", price: "80.0 млн ₽", image: "https://picsum.photos/600/400?random=4", location: "Москва, Сити", specs: "120 м²", tags: ["Бизнес", "Вид"], type: 'commercial', area: 120, priceVal: 80, floor: 35, district: 'ЦАО', city: 'Москва' },
    { id: 'p5', title: "ЖК 'Морской'", price: "18.9 млн ₽", image: "https://picsum.photos/600/400?random=5", location: "Сочи, Центр", specs: "2-к кв, 58 м²", tags: ["Бизнес", "Море"], type: 'apartment', area: 58, priceVal: 18.9, district: 'Центральный', city: 'Сочи' },
];

const CITIES = ["Москва", "Санкт-Петербург", "Сочи", "Казань", "Екатеринбург"];
const DISTRICTS: Record<string, string[]> = {
    "Москва": ["ЦАО", "ЗАО", "ЮЗАО", "САО", "СВАО", "ЮАО", "ЮВАО", "ВАО", "СЗАО", "Новая Москва", "Одинцовский"],
    "Санкт-Петербург": ["Центральный", "Петроградский", "Василеостровский", "Приморский", "Московский"],
    "Сочи": ["Центральный", "Адлерский", "Хостинский", "Лазаревский"],
    "Казань": ["Вахитовский", "Ново-Савиновский", "Приволжский"],
    "Екатеринбург": ["Центр", "Уралмаш", "Академический"]
};

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('buy-new-')).slice(0, 6);

const BuyPrimary: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch properties from VP
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { fetchWpEstates } = await import('../services/wpApi');
                const data = await fetchWpEstates();
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
                // Fallback to mock if API fails
                setProperties(MOCK_PROPERTIES);
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
        const source = properties.length > 0 ? properties : MOCK_PROPERTIES;
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

    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState<string | null>(null);

    // Monitor for messages from the iframe (errors, height changes, etc)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin.includes('vseprodam.ru')) {
                console.log('🤖 [Iframe Info] Message from catalog:', event.data);
            }
        };

        window.addEventListener('message', handleMessage);

        // Timeout to detect if the iframe fails to load in a reasonable time
        const timeout = setTimeout(() => {
            if (!iframeLoaded) {
                console.warn('🤖 [Iframe Warning] Catalog is taking too long to load.');
            }
        }, 8000);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeout);
        };
    }, [iframeLoaded]);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Подбор новостройки",
        "description": PAGE_CONTENT.BUY_PRIMARY.seo.description,
        "brand": {
            "@type": "Brand",
            "name": "Estate AI"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "RUB",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <div className="pt-24 min-h-screen">
            <SEO
                title="Купить новостройку в Москве | Цены от застройщика | Estate AI"
                description={PAGE_CONTENT.BUY_PRIMARY.seo.description}
                keywords={PAGE_CONTENT.BUY_PRIMARY.seo.keywords}
            />
            <SchemaMarkup schema={schemaData} />

            <Section className="py-8">
                <div className="mb-8 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">{PAGE_CONTENT.BUY_PRIMARY.hero.badge}</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{PAGE_CONTENT.BUY_PRIMARY.hero.title}</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                        {PAGE_CONTENT.BUY_PRIMARY.hero.subtitle}
                    </p>
                    {/* HEADER CONVERSION BUTTON - SERVICE */}
                    <button
                        onClick={() => setIsLeadFormOpen(true)}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-lg"
                    >
                        <Search size={20} />
                        Подобрать объект
                    </button>
                </div>

                {/* CATALOG IFRAME */}
                <div className="w-full overflow-hidden rounded-2xl mb-12 min-h-[500px] relative bg-white border border-gray-100 shadow-sm">
                    {!iframeLoaded && !iframeError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                                <div className="text-center">
                                    <p className="text-gray-900 font-bold">Загрузка каталога новостроек...</p>
                                    <p className="text-gray-500 text-sm">Подключаемся к базе данных застройщиков</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {iframeError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20 p-8 text-center">
                            <div className="max-w-md">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                    <Shield size={32} />
                                </div>
                                <p className="text-red-600 font-bold text-lg mb-2">Каталог временно недоступен</p>
                                <p className="text-gray-600 text-sm mb-6">
                                    {iframeError}.
                                    Попробуйте обновить страницу или зайти позже.
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg transition-colors"
                                >
                                    Обновить страницу
                                </button>
                            </div>
                        </div>
                    )}

                    <iframe
                        src="https://novostroiki.vseprodam.ru/catalog/?isFrame=true&frameListSize=4"
                        width="100%"
                        height="2700"
                        frameBorder="0"
                        scrolling="no"
                        title="Catalog"
                        onLoad={(e) => {
                            console.log('🤖 [Iframe Success] Catalog loaded event fired');
                            setIframeLoaded(true);
                        }}
                    />
                </div>

                {/* OLD CONTENT HIDDEN */}
                {false && (
                    <>
                        {/* --- FILTERS --- */}
                        {/* Mobile: relative (scrolls). Tablet/Desktop (md+): sticky (fixes) */}
                        <GlassCard className="mb-12 relative md:sticky md:top-24 z-30 p-6 border border-blue-100 shadow-xl bg-white/90 backdrop-blur-xl">
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
                                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-200"
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
                                            className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-200"
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
                                            placeholder="ЖК, метро или улица..."
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
                                                {property.type === 'apartment' ? 'Новостройка' : property.type === 'house' ? 'Дом' : 'Коммерция'}
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
                                                <span className="text-blue-600 font-bold">Подробнее →</span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                            ))}
                        </div>

                        {filteredProperties.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-600">Объектов не найдено</h3>
                                <p className="text-gray-400 mt-2">Попробуйте изменить параметры фильтра.</p>
                            </div>
                        )}
                    </>
                )}
            </Section>

            <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />

            {/* AI TOOLS HERO BLOCK - CAROUSEL */}
            <AIHeroCarousel />

            <Section title="Почему выбирают новостройки?">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <TrendingUp size={24} />, title: "Инвестиции", desc: "Покупка на этапе котлована — классическая инвестиция с высоким потенциалом роста.", color: "bg-blue-100 text-blue-600", link: "/blog/buy-new-3" },
                        { icon: <Layout size={24} />, title: "Планировки", desc: "Евроформат, мастер-спальни и постирочные. Современные стандарты жизни.", color: "bg-purple-100 text-purple-600", link: "/blog/buy-new-1" },
                        { icon: <DollarSign size={24} />, title: "Ипотека", desc: "Госпрограммы и субсидированные ставки от 0.1% делают платеж комфортным.", color: "bg-green-100 text-green-600", link: "/blog/buy-new-2" },
                        { icon: <Map size={24} />, title: "Инфраструктура", desc: "Современные ЖК строятся по принципу 'город в городе' со школами и парками.", color: "bg-orange-100 text-orange-600", link: "/blog/buy-new-4" },
                        { icon: <Shield size={24} />, title: "Безопасность", desc: "Эскроу-счета гарантируют сохранность ваших средств до получения ключей.", color: "bg-indigo-100 text-indigo-600", link: "/blog/buy-new-5" },
                        { icon: <Clock size={24} />, title: "Рассрочка", desc: "Гибкие условия оплаты от застройщиков: платите частями без переплат.", color: "bg-pink-100 text-pink-600", link: "/blog/buy-new-6" }
                    ].map((item, i) => (
                        <Link key={i} to={item.link} className="block h-full group cursor-pointer">
                            <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                                <div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color} group-hover:bg-black group-hover:text-white transition-colors`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Section>

            <ComparisonBlock items={PAGE_CONTENT.BUY_PRIMARY.comparison} theme="blue" />

            {/* Process Timeline */}
            <Section title="Как мы работаем">
                <ProcessTimeline steps={PAGE_CONTENT.BUY_PRIMARY.timeline} colorTheme="blue" />
            </Section>

            {/* Packages - Standardized */}
            <Section title="Пакеты услуг">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Лайт", price: "0 ₽", feats: ["Подбор вариантов", "Экскурсии", "Бронирование"] },
                        { title: "Под ключ", price: "0 ₽", feats: ["Все из Лайт", "Ипотека", "Юр. сопровождение", "Приемка"], popular: true },
                        { title: "Инвестор", price: "0 ₽", feats: ["Стратегия выхода", "Расчет доходности", "Управление"] }
                    ].map((pkg, i) => (
                        <GlassCard key={i} className={`relative flex flex-col hover:scale-[1.02] transition-transform duration-300 ${pkg.popular ? 'border-2 border-blue-500 shadow-xl' : 'border border-blue-100'}`}>
                            {pkg.popular && <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ХИТ</div>}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                                <div className="text-3xl font-bold text-gray-900">{pkg.price}</div>
                                <div className="text-xs text-gray-400 font-medium mt-1">оплачивает застройщик</div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {pkg.feats.map(f => (
                                    <li key={f} className="flex gap-3 text-sm text-gray-600 items-center">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                            <ShieldCheck size={12} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                                Выбрать
                            </button>
                        </GlassCard>
                    ))}
                </div>
            </Section>

            <ExpertsSection
                title="Эксперты по новостройкам"
                colorTheme="blue"
                experts={[
                    { name: "Ольга С.", role: "Руководитель отдела новостроек", exp: "12 лет опыта", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
                    { name: "Максим Д.", role: "Эксперт по инвестициям", exp: "7 лет опыта", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" },
                    { name: "Ирина К.", role: "Ипотечный брокер", exp: "1000+ одобрений", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80" }
                ]}
            />

            {/* Useful in Blog - COMPACT 3 COLUMNS */}
            <Section title="Полезное в блоге">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {RELEVANT_POSTS.map((art, i) => (
                        <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                            <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                                            <FileText size={24} />
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                            Статья
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{art.title}</h3>
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
                <FAQ items={PAGE_CONTENT.BUY_PRIMARY.faq} />
            </Section>

            <Section id="form" className="pb-32">
                <LeadForm title="Не нашли нужный вариант?" subtitle="Оставьте заявку, мы подберем из закрытой базы (2500+ объектов)." buttonText="Подобрать квартиру" />
            </Section>

            <Modal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} title="Подобрать объект">
                <LeadForm embedded={true} />
            </Modal>
        </div>
    );
};

export default BuyPrimary;
