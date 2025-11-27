
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import { BLOG_POSTS } from '../services/blogData';
import { ArrowLeft, Calendar, User, ArrowRight, MessageSquare, Send, Lock } from 'lucide-react';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import SubscriptionForm from '../components/SubscriptionForm';
import SEO from '../components/SEO';
import { SchemaMarkup } from '../components/SchemaMarkup';

interface Comment {
    id: number;
    author: string;
    text: string;
    date: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Comments State
  const [comments, setComments] = useState<Comment[]>([
      { id: 1, author: 'Виктор', text: 'Спасибо за статью! Очень полезная информация.', date: '21 Окт 2024' },
      { id: 2, author: 'Мария', text: 'Подскажите, актуальны ли данные на текущий момент?', date: '22 Окт 2024' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');

  useEffect(() => {
      const auth = localStorage.getItem('estate_auth');
      if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleAddComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !commentName.trim()) return;
      
      const comment: Comment = {
          id: Date.now(),
          author: commentName,
          text: newComment,
          date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      
      setComments([...comments, comment]);
      setNewComment('');
      setCommentName('');
  };

  const handleLoginRedirect = () => {
      navigate(`/dashboard?returnUrl=${encodeURIComponent(location.pathname)}`);
  };

  if (!post) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">Статья не найдена</h1>
        <Link to="/blog" className="text-blue-600 underline mt-4 block">Вернуться в блог</Link>
      </div>
    );
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [post.image],
    "datePublished": "2024-10-20T08:00:00+03:00", // Approximate based on display date
    "author": [{
        "@type": "Organization",
        "name": "Estate AI"
    }],
    "publisher": {
        "@type": "Organization",
        "name": "Estate AI",
        "logo": {
            "@type": "ImageObject",
            "url": "https://estate-ai.com/logo.png"
        }
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <SEO 
        title={`${post.title} | Блог Estate AI`} 
        description={post.excerpt} 
        keywords="недвижимость, блог, советы, аналитика" 
      />
      <SchemaMarkup schema={schemaData} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Все статьи
        </Link>

        <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
                <span className="flex items-center gap-2"><Calendar size={16}/> {post.date}</span>
                <span className="flex items-center gap-2"><User size={16}/> Estate AI Эксперт</span>
            </div>
        </div>

        <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-[400px] md:h-[500px] object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-gray-800 leading-loose mb-24">
            <p className="text-xl font-medium text-gray-600 mb-8 border-l-4 border-blue-500 pl-6 italic">
                {post.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Comments Section */}
        <div className="mb-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2"><MessageSquare size={24}/> Комментарии ({comments.length})</h3>
            
            <div className="space-y-6 mb-12">
                {comments.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900">{c.author}</span>
                            <span className="text-xs text-gray-400">{c.date}</span>
                        </div>
                        <p className="text-gray-600">{c.text}</p>
                    </div>
                ))}
            </div>

            <GlassCard className="p-8 bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-lg mb-4">Оставить комментарий</h4>
                {isAuthenticated ? (
                    <form onSubmit={handleAddComment} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Ваше имя" 
                            value={commentName}
                            onChange={e => setCommentName(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors"
                            required
                        />
                        <textarea 
                            placeholder="Ваш комментарий..." 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors min-h-[120px]"
                            required
                        />
                        <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <Send size={18}/> Отправить
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <Lock className="mx-auto text-gray-400 mb-4" size={32} />
                        <p className="text-gray-500 mb-6">Комментарии доступны только авторизованным пользователям.</p>
                        <button 
                            onClick={handleLoginRedirect}
                            className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            Войти в аккаунт
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>

        <div className="mb-24 p-4">
            <GlassCard className="bg-blue-50 border-blue-100 p-8 text-center shadow-2xl mx-2 my-4">
                <h3 className="text-2xl font-bold mb-4">Понравилась статья?</h3>
                <p className="text-gray-600 mb-8">Закажите консультацию эксперта или перейдите к услуге, чтобы узнать больше.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                        Оставить заявку
                    </button>
                    
                    {post.relatedService && (
                        <button 
                            onClick={() => navigate(post.relatedService!.link)}
                            className="px-8 py-4 bg-white text-black border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            {post.relatedService.label} <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </GlassCard>
        </div>

        <div className="mb-12 px-2">
           <SubscriptionForm />
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Связаться с экспертом">
          <LeadForm title="Заявка на консультацию" subtitle={`По статье: "${post.title}"`} className="shadow-none border-none p-0" embedded={true} />
      </Modal>
    </div>
  );
};

export default BlogPost;
