
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import ReviewsSection from '../components/ReviewsSection';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';
import ComparisonBlock from '../components/ComparisonBlock';
import ExpertsSection from '../components/ExpertsSection';
import ProcessTimeline from '../components/ProcessTimeline';
import { Paintbrush, Package, Camera, ArrowRight, Zap, Check, LayoutTemplate, ImageIcon, FileText, Wand2, Layers, Calculator, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGE_CONTENT } from '../services/contentData';
import { BLOG_POSTS } from '../services/blogData';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('prep-')).slice(0, 3);

const Preparation: React.FC = () => {
  return (
    <div className="pt-4 xl:pt-20">
      <SEO {...PAGE_CONTENT.PREPARATION.seo} />

      {/* 1. Hero */}
      <Section className="text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-pink-50 text-pink-600 font-bold text-sm mb-6 border border-pink-100">
            {PAGE_CONTENT.PREPARATION.hero.badge}
        </div>
        <h1 className="text-5xl font-bold mb-6">{PAGE_CONTENT.PREPARATION.hero.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {PAGE_CONTENT.PREPARATION.hero.subtitle}
        </p>
        <div className="mt-8">
            <Link to="/renovation" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-0.5">
                Нужен капитальный ремонт перед стейджингом? <ArrowRight size={14}/>
            </Link>
        </div>
      </Section>

      {/* 2. Before / After Slider */}
      <Section>
          <GlassCard className="relative h-[60vh] overflow-hidden p-0 group rounded-[3rem]">
             <div className="absolute inset-0 w-full h-full">
                 <img src="https://picsum.photos/1600/900?grayscale" alt="Before" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                     <span className="text-white text-4xl font-bold">До</span>
                 </div>
             </div>
             <div className="absolute inset-0 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out group-hover:w-full border-r-4 border-white shadow-2xl">
                 <img src="https://picsum.photos/1600/900" alt="After" className="w-full h-full object-cover max-w-none" style={{width: '100vw'}} />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-white text-4xl font-bold">После</span>
                 </div>
             </div>
             
             <div className="absolute bottom-8 left-0 right-0 text-center z-20 pointer-events-none">
                 <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg text-black">Потяните слайдер (наведите)</span>
             </div>
          </GlassCard>
      </Section>

      <ComparisonBlock items={PAGE_CONTENT.PREPARATION.comparison} theme="pink" />

      {/* 4. Process Timeline */}
      <Section title="Как мы работаем">
          <ProcessTimeline steps={PAGE_CONTENT.PREPARATION.timeline} colorTheme="pink" />
      </Section>

      {/* 5. What We Do (Tools) - Standardized */}
      <Section title="Наши инструменты">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                  {id: 'prep-3', icon: <Paintbrush />, title: "Косметический ремонт", desc: "Освежаем стены, меняем свет, устраняем мелкие дефекты."},
                  {id: 'tool-furniture', icon: <Package />, title: "Меблировка", desc: "Аренда стильной мебели и декора для показов."},
                  {id: 'tool-3d', icon: <Camera />, title: "Профессиональная съемка", desc: "Фото, которые хочется лайкнуть."},
                  {id: 'tool-declutter', icon: <LayoutTemplate />, title: "Расхламление", desc: "Убираем личные вещи, создаем 'воздух' в квартире."}
              ].map((item, i) => (
                  <Link key={i} to={`/blog/${item.id}`} className="block h-full group cursor-pointer">
                      <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-pink-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                          <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-pink-100 text-pink-600 group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                                  {React.cloneElement(item.icon as any, { size: 24 })}
                              </div>
                          </div>
                          <h3 className="font-bold text-xl mb-2 group-hover:text-pink-600 transition-colors">{item.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{item.desc}</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                              Подробнее <ArrowRight size={14} />
                          </div>
                      </GlassCard>
                  </Link>
              ))}
          </div>
      </Section>

      {/* 6. Packages - Standardized */}
      <Section title="Пакеты услуг">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  {name: "Онлайн", price: "15 000 ₽", feats: ["Консультация", "Список покупок", "Гайд по расстановке"]},
                  {name: "Стандарт", price: "50 000 ₽", feats: ["Выезд стейджера", "Декорирование", "Проф. фотосъемка"], popular: true},
                  {name: "Под ключ", price: "от 100 000 ₽", feats: ["Мелкий ремонт", "Аренда мебели", "Клининг", "Полное сопровождение"]}
              ].map((p, i) => (
                  <GlassCard key={i} className={`relative flex flex-col hover:scale-[1.02] transition-transform duration-300 ${p.popular ? 'border-2 border-blue-500 shadow-xl' : 'border border-pink-100'}`}>
                      {p.popular && <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ХИТ</div>}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                        <div className="text-2xl font-bold text-gray-800">{p.price}</div>
                      </div>
                      <ul className="space-y-3 mb-8 flex-grow">
                          {p.feats.map(f => (
                              <li key={f} className="flex gap-3 text-sm text-gray-600 items-center">
                                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                     <Check size={12}/> 
                                  </div>
                                  {f}
                              </li>
                          ))}
                      </ul>
                      <button className={`w-full py-4 rounded-xl font-bold transition-colors ${p.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                          Заказать
                      </button>
                  </GlassCard>
              ))}
          </div>
      </Section>

      <ExpertsSection title="Команда стейджинга" colorTheme="pink" />
      
      {/* AI Teaser */}
      <Section className="text-center">
          <div className="apple-glass-dark relative overflow-hidden rounded-[2.5rem] p-12 border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase bg-white/5 backdrop-blur mb-6 text-pink-300">
                        <Zap size={12} /> Virtual Renovation
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
                        Сколько стоит <br/> 
                        красивая жизнь?
                    </h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                        Перед тем как начать ремонт, узнайте его точную стоимость. AI создаст визуализацию и рассчитает смету за 5 минут.
                    </p>
                    <Link to="/ai/renovation-est" className="group relative bg-white text-black px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl overflow-hidden">
                        <span className="relative flex items-center gap-3">
                            Рассчитать смету <Wand2 size={22} className="text-pink-600" />
                        </span>
                    </Link>
                </div>
          </div>
      </Section>

      {/* Useful in Blog - Standardized */}
      <Section title="Полезное в блоге">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-pink-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors shadow-sm">
                                <FileText size={24} />
                            </div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                Статья
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition-colors">{art.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{art.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                            Читать <ArrowRight size={14}/>
                        </div>
                    </GlassCard>
                  </Link>
              ))}
          </div>
      </Section>

      <ReviewsSection reviews={PAGE_CONTENT.PREPARATION.reviews} />

      <Section>
          <FAQ items={PAGE_CONTENT.PREPARATION.faq} />
      </Section>

      <Section className="pb-32">
          <LeadForm title="Заказать аудит" subtitle="Пришлите фото, мы скажем, что улучшить." buttonText="Отправить заявку" icon={<ImageIcon size={40} className="text-pink-500" />} />
      </Section>
    </div>
  );
};

export default Preparation;
