
import React, { useState } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import { Percent, ArrowLeft, CheckCircle, Search, Briefcase, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const AISmartMortgage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const handleFind = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 2000);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Section className="py-8">
        <div className="mb-8">
             <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                 <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
             </Link>
             <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-4">Финансы</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Умная Ипотека</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    AI анализирует скрытые предложения 50 банков, чтобы найти ставку ниже рыночной.
                </p>
            </div>
        </div>

        <div className="max-w-6xl mx-auto">
            {/* Inputs */}
            <GlassCard className="p-8 mb-12">
                <div className="grid md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Wallet size={16}/> Доход в месяц</label>
                        <input type="text" placeholder="150 000 ₽" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Briefcase size={16}/> Первоначальный взнос</label>
                        <input type="text" placeholder="2 000 000 ₽" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-indigo-500" />
                    </div>
                    <button 
                        onClick={handleFind}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Search className="animate-spin" /> : <Percent />}
                        {loading ? 'Сканируем банки...' : 'Найти ставку'}
                    </button>
                </div>
            </GlassCard>

            {/* Results */}
            {result && (
                <div className="grid gap-6 animate-fade-in">
                    {/* Best Offer */}
                    <GlassCard className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white border-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">ВЫБОР AI</div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-900 font-bold text-2xl">
                                    С
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Сбер (Спецпрограмма)</h3>
                                    <p className="text-indigo-200">Семейная ипотека + Скидка застройщика</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <div className="text-5xl font-bold text-green-400 mb-1">3.5%</div>
                                <div className="text-sm text-gray-400">на весь срок</div>
                            </div>
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                                Оформить
                            </button>
                        </div>
                    </GlassCard>

                    {/* Other Offers */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <GlassCard className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">А</div>
                                <div>
                                    <div className="font-bold">Альфа-Банк</div>
                                    <div className="text-xs text-gray-500">IT Ипотека</div>
                                </div>
                            </div>
                            <div className="text-xl font-bold">5.0%</div>
                        </GlassCard>
                        <GlassCard className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">В</div>
                                <div>
                                    <div className="font-bold">ВТБ</div>
                                    <div className="text-xs text-gray-500">Господдержка</div>
                                </div>
                            </div>
                            <div className="text-xl font-bold">8.0%</div>
                        </GlassCard>
                    </div>
                </div>
            )}
        </div>
      </Section>
    </div>
  );
};

export default AISmartMortgage;
