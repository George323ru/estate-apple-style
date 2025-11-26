import React from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, children, className = '', id }) => {
  return (
    <section id={id} className={`py-24 px-6 sm:px-8 lg:px-12 relative z-10 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="mb-16 max-w-3xl">
            {title && (
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-[#1d1d1f] leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;