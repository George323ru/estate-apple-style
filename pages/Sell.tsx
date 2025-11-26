
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';
import ReviewsSection from '../components/ReviewsSection';
import ComparisonBlock from '../components/ComparisonBlock';
import ExpertsSection from '../components/ExpertsSection';
import ProcessTimeline from '../components/ProcessTimeline';
import { Link } from 'react-router-dom';
import { 
  Zap, BarChart3, ArrowRight, CheckCircle, FileText, PenTool, Sparkles, Wand2, Camera, TrendingUp, Image, Edit3, MapPin, Box, Package, Target, Coins
} from 'lucide-react';
import { PAGE_CONTENT } from '../services/contentData';
import { BLOG_POSTS } from '../services/blogData';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('sell-')).slice(0, 3);

const Sell: React.FC = () => {
  return (
    <div className="pt-4 xl:pt-20">
      <SEO {...PAGE_CONTENT.SELL.seo} />

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
            <button onClick={() => document.getElementById('form')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
              Оставить заявку
            </button>
            <Link to="/ai-generator" className="px-8 py-4 bg-white text-black border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
              <Zap className="text-yellow-500" size={20} /> Генератор описания
            </Link>
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

      {/* 4. Timeline */}
      <Section title="Как мы работаем">
          <ProcessTimeline steps={PAGE_CONTENT.SELL.timeline} colorTheme="purple" />
      </Section>

      {/* NEW: Our Tools - Standardized */}
      <Section title="Наши инструменты">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { id: 'sell-2', icon: <Box/>, title: "Хоумстейджинг", desc: "Декор и подготовка квартиры за наш счет." },
                  { id: 'tool-3d', icon: <Camera/>, title: "3D-тур и Фото", desc: "Профессиональная съемка для привлечения внимания." },
                  { id: 'tool-target', icon: <Target/>, title: "Таргетинг", desc: "Реклама в соцсетях и на 30 площадках." }
              ].map((tool, i) => (
                  <Link key={i} to={`/blog/${tool.id}`} className="block h-full group cursor-pointer">
                      <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-purple-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                          <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-100 text-purple-600 group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                                  {React.cloneElement(tool.icon as any, { size: 24 })}
                              </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">{tool.title}</h3>
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

      {/* NEW: Packages - Standardized */}
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

      {/* 5. AI Teaser - DESCRIPTION GENERATOR (Kept unique) */}
      <Section>
        <div className="apple-glass-dark relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group">
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8 order-2 lg:order-1">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase bg-white/5 backdrop-blur mb-4 text-yellow-300">
                            <PenTool size={12} /> AI Copywriter
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight leading-tight">
                            Объявление, которое <br/>
                            продает само
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            Не тратьте часы на написание текста. Загрузите фото, и Gemini 2.5 создаст описание, которое подчеркнет плюсы.
                        </p>
                    </div>
                    <Link to="/ai-generator" className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                        Создать описание <Wand2 size={20} className="text-purple-600" />
                    </Link>
                </div>
                <div className="order-1 lg:order-2 relative">
                    <div className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-auto text-xs font-mono text-gray-500">Gemini_Writer.exe</span>
                        </div>
                        <div className="space-y-4 font-mono text-sm">
                            <div className="opacity-50 line-through decoration-red-500/50 decoration-2 text-gray-400">
                                "Продам квартиру. Ремонт норм. Рядом магазин."
                            </div>
                            <div className="text-green-400 typing-effect">
                                "Просторная евро-двушка с дизайнерским ремонтом в стиле лофт..."
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      {/* Useful in Blog - Standardized */}
      <Section title="Полезное в блоге">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-purple-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                                <FileText size={24} />
                            </div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                Статья
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">{art.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{art.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                            Читать <ArrowRight size={14}/>
                        </div>
                    </GlassCard>
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
    </div>
  );
};

export default Sell;
