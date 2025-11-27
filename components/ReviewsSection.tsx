
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Section from './Section';
import GlassCard from './GlassCard';
import ReviewModal from './ReviewModal';
import { Review } from '../types';
import { Star, StarHalf } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  title?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews = [], title = "Отзывы клиентов" }) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  if (!reviews || reviews.length === 0) {
      return null;
  }

  return (
    <Section title={title} className="overflow-hidden py-12 md:py-24">
      <div className="relative w-full -mx-4 md:mx-0">
        
        {/* Global Gradient Masks for both rows */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#F5F5F7] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#F5F5F7] to-transparent z-20 pointer-events-none"></div>

        <div className="flex flex-col gap-0">
            {/* Row 1: Moves Left */}
            <ReviewRow 
                reviews={reviews} 
                direction="left" 
                speed={1} 
                onReviewClick={setSelectedReview} 
            />

            {/* Row 2: Moves Right */}
            <ReviewRow 
                reviews={reviews} 
                direction="right" 
                speed={1} 
                onReviewClick={setSelectedReview} 
            />
        </div>

      </div>
      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </Section>
  );
};

interface ReviewRowProps {
    reviews: Review[];
    direction: 'left' | 'right';
    speed: number;
    onReviewClick: (review: Review) => void;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ reviews, direction, speed, onReviewClick }) => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Triple the data to create a buffer for infinite scrolling - Memoize
    const loopReviews = useMemo(() => [...reviews, ...reviews, ...reviews], [reviews]);

    // Initial Positioning - Use useEffect to be safe
    useEffect(() => {
        const initScroll = () => {
            if (scrollRef.current) {
                const scrollWidth = scrollRef.current.scrollWidth;
                if (scrollWidth > 0) {
                    const singleSetWidth = scrollWidth / 3;
                    // Set initial position to the start of the middle set
                    scrollRef.current.scrollLeft = singleSetWidth;
                }
            }
        };

        // Attempt to set position
        const timer = setTimeout(initScroll, 100);
        return () => clearTimeout(timer);
    }, [loopReviews]);

    // Infinite Loop Logic (Teleportation)
    const handleScroll = () => {
        if (!scrollRef.current) return;
        
        try {
            const scrollLeft = scrollRef.current.scrollLeft;
            const scrollWidth = scrollRef.current.scrollWidth;
            const singleSetWidth = scrollWidth / 3;

            if (singleSetWidth <= 0) return;

            // Teleport when hitting boundaries to create seamless loop
            if (scrollLeft >= singleSetWidth * 2) {
                scrollRef.current.scrollLeft -= singleSetWidth;
            } else if (scrollLeft <= 0) {
                scrollRef.current.scrollLeft += singleSetWidth;
            }
        } catch (e) {
            // ignore scroll errors
        }
    };

    // Animation Loop
    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            if (!isPaused && scrollRef.current) {
                if (direction === 'left') {
                    scrollRef.current.scrollLeft += speed;
                } else {
                    scrollRef.current.scrollLeft -= speed;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, direction, speed]);

    // Handlers for Touchpad/Manual Scroll interaction
    const handleManualInteract = () => setIsPaused(true);
    const handleManualEnd = () => setIsPaused(false);

    return (
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleManualInteract}
            onTouchEnd={handleManualEnd}
            onWheel={handleManualInteract}
            onMouseLeave={handleManualEnd}
            className="flex overflow-x-auto gap-6 pt-4 pb-14 px-8 hide-scrollbar items-stretch"
            style={{ cursor: 'grab', WebkitOverflowScrolling: 'touch' }}
        >
            {loopReviews.map((rev, i) => (
                <div 
                    key={`${rev.id}-${i}-${direction}`}
                    className="flex-shrink-0"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={(e) => {
                        e.stopPropagation();
                        setIsPaused(false);
                    }}
                >
                    <ReviewCard 
                        review={rev} 
                        index={i}
                        onClick={() => onReviewClick(rev)} 
                    />
                </div>
            ))}
        </div>
    );
};

const ReviewCard: React.FC<{ review: Review; index: number; onClick: () => void }> = ({ review, index, onClick }) => {
    const isFourPointFive = index % 5 === 4;

    return (
        <div className="min-w-[360px] w-[360px] h-[240px] transform transition-transform duration-300 hover:scale-[1.02] active:scale-95">
            <GlassCard 
                onClick={onClick}
                className="h-full cursor-pointer hover:bg-white transition-colors flex flex-col justify-between p-8 shadow-sm hover:shadow-xl border border-white/60 bg-white/60 backdrop-blur-md rounded-[2rem]"
            >
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(star => (
                                <Star key={star} size={18} className="fill-yellow-400 text-yellow-400" />
                            ))}
                            {isFourPointFive ? (
                                <div className="relative">
                                    <StarHalf size={18} className="fill-yellow-400 text-yellow-400" />
                                </div>
                            ) : (
                                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                            )}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-lg">
                            {review.role}
                        </div>
                    </div>
                    <p className="text-gray-800 text-base leading-relaxed font-medium line-clamp-3">
                        "{review.text}"
                    </p>
                </div>
                
                <div className="mt-auto flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-white shadow-sm">
                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-gray-900 text-sm truncate">{review.name}</div>
                        <div className="text-xs text-gray-500">Подтвержденный клиент</div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default ReviewsSection;
