
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ExpertsSection from '../components/ExpertsSection';
import SEO from '../components/SEO';
import { Building2, Users, Globe, Award, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SchemaMarkup } from '../components/SchemaMarkup';
import LeadForm from '../components/LeadForm';

const Company: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Estate AI",
    "description": "Агентство недвижимости нового поколения с AI-технологиями.",
    "image": "https://estate-ai.com/logo.png",
    "telephone": "+74950000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Пресненская наб., 12",
      "addressLocality": "Москва",
      "addressCountry": "RU"
    },
    "priceRange": "$$"
  };

  return (
    <div className="pt-24 min-h-screen">
      <SEO 
        title="О компании Estate AI | Команда, Офис, Контакты" 
        description="Агентство недвижимости нового поколения. Мы объединяем опыт экспертов и технологии AI для быстрых и безопасных сделок." 
        keywords="агентство недвижимости, команда estate ai, контакты, офис москва" 
      />
      <SchemaMarkup schema={schemaData} />
      
      <Section className="text-center pb-12">
         <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-600 font-bold text-sm mb-6">О нас</span>
         <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">Недвижимость <br/> с интеллектом</h1>
         <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
           Мы создали гибридную модель работы, где рутину выполняют нейросети Gemini, а важные решения принимают люди с эмпатией.
         </p>
      </Section>

      <Section>
         <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="text-center p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600"><Users size={32}/></div>
                <h3 className="text-4xl font-bold mb-2">150+</h3>
                <p className="text-gray-500">Экспертов в штате</p>
            </GlassCard>
            <GlassCard className="text-center p-8">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-600"><Award size={32}/></div>
                <h3 className="text-4xl font-bold mb-2">Top-3</h3>
                <p className="text-gray-500">Агентство года 2024</p>
            </GlassCard>
            <GlassCard className="text-center p-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600"><Globe size={32}/></div>
                <h3 className="text-4xl font-bold mb-2">12</h3>
                <p className="text-gray-500">Городов присутствия</p>
            </GlassCard>
         </div>
      </Section>

      <Section title="Наша миссия">
         <div className="bg-black text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]"></div>
             <div className="relative z-10 max-w-4xl">
                 <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                    Сделать рынок недвижимости прозрачным, быстрым и безопасным для каждого человека.
                 </h2>
                 <div className="grid md:grid-cols-2 gap-12 text-gray-400 text-lg">
                     <p>Мы верим, что покупка квартиры не должна быть стрессом. Технологии позволяют убрать неопределенность, а люди добавляют заботу.</p>
                     <p>Estate AI — это не просто агрегатор. Это экосистема, которая сопровождает вас от мысли о переезде до новоселья.</p>
                 </div>
             </div>
         </div>
      </Section>

      <ExpertsSection title="Команда лидеров" colorTheme="gray" />

      <Section title="Контакты" className="pb-32">
          <div className="flex flex-col gap-8">
              
              {/* 1. Full Width Info Block */}
              <GlassCard className="p-10 md:p-12">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                      <div className="flex-1">
                          <h3 className="text-3xl font-bold mb-8 text-gray-900">Головной офис</h3>
                          <div className="grid md:grid-cols-2 gap-6 text-lg text-gray-600">
                              <div className="space-y-6">
                                  <div className="flex items-center gap-4 group">
                                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors"><MapPin size={24} /></div>
                                      <span>Москва, Пресненская наб., 12</span>
                                  </div>
                                  <div className="flex items-center gap-4 group">
                                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors"><Mail size={24} /></div>
                                      <span>hello@estate-ai.com</span>
                                  </div>
                              </div>
                              <div className="space-y-6">
                                  <div className="flex items-center gap-4 group">
                                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors"><Phone size={24} /></div>
                                      <span>+7 (495) 000-00-00</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Working Hours Block */}
                      <div className="bg-[#F5F5F7] rounded-[2.5rem] p-10 lg:min-w-[320px] text-center self-stretch flex flex-col justify-center items-center border border-gray-200">
                          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full mb-4 shadow-sm text-green-600">
                              <Clock size={28} strokeWidth={2.5} />
                          </div>
                          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Режим работы</p>
                          <p className="text-gray-900 font-bold text-3xl leading-tight">Ежедневно <br/> 9:00 - 21:00</p>
                      </div>
                  </div>
              </GlassCard>

              {/* 2. Grid: Image + Form */}
              <div className="grid lg:grid-cols-2 gap-8">
                  {/* Image */}
                  <GlassCard className="p-0 overflow-hidden h-full min-h-[500px] rounded-[2.5rem] relative group">
                      <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt="Office Interior" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </GlassCard>
                  
                  {/* Form */}
                  <GlassCard className="p-8 md:p-12 border border-gray-200 shadow-xl h-full flex flex-col justify-center">
                      <div className="max-w-lg mx-auto w-full">
                        <h3 className="text-3xl font-bold mb-3 text-gray-900">Написать нам</h3>
                        <p className="text-gray-500 mb-8 text-lg">Есть вопросы, предложения или хотите стать партнером? Заполните форму ниже.</p>
                        <LeadForm 
                            title="" 
                            subtitle="" 
                            buttonText="Отправить сообщение" 
                            className="p-0 shadow-none border-none my-0 w-full" 
                            embedded={true}
                        />
                      </div>
                  </GlassCard>
              </div>
          </div>
      </Section>
    </div>
  );
};

export default Company;
