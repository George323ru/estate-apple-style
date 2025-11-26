import React from 'react';
import Modal from './Modal';
import { Review } from '../types';
import { Quote } from 'lucide-react';

interface ReviewModalProps {
  review: Review | null;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <Modal isOpen={!!review} onClose={onClose}>
        <div className="text-center pt-4">
            <Quote size={48} className="mx-auto text-blue-200 mb-6" />
            <p className="text-xl md:text-2xl font-medium text-gray-800 italic mb-8 leading-relaxed">
                "{review.fullText || review.text}"
            </p>
            <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img src={review.avatar} alt={review.name} />
                </div>
                <div className="text-left">
                    <div className="font-bold text-lg">{review.name}</div>
                    <div className="text-gray-500">{review.role}</div>
                </div>
            </div>
            <button onClick={onClose} className="mt-8 text-gray-400 hover:text-black">Закрыть</button>
        </div>
    </Modal>
  );
};

export default ReviewModal;