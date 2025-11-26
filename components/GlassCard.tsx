import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        apple-glass p-8
        ${hoverEffect ? 'transition-all duration-500 hover:scale-[1.02] hover:shadow-glass-hover cursor-pointer' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;