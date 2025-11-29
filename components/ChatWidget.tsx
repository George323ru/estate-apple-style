
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import { chatWithAI } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Привет! Я ваш AI помощник по недвижимости. Чем могу помочь?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Загрузка истории из localStorage при монтировании
  useEffect(() => {
    const savedHistory = localStorage.getItem('estate-chat-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Сохранение истории в localStorage при изменении
  useEffect(() => {
    if (messages.length > 1) { // Сохраняем только если есть сообщения кроме приветствия
      localStorage.setItem('estate-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Convert history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }] as [{ text: string }]
      }));

      const response = await chatWithAI(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response || "Ошибка." }]);
    } catch (e) {
      console.error("Chat Widget Error:", e);
      setMessages(prev => [...prev, { role: 'model', text: "Что-то пошло не так, попробуйте позже." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    const initialMessage = { role: 'model' as const, text: 'Привет! Я ваш AI помощник по недвижимости. Чем могу помочь?' };
    setMessages([initialMessage]);
    localStorage.removeItem('estate-chat-history');
  };

  return (
    // Updated breakpoint: lg (1024px) matches Navbar. 
    // Mobile (<1024px): bottom-32 to clear the dock.
    // Desktop (>=1024px): bottom-6 for corner position.
    <div className="fixed bottom-32 lg:bottom-6 right-6 z-[150] flex flex-col items-end transition-all duration-300">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] rounded-[2rem] flex flex-col overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] animate-slide-up border border-white/60 bg-white/80 backdrop-blur-xl ring-1 ring-white/50">

          {/* Header */}
          <div className="p-4 border-b border-white/30 bg-white/40 backdrop-blur flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg text-white border border-white/20">
                <Sparkles size={14} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm leading-tight">Estate AI</div>
                <div className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="hover:bg-black/5 p-2 rounded-full transition-colors"
                title="Очистить историю"
              >
                <Trash2 size={16} className="text-gray-500" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black/5 p-2 rounded-full transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-white/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                  ? 'bg-black text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                  }`}>
                  <div className="prose prose-sm max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&_strong]:font-bold">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="leading-relaxed my-1">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc ml-4 space-y-0.5 my-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-4 space-y-0.5 my-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 px-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center border border-gray-100">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area - Improved iOS Style */}
          <div className="p-3 md:p-4 bg-white/90 backdrop-blur-xl border-t border-white/40">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Сообщение..."
                className="flex-1 bg-[#F2F2F7] border-none rounded-2xl px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 outline-none placeholder-gray-400 text-gray-900 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-12 h-12 bg-black text-white rounded-2xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center flex-shrink-0"
              >
                <Send size={20} className={loading ? "animate-pulse" : "ml-0.5"} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        aria-label="Chat"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 lg:w-16 lg:h-16 bg-black text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform flex items-center justify-center group border-2 border-white/20"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

export default ChatWidget;
