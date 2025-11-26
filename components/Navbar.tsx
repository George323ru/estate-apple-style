
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Key, Building2, Wallet, Sparkles, Sofa, BookOpen, Repeat, User, Phone, Grid2X2, X, Users, ChevronDown, PenTool, BrainCircuit, ScanEye, TrendingUp, Sun, Hammer, ShieldCheck, Percent, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import LeadForm from './LeadForm';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const aiTools = [
    { path: '/ai-generator', label: 'Генератор описаний', icon: <PenTool size={16} /> },
    { path: '/ai/invest-forecast', label: 'Инвест-прогноз', icon: <TrendingUp size={16} /> },
    { path: '/ai/eco-scan', label: 'Эко-сканер', icon: <Sun size={16} /> },
    { path: '/ai/renovation-est', label: 'Смета ремонта', icon: <Hammer size={16} /> },
    { path: '/ai/tenant-check', label: 'Проверка физ.лица', icon: <ShieldCheck size={16} /> },
    { path: '/ai/smart-match', label: 'Умный подбор', icon: <BrainCircuit size={16} /> },
  ];

  const desktopNavItems = [
    { path: '/', label: 'Главная', icon: <Home /> },
    { path: '/buy-new', label: 'Первичка', icon: <Key /> },
    { path: '/buy-resale', label: 'Вторичка', icon: <Building2 /> },
    { path: '/sell', label: 'Продажа', icon: <Wallet /> },
    { path: '/rent-out', label: 'Сдать', icon: <Repeat /> },
    { path: '/preparation', label: 'Подготовка', icon: <Sofa /> },
    { path: '/blog', label: 'Блог', icon: <BookOpen /> },
    { path: '/company', label: 'Компания', icon: <Users /> },
    { path: '/dashboard', label: 'Кабинет', icon: <User /> },
  ];

  // Mobile Drawer Items (Everything EXCEPT the 5 dock items)
  const mobileDrawerItems = [
    { path: '/buy-new', label: 'Первичка', icon: <Key /> },
    { path: '/buy-resale', label: 'Вторичка', icon: <Building2 /> },
    { path: '/sell', label: 'Продажа', icon: <Wallet /> },
    { path: '/rent-out', label: 'Аренда', icon: <Repeat /> },
    { path: '/preparation', label: 'Стейдж', icon: <Sofa /> },
    { path: '/blog', label: 'Блог', icon: <BookOpen /> },
    { path: '/company', label: 'Компания', icon: <Users /> },
  ];

  const landscapeItems = [
    { path: '/', label: 'Главная', icon: <Home /> },
    { path: '/buy-new', label: 'Первичка', icon: <Key /> },
    { path: '/buy-resale', label: 'Вторичка', icon: <Building2 /> },
    { path: '/sell', label: 'Продажа', icon: <Wallet /> },
    { path: '/rent-out', label: 'Аренда', icon: <Repeat /> },
    { path: '/preparation', label: 'Стейдж', icon: <Sofa /> },
    { path: '/ai', label: 'AI', icon: <Sparkles /> },
    { path: '/blog', label: 'Блог', icon: <BookOpen /> },
    { path: '/company', label: 'Компания', icon: <Users /> },
    { path: '/dashboard', label: 'Кабинет', icon: <User /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAIDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* --- DESKTOP NAV (Floating Pill) --- */}
      <nav className="hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-fade-in max-w-[98vw] w-fit">
        <div className="
          bg-white/80 backdrop-blur-[50px] saturate-[180%]
          ring-1 ring-white/50 border border-white/40
          shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]
          rounded-full 
          lg:p-1.5 xl:p-2.5 
          flex items-center lg:gap-1 xl:gap-2
          transition-all hover:bg-white/90
        ">
          
          {/* Left Group */}
          {desktopNavItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative rounded-full transition-all duration-300 ease-out flex items-center gap-2
                  lg:px-3 lg:py-2 xl:px-5 xl:py-3 
                  ${isActive 
                    ? 'bg-black text-white shadow-lg font-bold' 
                    : 'text-gray-600 hover:bg-black/5 hover:text-black font-medium'
                  }
                `}
              >
                {React.cloneElement(item.icon as any, { size: 16, className: `lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4`, strokeWidth: isActive ? 2.5 : 2 })}
                <span className="lg:text-[11px] xl:text-[13px] 2xl:text-[14px]">{item.label}</span>
              </Link>
            );
          })}

          {/* AI Dropdown */}
          <div 
            className="relative lg:pt-1 lg:pb-1 xl:pt-2 xl:pb-2" 
            onMouseEnter={() => setIsAIDropdownOpen(true)}
            onMouseLeave={() => setIsAIDropdownOpen(false)}
          >
            <Link
                to="/ai"
                className={`
                  relative rounded-full transition-all duration-300 ease-out flex items-center gap-2
                  lg:px-3 lg:py-2 xl:px-5 xl:py-3
                  ${location.pathname.startsWith('/ai')
                    ? 'bg-black text-white shadow-lg font-bold' 
                    : 'text-gray-600 hover:bg-black/5 hover:text-black font-medium'
                  }
                `}
            >
                <Sparkles className="lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4" strokeWidth={location.pathname.startsWith('/ai') ? 2.5 : 2} />
                <span className="lg:text-[11px] xl:text-[13px] 2xl:text-[14px]">AI</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isAIDropdownOpen ? 'rotate-180' : ''}`} />
            </Link>

            {/* Dropdown Content - Invisible Bridge added (pt-4) */}
            <div className={`
                absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72 z-50
                transition-all duration-300 origin-top
                ${isAIDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}>
                <div className="
                    bg-white/80 backdrop-blur-[50px] saturate-[180%]
                    ring-1 ring-white/50 border border-white/40
                    rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden p-2
                ">
                    <div className="grid gap-1">
                        {aiTools.map((tool) => (
                            <Link 
                                key={tool.path} 
                                to={tool.path}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 rounded-2xl text-sm font-medium text-gray-700 hover:text-black transition-all group"
                            >
                                <div className="text-gray-400 group-hover:text-black transition-colors">{tool.icon}</div>
                                {tool.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* Right Group */}
          {desktopNavItems.slice(4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative rounded-full transition-all duration-300 ease-out flex items-center gap-2
                  lg:px-3 lg:py-2 xl:px-5 xl:py-3
                  ${isActive 
                    ? 'bg-black text-white shadow-lg font-bold' 
                    : 'text-gray-600 hover:bg-black/5 hover:text-black font-medium'
                  }
                `}
            >
                {React.cloneElement(item.icon as any, { size: 16, className: `lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4`, strokeWidth: isActive ? 2.5 : 2 })}
                <span className="lg:text-[11px] xl:text-[13px] 2xl:text-[14px]">{item.label}</span>
              </Link>
            );
          })}

          <div className="w-px h-5 bg-black/10 mx-1"></div>

          <button
            onClick={() => setIsLeadFormOpen(true)}
            className="apple-btn-primary lg:px-4 lg:py-2.5 xl:px-6 xl:py-3 rounded-full font-bold lg:text-[11px] xl:text-[13px] 2xl:text-[14px] flex items-center gap-2 ml-1"
          >
            <MessageCircle className="fill-current lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4" />
            <span>Заявка</span>
          </button>
        </div>
      </nav>

      {/* --- MOBILE PORTRAIT: 5-Button Dock + Drawer --- */}
      <div className="lg:hidden portrait:block hidden fixed bottom-0 left-0 right-0 z-[200] pb-[env(safe-area-inset-bottom)]">
        
        {/* Glass Drawer (Menu) */}
        <div className={`
            absolute bottom-full left-4 right-4 mb-4 
            bg-white/80 backdrop-blur-[50px] saturate-[180%]
            border border-white/40 ring-1 ring-white/50
            rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)]
            overflow-hidden transition-all duration-500 origin-bottom
            ${isMobileMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
        `}>
            <div className="p-5 grid grid-cols-4 gap-4">
                {mobileDrawerItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-2"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#F2F2F7] flex items-center justify-center text-black shadow-inner">
                            {React.cloneElement(item.icon as any, { size: 22 })}
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>

        {/* 5-Button Dock */}
        <div className="mx-4 mb-4">
            <div className="
                bg-white/80 backdrop-blur-[50px] saturate-[180%]
                border border-white/40 ring-1 ring-white/50
                shadow-[0_20px_40px_rgba(0,0,0,0.2)]
                rounded-[2.5rem] h-[80px]
                flex items-center justify-between px-4
            ">
                {/* 1. HOME */}
                <Link to="/" className="flex-1 flex flex-col items-center gap-1 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${location.pathname === '/' ? 'bg-black text-white shadow-lg' : 'text-gray-500 group-active:scale-90'}`}>
                        <Home size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Главная</span>
                </Link>

                {/* 2. AI */}
                <Link to="/ai" className="flex-1 flex flex-col items-center gap-1 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${location.pathname.startsWith('/ai') ? 'bg-black text-white shadow-lg' : 'text-gray-500 group-active:scale-90'}`}>
                        <Sparkles size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">AI</span>
                </Link>

                {/* 3. CABINET */}
                <Link to="/dashboard" className="flex-1 flex flex-col items-center gap-1 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${location.pathname === '/dashboard' ? 'bg-black text-white shadow-lg' : 'text-gray-500 group-active:scale-90'}`}>
                        <User size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Кабинет</span>
                </Link>

                {/* 4. MENU (Toggle) */}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMobileMenuOpen ? 'bg-black text-white shadow-lg' : 'text-gray-500 group-active:scale-90'}`}>
                        {isMobileMenuOpen ? <X size={24} /> : <Grid2X2 size={24} />}
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Меню</span>
                </button>

                {/* 5. CALL (Action) */}
                <button onClick={() => setIsLeadFormOpen(true)} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black text-white shadow-lg transition-transform active:scale-90">
                        <MessageCircle size={22} className="fill-current" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">Заявка</span>
                </button>
            </div>
        </div>
      </div>

      {/* --- MOBILE LANDSCAPE: Single Row Dock --- */}
      <div className="lg:hidden portrait:hidden fixed bottom-4 left-6 right-6 z-[200] pb-[env(safe-area-inset-bottom)]">
         <div className="
            bg-white/80 backdrop-blur-[50px] saturate-[180%]
            border border-white/40 ring-1 ring-white/50
            shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            rounded-full px-3 py-2
            flex items-center justify-between gap-1
         ">
            {landscapeItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path}
                        to={item.path}
                        className={`
                            flex-1 min-w-0 flex flex-col items-center justify-center py-2 rounded-full transition-all
                            ${isActive ? 'bg-black text-white shadow-md rounded-full' : 'text-gray-500 hover:bg-black/5'}
                        `}
                    >
                        {React.cloneElement(item.icon as any, { size: 18, strokeWidth: isActive ? 2.5 : 2 })}
                        <span className="text-[8px] font-bold mt-0.5 truncate w-full text-center px-1">{item.label}</span>
                    </Link>
                )
            })}
            
            <button 
                onClick={() => setIsLeadFormOpen(true)}
                className="min-w-[80px] bg-black text-white rounded-full py-2 px-3 flex flex-col items-center justify-center shadow-lg ml-1 active:scale-95 transition-transform"
            >
                <MessageCircle size={16} className="fill-current mb-0.5" />
                <span className="text-[8px] font-bold uppercase">Заявка</span>
            </button>
         </div>
      </div>

      <Modal isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} title="Оставить заявку">
        <LeadForm 
            title="Свяжитесь с нами" 
            subtitle="Оставьте контакт, и мы перезвоним в течение 5 минут." 
            className="p-0"
            embedded={true}
        />
      </Modal>
    </>
  );
};

export default Navbar;
