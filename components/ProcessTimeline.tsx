
import React, { useState } from 'react';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import Modal from './Modal';

interface Step {
  step: string;
  title: string;
  text: string;
  details?: string;
  icon: React.ReactNode;
}

interface ProcessTimelineProps {
  steps?: Step[];
  colorTheme?: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo';
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps = [], colorTheme = 'blue' }) => {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  if (!steps || steps.length === 0) {
      return null; 
  }

  const getThemeStyles = () => {
      const themes = {
          blue: { 
              text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', 
              hoverBorder: 'hover:border-blue-200', shadow: 'shadow-blue-100',
              iconBg: 'bg-blue-100', iconText: 'text-blue-600'
          },
          green: { 
              text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', 
              hoverBorder: 'hover:border-green-200', shadow: 'shadow-green-100',
              iconBg: 'bg-green-100', iconText: 'text-green-600'
          },
          orange: { 
              text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', 
              hoverBorder: 'hover:border-orange-200', shadow: 'shadow-orange-100',
              iconBg: 'bg-orange-100', iconText: 'text-orange-600'
          },
          purple: { 
              text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', 
              hoverBorder: 'hover:border-purple-200', shadow: 'shadow-purple-100',
              iconBg: 'bg-purple-100', iconText: 'text-purple-600'
          },
          pink: { 
              text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', 
              hoverBorder: 'hover:border-pink-200', shadow: 'shadow-pink-100',
              iconBg: 'bg-pink-100', iconText: 'text-pink-600'
          },
          indigo: { 
              text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', 
              hoverBorder: 'hover:border-indigo-200', shadow: 'shadow-indigo-100',
              iconBg: 'bg-indigo-100', iconText: 'text-indigo-600'
          },
      };
      return themes[colorTheme] || themes.blue;
  };

  const styles = getThemeStyles();

  // Safe Icon Renderer
  const renderIcon = (icon: React.ReactNode, props: any) => {
      if (!icon) return null;
      try {
          return React.cloneElement(icon as any, props);
      } catch (e) {
          return null;
      }
  };

  return (
    <div className="relative">
        {/* --- DESKTOP GRID LAYOUT --- */}
        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8 relative">
            {steps.map((s, i) => {
                const isLastInRow = (i + 1) % 3 === 0;
                const isLastItem = i === steps.length - 1;

                return (
                    <div key={i} className="relative group h-full">
                        {/* Visual Connector (Arrow between cards) */}
                        {!isLastInRow && !isLastItem && (
                            <div className="absolute top-12 -right-5 lg:-right-6 z-10 text-gray-300">
                                <ChevronRight size={32} strokeWidth={1.5} />
                            </div>
                        )}

                        {/* The Card */}
                        <div 
                            onClick={() => setSelectedStep(s)}
                            className={`
                                h-full p-8 rounded-[2.5rem] bg-white 
                                border border-transparent ${styles.hoverBorder}
                                shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]
                                cursor-pointer transition-all duration-300 hover:-translate-y-1
                                relative overflow-hidden group/card
                            `}
                        >
                            {/* Huge Background Number */}
                            <div className="absolute -right-4 -bottom-10 text-[10rem] font-black leading-none text-[#F5F5F7] select-none pointer-events-none group-hover/card:text-gray-100 transition-colors duration-500">
                                {s.step.replace(/^0+/, '')} 
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center 
                                        ${styles.iconBg} ${styles.iconText} 
                                        shadow-sm group-hover/card:scale-110 transition-transform duration-300
                                    `}>
                                        {renderIcon(s.icon, { size: 32, strokeWidth: 1.5 })}
                                    </div>
                                    <div className="py-1 px-3 rounded-lg bg-[#F5F5F7] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Этап {s.step}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover/card:text-black transition-colors">
                                        {s.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                        {s.text}
                                    </p>
                                </div>

                                {/* Footer Link */}
                                <div className={`mt-8 flex items-center gap-2 text-sm font-bold ${styles.text} opacity-90 group-hover/card:opacity-100 transition-opacity`}>
                                    <span>Подробнее</span>
                                    <ArrowRight size={16} className="group-hover/card:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* --- MOBILE LAYOUT (Vertical Stack) --- */}
        <div className="md:hidden space-y-4">
            {steps.map((s, i) => (
                <div 
                    key={i} 
                    onClick={() => setSelectedStep(s)}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-transform relative overflow-hidden"
                >
                    {/* BG Number Mobile */}
                    <div className="absolute -right-2 -bottom-6 text-[6rem] font-black text-[#F9F9FA] select-none pointer-events-none">
                        {s.step.replace(/^0+/, '')}
                    </div>

                    <div className="relative z-10 flex gap-5 items-start">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                            ${styles.iconBg} ${styles.iconText}
                        `}>
                            {renderIcon(s.icon, { size: 24, strokeWidth: 1.5 })}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Этап {s.step}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {s.text}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <Modal isOpen={!!selectedStep} onClose={() => setSelectedStep(null)} title={selectedStep?.title}>
            <div className="space-y-8">
                {/* Header Visual */}
                <div className={`relative h-32 rounded-3xl bg-gradient-to-br ${styles.bg.replace('bg-', 'from-white to-')} overflow-hidden flex items-center justify-center shadow-inner border border-gray-100`}>
                    <div className={`opacity-20 absolute -bottom-8 -right-4 ${styles.text}`}>
                        {renderIcon(selectedStep?.icon, { size: 160 })}
                    </div>
                    <div className={`text-6xl font-black ${styles.text} z-10 opacity-50`}>
                        {selectedStep?.step}
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{selectedStep?.text}</h3>
                    
                    {selectedStep?.details && (
                        <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100">
                            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                <div className={`w-2 h-2 rounded-full ${styles.iconBg.replace('bg-', 'bg-opacity-100 bg-')}`}></div>
                                Детали этапа:
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-base">
                                {selectedStep.details}
                            </p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => setSelectedStep(null)} 
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg ${styles.text.replace('text-', 'bg-')} hover:opacity-90 transition-opacity text-lg flex items-center justify-center gap-2`}
                >
                    <Check size={20} /> Понятно
                </button>
            </div>
        </Modal>
    </div>
  );
};

export default ProcessTimeline;
