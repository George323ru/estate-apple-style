
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import { BLOG_POSTS } from '../services/blogData';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import SubscriptionForm from '../components/SubscriptionForm';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!post) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">Статья не найдена</h1>
        <Link to="/blog" className="text-blue-600 underline mt-4 block">Вернуться в блог</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
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
