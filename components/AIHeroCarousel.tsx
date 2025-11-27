
import React, { useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, Sun, TrendingUp, PenTool, Hammer, ShieldCheck, ArrowRight } from 'lucide-react';

const AI_TOOLS = [
  { 
    id: 'smart-match',
    title: "Умный подбор", 
    desc: "Нейросеть найдет идеальный ЖК под ваш стиль жизни.", 
    icon: <BrainCircuit />, 
    link: "/ai/smart-match",
    color: "text-purple-400"
  },
  { 
    id: 'eco-scan',
    title: "Эко-сканер", 
    desc: "Анализ радиации и воздуха по картам.", 
    icon: <Sun />, 
    link: "/ai/eco-scan",
    color: "text-green-400"
  },
  { 
    id: 'invest',
    title: "Инвест-прогноз", 
    desc: "Расчет реальной доходности (MIRR).", 
    icon: <TrendingUp />, 
    link: "/ai/invest-forecast",
    color: "text-blue-400"
  },
  {
    id: 'desc-gen',
    title: "Генератор",
    desc: "Продающее описание по фото за 1 минуту.",
    icon: <PenTool />,
    link: "/ai-generator",
    color: "text-pink-400"
  },
  {
    id: 'renov',
    title: "AI Смета",
    desc: "Расчет стоимости ремонта по фото.",
    icon: <Hammer />,
    link: "/ai/renovation-est",
    color: "text-orange-400"
  },
  {
    id: 'tenant',
    title: "Проверка",
    desc: "Скоринг жильца по базам МВД и ФССП.",
    icon: <ShieldCheck />,
    link: "/ai/tenant-check",
    color: "text-indigo-400"
  }
];

const AIHeroCarousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics state
  const state = useRef({
    currentX: 0,
    velocity: 0,
    isDragging: false,
    startX: 0,
    lastX: 0,
    isHovered: false
  });

  // Quadruple list for infinite loop - Memoized to ensure stability
  const infiniteTools = useMemo(() => [...AI_TOOLS, ...AI_TOOLS, ...AI_TOOLS, ...AI_TOOLS], []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      // CRITICAL: Check if ref exists immediately
      if (!trackRef.current) {
          animationFrameId = requestAnimationFrame(animate);
          return;
      }

      try {
          const deltaMS = time - lastTime;
          lastTime = time;
          // Cap dt to prevent huge jumps if tab was inactive
          const dt = Math.min(deltaMS / 16.667, 4);

          const { current } = state;
          
          // Ensure children exist before accessing to prevent "undefined" errors
          const children = trackRef.current.children;
          if (!children || children.length <= AI_TOOLS.length) {
              animationFrameId = requestAnimationFrame(animate);
              return;
          }

          const item0 = children[0] as HTMLElement;
          const setLength = AI_TOOLS.length;
          const itemSet = children[setLength] as HTMLElement;
          
          // Double check elements exist
          if (!item0 || !itemSet) {
              animationFrameId = requestAnimationFrame(animate);
              return;
          }
          
          const totalSetWidth = itemSet.offsetLeft - item0.offsetLeft;
          
          // Safety check for width to avoid divide by zero or infinite loops
          if (totalSetWidth <= 0) {
              animationFrameId = requestAnimationFrame(animate);
              return;
          }

          if (!current.isDragging) {
            if (!current.isHovered) {
                // Cruising speed
                const cruiseSpeed = -0.8; 
                current.velocity += (cruiseSpeed - current.velocity) * 0.05 * dt;
            } else {
                // Friction when hovered
                current.velocity *= Math.pow(0.92, dt);
            }
            
            current.currentX += current.velocity * dt;
          }

          // Teleportation Logic
          if (current.currentX <= -totalSetWidth) {
            current.currentX += totalSetWidth;
            if (current.isDragging) current.lastX += totalSetWidth; 
          } 
          else if (current.currentX > 0) {
            current.currentX -= totalSetWidth;
            if (current.isDragging) current.lastX -= totalSetWidth;
          }

          trackRef.current.style.transform = `translate3d(${current.currentX}px, 0, 0)`;
      } catch (e) {
          // Prevent crash on single frame error
          console.warn("Carousel animation error:", e);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [infiniteTools]); // Add dependency

  // --- Event Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    state.current.velocity -= delta * 0.08;
    state.current.isHovered = true;
    
    const win = window as any;
    if (win.aiCarouselTimeout) clearTimeout(win.aiCarouselTimeout);
    win.aiCarouselTimeout = setTimeout(() => { state.current.isHovered = false; }, 1000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    state.current.isDragging = true;
    state.current.startX = e.touches[0].clientX;
    state.current.lastX = state.current.currentX;
    state.current.velocity = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!state.current.isDragging) return;
    const clientX = e.touches[0].clientX;
    const delta = clientX - state.current.startX;
    state.current.currentX = state.current.lastX + delta;
    state.current.velocity = delta * 0.5;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    state.current.isDragging = true;
    state.current.startX = e.clientX;
    state.current.lastX = state.current.currentX;
    state.current.velocity = 0;
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!state.current.isDragging) return;
    e.preventDefault();
    const delta = e.clientX - state.current.startX;
    state.current.currentX = state.current.lastX + delta;
    state.current.velocity = delta * 0.5;
  };

  const handleDragEnd = () => {
    state.current.isDragging = false;
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
  };

  return (
    <section className="py-12 md:py-24 px-4 relative z-10">
      <div className="max-w-[1400px] mx-auto bg-[#080808] rounded-[3rem] relative overflow-hidden border border-white/5 shadow-2xl">
        
        {/* 1. Tech Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* 2. Ambient Glows */}
        <div className="absolute top-[-200px] left-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-[-200px] right-[20%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px] animate-float pointer-events-none"></div>

        <div className="relative z-10 py-16 md:py-20 flex flex-col h-full justify-center">
            
            {/* Header */}
            <div className="text-center mb-12 md:mb-16 px-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-6 text-gray-300">
                    <Sparkles size={14} className="text-yellow-400 fill-yellow-400" /> 
                    Estate AI Core
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                    Интеллект. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Скорость.</span>
                </h2>
                <p className="text-gray-400 mt-4 max-w-lg mx-auto text-lg">
                    Технологии, которые меняют правила игры на рынке недвижимости.
                </p>
            </div>

            {/* Carousel Area */}
            <div 
              ref={containerRef}
              className="relative w-full cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onMouseEnter={() => { state.current.isHovered = true; }}
            >
              {/* PREMIUM FADE MASKS */}
              <div className="absolute inset-y-0 left-0 w-16 md:w-32 z-20 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-16 md:w-32 z-20 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none"></div>

              <div 
                ref={trackRef}
                className="flex gap-6 px-8 md:px-12 will-change-transform"
              >
                {infiniteTools.map((tool, i) => (
                  <Link 
                    key={`${tool.id}-${i}`} 
                    to={tool.link} 
                    className="group relative flex-shrink-0 block"
                    draggable={false}
                  >
                    <div className="
                        w-[260px] md:w-[300px] h-[320px]
                        rounded-[2rem] p-8
                        flex flex-col justify-between
                        bg-white/5 hover:bg-white/10
                        backdrop-blur-xl
                        border border-white/5 hover:border-white/20
                        transition-all duration-500 ease-out
                        group-hover:scale-[1.03] group-hover:-translate-y-1
                        group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]
                    ">
                        {/* Content */}
                        <div>
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center mb-6 
                                bg-white/5 border border-white/10 shadow-inner
                                transition-colors duration-300
                                ${tool.color}
                            `}>
                                {React.cloneElement(tool.icon as any, { size: 28 })}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                                {tool.title}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed group-hover:text-gray-300">
                                {tool.desc}
                            </p>
                        </div>

                        {/* Bottom Action */}
                        <div className="flex items-center gap-3 pt-6 mt-auto border-t border-white/5">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                <ArrowRight size={14} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                                Запустить
                            </span>
                        </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AIHeroCarousel;
