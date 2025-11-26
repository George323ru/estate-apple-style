
import React from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ExpertsSection from '../components/ExpertsSection';
import SEO from '../components/SEO';
import { Building2, Users, Globe, Award, MapPin, Phone, Mail } from 'lucide-react';

const Company: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen">
      <SEO title="О компании Estate AI" description="Агентство недвижимости нового поколения" keywords="команда, офис, контакты" />
      
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
          <div className="grid md:grid-cols-2 gap-8">
              <GlassCard className="p-0 overflow-hidden min-h-[400px]">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Office" />
              </GlassCard>
              <div className="flex flex-col gap-4">
                  <GlassCard className="flex-1 flex flex-col justify-center p-10">
                      <h3 className="text-2xl font-bold mb-6">Головной офис</h3>
                      <div className="space-y-6 text-lg text-gray-600">
                          <div className="flex items-center gap-4">
                              <MapPin className="text-black" /> Москва, Пресненская наб., 12
                          </div>
                          <div className="flex items-center gap-4">
                              <Phone className="text-black" /> +7 (495) 000-00-00
                          </div>
                          <div className="flex items-center gap-4">
                              <Mail className="text-black" /> hello@estate-ai.com
                          </div>
                      </div>
                  </GlassCard>
                  <GlassCard className="bg-[#F5F5F7] border-none p-8 text-center">
                      <p className="text-gray-500 font-medium">Работаем ежедневно с 9:00 до 21:00</p>
                  </GlassCard>
              </div>
          </div>
      </Section>
    </div>
  );
};

export default Company;
