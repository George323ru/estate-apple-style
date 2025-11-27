
import React, { useState } from 'react';
import Modal from './Modal';
import { Check, MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { useTracking } from '../context/TrackingContext';
import { api } from '../services/api';

interface LeadFormProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
  embedded?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ 
  title = "Остались вопросы?", 
  subtitle = "Оставьте номер, мы перезвоним через 5 минут.", 
  buttonText = "Получить консультацию",
  icon = <MessageCircle size={32} />,
  className,
  embedded = false
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getJourney } = useTracking();

  const handleSubmit = async () => {
    setError(null);

    if (!privacyAccepted) {
      setError("Необходимо принять политику конфиденциальности");
      return;
    }
    if (!phone) {
        setError("Введите номер телефона");
        return;
    }

    setLoading(true);

    try {
        // Collect User Journey Data
        const journey = getJourney();
        
        // Send to API / CRM
        await api.submitLead({
            phone,
            name,
            source: embedded ? 'lead_form_embedded' : 'lead_form_section',
            journey: journey,
            metadata: { message }
        });

        setSubmitted(true);
    } catch (e) {
        console.error(e);
        setError("Ошибка отправки. Попробуйте позже.");
    } finally {
        setLoading(false);
    }
  };

  if (submitted) {
      return (
          <div className={`${embedded ? 'py-8' : 'max-w-2xl mx-auto text-center py-16 my-8 mx-2 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-12'} ${className}`}>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
                  <Check size={48} className="text-green-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Заявка принята!</h3>
              <p className="text-gray-500 text-lg mb-8">Менеджер свяжется с вами в ближайшее время.</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold hover:underline text-lg">Отправить еще одну</button>
          </div>
      );
  }

  // Stylish Volumetric Container Styling
  const containerClasses = embedded 
    ? `w-full ${className || ''}`
    : `max-w-2xl mx-auto my-12 relative ${className || ''}`;
    
  const innerClasses = embedded
    ? "" 
    : "bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-white/50";

  return (
    <>
      <div className={containerClasses}>
        <div className={innerClasses}>
            
            <div className="text-center mb-10">
              {!embedded && (
                  <div className="w-20 h-20 mx-auto bg-[#F5F5F7] rounded-[2rem] flex items-center justify-center mb-8 text-gray-900 shadow-inner">
                      {icon}
                  </div>
              )}
              {embedded && icon && (
                   <div className="w-16 h-16 mx-auto bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-6 text-gray-900 shadow-inner">
                      {React.cloneElement(icon as any, { size: 32 })}
                   </div>
              )}
              <h2 className={`${embedded ? 'text-2xl' : 'text-3xl md:text-5xl'} font-bold mb-4 tracking-tight text-gray-900 leading-tight`}>{title}</h2>
              <p className="text-gray-500 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">{subtitle}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как вас зовут?" 
                  className="w-full p-5 rounded-2xl apple-input font-medium text-lg placeholder-gray-400 focus:scale-[1.01] transition-all" 
                />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(null); }}
                  placeholder="+7 (999) 000-00-00" 
                  className={`w-full p-5 rounded-2xl apple-input font-medium text-lg placeholder-gray-400 focus:scale-[1.01] transition-all ${error ? 'ring-2 ring-red-100 bg-red-50' : ''}`}
                />
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ваш комментарий (необязательно)" 
                  className="w-full p-5 rounded-2xl apple-input font-medium text-lg placeholder-gray-400 focus:scale-[1.01] transition-all min-h-[120px] resize-none" 
                />
              </div>
              
              <div className="flex items-center gap-3 py-2 px-1 justify-center">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id={`privacy-form-${embedded ? 'emb' : 'main'}`} 
                    checked={privacyAccepted}
                    onChange={e => { setPrivacyAccepted(e.target.checked); setError(null); }}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-black checked:bg-black transition-all"
                  />
                  <Check size={14} className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <label htmlFor={`privacy-form-${embedded ? 'emb' : 'main'}`} className="text-sm text-gray-500 select-none">
                  Я согласен с <button onClick={() => setShowPrivacyModal(true)} className="text-black font-bold hover:underline">правилами обработки данных</button>
                </label>
              </div>

              {error && (
                  <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold animate-fade-in">
                      <AlertCircle size={16} />
                      {error}
                  </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="apple-btn-primary w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? "Отправка..." : buttonText}
              </button>
            </div>
        </div>
      </div>

      <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Согласие на обработку данных">
        <div className="prose prose-sm max-w-none text-gray-600">
           <p>В соответствии с Федеральным законом от 27.07.2006 N 152-ФЗ "О персональных данных", я даю свое согласие на обработку моих персональных данных.</p>
           <ul className="list-disc pl-5 space-y-1">
               <li>Фамилия, имя, отчество;</li>
               <li>Номер телефона;</li>
               <li>Адрес электронной почты.</li>
           </ul>
           <p className="mt-2">Цель обработки: предоставление консультационных услуг, связь с менеджером, анализ пользовательского опыта.</p>
           <div className="mt-6 flex justify-end">
             <button onClick={() => setShowPrivacyModal(false)} className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Принимаю</button>
           </div>
        </div>
      </Modal>
    </>
  );
};

export default LeadForm;
