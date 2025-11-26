
import React from 'react';
import Section from './Section';
import GlassCard from './GlassCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, LogIn } from 'lucide-react';

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface ServiceLandingProps {
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  buttonText: string;
  onStart: () => void;
  icon: React.ReactNode;
  colorTheme: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo';
}

const ServiceLanding: React.FC<ServiceLandingProps> = ({ 
  title, subtitle, description, features, buttonText, onStart, icon, colorTheme 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('estate_auth') === 'true';

  const handleAction = () => {
    if (isAuthenticated) {
      onStart();
    } else {
      // Redirect to dashboard for login with return URL
      navigate(`/dashboard?returnUrl=${encodeURIComponent(location.pathname)}`);
    }
  };

  const getColorClass = (opacity: string = '100') => {
    switch (colorTheme) {
      case 'blue': return `bg-blue-${opacity} text-blue-600 border-blue-200`;
      case 'green': return `bg-green-${opacity} text-green-600 border-green-200`;
      case 'orange': return `bg-orange-${opacity} text-orange-600 border-orange-200`;
      case 'purple': return `bg-purple-${opacity} text-purple-600 border-purple-200`;
      case 'pink': return `bg-pink-${opacity} text-pink-600 border-pink-200`;
      case 'indigo': return `bg-indigo-${opacity} text-indigo-600 border-indigo-200`;
      default: return `bg-gray-${opacity} text-gray-600 border-gray-200`;
    }
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-[#F5F5F7]">
      {/* Hero */}
      <Section className="text-center relative overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${getColorClass('500/10').replace('text-', 'bg-')} rounded-full blur-[100px] -z-10`}></div>
        
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] mb-8 shadow-xl ${getColorClass('100')} ${getColorClass().split(' ')[1]}`}>
          {React.cloneElement(icon as any, { size: 48 })}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
          {subtitle}
        </p>
        
        <div className="max-w-2xl mx-auto mb-12">
            <p className="text-gray-600 text-lg leading-relaxed bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/50">
                {description}
            </p>
        </div>

        <div className="flex justify-center">
            <button 
                onClick={handleAction}
                className="group relative bg-black text-white px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center gap-3 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-2">
                    {isAuthenticated ? (
                        <> {buttonText} <ArrowRight /> </>
                    ) : (
                        <> <Lock size={20} /> Войти для доступа </>
                    )}
                </span>
            </button>
        </div>
        
        {!isAuthenticated && (
            <p className="mt-4 text-sm text-gray-400 flex items-center justify-center gap-2">
                <ShieldCheck size={14} /> Доступ только для авторизованных пользователей
            </p>
        )}
      </Section>

      {/* Features */}
      <Section title="Возможности сервиса">
        <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
                <GlassCard key={i} className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-colors ${getColorClass('50')} group-hover:${getColorClass('100')}`}>
                        {feat.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{feat.title}</h3>
                    <p className="text-gray-500 leading-relaxed">
                        {feat.desc}
                    </p>
                </GlassCard>
            ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="pb-24">
          <div className="apple-panel p-10 md:p-16 bg-gradient-to-br from-gray-900 to-black text-white">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                      <h2 className="text-4xl font-bold mb-6">Безопасность и приватность</h2>
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                          Мы ограничиваем публичный доступ к этому инструменту, чтобы предотвратить автоматический парсинг данных и злоупотребления. 
                          Все запросы в личном кабинете шифруются и не передаются третьим лицам.
                      </p>
                      <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                              <CheckCircle2 className="text-green-400" />
                              <span>Защита от фрода и ботов</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <CheckCircle2 className="text-green-400" />
                              <span>История запросов в ЛК</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <CheckCircle2 className="text-green-400" />
                              <span>Персональная поддержка</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-center">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] w-full max-w-sm rotate-3 hover:rotate-0 transition-transform duration-500">
                          <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                  <LogIn className="text-black" size={24} />
                              </div>
                              <div>
                                  <div className="font-bold text-lg">Авторизация</div>
                                  <div className="text-sm text-gray-400">Estate ID</div>
                              </div>
                          </div>
                          <p className="text-sm text-gray-300">
                              Для продолжения работы необходимо войти в единый аккаунт экосистемы Estate AI.
                          </p>
                          <button onClick={() => navigate(`/dashboard?returnUrl=${encodeURIComponent(location.pathname)}`)} className="w-full mt-6 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                              Войти в кабинет
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </Section>
    </div>
  );
};

export default ServiceLanding;
