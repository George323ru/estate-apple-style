
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Modal from './Modal';
import GlassCard from './GlassCard';

interface Step {
  step: string;
  title: string;
  text: string;
  details?: string;
  icon: React.ReactNode;
}

interface ProcessTimelineProps {
  steps: Step[];
  colorTheme?: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo';
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps, colorTheme = 'blue' }) => {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  const themeStyles = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', iconBg: 'bg-green-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', iconBg: 'bg-pink-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-600' },
  }[colorTheme];

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
                <div 
                    key={i} 
                    onClick={() => setSelectedStep(s)}
                    className="group cursor-pointer h-full"
                >
                    <GlassCard className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300 border border-white/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${themeStyles.bg} ${themeStyles.text} group-hover:bg-black group-hover:text-white transition-colors shadow-sm`}>
                                {React.cloneElement(s.icon as any, { size: 24 })}
                            </div>
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                Шаг {s.step}
                            </span>
                        </div>
                        
                        <h3 className={`font-bold text-lg mb-2 group-hover:${themeStyles.text} transition-colors`}>{s.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                            {s.text}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-black transition-colors mt-auto border-t border-gray-100 pt-4">
                            Подробнее <ArrowRight size={14} />
                        </div>
                    </GlassCard>
                </div>
            ))}
        </div>

        <Modal isOpen={!!selectedStep} onClose={() => setSelectedStep(null)} title={selectedStep?.title}>
            <div className="space-y-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg bg-black mx-auto mb-4`}>
                    {selectedStep?.step}
                </div>
                <p className="text-xl font-medium text-center text-gray-900">
                    {selectedStep?.text}
                </p>
                
                {selectedStep?.details && (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-600 leading-relaxed text-left">
                        <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Детали этапа</h4>
                        {selectedStep.details}
                    </div>
                )}

                <button onClick={() => setSelectedStep(null)} className="w-full py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                    Понятно
                </button>
            </div>
        </Modal>
    </>
  );
};

export default ProcessTimeline;
