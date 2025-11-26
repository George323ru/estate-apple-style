
import React, { useState } from 'react';
import Section from './Section';
import { Plus, Briefcase, User, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import LeadForm from './LeadForm';

interface Expert {
  name: string;
  role: string;
  image: string;
  exp: string;
  bio?: string; // Added bio
}

interface ExpertsSectionProps {
  title?: string;
  experts?: Expert[];
  colorTheme?: 'blue' | 'green' | 'purple' | 'pink' | 'indigo' | 'orange' | 'gray';
}

const DEFAULT_EXPERTS: Expert[] = [
    { 
        name: "Алексей М.", 
        role: "Ведущий эксперт", 
        exp: "10 лет опыта", 
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
        bio: "Специализируется на элитной недвижимости в ЦАО. Провел более 300 сделок. Знает каждый дом на Остоженке и Патриарших."
    },
    { 
        name: "Елена В.", 
        role: "Руководитель отдела", 
        exp: "12 лет опыта", 
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
        bio: "Эксперт по сложным альтернативным сделкам и ипотеке. Помогает семьям расширять жилплощадь с максимальной выгодой."
    },
    { 
        name: "Дмитрий К.", 
        role: "Топ-брокер", 
        exp: "8 лет опыта", 
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
        bio: "Инвестиционный консультант. Помогает клиентам зарабатывать на новостройках до 30% годовых. Аналитический склад ума."
    }
];

const ExpertsSection: React.FC<ExpertsSectionProps> = ({ 
  title = "Наши эксперты", 
  experts = DEFAULT_EXPERTS, 
  colorTheme = 'blue' 
}) => {
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'green': return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300', hoverBorder: 'group-hover:border-green-400', btn: 'bg-green-600 hover:bg-green-700' };
      case 'purple': return { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-300', hoverBorder: 'group-hover:border-purple-400', btn: 'bg-purple-600 hover:bg-purple-700' };
      case 'pink': return { text: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-300', hoverBorder: 'group-hover:border-pink-400', btn: 'bg-pink-600 hover:bg-pink-700' };
      case 'indigo': return { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-300', hoverBorder: 'group-hover:border-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700' };
      case 'orange': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300', hoverBorder: 'group-hover:border-orange-400', btn: 'bg-orange-600 hover:bg-orange-700' };
      case 'gray': return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-300', hoverBorder: 'group-hover:border-gray-400', btn: 'bg-gray-800 hover:bg-black' };
      default: return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300', hoverBorder: 'group-hover:border-blue-400', btn: 'bg-blue-600 hover:bg-blue-700' };
    }
  };

  const styles = getThemeStyles();

  return (
    <Section title={title}>
      {/* Desktop: 4 columns. Mobile: 2 columns (2 rows) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {experts.map((expert, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedExpert(expert)}
            className="group cursor-pointer flex flex-col h-full"
          >
            {/* Large Vertical Portrait Frame */}
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
               <img src={expert.image} alt={expert.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               
               {/* Floating Experience Badge */}
               <div className={`absolute top-4 right-4 ${styles.bg} ${styles.text} px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md bg-opacity-95 shadow-sm border border-white/50`}>
                  {expert.exp}
               </div>
               
               {/* Bottom Gradient for contrast */}
               <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold shadow-lg text-black whitespace-nowrap">
                   Подробнее
               </div>
            </div>
            
            <div className="text-center">
                <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-black transition-colors">{expert.name}</h3>
                <p className="text-gray-500 font-medium text-sm">{expert.role}</p>
            </div>
          </div>
        ))}

        {/* 'Join Us' Card */}
        <div 
            onClick={() => setIsRecruitModalOpen(true)}
            className="flex flex-col h-full group cursor-pointer"
        >
            <div className={`
                w-full aspect-[3/4]
                rounded-[2.5rem] border-2 border-dashed ${styles.border} ${styles.hoverBorder}
                flex flex-col items-center justify-center p-6 
                transition-all duration-300 bg-gray-50/50 hover:bg-white
                relative overflow-hidden mb-6
            `}>
                <div className={`
                    w-20 h-20 rounded-full ${styles.bg} ${styles.text} 
                    flex items-center justify-center mb-6 
                    group-hover:scale-110 transition-transform duration-300 shadow-md
                `}>
                    <Plus size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Вы?</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 group-hover:text-gray-600 text-center px-4">
                    Стать частью команды
                </p>
            </div>
            
            <div className="text-center opacity-0">
                <h3 className="font-bold text-xl mb-1">Placeholder</h3>
                <p className="text-sm">Placeholder</p>
            </div>
        </div>
      </div>

      <Modal isOpen={isRecruitModalOpen} onClose={() => setIsRecruitModalOpen(false)} title="Присоединяйтесь к команде">
          <LeadForm 
            title="Карьера в Estate AI" 
            subtitle="Мы ищем талантливых экспертов. Оставьте контакты, и HR свяжется с вами." 
            buttonText="Отправить резюме" 
            icon={<Briefcase size={32} />}
            embedded={true}
            className="p-0"
          />
      </Modal>

      <Modal isOpen={!!selectedExpert} onClose={() => setSelectedExpert(null)} title="Эксперт">
          {selectedExpert && (
              <div>
                  <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex-shrink-0 mx-auto md:mx-0">
                          <img src={selectedExpert.image} alt={selectedExpert.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedExpert.name}</h3>
                          <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mb-4 ${styles.bg} ${styles.text}`}>
                              {selectedExpert.role}
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                              {selectedExpert.bio || "Опытный специалист, готовый решить вашу задачу с недвижимостью в кратчайшие сроки."}
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm font-bold">
                              <Briefcase size={16}/> {selectedExpert.exp}
                          </div>
                      </div>
                  </div>
                  
                  <LeadForm 
                    title={`Написать эксперту`}
                    subtitle={`Оставьте заявку, и ${selectedExpert.name} свяжется с вами лично.`}
                    buttonText="Отправить запрос"
                    icon={<MessageCircle size={24}/>}
                    embedded={true}
                    className="p-0 shadow-none border-t border-gray-100 pt-6"
                  />
              </div>
          )}
      </Modal>
    </Section>
  );
};

export default ExpertsSection;
