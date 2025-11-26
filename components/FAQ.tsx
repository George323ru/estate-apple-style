import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = "Частые вопросы" }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <GlassCard 
            key={index} 
            className={`transition-all duration-300 cursor-pointer hover:bg-white/60 ${openIndex === index ? 'bg-white/80' : ''}`}
            onClick={() => toggle(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg pr-4 flex items-center gap-3">
                <HelpCircle size={20} className="text-blue-500 flex-shrink-0" />
                {item.question}
              </h3>
              {openIndex === index ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                {item.answer}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default FAQ;