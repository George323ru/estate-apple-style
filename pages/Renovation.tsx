
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import SEO from '../components/SEO';
import ProcessTimeline from '../components/ProcessTimeline';
import { Hammer, Paintbrush, Clock, ShieldCheck, FileText, CheckCircle2, ArrowRight, Ruler, Tablet, HardHat, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../services/blogData';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('renov-')).slice(0, 3);

const Renovation: React.FC = () => {
  const timelineSteps = [
      { step: "01", title: "Замер и Смета", text: "Инженер приезжает на объект, делает замеры. Составляем точную смету работ и материалов.", icon: <Hammer/> },
      { step: "02", title: "Черновые работы", text: "Демонтаж, возведение перегородок, разводка электрики и сантехники, стяжка, штукатурка.", icon: <Paintbrush/> },
      { step: "03", title: "Чистовая отделка", text: "Укладка плитки, напольных покрытий, покраска стен, установка дверей и освещения.", icon: <CheckCircle2/> },
      { step: "04", title: "Переход к Стейджингу", text: "Сдача объекта. Подключение команды декораторов для меблировки и подготовки к продаже/аренде.", icon: <ArrowRight/> }
  ];

  return (
    <div className="pt-4 xl:pt-20">
      <SEO title="Ремонт под ключ в Москве | Стейджинг с нуля | Estate AI" description="Капитальный и косметический ремонт квартир. Фиксированная смета, технадзор, соблюдение сроков." keywords="ремонт квартир, ремонт под ключ, стейджинг с нуля, отделка квартир" />

      {/* Hero */}
      <Section className="text-center relative min-h-[60vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-10 right-10 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-bold text-sm mb-6 border border-orange-100">
            Staging from Scratch
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Ремонт как инвестиция
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Превращаем "бетон" или "бабушкин вариант" в ликвидный актив. Полный цикл работ от демонтажа до чистовой отделки перед стейджингом.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => document.getElementById('form')?.scrollIntoView({behavior: 'smooth'})} className="px-10 py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg text-lg">
              Заказать замер
            </button>
            <Link to="/ai/renovation-est" className="px-10 py-5 bg-white text-black border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Hammer size={20} /> AI Смета
            </Link>
          </div>
        </div>
      </Section>

      {/* Why Us */}
      <Section className="bg-white/50 backdrop-blur-sm rounded-[3rem] my-8">
         <div className="max-w-5xl mx-auto text-center py-12">
             <h2 className="text-3xl font-bold mb-8">Стандарты качества</h2>
             <div className="grid md:grid-cols-3 gap-8 text-left">
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                     <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6"><FileText size={24}/></div>
                     <h3 className="text-xl font-bold mb-2">Фиксированная смета</h3>
                     <p className="text-gray-500">Цена работ фиксируется в договоре и не меняется в процессе, если вы не вносите изменений.</p>
                 </div>
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                     <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><ShieldCheck size={24}/></div>
                     <h3 className="text-xl font-bold mb-2">Технический надзор</h3>
                     <p className="text-gray-500">Инженер проверяет каждый этап (скрытые работы, электрика, сантехника) по чек-листу из 150 пунктов.</p>
                 </div>
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                     <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6"><Clock size={24}/></div>
                     <h3 className="text-xl font-bold mb-2">Соблюдение сроков</h3>
                     <p className="text-gray-500">Финансовая ответственность за просрочку. Мы ценим ваше время и деньги.</p>
                 </div>
             </div>
         </div>
      </Section>

      {/* Timeline */}
      <Section title="Этапы работы">
          <ProcessTimeline steps={timelineSteps} colorTheme="orange" />
      </Section>

      {/* Our Tools - Standardized */}
      <Section title="Наши инструменты">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { id: 'tool-laser', icon: <Ruler/>, title: "Лазерный замер", desc: "Точная геометрия для расчета материалов." },
                  { id: 'rent-6', icon: <Tablet/>, title: "Приложение", desc: "Контроль хода работ и фотоотчеты в телефоне." },
                  { id: 'tool-tech-supervision', icon: <HardHat/>, title: "Технадзор", desc: "Независимый инженер принимает каждый этап." }
              ].map((tool, i) => (
                  <Link key={i} to={`/blog/${tool.id}`} className="block h-full group cursor-pointer">
                      <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-orange-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                          <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-100 text-orange-600 group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                                  {React.cloneElement(tool.icon as any, { size: 24 })}
                              </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{tool.title}</h3>
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

      {/* Packages - Standardized */}
      <Section title="Пакеты услуг">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  { title: "White Box", price: "15 000 ₽/м²", feats: ["Черновые работы", "Электрика", "Стяжка", "Штукатурка"] },
                  { title: "Под ключ", price: "25 000 ₽/м²", feats: ["Чистовая отделка", "Плитка", "Покраска", "Двери"], popular: true },
                  { title: "Дизайнерский", price: "40 000 ₽/м²", feats: ["Авторский надзор", "Сложные узлы", "Меблировка"] }
              ].map((pkg, i) => (
                  <GlassCard key={i} className={`relative flex flex-col hover:scale-[1.02] transition-transform duration-300 ${pkg.popular ? 'border-2 border-orange-500 shadow-xl' : 'border border-orange-100'}`}>
                      {pkg.popular && <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">ХИТ</div>}
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                        <div className="text-2xl font-bold text-gray-800">{pkg.price}</div>
                        <div className="text-xs text-gray-400 font-medium mt-1">только работы</div>
                      </div>
                      <ul className="space-y-3 mb-8 flex-grow">
                          {pkg.feats.map(f => (
                              <li key={f} className="flex gap-3 text-sm text-gray-600 items-center">
                                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                     <Palette size={12}/> 
                                  </div>
                                  {f}
                              </li>
                          ))}
                      </ul>
                      <button className={`w-full py-4 rounded-xl font-bold transition-colors ${pkg.popular ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                          Выбрать
                      </button>
                  </GlassCard>
              ))}
          </div>
      </Section>

      {/* Useful in Blog - Added */}
      <Section title="Полезное в блоге">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-orange-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-sm">
                                <FileText size={24} />
                            </div>
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                Статья
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{art.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{art.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                            Читать <ArrowRight size={14}/>
                        </div>
                    </GlassCard>
                  </Link>
              ))}
          </div>
      </Section>

      <Section id="form" className="pb-32">
          <LeadForm title="Рассчитать ремонт" subtitle="Оставьте заявку на бесплатный выезд замерщика." buttonText="Вызвать инженера" />
      </Section>
    </div>
  );
};

export default Renovation;
