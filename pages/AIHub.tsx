
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Calculator, 
  ArrowRight,
  Bot,
  BrainCircuit,
  ShieldCheck,
  Hammer,
  Sun
} from 'lucide-react';

const AI_TOOLS = [
  {
    id: 'desc-gen',
    title: "Генератор описаний",
    desc: "Создайте продающий текст объявления за 1 минуту. AI анализирует фото, распознает преимущества интерьера и находит инфраструктуру рядом.",
    icon: <PenTool size={32} />,
    link: "/ai-generator",
    color: "bg-blue-100 text-blue-600",
    buttonText: "Написать текст",
    targetAudience: "Продавцы"
  },
  {
    id: 'smart-match',
    title: "Умный подбор ЖК",
    desc: "Персональная подборка. Нейросеть анализирует ваш образ жизни, финансы и привычки, чтобы найти идеальное совпадение среди новостроек и вторички.",
    icon: <BrainCircuit size={32} />,
    link: "/ai/smart-match",
    color: "bg-purple-100 text-purple-600",
    buttonText: "Пройти тест",
    targetAudience: "Покупатели"
  },
  {
    id: 'renovation-est',
    title: "AI Смета ремонта",
    desc: "Загрузите фото — получите дизайн-проект и точный расчет стоимости материалов и работ. Идеально для оценки вложений во вторичку.",
    icon: <Hammer size={32} />,
    link: "/ai/renovation-est",
    color: "bg-orange-100 text-orange-600",
    buttonText: "Рассчитать смету",
    targetAudience: "Покупатели / Инвесторы"
  },
  {
    id: 'tenant-check',
    title: "Проверка нанимателя",
    desc: "Проверка физ.лиц по 15 федеральным базам (ФССП, МВД, Суды). Выявляем риски, долги и проблемы с законом до подписания договора.",
    icon: <ShieldCheck size={32} />,
    link: "/ai/tenant-check",
    color: "bg-indigo-100 text-indigo-600",
    buttonText: "Проверить жильца",
    targetAudience: "Арендодатели"
  },
  {
    id: 'eco-scan',
    title: "Эко-сканер",
    desc: "Анализ экологической обстановки района: радиация, качество воздуха, уровень шума. Данные из государственных источников.",
    icon: <Sun size={32} />,
    link: "/ai/eco-scan",
    color: "bg-green-100 text-green-600",
    buttonText: "Проверить район",
    targetAudience: "Покупатели (Семьи)"
  },
  {
    id: 'invest-forecast',
    title: "Инвест-прогноз",
    desc: "Расчет реальной доходности (MIRR) с учетом налогов, ипотеки, простоя и инфляции.",
    icon: <Calculator size={32} />,
    link: "/ai/invest-forecast",
    color: "bg-emerald-100 text-emerald-600",
    buttonText: "Считать доход",
    targetAudience: "Инвесторы"
  }
];

const AIHub: React.FC = () => {
  return (
    <div className="pt-4 xl:pt-20 min-h-screen">
      
      {/* Hero Section */}
      <Section className="text-center relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-white/40 mb-8 shadow-sm">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm font-bold text-gray-800">Технологии Estate AI</span>
         </div>
         <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Интеллект, который <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">работает на вас</span>
         </h1>
         <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Набор нейросетевых инструментов для каждого этапа сделки. Экономьте время, деньги и нервы.
         </p>
      </Section>

      {/* Tools Grid */}
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AI_TOOLS.map((tool) => (
            <Link key={tool.id} to={tool.link} className="block h-full group">
              <GlassCard className="h-full flex flex-col hover:bg-white transition-all hover:shadow-2xl border border-white/60">
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-4 rounded-2xl ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                      {tool.icon}
                   </div>
                   <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {tool.targetAudience}
                   </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{tool.title}</h3>
                <p className="text-gray-500 mb-8 flex-1 leading-relaxed">{tool.desc}</p>
                
                <div className="flex items-center gap-2 font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                   {tool.buttonText} <ArrowRight size={20} />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section className="pb-32">
         <GlassCard className="bg-black text-white p-12 relative overflow-hidden border-none text-center">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                 <Bot size={64} className="mx-auto mb-6 text-gray-400" />
                 <h2 className="text-3xl font-bold mb-4">Нужна помощь с выбором?</h2>
                 <p className="text-gray-400 mb-8 max-w-lg mx-auto">Наш AI-ассистент доступен в чате 24/7. Он поможет подобрать инструмент или ответит на вопросы по недвижимости.</p>
                 <button onClick={() => (document.querySelector('button[aria-label="Chat"]') as HTMLElement)?.click()} className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
                     Открыть чат
                 </button>
             </div>
         </GlassCard>
      </Section>

    </div>
  );
};

export default AIHub;
