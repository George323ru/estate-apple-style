
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'default' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'default' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = 
    size === 'xl' ? 'sm:max-w-5xl' : 
    size === 'lg' ? 'sm:max-w-4xl' : 
    'sm:max-w-3xl';

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
        
        {/* Backdrop with Blur (VisionOS Style) */}
        <div 
          className="fixed inset-0 bg-gray-100/60 backdrop-blur-xl transition-opacity animate-fade-in" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Content (Volumetric Panel) */}
        <div 
          ref={modalRef}
          className={`
            relative inline-block align-bottom text-left 
            bg-white rounded-[32px] shadow-2xl transform transition-all 
            sm:my-8 sm:align-middle w-full ${maxWidthClass}
            animate-scale-in mx-4 mb-24 sm:mb-8
          `}
          style={{ boxShadow: '0 40px 80px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)' }}
        >
          <div className="absolute top-6 right-6 z-10">
            <button
              type="button"
              className="bg-[#F2F2F7] rounded-full p-2 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 sm:p-12">
            {title && (
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 pr-10 tracking-tight" id="modal-title">
                {title}
              </h3>
            )}
            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
