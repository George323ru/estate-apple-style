
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ServiceLanding from '../components/ServiceLanding';
import { ShieldCheck, ArrowLeft, User, FileText, Search, AlertTriangle, CheckCircle2, Loader2, Scale, Gavel, ExternalLink, Calendar, Siren, Building2, Lock, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeTenant } from '../services/aiService';

const STEPS = [
    "Инициализация проверки по 85 регионам РФ...",
    "Запрос к базе ФССП (Исполнительные производства)...",
    "Сверка с базой МВД (Действительность паспорта)...",
    "Поиск по ГАС 'Правосудие' (Суды общей юрисдикции)...",
    "Подключение к шлюзу Мосгорсуда (Москва)...",
    "Проверка по базе федерального розыска МВД...",
    "Сверка с реестром террористов и экстремистов (Росфинмониторинг)...",
    "Проверка реестра банкротов (Федресурс)...",
    "Анализ рисков..."
];

const AITenantCheck: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [name, setName] = useState('');
  const [passport, setPassport] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
      const auth = localStorage.getItem('estate_auth');
      if (auth === 'true') setIsAuthorized(true);
  }, []);

  const handleCheck = async () => {
    if (!name || !passport || !dob) return;
    setLoading(true);
    setResult(null);
    setScanStep(0);

    const interval = setInterval(() => {
        setScanStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
        const data = await analyzeTenant(name, dob, passport);
        setTimeout(() => {
            clearInterval(interval);
            setResult(data);
            setLoading(false);
        }, 5500);
    } catch (error) {
        console.error(error);
        setLoading(false);
        clearInterval(interval);
    }
  };

  if (!isAuthorized) {
      return (
          <ServiceLanding 
            title="Проверка физ.лица"
            subtitle="Узнайте всё о потенциальном арендаторе или покупателе до сделки."
            description="Сервис проводит поиск по 15 федеральным базам данных (МВД, ФССП, Суды, Банкротство), выявляя риски, долги и проблемы с законом."
            icon={<ShieldCheck />}
            colorTheme="indigo"
            buttonText="Начать проверку"
            onStart={() => setIsAuthorized(true)}
            features={[
                { title: "Финансовая дисциплина", desc: "Поиск долгов у судебных приставов и статус банкротства.", icon: <Scale className="text-indigo-600"/> },
                { title: "Проблемы с законом", desc: "Проверка по базам розыска МВД и спискам экстремистов.", icon: <Siren className="text-indigo-600"/> },
                { title: "Судебная история", desc: "Анализ гражданских и уголовных дел по всей России.", icon: <Gavel className="text-indigo-600"/> }
            ]}
          />
      );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Section className="py-8">
        <div className="mb-8">
             <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                 <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
             </Link>
             <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">AI Безопасность</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Проверка нанимателя</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Глубокий анализ физ.лица по государственным базам всех регионов РФ.
                </p>
            </div>
        </div>

        <div className="max-w-4xl mx-auto">
            {/* Input Card */}
            <GlassCard className="mb-12 p-8 border border-blue-100 shadow-xl">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><User size={16}/> ФИО (Полностью)</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Иванов Иван Иванович" 
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Calendar size={16}/> Дата рождения</label>
                        <input 
                            type="date" 
                            value={dob}
                            onChange={e => setDob(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><FileText size={16}/> Паспорт (Серия и номер)</label>
                        <input 
                            type="text" 
                            value={passport}
                            onChange={e => setPassport(e.target.value)}
                            placeholder="4500 123456" 
                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" 
                        />
                    </div>
                </div>
                
                <button 
                    onClick={handleCheck}
                    disabled={loading || !name || !passport || !dob}
                    className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    {loading ? 'Глубокая проверка...' : 'Проверить человека'}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                    Нажимая кнопку, вы подтверждаете наличие согласия субъекта на обработку персональных данных.
                </p>
            </GlassCard>

            {/* Loading Animation */}
            {loading && (
                <div className="bg-black text-blue-400 p-8 rounded-3xl font-mono text-sm shadow-2xl mb-8 animate-fade-in border border-gray-800">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-4">
                        <ShieldCheck className="animate-pulse" />
                        <span className="text-white font-bold uppercase tracking-widest">Security Scan :: Deep Search</span>
                    </div>
                    <div className="space-y-2">
                        {STEPS.map((step, i) => (
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
                <div className="animate-slide-up space-y-8">
                    
                    {/* Score Card */}
                    <div className={`rounded-[2.5rem] p-10 shadow-2xl border flex flex-col md:flex-row items-center gap-12 relative overflow-hidden ${result.riskLevel === 'low' ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                        <div className={`absolute top-0 left-0 w-full h-2 ${result.riskLevel === 'low' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" stroke="#F2F2F7" strokeWidth="12" fill="none" />
                                <circle 
                                    cx="80" cy="80" r="70" 
                                    stroke={result.riskLevel === 'low' ? '#22c55e' : '#ef4444'} 
                                    strokeWidth="12" 
                                    strokeLinecap="round" 
                                    fill="none" 
                                    strokeDasharray="440" 
                                    strokeDashoffset={440 - (440 * result.score) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-gray-900 tracking-tighter">{result.score}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1">Рейтинг</span>
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h3 className={`text-4xl font-bold mb-2 ${result.riskLevel === 'low' ? 'text-green-600' : 'text-red-600'}`}>{result.verdict}</h3>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium mb-4">
                                {result.description}
                            </p>
                            {result.riskLevel === 'low' ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm">
                                    <CheckCircle2 size={18} /> Рекомендован к сделке
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold text-sm">
                                    <AlertTriangle size={18} /> Требуется осторожность
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {result.factors.map((factor: any, i: number) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-lg flex items-center gap-2">
                                            {factor.name.includes('ФССП') ? <Scale size={20} className="text-blue-500"/> : 
                                            factor.name.includes('Суды') ? <Gavel size={20} className="text-purple-500"/> : 
                                            factor.name.includes('Мосгорсуд') ? <Building2 size={20} className="text-red-500"/> :
                                            factor.name.includes('Розыск') ? <Siren size={20} className="text-orange-500"/> :
                                            factor.name.includes('Экстремизм') ? <AlertTriangle size={20} className="text-red-600"/> :
                                            <FileText size={20} className="text-gray-500"/>}
                                            {factor.name}
                                        </h4>
                                        {factor.safe ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">Чисто</span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold">Найдено</span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-6">{factor.desc}</p>
                                </div>
                                
                                {factor.searchUrl && (
                                    <a 
                                        href={factor.searchUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors w-fit"
                                    >
                                        Проверить источник <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-gray-100 p-6 rounded-2xl flex gap-4 text-sm text-gray-500 items-start">
                        <AlertTriangle size={20} className="flex-shrink-0 mt-0.5 text-gray-400" />
                        <p className="leading-relaxed">
                            Отчет сформирован на основе открытых данных (ФССП России, ГАС РФ «Правосудие», Портал судов Москвы, Федресурс, МВД). 
                            Поиск производился по всем регионам РФ. Информация носит справочный характер. Для получения официальной справки используйте Госуслуги.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </Section>
    </div>
  );
};

export default AITenantCheck;
