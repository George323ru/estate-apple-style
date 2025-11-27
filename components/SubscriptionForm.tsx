
import React, { useState } from 'react';
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
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#007AFF] p-6 md:p-8 text-white shadow-xl transition-transform hover:scale-[1.005] duration-300">
        {/* Decorative Ambience */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-purple-500/30 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 flex items-center gap-4 text-center md:text-left">
                <div className="hidden md:flex w-12 h-12 rounded-xl bg-white/20 items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 flex-shrink-0">
                    <Mail size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold leading-tight mb-1">Подпишитесь на рассылку</h3>
                    <p className="text-blue-50 text-sm font-medium opacity-90 leading-relaxed">
                        Аналитика рынка и закрытые старты продаж. Без спама.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto md:min-w-[350px] relative group">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email" 
                    className="w-full h-12 pl-5 pr-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-blue-100 outline-none focus:bg-white/20 focus:border-white/50 transition-all text-sm font-medium shadow-inner"
                    required
                />
                <button 
                    type="submit" 
                    className={`absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-full flex items-center justify-center transition-all shadow-sm ${subscribed ? 'bg-green-400 text-white' : 'bg-white text-[#007AFF] hover:scale-105 active:scale-95'}`}
                >
                    {subscribed ? <Check size={18} /> : <ArrowRight size={18} />}
                </button>
            </form>
        </div>
    </div>
  );
};

export default SubscriptionForm;
