
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
import { CheckCircle2, FileText, ArrowRight, ShieldCheck, ScanEye, UserCheck, CreditCard, UserX, Search, Gavel, Siren, Wallet, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGE_CONTENT } from '../services/contentData';
import { BLOG_POSTS } from '../services/blogData';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('rent-')).slice(0, 3);

const RentOut: React.FC = () => {
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState('');

  const openTariffModal = (tariff: string) => {
      setSelectedTariff(tariff);
      setIsTariffModalOpen(true);
  };

  return (
    <div className="pt-4 xl:pt-20">
      <SEO {...PAGE_CONTENT.RENT.seo} />
      
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
            <button onClick={() => document.getElementById('form')?.scrollIntoView({behavior: 'smooth'})} className="px-10 py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-lg">
              Сдать квартиру
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

      <Section title="Как мы работаем">
          <ProcessTimeline steps={PAGE_CONTENT.RENT.timeline} colorTheme="green" />
      </Section>

      {/* Our Tools - Standardized */}
      <Section title="Наши инструменты">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { id: 'tool-scoring', icon: <UserCheck/>, title: "Скоринг жильцов", desc: "Проверка по 15 базам данных (МВД, ФССП)." },
                  { id: 'tool-insurance', icon: <ShieldCheck/>, title: "Страхование", desc: "Защита ремонта и ответственности перед соседями." },
                  { id: 'rent-6', icon: <Smartphone/>, title: "Приложение", desc: "Контроль оплат, чеков и фотоотчетов в телефоне." }
              ].map((tool, i) => (
                  <Link key={i} to={`/blog/${tool.id}`} className="block h-full group cursor-pointer">
                      <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-green-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                          <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-100 text-green-600 group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                                  {React.cloneElement(tool.icon as any, { size: 24 })}
                              </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">{tool.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                              {tool.desc}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                              Подробнее <ArrowRight size={14} />
                          </div>
                      </GlassCard>
                  </Link>
              ))}
          </div>
      </Section>

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

      {/* AI Tech Teaser (Keep unique) */}
      <Section>
        <div className="apple-glass-dark relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group">
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase bg-white/5 backdrop-blur mb-4 text-green-300">
                            <ScanEye size={12} /> Tenant Face Control
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight leading-tight">
                            Сдавайте только <br/>
                            надежным
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            Никаких "котов в мешке". Наш AI проверяет потенциального арендатора по 15 базам данных.
                        </p>
                    </div>
                    <Link to="/ai/tenant-check" className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-900/50">
                        Проверить человека <UserCheck size={20} />
                    </Link>
                </div>
            </div>
        </div>
      </Section>

      {/* Useful in Blog - Standardized */}
      <Section title="Полезное в блоге">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-green-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                                <FileText size={24} />
                            </div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                Статья
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">{art.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{art.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                            Читать <ArrowRight size={14}/>
                        </div>
                    </GlassCard>
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
    </div>
  );
};

export default RentOut;
