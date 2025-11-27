
import React, { useState } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';
import ReviewsSection from '../components/ReviewsSection';
import ComparisonBlock from '../components/ComparisonBlock';
import ExpertsSection from '../components/ExpertsSection';
import ProcessTimeline from '../components/ProcessTimeline';
import AIHeroCarousel from '../components/AIHeroCarousel';
import { Link } from 'react-router-dom';
import { 
  Zap, BarChart3, ArrowRight, CheckCircle, FileText, PenTool, Sparkles, Wand2, Camera, TrendingUp, Image, Edit3, MapPin, Box, Package, Target, Coins, Hammer, Calculator, MessageCircle, Scale, ShieldCheck
} from 'lucide-react';
import { PAGE_CONTENT } from '../services/contentData';
import { BLOG_POSTS } from '../services/blogData';
import { SchemaMarkup } from '../components/SchemaMarkup';
import Modal from '../components/Modal';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('sell-')).slice(0, 6);

const Sell: React.FC = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Продажа недвижимости",
    "description": PAGE_CONTENT.SELL.seo.description,
    "provider": {
        "@type": "RealEstateAgent",
        "name": "Estate AI"
    },
    "areaServed": "RU"
  };

  return (
    <div className="pt-4 xl:pt-20">
      <SEO 
        title="Продать квартиру в Москве | Оценка и Хоумстейджинг | Estate AI" 
        description={PAGE_CONTENT.SELL.seo.description}
        keywords={PAGE_CONTENT.SELL.seo.keywords}
      />
      <SchemaMarkup schema={schemaData} />

      {/* 1. Hero Section */}
      <Section className="text-center relative min-h-[70vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
             <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6 border border-blue-100">
            {PAGE_CONTENT.SELL.hero.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            {PAGE_CONTENT.SELL.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {PAGE_CONTENT.SELL.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* HEADER CONVERSION BUTTON - SERVICE */}
            <button 
                onClick={() => setIsLeadFormOpen(true)}
                className="px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-lg flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Оставить заявку
            </button>
          </div>
        </div>
      </Section>

      {/* 2. Stats Block */}
      <Section className="bg-white/50 backdrop-blur-sm rounded-[3rem] my-8">
         <div className="max-w-4xl mx-auto text-center py-12">
             <BarChart3 size={48} className="mx-auto text-blue-600 mb-4" />
             <h2 className="text-3xl font-bold mb-6">Честная оценка стоимости</h2>
             <div className="grid md:grid-cols-3 gap-8 text-left">
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-blue-600 mb-2">24ч</div>
                     <p className="text-gray-500 font-medium">Время на полную оценку</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-blue-600 mb-2">±2%</div>
                     <p className="text-gray-500 font-medium">Точность прогноза цены</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-blue-600 mb-2">0₽</div>
                     <p className="text-gray-500 font-medium">Стоимость выезда эксперта</p>
                 </div>
             </div>
         </div>
      </Section>

      <ComparisonBlock items={PAGE_CONTENT.SELL.comparison} theme="purple" />

      {/* Why Choose Us for Selling */}
      <Section title="Почему выбирают нас?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: <BarChart3 size={24} />, title: "Оценка AI", desc: "Big Data против интуиции. Алгоритмы точнее риэлторов определяют рыночную цену.", color: "bg-purple-100 text-purple-600", link: "/blog/sell-1" },
                { icon: <Sparkles size={24} />, title: "Упаковка", desc: "Хоумстейджинг — это не ремонт, а магия упаковки, которая продает на миллион дороже.", color: "bg-pink-100 text-pink-600", link: "/blog/sell-2" },
                { icon: <TrendingUp size={24} />, title: "Маркетинг", desc: "Секреты мощного продвижения: где рекламировать, чтобы найти покупателя за неделю.", color: "bg-blue-100 text-blue-600", link: "/blog/sell-3" },
                { icon: <Scale size={24} />, title: "Налоги", desc: "Поможем законно оптимизировать налоги при продаже недвижимости.", color: "bg-green-100 text-green-600", link: "/blog/sell-4" },
                { icon: <FileText size={24} />, title: "Документы", desc: "Соберем полный пакет справок и выписок, чтобы сделка прошла без задержек.", color: "bg-indigo-100 text-indigo-600", link: "/blog/sell-5" },
                { icon: <ShieldCheck size={24} />, title: "Безопасность", desc: "Контролируем расчеты через аккредитив или ячейку. Деньги точно будут у вас.", color: "bg-orange-100 text-orange-600", link: "/blog/sell-6" }
            ].map((item, i) => (
                <Link key={i} to={item.link} className="block h-full group cursor-pointer">
                    <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color} group-hover:bg-black group-hover:text-white transition-colors`}>
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </Section>

      {/* 4. Timeline */}
      <Section title="Как мы работаем">
          <ProcessTimeline steps={PAGE_CONTENT.SELL.timeline} colorTheme="purple" />
      </Section>

      {/* AI TOOLS HERO BLOCK - CAROUSEL */}
      <AIHeroCarousel />

      {/* Packages - Standardized */}
      <Section title="Пакеты услуг">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  { title: "Срочный выкуп", price: "-10%", feats: ["Деньги за 3 дня", "Без показов", "Любое состояние"] },
                  { title: "Стандарт", price: "2-3%", feats: ["Оценка", "Маркетинг", "Показы", "Сделка"], popular: true },
                  { title: "Трейд-ин", price: "Индив.", feats: ["Обмен на новостройку", "Фиксация цены", "Переезд сразу"] }
              ].map((pkg, i) => (
                  <GlassCard key={i} className={`relative flex flex-col hover:scale-[1.02] transition-transform duration-300 ${pkg.popular ? 'border-2 border-purple-500 shadow-xl' : 'border border-purple-100'}`}>
                      {pkg.popular && <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ХИТ</div>}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                        <div className="text-2xl font-bold text-gray-800">{pkg.price} <span className="text-xs text-gray-400 font-normal">от цены</span></div>
                      </div>
                      <ul className="space-y-3 mb-8 flex-grow">
                          {pkg.feats.map(f => (
                              <li key={f} className="flex gap-3 text-sm text-gray-600 items-center">
                                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                     <CheckCircle size={12}/> 
                                  </div>
                                  {f}
                              </li>
                          ))}
                      </ul>
                      <button className={`w-full py-4 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                          Выбрать
                      </button>
                  </GlassCard>
              ))}
          </div>
      </Section>

      <ExpertsSection title="Команда продаж" colorTheme="purple" />

      {/* Useful in Blog - Standardized */}
      <Section title="Полезное в блоге">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                                    <FileText size={24} />
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                    Статья
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">{art.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                                {art.excerpt}
                            </p>
                        </div>
                    </div>
                  </Link>
              ))}
          </div>
      </Section>
      
      <ReviewsSection reviews={PAGE_CONTENT.SELL.reviews} />

      <Section>
        <FAQ items={PAGE_CONTENT.SELL.faq} />
      </Section>

      <Section id="form" className="pb-32">
          <LeadForm title="Запишитесь на бесплатную оценку" subtitle="Узнайте реальную стоимость вашей квартиры уже сегодня." buttonText="Вызвать оценщика" />
      </Section>

      <Modal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} title="Оставить заявку">
        <LeadForm embedded={true} />
      </Modal>
    </div>
  );
};

export default Sell;
