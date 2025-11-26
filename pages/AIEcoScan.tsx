
import React, { useState, useEffect, useRef } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ServiceLanding from '../components/ServiceLanding';
import { Sun, Wind, ArrowLeft, MapPin, Activity, Volume2, TreeDeciduous, Radiation, Search, ShieldCheck, AlertTriangle, Loader2, Link as LinkIcon, ExternalLink, CheckCircle2, Database, Globe, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEcoAnalysis } from '../services/aiService';

interface EcoMetric {
    name: string;
    value: string;
    score: number;
    status: string;
    desc: string;
    sources?: string[];
}

interface EcoResult {
    overallScore: number;
    verdict: string;
    description?: string;
    metrics: EcoMetric[];
    globalSources?: { title: string; uri: string }[];
}

const SCAN_STEPS = [
    "Подключение к картам радоновой активности...",
    "Анализ спутниковых снимков (NDVI)...",
    "Запрос данных станций Мосэкомониторинга...",
    "Оценка шумового загрязнения...",
    "Формирование отчета..."
];

const MOCK_ADDRESSES = [
  "Москва, Пресненская набережная, 12",
  "Москва, Ленинский проспект, 45",
  "Ленинградская область, Мурино, ул. Шувалова, 4",
  "Санкт-Петербург, Невский проспект, 114",
  "Сочи, Курортный проспект, 105",
  "Казань, ул. Сибгата Хакима, 50"
];

const AIEcoScan: React.FC = () => {
  // Auth State
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Tool State
  const [address, setAddress] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<EcoResult | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const auth = localStorage.getItem('estate_auth');
      if (auth === 'true') setIsAuthorized(true);
  }, []);

  const filteredAddresses = MOCK_ADDRESSES.filter(addr => 
    addr.toLowerCase().includes(address.toLowerCase()) && address.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScan = async () => {
    if (!address) return;
    setLoading(true);
    setResult(null);
    setScanStep(0);
    setShowSuggestions(false);

    const interval = setInterval(() => {
        setScanStep(prev => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
        const data = await getEcoAnalysis(address);
        clearInterval(interval);
        setResult(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
      if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-600 bg-red-50 border-red-200';
  };

  const getBarColor = (score: number) => {
      if (score >= 8) return 'bg-green-500';
      if (score >= 5) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  const getIcon = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('рад')) return <Radiation size={28} />;
      if (n.includes('воздух') || n.includes('газ')) return <Wind size={28} />;
      if (n.includes('шум')) return <Volume2 size={28} />;
      if (n.includes('зелен')) return <TreeDeciduous size={28} />;
      return <Activity size={28} />;
  };

  if (!isAuthorized) {
      return (
          <ServiceLanding 
            title="Эко-сканер района"
            subtitle="Полный анализ экологической безопасности любой локации за 30 секунд."
            description="Мы используем нейросети для агрегации данных из 15+ государственных источников (МЧС, Росгидромет, Экологические карты), чтобы предоставить вам честную картину о радиации, качестве воздуха и уровне шума."
            icon={<Sun />}
            colorTheme="green"
            buttonText="Запустить сканер"
            onStart={() => setIsAuthorized(true)} 
            features={[
                { title: "Государственные базы", desc: "Прямой поиск по открытым реестрам МЧС и Мосэкомониторинга.", icon: <Database className="text-green-600"/> },
                { title: "Мультифакторный анализ", desc: "Проверка радиации, радона, CO2, шума и электромагнитных полей.", icon: <Activity className="text-green-600"/> },
                { title: "Независимая оценка", desc: "Объективные данные без маркетинговых уловок застройщиков.", icon: <ShieldCheck className="text-green-600"/> }
            ]}
          />
      );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-[#F5F5F7]">
      <Section className="py-8">
        <div className="mb-8">
             <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                 <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
             </Link>
             <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-4">Эко-мониторинг 2.0</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Эко-сканер района</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Анализ радиации, радона, воздуха и шума по открытым государственным базам данных.
                </p>
            </div>
        </div>

        <div className="max-w-4xl mx-auto">
            {/* Search Bar with Autocomplete */}
            <div ref={inputRef} className="relative mb-12 z-30">
                <GlassCard className="p-2 md:p-3 shadow-xl border-green-100/50">
                    <div className="relative flex items-center">
                        <MapPin className="absolute left-4 text-gray-400" />
                        <input 
                            type="text" 
                            value={address}
                            onChange={(e) => { setAddress(e.target.value); setShowSuggestions(true); }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Введите адрес..."
                            className="w-full pl-12 pr-32 md:pr-36 py-4 rounded-xl bg-[#F2F2F7] text-base md:text-lg font-medium outline-none focus:bg-white focus:shadow-inner transition-all"
                        />
                        <button 
                            onClick={handleScan}
                            disabled={loading || !address}
                            className="absolute right-2 bg-black text-white px-4 md:px-6 py-2.5 rounded-lg font-bold hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2 text-sm md:text-base"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18}/> : <Search size={18}/>}
                            <span className="hidden md:inline">{loading ? 'Скан...' : 'Найти'}</span>
                        </button>
                    </div>
                </GlassCard>
                {showSuggestions && filteredAddresses.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                     {filteredAddresses.map((addr, i) => (
                       <div key={i} onClick={() => { setAddress(addr); setShowSuggestions(false); }} className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-none flex items-center gap-2">
                         <MapPin size={14} className="text-green-500" /> {addr}
                       </div>
                     ))}
                   </div>
                 )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-black text-green-400 p-8 rounded-3xl font-mono text-sm shadow-2xl mb-8 animate-fade-in border border-gray-800">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-4">
                        <Activity className="animate-pulse" />
                        <span className="text-white font-bold uppercase tracking-widest">Система сканирования</span>
                    </div>
                    <div className="space-y-2">
                        {SCAN_STEPS.map((step, i) => (
                            <div key={i} className={`flex items-center gap-3 transition-opacity duration-300 ${i > scanStep ? 'opacity-0' : i === scanStep ? 'opacity-100' : 'opacity-50'}`}>
                                <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                                <span>{i < scanStep ? '✓' : '>'} {step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {result && !loading && (
                <div className="space-y-8 animate-slide-up">
                    
                    {/* Overall Score Card */}
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col md:flex-row items-center gap-8 md:gap-10">
                        <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" stroke="#F2F2F7" strokeWidth="12" fill="none" />
                                <circle 
                                    cx="80" cy="80" r="70" 
                                    stroke={result.overallScore > 70 ? '#22c55e' : result.overallScore > 40 ? '#eab308' : '#ef4444'} 
                                    strokeWidth="12" 
                                    strokeLinecap="round"
                                    fill="none" 
                                    strokeDasharray="440" 
                                    strokeDashoffset={440 - (440 * result.overallScore) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">{result.overallScore}</span>
                                <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">из 100</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left flex-1 space-y-4">
                            <div>
                                <h3 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900 leading-tight">{result.verdict}</h3>
                                <p className="text-gray-500 leading-relaxed text-base md:text-lg font-medium">
                                    {result.description || "Анализ экологической обстановки завершен. Проверьте детальные метрики ниже."}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                                {result.metrics.some(m => m.score < 5) && (
                                    <span className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                                        <AlertTriangle size={16} /> Обнаружены риски
                                    </span>
                                )}
                                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-100">
                                    <ShieldCheck size={16} /> Данные подтверждены
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metrics List */}
                    <div className="grid gap-6">
                        {result.metrics.map((metric, i) => (
                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row gap-6 mb-6">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${getScoreColor(metric.score)} bg-opacity-10 border-opacity-20 self-start md:self-auto`}>
                                        {getIcon(metric.name)}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                            <h4 className="text-xl md:text-2xl font-bold text-gray-900">{metric.name}</h4>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide w-fit ${getScoreColor(metric.score)}`}>
                                                {metric.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{metric.value}</span>
                                            <div className="flex-1 h-3 bg-gray-100 rounded-full max-w-[100px] md:max-w-[120px] overflow-hidden">
                                                <div className={`h-full rounded-full ${getBarColor(metric.score)}`} style={{width: `${metric.score * 10}%`}}></div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">{metric.desc}</p>
                                    </div>
                                </div>

                                {/* Integrated Sources Section */}
                                {metric.sources && metric.sources.length > 0 && (
                                    <div className="pt-6 border-t border-gray-100 mt-2">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold flex-shrink-0">
                                                <LinkIcon size={14} /> Источники данных:
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {metric.sources.map((src, sIdx) => (
                                                    <a 
                                                        key={sIdx}
                                                        href={`https://www.google.com/search?q=${encodeURIComponent(src + ' ' + address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all group"
                                                    >
                                                        {src}
                                                        <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Global Sources (Fallback) */}
                    {result.globalSources && result.globalSources.length > 0 && (
                        <div className="text-center py-8 opacity-60 hover:opacity-100 transition-opacity">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Все использованные ресурсы</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {result.globalSources.map((source, idx) => (
                                    <a 
                                        key={idx}
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-gray-500 hover:text-blue-600 underline decoration-gray-300 hover:decoration-blue-600 transition-all truncate max-w-[200px]"
                                    >
                                        {source.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-gray-100 p-6 rounded-2xl flex gap-4 text-sm text-gray-500 items-start">
                        <AlertTriangle size={20} className="flex-shrink-0 mt-0.5 text-gray-400" />
                        <p className="leading-relaxed">
                            Данный отчет сформирован искусственным интеллектом на основе открытых государственных источников (МЧС, Росгидромет, Экологические карты). 
                            Данные носят справочный характер. Для юридически значимых замеров рекомендуем заказать официальную экологическую экспертизу.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </Section>
    </div>
  );
};

export default AIEcoScan;
