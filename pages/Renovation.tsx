
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import SEO from '../components/SEO';
import ProcessTimeline from '../components/ProcessTimeline';
import ReviewsSection from '../components/ReviewsSection';
import FAQ from '../components/FAQ';
import { Hammer, Paintbrush, CheckCircle2, ArrowRight, Ruler, Tablet, HardHat, Palette, ClipboardCheck, Package, Zap, Volume2, PenTool, Calculator, Home, Key, Camera, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../services/blogData';
import { PAGE_CONTENT } from '../services/contentData';

const RELEVANT_POSTS = BLOG_POSTS.filter(p => p.id.startsWith('renov-')).slice(0, 6);

const Renovation: React.FC = () => {
  // Updated Timeline Steps matching Dashboard (6 Steps)
  const timelineSteps = [
      { 
          step: "01", title: "Замер", 
          text: "Инженер приезжает на объект, делает точные замеры лазером.", 
          details: "Составляем дефектную ведомость и обсуждаем ваши пожелания по планировке и материалам.",
          icon: <Calculator/> 
      },
      { 
          step: "02", title: "Дизайн", 
          text: "Разработка планировочного решения и рабочих чертежей.", 
          details: "Создаем технический дизайн-проект: планы электрики, сантехники, расстановки мебели. Это исключает ошибки при работах.",
          icon: <PenTool/> 
      },
      { 
          step: "03", title: "Черновые", 
          text: "Демонтаж, возведение стен, стяжка и штукатурка.", 
          details: "Самый грязный и важный этап. Выравниваем геометрию стен под 90 градусов, разводим инженерные коммуникации.",
          icon: <Hammer/> 
      },
      { 
          step: "04", title: "Чистовые", 
          text: "Укладка плитки, напольных покрытий, покраска и обои.", 
          details: "Работаем с чистовыми материалами. Идеальные швы, ровная покраска, установка сантехники и дверей.",
          icon: <Paintbrush/> 
      },
      { 
          step: "05", title: "Мебель", 
          text: "Сборка и установка корпусной и мягкой мебели.", 
          details: "Монтаж кухни, шкафов, установка техники. Подключение осветительных приборов.",
          icon: <Home/> 
      },
      { 
          step: "06", title: "Сдача", 
          text: "Генеральная уборка и передача готового объекта.", 
          details: "Вывозим весь мусор, проводим клининг. Подписываем акт выполненных работ и передаем гарантийный сертификат.",
          icon: <Key/> 
      }
  ];

  return (
    <div className="pt-4 xl:pt-20">
      <SEO {...PAGE_CONTENT.RENOVATION.seo} />

      {/* Hero */}
      <Section className="text-center relative min-h-[60vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-10 right-10 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-bold text-sm mb-6 border border-orange-100">
            {PAGE_CONTENT.RENOVATION.hero.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            {PAGE_CONTENT.RENOVATION.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {PAGE_CONTENT.RENOVATION.hero.subtitle}
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

      {/* Before / After Slider */}
      <Section>
          <GlassCard className="relative h-[60vh] overflow-hidden p-0 group rounded-[3rem]">
             <div className="absolute inset-0 w-full h-full">
                 {/* Concrete / Rough Image */}
                 <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80" alt="Before Renovation" className="w-full h-full object-cover grayscale contrast-125" />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                     <span className="text-white text-4xl font-bold">До</span>
                 </div>
             </div>
             <div className="absolute inset-0 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out group-hover:w-full border-r-4 border-white shadow-2xl">
                 {/* Finished / Modern Image */}
                 <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80" alt="After Renovation" className="w-full h-full object-cover max-w-none" style={{width: '100vw'}} />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-white text-4xl font-bold">После</span>
                 </div>
             </div>
             
             <div className="absolute bottom-8 left-0 right-0 text-center z-20 pointer-events-none">
                 <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg text-black">Потяните слайдер (наведите)</span>
             </div>
          </GlassCard>
      </Section>

      {/* Why Choose Us for Renovation */}
      <Section title="Наши стандарты">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { icon: <ClipboardCheck size={24} />, title: "Планирование", desc: "Без проекта ремонт будет длиться вечно. Начинаем с замеров.", color: "bg-orange-100 text-orange-600", link: "/blog/renov-1" },
                { icon: <ShieldCheck size={24} />, title: "Приемка", desc: "Контроль качества: ровные стены, углы 90 градусов, инженерные системы.", color: "bg-blue-100 text-blue-600", link: "/blog/renov-2" },
                { icon: <Package size={24} />, title: "White Box", desc: "Оптимальный баланс для инвестиций. Быстрый финиш под конкретного жильца.", color: "bg-green-100 text-green-600", link: "/blog/renov-3" },
                { icon: <Zap size={24} />, title: "Электрика", desc: "Правильная разводка розеток и выключателей для удобной жизни.", color: "bg-yellow-100 text-yellow-600", link: "/blog/renov-4" },
                { icon: <Volume2 size={24} />, title: "Тишина", desc: "Профессиональная шумоизоляция для комфорта в многоквартирном доме.", color: "bg-purple-100 text-purple-600", link: "/blog/renov-5" },
                { icon: <PenTool size={24} />, title: "Дизайн-проект", desc: "Рабочая документация для строителей, чтобы избежать переделок.", color: "bg-indigo-100 text-indigo-600", link: "/blog/renov-6" }
            ].map((item, i) => (
                <Link key={i} to={item.link} className="block h-full group cursor-pointer">
                    <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color} group-hover:bg-black group-hover:text-white transition-colors`}>
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section title="Этапы работы">
          <ProcessTimeline steps={timelineSteps} colorTheme="orange" />
      </Section>

      {/* Our Tools - Standardized */}
      <Section title="Наши инструменты">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  { id: 'tool-laser', icon: <Ruler/>, title: "Лазерный замер", desc: "Точная геометрия для расчета материалов.", link: "/blog/tool-laser" },
                  { id: 'rent-6', icon: <Tablet/>, title: "Приложение", desc: "Контроль хода работ и фотоотчеты в телефоне.", link: "/dashboard" },
                  { id: 'tool-tech-supervision', icon: <HardHat/>, title: "Технадзор", desc: "Независимый инженер принимает каждый этап.", link: "/blog/tool-tech-supervision" }
              ].map((tool, i) => (
                  <Link key={i} to={tool.link} className="block h-full group cursor-pointer">
                      <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                          <div>
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-100 text-orange-600 mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                                  {React.cloneElement(tool.icon as any, { size: 24 })}
                              </div>
                              <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{tool.title}</h3>
                              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                  {tool.desc}
                              </p>
                          </div>
                      </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RELEVANT_POSTS.map((art, i) => (
                  <Link key={i} to={`/blog/${art.id}`} className="block h-full group cursor-pointer">
                    <div className="apple-panel p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-sm">
                                    <FileText size={24} />
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                    Статья
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{art.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                                {art.excerpt}
                            </p>
                        </div>
                    </div>
                  </Link>
              ))}
          </div>
      </Section>

      <ReviewsSection reviews={PAGE_CONTENT.RENOVATION.reviews} />

      <Section>
          <FAQ items={PAGE_CONTENT.RENOVATION.faq} />
      </Section>

      <Section id="form" className="pb-32">
          <LeadForm title="Рассчитать ремонт" subtitle="Оставьте заявку на бесплатный выезд замерщика." buttonText="Вызвать инженера" />
      </Section>
    </div>
  );
};

export default Renovation;
