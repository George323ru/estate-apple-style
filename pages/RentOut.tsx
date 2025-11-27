
import React, { useState } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import FAQ from '../components/FAQ';
import ReviewsSection from '../components/ReviewsSection';
import SEO from '../components/SEO';
import Modal from '../components/Modal';
import ComparisonBlock from '../components/ComparisonBlock';
import ExpertsSection from '../components/ExpertsSection';
import ProcessTimeline from '../components/ProcessTimeline';
import AIHeroCarousel from '../components/AIHeroCarousel';
import { CheckCircle2, FileText, ArrowRight, ShieldCheck, ScanEye, UserCheck, CreditCard, UserX, Search, Gavel, Siren, Wallet, Smartphone, TrendingUp, Hammer, MessageCircle, Shield, Sparkles, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGE_CONTENT } from '../services/contentData';
import { BLOG_POSTS } from '../services/blogData';
import { SchemaMarkup } from '../components/SchemaMarkup';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('rent-')).slice(0, 6);

const RentOut: React.FC = () => {
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState('');
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const openTariffModal = (tariff: string) => {
      setSelectedTariff(tariff);
      setIsTariffModalOpen(true);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Сдача и управление недвижимостью",
    "description": PAGE_CONTENT.RENT.seo.description,
    "provider": {
        "@type": "RealEstateAgent",
        "name": "Estate AI"
    },
    "areaServed": "RU"
  };

  return (
    <div className="pt-4 xl:pt-20">
      <SEO 
        title="Сдать квартиру в Москве | Управление и Страховка | Estate AI" 
        description={PAGE_CONTENT.RENT.seo.description}
        keywords={PAGE_CONTENT.RENT.seo.keywords}
      />
      <SchemaMarkup schema={schemaData} />
      
      <Section className="text-center relative min-h-[70vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-10 right-10 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-float"></div>
             <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-green-50 text-green-600 font-bold text-sm mb-6 border border-green-100 shadow-sm">
            {PAGE_CONTENT.RENT.hero.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            {PAGE_CONTENT.RENT.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
             {PAGE_CONTENT.RENT.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* HEADER CONVERSION BUTTON - SERVICE */}
            <button 
                onClick={() => setIsLeadFormOpen(true)}
                className="px-10 py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-lg flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Оставить заявку
            </button>
          </div>
        </div>
      </Section>

      {/* Stats Block */}
      <Section className="bg-white/50 backdrop-blur-sm rounded-[3rem] my-8">
         <div className="max-w-5xl mx-auto text-center py-12">
             <h2 className="text-3xl font-bold mb-8">Почему собственники выбирают нас</h2>
             <div className="grid md:grid-cols-4 gap-8 text-left">
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-green-600 mb-2">3 дня</div>
                     <p className="text-gray-500 font-medium text-sm">Средний срок поиска жильца</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
                     <p className="text-gray-500 font-medium text-sm">Комиссия при простое</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-green-600 mb-2">1.5 млн</div>
                     <p className="text-gray-500 font-medium text-sm">Страховое покрытие имущества</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                     <p className="text-gray-500 font-medium text-sm">Гарантия оплаты вовремя</p>
                 </div>
             </div>
         </div>
      </Section>

      <ComparisonBlock items={PAGE_CONTENT.RENT.comparison} theme="green" title="В чем разница?" />

      {/* Why Choose Us for Renting */}
      <Section title="Почему мы?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: <Wallet size={24} />, title: "Пассивный доход", desc: "Сдача через УК освобождает время. Мы берем на себя все заботы.", color: "bg-green-100 text-green-600", link: "/blog/rent-1" },
                { icon: <Shield size={24} />, title: "Страховка", desc: "Полная защита от ущерба, пожара и потопа на 1.5 млн рублей.", color: "bg-blue-100 text-blue-600", link: "/blog/rent-2" },
                { icon: <UserCheck size={24} />, title: "Проверка", desc: "Фейс-контроль жильцов по базам МВД и ФССП. Только надежные арендаторы.", color: "bg-indigo-100 text-indigo-600", link: "/blog/rent-3" },
                { icon: <FileText size={24} />, title: "Договор", desc: "Грамотно составленный договор защищает вас от неплатежей и порчи имущества.", color: "bg-purple-100 text-purple-600", link: "/blog/rent-4" },
                { icon: <ClipboardList size={24} />, title: "Опись", desc: "Фиксируем каждый предмет мебели и техники, чтобы избежать споров при выезде.", color: "bg-orange-100 text-orange-600", link: "/blog/rent-5" },
                { icon: <Gavel size={24} />, title: "Решение споров", desc: "Берем на себя переговоры с соседями и жильцами в конфликтных ситуациях.", color: "bg-red-100 text-red-600", link: "/blog/rent-6" }
            ].map((item, i) => (
                <Link key={i} to={item.link} className="block h-full group cursor-pointer">
                    <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color} group-hover:bg-black group-hover:text-white transition-colors`}>
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </Section>

      <Section title="Как мы работаем">
          <ProcessTimeline steps={PAGE_CONTENT.RENT.timeline} colorTheme="green" />
      </Section>

      {/* AI TOOLS HERO BLOCK - CAROUSEL */}
      <AIHeroCarousel />

      {/* Management Packages - Standardized */}
      <Section title="Тарифы">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
               {/* Basic Card */}
               <GlassCard className="p-8 flex flex-col h-full hover:scale-[1.01] transition-all duration-300 border border-green-100">
                   <h3 className="text-2xl font-bold mb-2 text-gray-900">Просто сдать</h3>
                   <div className="text-4xl font-bold mb-4 tracking-tight">50% <span className="text-sm font-normal text-gray-500 align-middle">от 1 месяца (разово)</span></div>
                   <div className="space-y-4 mb-8 flex-grow text-gray-600">
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Профессиональная фотосъемка и 3D-тур</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Размещение на 20+ площадках</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Проверка арендаторов (БКИ, МВД)</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Подготовка договора аренды</span></div>
                   </div>
                   <button 
                        onClick={() => openTariffModal('Просто сдать')}
                        className="w-full py-4 rounded-2xl font-bold mt-auto bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                   >
                       Выбрать тариф
                   </button>
               </GlassCard>

               {/* Popular Card */}
               <GlassCard className="p-8 flex flex-col h-full relative transform md:scale-105 z-10 shadow-2xl border-2 border-green-500">
                   <div className="absolute top-6 right-6">
                       <span className="bg-green-500 text-white px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider shadow-md">Популярно</span>
                   </div>
                   <h3 className="text-2xl font-bold mb-2 text-gray-900">Доверительное управление</h3>
                   <div className="text-4xl font-bold mb-4 tracking-tight">10% <span className="text-sm font-normal text-gray-500 align-middle">в месяц</span></div>
                   <div className="space-y-4 mb-8 flex-grow text-gray-600">
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span className="font-bold text-gray-900">Всё из тарифа "Просто сдать"</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Страхование имущества на 1.5 млн ₽</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Решение бытовых вопросов 24/7</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Контроль оплат и счетчиков</span></div>
                       <div className="flex gap-3 items-start"><CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> <span>Клининг при смене жильцов</span></div>
                   </div>
                   <button 
                        onClick={() => openTariffModal('Доверительное управление')}
                        className="w-full py-4 rounded-2xl font-bold mt-auto bg-green-600 hover:bg-green-700 text-white shadow-lg transition-colors"
                   >
                       Выбрать тариф
                   </button>
               </GlassCard>
          </div>
      </Section>

      <ExpertsSection title="Управляющие объектами" colorTheme="green" />

      {/* Useful in Blog - Standardized */}
      <Section title="Полезное в блоге">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                                    <FileText size={24} />
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                    Статья
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">{art.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                                {art.excerpt}
                            </p>
                        </div>
                    </div>
                  </Link>
              ))}
          </div>
      </Section>

      <ReviewsSection reviews={PAGE_CONTENT.RENT.reviews} title="Отзывы собственников" />

      <Section>
          <FAQ items={PAGE_CONTENT.RENT.faq} title="Вопросы собственников" />
      </Section>

      <Section id="form" className="pb-32">
          <LeadForm title="Сдать квартиру" subtitle="Бесплатная оценка арендной ставки и консультация." buttonText="Рассчитать доход" />
      </Section>

      <Modal isOpen={isTariffModalOpen} onClose={() => setIsTariffModalOpen(false)} title={selectedTariff}>
          <LeadForm title="Оставьте заявку" subtitle={`Менеджер свяжется для обсуждения условий по тарифу "${selectedTariff}"`} className="p-0" embedded={true} />
      </Modal>

      <Modal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} title="Оставить заявку">
        <LeadForm embedded={true} />
      </Modal>
    </div>
  );
};

export default RentOut;
