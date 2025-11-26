
import React from 'react';
import Section from './Section';
import { Check, X, AlertCircle } from 'lucide-react';

interface ComparisonPoint {
  title: string;
  without: string;
  with: string;
}

interface ComparisonBlockProps {
  items: ComparisonPoint[];
  title?: string;
  theme?: 'blue' | 'green' | 'purple' | 'pink' | 'indigo' | 'orange';
}

const ComparisonBlock: React.FC<ComparisonBlockProps> = ({ 
  items, 
  title = "С нами / Без нас", 
  theme = 'blue' 
}) => {

  const getThemeStyles = () => {
    switch (theme) {
      case 'green': return { iconColor: 'text-green-600', bg: 'bg-green-50' };
      case 'purple': return { iconColor: 'text-purple-600', bg: 'bg-purple-50' };
      case 'pink': return { iconColor: 'text-pink-600', bg: 'bg-pink-50' };
      case 'indigo': return { iconColor: 'text-indigo-600', bg: 'bg-indigo-50' };
      case 'orange': return { iconColor: 'text-orange-600', bg: 'bg-orange-50' };
      default: return { iconColor: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  const styles = getThemeStyles();

  return (
    <Section title={title}>
      <div className="relative max-w-6xl mx-auto py-8 lg:py-12">
        <div className="grid md:grid-cols-2 items-center">
          
          {/* LEFT CARD (Without Us) - Recessed Matte */}
          <div className="
            relative z-0 
            bg-[#F2F2F7] rounded-[2.5rem] p-8 md:p-12 
            md:pr-24 lg:pr-32 
            text-gray-500 
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
            flex flex-col justify-center
            min-h-[500px]
          ">
            <div className="flex items-center gap-4 mb-8 md:mb-12 opacity-70">
              <div className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center shadow-inner">
                <X size={24} strokeWidth={3} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Обычно</h3>
            </div>
            
            <div className="space-y-8 md:space-y-10">
              {items.map((point, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-gray-300">
                  <h4 className="font-bold text-gray-400 text-sm uppercase tracking-wider mb-1">{point.title}</h4>
                  <p className="text-base md:text-lg font-medium leading-snug">{point.without}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CARD (With Estate AI) - Floating Liquid Glass */}
          <div className="
            relative z-10 
            md:-ml-16 lg:-ml-24 
            mt-[-2rem] md:mt-0
            apple-glass p-8 md:p-12 
            rounded-[2.5rem] 
            border border-white/60
            backdrop-blur-xl
            bg-white/80
            transform md:scale-105
            flex flex-col justify-center
            min-h-[500px]
          ">
            {/* Glass Reflection Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-white/20 pointer-events-none rounded-[2.5rem]"></div>

            <div className="relative">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                <div className={`w-12 h-12 rounded-full ${styles.bg} ${styles.iconColor} flex items-center justify-center shadow-lg border border-white`}>
                    <Check size={24} strokeWidth={3} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">В Estate AI</h3>
                </div>
                
                <div className="space-y-8 md:space-y-10">
                {items.map((point, i) => (
                    <div key={i} className="group">
                        <h4 className={`font-bold text-sm uppercase tracking-wider mb-1 ${styles.iconColor} opacity-80`}>{point.title}</h4>
                        <p className="text-lg md:text-xl font-bold text-gray-900 leading-snug">{point.with}</p>
                    </div>
                ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
};

export default ComparisonBlock;
