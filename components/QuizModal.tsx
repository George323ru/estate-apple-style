
import React, { useState } from 'react';
import Modal from './Modal';
import { Check, Award, ArrowRight, Gift, Phone, MessageCircle, Send, AlertCircle } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    q: "Какая цель покупки?",
    a: ["Для жизни", "Инвестиции (сдача)", "Инвестиции (перепродажа)", "Для детей"]
  },
  {
    q: "Какой бюджет рассматриваете?",
    a: ["До 10 млн ₽", "10 - 20 млн ₽", "20 - 40 млн ₽", "Без ограничений"]
  },
  {
    q: "Сколько комнат необходимо?",
    a: ["Студия", "1 спальня", "2 спальни", "3+ спальни"]
  },
  {
    q: "Важна ли отделка?",
    a: ["Только с ремонтом", "White box", "Черновая", "Не имеет значения"]
  },
  {
    q: "Когда планируете сделку?",
    a: ["В этом месяце", "В течение 3 месяцев", "Полгода-год", "Просто смотрю"]
  }
];

type CommunicationChannel = 'whatsapp' | 'telegram' | 'call';

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 -> CONTACT_STEP -> RESULT_STEP
  const [answers, setAnswers] = useState<string[]>([]);
  const [viewState, setViewState] = useState<'QUIZ' | 'CONTACT' | 'RESULT'>('QUIZ');
  
  // Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<CommunicationChannel>('whatsapp');
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = (ans: string) => {
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setViewState('CONTACT');
    }
  };

  const submitContacts = () => {
    setError(null);
    if (!phone || phone.length < 5) { // Basic validation
      setError("Пожалуйста, введите корректный номер телефона");
      return;
    }
    // Simulate API submission
    setViewState('RESULT');
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setViewState('QUIZ');
    setName('');
    setPhone('');
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={
      viewState === 'QUIZ' ? `Вопрос ${step + 1}/${QUESTIONS.length}` : 
      viewState === 'CONTACT' ? "Почти готово!" : "Ваш результат"
    }>
      
      {/* STEP 1: QUESTIONS */}
      {viewState === 'QUIZ' && (
        <div>
          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
             <div 
               className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
               style={{width: `${((step + 1) / QUESTIONS.length) * 100}%`}}
             ></div>
          </div>
          
          <h3 className="text-2xl font-bold mb-8">{QUESTIONS[step].q}</h3>
          
          <div className="grid gap-3">
            {QUESTIONS[step].a.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium flex justify-between items-center group"
              >
                {opt}
                <div className="w-6 h-6 rounded-full border border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-500 flex items-center justify-center">
                    <Check size={14} className="text-white opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: CONTACT FORM */}
      {viewState === 'CONTACT' && (
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={40} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Мы подобрали 3 варианта</h3>
          <p className="text-gray-500 mb-8">
            Оставьте контакты, чтобы AI отправил вам подборку и закрепил скидку 10%.
          </p>

          <div className="space-y-4 text-left mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ваше имя</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Иван"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Номер телефона*</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(null); }}
                className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none ${error ? 'border-red-300 bg-red-50' : ''}`}
                placeholder="+7 (999) 000-00-00"
              />
              {error && <div className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle size={12}/> {error}</div>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Куда прислать подборку?</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setChannel('whatsapp')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${channel === 'whatsapp' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <MessageCircle size={20} /> <span className="text-xs font-bold">WhatsApp</span>
                </button>
                <button 
                  onClick={() => setChannel('telegram')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${channel === 'telegram' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <Send size={20} /> <span className="text-xs font-bold">Telegram</span>
                </button>
                <button 
                  onClick={() => setChannel('call')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${channel === 'call' ? 'bg-gray-100 border-black text-black' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <Phone size={20} /> <span className="text-xs font-bold">Звонок</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={submitContacts}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 shadow-xl transition-all transform hover:scale-[1.02]"
          >
            Получить подборку
          </button>
          <p className="text-xs text-gray-400 mt-4">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</p>
        </div>
      )}

      {/* STEP 3: RESULTS */}
      {viewState === 'RESULT' && (
        <div className="text-center py-4">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Gift size={48} className="text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold mb-2">Поздравляем!</h3>
            <p className="text-gray-500 mb-8">
              Менеджер уже формирует персональный PDF-файл. Мы отправим его в {channel === 'whatsapp' ? 'WhatsApp' : channel === 'telegram' ? 'Telegram' : 'СМС'} на номер {phone} в течение 5 минут.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 text-left">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">Ваша скидка:</span>
                    <span className="font-bold text-2xl text-blue-600">10%</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">Статус:</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">АКТИВИРОВАНО</span>
                </div>
            </div>

            <button onClick={onClose} className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 shadow-sm flex items-center justify-center gap-2">
                Вернуться на сайт
            </button>
        </div>
      )}
    </Modal>
  );
};

export default QuizModal;
