
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowRight, PlayCircle, CheckCircle, Smartphone, Star, ArrowUpRight, MapPin, ChevronLeft, ChevronRight, Key, Wallet, Building2, Repeat, PenTool, Percent, Sun, BarChart3, Camera, ShieldCheck, Sparkles, BrainCircuit, Hammer, Calculator, TrendingUp } from 'lucide-react';
import Section from '../components/Section';
import PropertyModal from '../components/PropertyModal';
import QuizModal from '../components/QuizModal';
import LeadForm from '../components/LeadForm';
import FAQ from '../components/FAQ';
import ReviewsSection from '../components/ReviewsSection';
import ComparisonBlock from '../components/ComparisonBlock';
import AIHeroCarousel from '../components/AIHeroCarousel';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import SEO from '../components/SEO';
import { PAGE_CONTENT } from '../services/contentData';
import Modal from '../components/Modal';
import { SchemaMarkup } from '../components/SchemaMarkup';

// --- Mock Data ---
const MOCK_PROPERTIES: Property[] = [
    { id: '1', title: "ЖК 'Футурист'", price: "15.5 млн ₽", image: "https://picsum.photos/1200/800?random=1", location: "Москва, ЦАО", specs: "2-к кв, 65 м²", tags: ["Бизнес", "Парк"] },
    { id: '2', title: "Резиденция Холл", price: "22.1 млн ₽", image: "https://picsum.photos/1200/800?random=2", location: "Санкт-Петербург", specs: "3-к кв, 92 м²", tags: ["Премиум", "Вид"] },
    { id: '3', title: "Квартал Событие", price: "11.2 млн ₽", image: "https://picsum.photos/1200/800?random=3", location: "Казань", specs: "1-к кв, 42 м²", tags: ["Комфорт"] },
    { id: '4', title: "ЖК 'Акватория'", price: "18.9 млн ₽", image: "https://picsum.photos/1200/800?random=4", location: "Сочи", specs: "2-к кв, 58 м²", tags: ["Бизнес", "Море"] },
    { id: '5', title: "ЖК 'Высота'", price: "14.5 млн ₽", image: "https://picsum.photos/1200/800?random=5", location: "Екатеринбург", specs: "2-к кв, 60 м²", tags: ["Центр"] },
];

const Home: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
            }
        };
        fetchProperties();
    }, []);

    // Slider State
    const hotScrollRef = useRef<HTMLDivElement>(null);
    const [currentHotIndex, setCurrentHotIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Create tripled list for infinite loop logic (Memoized to prevent re-renders)
    const extendedHotProperties = useMemo(() => {
        const source = properties.length > 0 ? properties : MOCK_PROPERTIES;
        return [...source, ...source, ...source];
    }, [properties]);

    const realCount = properties.length > 0 ? properties.length : MOCK_PROPERTIES.length;

    // Initial Scroll to Middle Set
    useEffect(() => {
        if (hotScrollRef.current) {
            const w = hotScrollRef.current.clientWidth;
            hotScrollRef.current.scrollLeft = w * realCount; // Start at beginning of 2nd set
            setCurrentHotIndex(0);
        }
    }, [realCount]);

    // Auto Play Logic
    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        if (!isPaused) {
            interval = setInterval(() => {
                scrollNext();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPaused, currentHotIndex]);

    const handleScroll = () => {
        if (hotScrollRef.current) {
            const w = hotScrollRef.current.clientWidth;
            const scrollPos = hotScrollRef.current.scrollLeft;
            const rawIndex = Math.round(scrollPos / w);
            const scrollOffset = scrollPos - (rawIndex * w);

            // Teleport logic: Only jump if we are aligned (not mid-swipe)
            if (Math.abs(scrollOffset) < 5) { // Strict threshold for alignment
                if (rawIndex < realCount) {
                    // Jump forward to middle set
                    hotScrollRef.current.scrollLeft = w * (rawIndex + realCount);
                } else if (rawIndex >= realCount * 2) {
                    // Jump backward to middle set
                    hotScrollRef.current.scrollLeft = w * (rawIndex - realCount);
                }
            }

            // Normalize index for display (0 to realCount-1)
            const normalized = rawIndex % realCount;
            setCurrentHotIndex(normalized);
        }
    };

    const scrollNext = () => {
        if (hotScrollRef.current) {
            const w = hotScrollRef.current.clientWidth;
            hotScrollRef.current.scrollBy({ left: w, behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        if (hotScrollRef.current) {
            const w = hotScrollRef.current.clientWidth;
            hotScrollRef.current.scrollBy({ left: -w, behavior: 'smooth' });
        }
    };

    const scrollToVideo = () => {
        const videoSection = document.getElementById('video-section');
        if (videoSection) {
            videoSection.scrollIntoView({ behavior: 'smooth' });
            setIsVideoPlaying(true);
        }
    };

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Estate AI",
        "image": "https://estate-ai.com/logo.png",
        "description": "Экосистема недвижимости: покупка, продажа, аренда и AI-аналитика.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Пресненская наб., 12",
            "addressLocality": "Москва",
            "addressCountry": "RU"
        },
        "telephone": "+74950000000",
        "priceRange": "$$"
    };

    return (
        <div className="pt-2 xl:pt-20 overflow-hidden">
            <SEO {...PAGE_CONTENT.HOME.seo} />
            <SchemaMarkup schema={schemaData} />

            {/* 1. Hero Section */}
            <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pb-12 md:pb-20">
                <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6 md:space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm animate-fade-in scale-90 md:scale-100">
                        <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse"></span>
                        <span className="text-xs font-bold tracking-wide text-gray-800 uppercase">{PAGE_CONTENT.HOME.hero.badge}</span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tighter text-[#1d1d1f] leading-[0.95] drop-shadow-sm">
                        {PAGE_CONTENT.HOME.hero.title}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium px-4">
                        {PAGE_CONTENT.HOME.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 md:pt-8 w-full px-4">
                        <Link to="/buy-new" className="apple-btn-primary px-8 py-4 rounded-full font-semibold text-lg w-full sm:w-auto text-center">
                            Каталог объектов
                        </Link>
                        <button
                            onClick={scrollToVideo}
                            className="apple-btn-secondary px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <PlayCircle size={20} />
                            Как мы работаем
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Stats Bar */}
            <div className="max-w-5xl mx-auto px-4 -mt-8 md:-mt-12 relative z-20 mb-16 md:mb-24">
                <div className="apple-glass px-6 py-8 md:px-8 md:py-10 grid grid-cols-2 md:flex md:flex-wrap justify-between items-center gap-6 text-center md:text-left">
                    {[
                        { val: "15 лет", label: "На рынке" },
                        { val: "4,200+", label: "Сделок" },
                        { val: "120", label: "ЖК партнеров" },
                        { val: "1.5 млрд", label: "Сэкономлено" }
                    ].map((s, i) => (
                        <div key={i} className="flex-1 min-w-[120px]">
                            <div className="text-2xl md:text-4xl font-bold text-[#1d1d1f] tracking-tight">{s.val}</div>
                            <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Main Directions (COMPACT BUTTONS) */}
            <Section title="Направления работы" subtitle="Полный спектр услуг в едином окне.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Buy New */}
                    <Link to="/buy-new" className="group relative h-44 rounded-[2rem] apple-glass overflow-hidden hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm hover:shadow-xl bg-white/70 backdrop-blur-xl">
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Key size={24} />
                                </div>
                                <div className="p-2 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="text-gray-400 group-hover:text-black transition-colors" size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Новостройки</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">База 500+ ЖК без комиссии</p>
                            </div>
                        </div>
                    </Link>

                    {/* Sell */}
                    <Link to="/sell" className="group relative h-44 rounded-[2rem] apple-glass overflow-hidden hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm hover:shadow-xl bg-white/70 backdrop-blur-xl">
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Wallet size={24} />
                                </div>
                                <div className="p-2 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="text-gray-400 group-hover:text-black transition-colors" size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Продать</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">Оценка и поиск за 14 дней</p>
                            </div>
                        </div>
                    </Link>

                    {/* Buy Resale */}
                    <Link to="/buy-resale" className="group relative h-44 rounded-[2rem] apple-glass overflow-hidden hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm hover:shadow-xl bg-white/70 backdrop-blur-xl">
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Building2 size={24} />
                                </div>
                                <div className="p-2 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="text-gray-400 group-hover:text-purple-600 transition-colors" size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Вторичка</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">Квартиры с проверкой</p>
                            </div>
                        </div>
                    </Link>

                    {/* Rent */}
                    <Link to="/rent-out" className="group relative h-44 rounded-[2rem] apple-glass overflow-hidden hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-sm hover:shadow-xl bg-white/70 backdrop-blur-xl">
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Repeat size={24} />
                                </div>
                                <div className="p-2 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="text-gray-400 group-hover:text-orange-600 transition-colors" size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Аренда</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">Управление и доход</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </Section>

            {/* 4. AI Ecosystem (Carousel) */}
            <AIHeroCarousel />

            <ComparisonBlock items={PAGE_CONTENT.HOME.comparison} theme="blue" />

            {/* 5. Video */}
            <Section id="video-section" title="Почему выбирают нас" subtitle="Прозрачность на каждом этапе.">
                <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] h-[400px] md:h-[600px] group cursor-pointer bg-black w-full transform transition-transform duration-700 hover:scale-[1.01]">
                    {!isVideoPlaying ? (
                        <div onClick={() => setIsVideoPlaying(true)} className="absolute inset-0 w-full h-full">
                            <img src="https://picsum.photos/1600/900?random=1" alt="Video Cover" className="w-full h-full object-cover opacity-70 transition-opacity group-hover:opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 md:w-28 md:h-28 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center pl-1 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 shadow-2xl">
                                    <PlayCircle size={48} className="text-white md:w-16 md:h-16" />
                                </div>
                            </div>
                            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white max-w-xl">
                                <h3 className="text-2xl md:text-4xl font-bold mb-2">Как мы работаем</h3>
                                <p className="text-base md:text-xl opacity-90 font-light">Посмотрите короткое видео о наших процессах</p>
                            </div>
                        </div>
                    ) : (
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </Section>

            {/* 6. Hot Offers (IMMERSIVE SLIDER) */}
            <Section title="Горячие предложения" subtitle="Эксклюзивные варианты этой недели.">
                <div
                    className="relative w-full h-[600px] rounded-[2.5rem] overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Slides Container */}
                    <div
                        ref={hotScrollRef}
                        onScroll={handleScroll}
                        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                    >
                        {extendedHotProperties.map((prop, index) => (
                            <div key={`${prop.id}-${index}`} className="min-w-full w-full h-full flex-shrink-0 snap-center relative">
                                <img src={prop.image} className="w-full h-full object-cover" alt={prop.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Floating Info Card */}
                                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-md w-full">
                                    <div className="apple-glass p-6 md:p-8 bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setSelectedProperty(prop)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">HOT</span>
                                            <ArrowUpRight size={24} className="text-black" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{prop.price}</h3>
                                        <p className="text-lg font-medium text-gray-800 mb-2">{prop.title}</p>
                                        <p className="text-gray-500 text-sm flex items-center gap-1 mb-4"><MapPin size={16} /> {prop.location}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {prop.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-full text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-full text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 right-8 flex gap-2">
                        {MOCK_PROPERTIES.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentHotIndex ? 'bg-white w-8' : 'bg-white/40 w-2'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </Section>

            <ReviewsSection reviews={PAGE_CONTENT.HOME.reviews} />

            <Section className="py-12 md:py-20">
                <FAQ items={PAGE_CONTENT.HOME.faq} />
            </Section>

            <Section className="pb-24 md:pb-32">
                <LeadForm />
            </Section>

            <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
            <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
            <Modal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} title="Оставить заявку">
                <LeadForm embedded={true} />
            </Modal>
        </div>
    );
};

export default Home;
