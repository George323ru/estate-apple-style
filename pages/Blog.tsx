
import React, { useState, useMemo } from 'react';
import Section from '../components/Section';
import { BLOG_POSTS } from '../services/blogData';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriptionForm from '../components/SubscriptionForm';
import GlassCard from '../components/GlassCard';

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'buy-new', label: 'Новостройки' },
  { id: 'buy-sec', label: 'Вторичка' },
  { id: 'sell', label: 'Продажа' },
  { id: 'rent', label: 'Аренда' },
  { id: 'prep', label: 'Дизайн & Стейджинг' }
];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.id.startsWith(selectedCategory);
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Determine Layout
  // If we are on "All" and not searching, show the Featured Post layout.
  // Otherwise, show a standard uniform grid.
  const isDefaultView = selectedCategory === 'all' && !searchQuery;
  const featuredPost = isDefaultView ? filteredPosts[0] : null;
  const gridPosts = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="pt-4 lg:pt-24 min-h-screen">
      <Section className="pb-8">
        <div className="text-center mb-10">
           <h1 className="text-4xl md:text-5xl font-bold mb-4">Блог Estate AI</h1>
           <p className="text-gray-500 text-lg">Инсайты рынка, советы экспертов и тренды дизайна.</p>
        </div>

        {/* --- NAVIGATION BAR --- */}
        <div className="max-w-7xl mx-auto mb-12 sticky top-2 lg:top-24 z-40">
           <div className="apple-glass p-3 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl backdrop-blur-xl">
               
               {/* Categories (Scrollable) - Updated padding for shadows */}
               <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto p-4 -m-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`
                        flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                        ${selectedCategory === cat.id 
                            ? 'bg-black text-white shadow-lg scale-105' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black'}
                      `}
                    >
                      {cat.label}
                    </button>
                  ))}
               </div>

               {/* Search Input */}
               <div className="relative w-full md:w-80 flex-shrink-0 px-2 md:px-0">
                  <Search className="absolute left-5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск статей..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-full apple-input text-sm font-medium outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X size={14} />
                    </button>
                  )}
               </div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          
          {/* Featured Post (Only visible in default view) */}
          {featuredPost && (
            <Link to={`/blog/${featuredPost.id}`} className="md:col-span-2 lg:col-span-3 group cursor-pointer relative overflow-hidden rounded-[2.5rem] h-[500px] block shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all">
                <img src={featuredPost.image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-16">
                    <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-4">
                        Выбор редакции
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{featuredPost.title}</h2>
                    <p className="text-gray-200 max-w-2xl text-lg md:text-xl leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="mt-8 flex items-center gap-2 text-white font-bold group-hover:translate-x-2 transition-transform">
                        Читать статью <ArrowUpRight />
                    </div>
                </div>
            </Link>
          )}

          {/* Grid Posts */}
          {gridPosts.length > 0 ? (
            gridPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group cursor-pointer block h-full">
                <GlassCard className="h-full p-0 overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-500 border-0 shadow-lg">
                  <div className="h-64 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-gray-800">
                        {post.date}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm mb-6 line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">5 мин чтение</span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-600">Ничего не найдено</h3>
                <p className="text-gray-400 mt-2">Попробуйте изменить категорию или поисковый запрос.</p>
                <button 
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    className="mt-6 text-blue-600 font-bold hover:underline"
                >
                    Сбросить фильтры
                </button>
            </div>
          )}
        </div>

        <div className="my-16">
          <SubscriptionForm />
        </div>
      </Section>
    </div>
  );
};

export default Blog;
