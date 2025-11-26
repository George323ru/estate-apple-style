
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Property } from '../types';
import { MapPin, ChevronLeft, ChevronRight, CheckCircle, Layout, Maximize, Home, Building } from 'lucide-react';
import LeadForm from './LeadForm';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when property changes
  useEffect(() => {
    if (property) {
        setCurrentImageIndex(0);
        setShowForm(false);
        // Reset scroll position
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' });
        }
    }
  }, [property]);

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const width = container.clientWidth;
      container.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (currentImageIndex + 1) % images.length;
    scrollToImage(newIndex);
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    scrollToImage(newIndex);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const width = container.clientWidth;
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < images.length) {
        setCurrentImageIndex(newIndex);
      }
    }
  };

  return (
    <Modal 
      isOpen={!!property} 
      onClose={onClose}
      title={showForm ? "Заявка на просмотр" : property.title}
      size="lg"
    >
      {!showForm ? (
        <div className="space-y-6">
            {/* Image Carousel with Touchpad Scroll Support */}
            <div className="relative h-64 md:h-[400px] rounded-2xl overflow-hidden group bg-gray-100">
                
                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {images.map((img, idx) => (
                        <div key={idx} className="min-w-full w-full h-full flex-shrink-0 snap-center">
                            <img src={img} alt={`${property.title} ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                
                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10">
                            <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => scrollToImage(i)}
                                    className={`h-2 rounded-full transition-all shadow-sm ${i === currentImageIndex ? 'bg-white w-8' : 'bg-white/60 w-2 hover:bg-white'}`} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            
            {/* Chips & Details */}
            <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                    {/* Type Chip */}
                    {property.type && (
                        <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-1.5">
                           {property.type === 'apartment' && <Building size={16} />}
                           {property.type === 'house' && <Home size={16} />}
                           {property.type === 'commercial' && <Building size={16} />}
                           {property.type === 'parking' && <Maximize size={16} />}
                           {property.type === 'apartment' ? 'Квартира' : property.type === 'house' ? 'Дом' : property.type === 'commercial' ? 'Коммерция' : property.type}
                        </span>
                    )}
                    {/* Area Chip */}
                    {property.area && (
                         <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-1.5">
                            <Maximize size={16} /> {property.area} м²
                        </span>
                    )}
                    <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-1.5">
                        <Layout size={16} /> {property.specs}
                    </span>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                     <div>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{property.price}</p>
                        <p className="text-gray-500 flex items-center gap-2 mt-2 text-lg"><MapPin size={20} /> {property.location}</p>
                     </div>
                     <div className="flex gap-2">
                        {property.tags.map(tag => (
                            <span key={tag} className="border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                     </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <h4 className="font-bold mb-3 text-xl text-gray-800">О проекте</h4>
                    <p className="text-gray-600 leading-relaxed text-base">
                        Уникальное предложение в престижном районе. Панорамные виды, высокие потолки и премиальная отделка. 
                        Идеально подходит для комфортной жизни или инвестиций. Развитая инфраструктура: школы, парки и рестораны в 5 минутах.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button 
                    className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 duration-200" 
                    onClick={() => setShowForm(true)}
                >
                    Записаться на просмотр
                </button>
            </div>
        </div>
      ) : (
        <div className="animate-fade-in">
            <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-center gap-4">
                <img src={images[0]} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                    <div className="font-bold text-lg">{property.title}</div>
                    <div className="text-sm text-gray-500">{property.specs} • {property.price}</div>
                </div>
            </div>
            <LeadForm 
                title="Оставьте контакты" 
                subtitle="Менеджер свяжется для согласования времени." 
                buttonText="Подтвердить запись"
                className="p-0"
                embedded={true}
            />
            <button onClick={() => setShowForm(false)} className="w-full mt-6 text-gray-400 hover:text-black text-sm font-medium py-2">
                ← Назад к описанию
            </button>
        </div>
      )}
    </Modal>
  );
};

export default PropertyModal;
