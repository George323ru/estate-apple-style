import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-lg border-t border-white/50 pt-16 pb-28 md:pb-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">E</div>
              <span className="font-bold text-xl tracking-tight text-black">Estate<span className="font-light text-blue-600">AI</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
                Инновационное агентство. Сочетаем человеческий опыт и технологии Gemini для безупречного сервиса.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4">Услуги</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link to="/buy-new" className="hover:text-blue-600 transition-colors">Купить новостройку</Link></li>
                <li><Link to="/buy-resale" className="hover:text-blue-600 transition-colors">Купить вторичку</Link></li>
                <li><Link to="/sell" className="hover:text-blue-600 transition-colors">Продать квартиру</Link></li>
                <li><Link to="/rent-out" className="hover:text-blue-600 transition-colors">Сдать в аренду</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4">Компания</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Блог</Link></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Вакансии</a></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-gray-900 text-lg mb-4">Мы в соцсетях</h4>
             <div className="flex gap-3 mb-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"><Instagram size={18} /></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"><Twitter size={18} /></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"><Facebook size={18} /></a>
             </div>
             <p className="text-gray-400 text-xs">
                 Москва, Пресненская наб., 12<br/>
                 +7 (495) 000-00-00
             </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>&copy; 2024 Estate AI. Liquid Glass Design.</p>
            <div className="flex gap-6">
                <a href="#" className="hover:text-black">Политика конфиденциальности</a>
                <a href="#" className="hover:text-black">Публичная оферта</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;