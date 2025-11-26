
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Mail, Check, ArrowRight } from 'lucide-react';

const SubscriptionForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <GlassCard className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none p-8 md:p-12 mx-2 my-6 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-blue-200" size={32} />
            <h3 className="text-2xl font-bold">Подпишитесь на рассылку</h3>
          </div>
          <p className="text-blue-100 text-lg">
            Получайте аналитику рынка, закрытые старты продаж и советы экспертов первыми. Никакого спама.
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="flex-1 w-full max-w-md relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email" 
            className="w-full p-4 pr-16 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-blue-300/50 transition-all shadow-lg"
            required
          />
          <button 
            type="submit"
            className={`absolute right-2 top-2 bottom-2 rounded-full px-4 flex items-center justify-center transition-all duration-300 ${subscribed ? 'bg-green-500 text-white w-12' : 'bg-black text-white w-12 hover:w-16 hover:bg-gray-800'}`}
          >
            {subscribed ? <Check size={20} /> : <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </GlassCard>
  );
};

export default SubscriptionForm;
