
import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import { ArrowUpRight, Search, X, Mail, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriptionForm from '../components/SubscriptionForm';
import GlassCard from '../components/GlassCard';
import LeadForm from '../components/LeadForm';
import { BlogPost } from '../types';

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'buy-new', label: 'Новостройки' },
  { id: 'buy-sec', label: 'Вторичка' },
  { id: 'sell', label: 'Продажа' },
  { id: 'rent', label: 'Аренда' },
  { id: 'prep', label: 'Дизайн' }
];

const POSTS_PER_PAGE = 10;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch posts from WP
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { fetchWpPosts } = await import('../services/wpApi');
        const data = await fetchWpPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // In WP, we might not have the prefix-based ID anymore.
      // For now, we allow 'all' or simple matching if slug starts with category (if user follows convention)
      const matchesCategory = selectedCategory === 'all' || post.id.startsWith(selectedCategory);
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Determine Layout & Limit
  const isDefaultView = selectedCategory === 'all' && !searchQuery;
  const featuredPost = isDefaultView ? filteredPosts[0] : null;

  // Grid Posts Source (excluding featured if applicable)
  const gridSource = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  // Pagination Logic
  const totalPages = Math.ceil(gridSource.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const visibleGridPosts = gridSource.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid (approximate)
    const gridElement = document.getElementById('blog-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-4 lg:pt-24 min-h-screen">
      <Section className="pb-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Блог Estate AI</h1>
          <p className="text-gray-500 text-lg">Инсайты рынка, советы экспертов и тренды дизайна.</p>
        </div>

        {/* --- NAVIGATION BAR --- */}
        <div className="max-w-7xl mx-auto mb-12 sticky top-2 lg:top-24 z-40">
          <div className="apple-glass p-2 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xl backdrop-blur-xl">

            {/* Categories (Scrollable) */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto px-2 py-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                        flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap
                        ${selectedCategory === cat.id
                      ? 'bg-black text-white shadow-md'
                      : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black'}
                      `}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 flex-shrink-0 px-2 md:px-0 pb-2 md:pb-0">
              <Search className="absolute left-5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-10 pr-8 py-2 rounded-full apple-input text-sm font-medium outline-none h-10"
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

        {/* 2. Featured Post Section (Only on Page 1) */}
        {featuredPost && currentPage === 1 && (
          <div className="mb-12">
            <Link to={`/blog/${featuredPost.id}`} className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] h-[500px] block shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all">
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
          </div>
        )}

        {/* 3. Grid Posts */}
        <div id="blog-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {visibleGridPosts.length > 0 ? (
            visibleGridPosts.map((post) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-16">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                            ${currentPage === i + 1
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'}
                        `}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* 4. Bottom Action Block (Subscribe + Lead) */}
        <div className="border-t border-gray-200 pt-16 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Subscription Column */}
            <div className="flex flex-col h-full justify-center">
              <div className="mb-8">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Оставайтесь в курсе</h3>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Подпишитесь на еженедельную рассылку Estate AI. Только полезные статьи, обзоры рынка и закрытые старты продаж. Никакого спама.
                </p>
              </div>
              <SubscriptionForm />
            </div>

            {/* Lead Form Column */}
            <GlassCard className="p-8 md:p-10 border border-gray-200 shadow-xl bg-white/80">
              <LeadForm
                title="Нужна помощь эксперта?"
                subtitle="Не нашли ответ в статьях? Оставьте заявку, и мы проконсультируем вас бесплатно."
                buttonText="Связаться с нами"
                icon={<MessageCircle size={32} />}
                embedded={true}
                className="p-0 shadow-none border-none my-0 w-full"
              />
            </GlassCard>

          </div>
        </div>

      </Section>
    </div>
  );
};

export default Blog;
