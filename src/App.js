import React, { useState, useEffect, useRef } from 'react';
import { Coffee, Croissant, Users, Menu, X, MapPin, Phone, Instagram, Facebook, ArrowDown, ArrowRight, Star, Sun, Moon, Clock, Send, Map, ArrowUp } from 'lucide-react';

// --- Global Styles & Animations ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&display=swap');
    
    :root {
      --cursor-size: 20px;
      --cursor-hover-size: 80px;
      
      /* Default Dark Theme (Stone 950 base) */
      --bg-main: #0c0a09;
      --bg-secondary: #1c1917;
      --bg-surface: #292524;
      --text-main: #fafaf9;
      --text-muted: #a8a29e;
      --text-invert: #0c0a09;
      --accent: #d97706;
      --border-color: rgba(255, 255, 255, 0.1);
      --border-hover: rgba(255, 255, 255, 0.3);
    }

    [data-theme='light'] {
      --bg-main: #fafaf9;
      --bg-secondary: #f5f5f4;
      --bg-surface: #e7e5e4;
      --text-main: #0c0a09;
      --text-muted: #57534e;
      --text-invert: #fafaf9;
      --accent: #b45309;
      --border-color: rgba(0, 0, 0, 0.1);
      --border-hover: rgba(0, 0, 0, 0.3);
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      overflow-x: hidden;
      cursor: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      transition: background-color 0.5s ease, color 0.5s ease;
    }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-secondary); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 4px; }

    h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Playfair Display', serif; }
    html { scroll-behavior: smooth; }

    .noise-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 9998; opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
    [data-theme='light'] .noise-overlay { opacity: 0.08; filter: invert(1); }

    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .animate-marquee { animation: marquee 25s linear infinite; }

    .magnetic-btn { transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); }

    .reveal-hidden { opacity: 0; transform: translateY(30px); transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
    .reveal-visible { opacity: 1; transform: translateY(0); }
    
    .preloader-exit { transform: translateY(-100%); transition: transform 1.5s cubic-bezier(0.77, 0, 0.175, 1); }

    /* Horizontal Scroll Utilities */
    .horizontal-container { position: relative; height: 400vh; }
    .horizontal-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center; }
    .horizontal-track { display: flex; gap: 0; will-change: transform; }
    
    /* Modal Animation */
    .modal-enter { opacity: 0; transform: scale(0.95); }
    .modal-enter-active { opacity: 1; transform: scale(1); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    .modal-exit { opacity: 0; transform: scale(1.05); transition: all 0.3s ease-in; }

    /* Text Fill Animation */
    .text-outline-fill {
      -webkit-text-stroke: 1px var(--text-muted);
      color: transparent;
      background: linear-gradient(to bottom, var(--text-main) 50%, transparent 50%);
      background-clip: text;
      background-size: 100% 200%;
      background-position: 0 100%;
      transition: background-position 1s ease;
    }
    .text-outline-fill.filled {
      background-position: 0 0;
    }
    
    /* 3D Tilt */
    .tilt-card { transform-style: preserve-3d; will-change: transform; }
    .tilt-content { transform: translateZ(20px); }
  `}</style>
);

// --- Custom Hooks ---
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        ref.current.classList.add('reveal-visible');
        ref.current.classList.remove('reveal-hidden');
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const useTextFill = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) ref.current.classList.add('filled');
      else ref.current.classList.remove('filled');
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return progress;
};

// --- Components ---

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(timer); }, []);
  return (
    <div className={`fixed inset-0 bg-black z-[10000] flex items-center justify-center ${!loading ? 'preloader-exit' : ''}`}>
      <div className="text-center text-white relative overflow-hidden">
        <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter animate-pulse">AROMA</h1>
        <div className="w-full h-1 bg-amber-600 mt-4 transform origin-left animate-[grow_1.5s_ease-in-out]"></div>
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const cursorRef = useRef(null);
  useEffect(() => {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    const moveCursor = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15; cursorY += (mouseY - cursorY) * 0.15;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animate);
    };
    const handleHoverStart = () => cursorRef.current?.classList.add('hovering');
    const handleHoverEnd = () => cursorRef.current?.classList.remove('hovering');
    window.addEventListener('mousemove', moveCursor);
    const rAF = requestAnimationFrame(animate);
    const hoverables = document.querySelectorAll('a, button, .hover-trigger, input, select');
    hoverables.forEach(el => { el.addEventListener('mouseenter', handleHoverStart); el.addEventListener('mouseleave', handleHoverEnd); });
    return () => {
      window.removeEventListener('mousemove', moveCursor); cancelAnimationFrame(rAF);
      hoverables.forEach(el => { el.removeEventListener('mouseenter', handleHoverStart); el.removeEventListener('mouseleave', handleHoverEnd); });
    };
  }, []);
  return (
    <div ref={cursorRef} className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference" style={{ marginTop: '-10px', marginLeft: '-10px' }}>
      <div className="w-5 h-5 bg-white rounded-full transition-all duration-300 ease-out cursor-dot" />
      <style>{`.hovering .cursor-dot { transform: scale(4); opacity: 0.8; }`}</style>
    </div>
  );
};

const MagneticButton = ({ children, className, href, onClick }) => {
  const btnRef = useRef(null);
  const handleMouseMove = (e) => {
    const btn = btnRef.current; const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2; const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };
  const handleMouseLeave = () => { if(btnRef.current) btnRef.current.style.transform = 'translate(0px, 0px)'; };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} ref={btnRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`magnetic-btn inline-flex items-center justify-center relative overflow-hidden hover-trigger ${className}`}>
      {children}
    </Tag>
  );
};

const ScrollProgress = () => {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[10002]">
      <div className="h-full bg-[var(--accent)] transition-all duration-100 ease-out" style={{ width: `${progress * 100}%` }}></div>
    </div>
  );
};

const Reveal = ({ children, className = "" }) => {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-hidden ${className}`}>{children}</div>;
};

const Marquee = ({ text, speed = 20 }) => (
  <div className="w-full overflow-hidden bg-[var(--accent)] py-4 relative z-20 border-y border-[var(--accent)] text-[var(--bg-main)]">
    <div className="flex whitespace-nowrap animate-marquee" style={{ animationDuration: `${speed}s` }}>
      {[...Array(4)].map((_, i) => (
        <span key={i} className="text-4xl md:text-6xl font-serif font-bold mx-8 uppercase tracking-tighter flex items-center">
          {text} <Star className="ml-8 w-8 h-8 fill-current" />
        </span>
      ))}
    </div>
  </div>
);

// --- Reservation Modal ---
const ReservationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90 backdrop-blur-xl modal-enter-active">
      <button onClick={onClose} className="absolute top-8 right-8 text-white hover:text-[var(--accent)] transition-colors hover-trigger"><X size={40} /></button>
      <div className="w-full max-w-4xl px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-6 hidden md:block">
          <h2 className="text-7xl font-serif font-bold leading-none">TABLE<br/><span className="text-[var(--accent)]">FOR TWO?</span></h2>
          <p className="text-stone-300 text-xl font-light max-w-sm">Experience the ambiance. Reserve your spot in our sanctuary of taste.</p>
          <div className="flex items-center gap-4 text-stone-400 pt-8">
             <Clock size={24} />
             <span>Avg. Wait: 15 mins without booking</span>
          </div>
        </div>
        <form className="bg-[var(--bg-main)] p-10 md:p-14 rounded-2xl shadow-2xl w-full">
          <h3 className="text-3xl font-serif font-bold text-[var(--text-main)] mb-8">Book Your Table</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Name</label>
              <input type="text" className="w-full bg-[var(--bg-secondary)] border-b-2 border-[var(--border-color)] p-4 text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors" placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Date</label>
                <input type="date" className="w-full bg-[var(--bg-secondary)] border-b-2 border-[var(--border-color)] p-4 text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Guests</label>
                <select className="w-full bg-[var(--bg-secondary)] border-b-2 border-[var(--border-color)] p-4 text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors">
                  <option>2 People</option>
                  <option>4 People</option>
                  <option>Large Group</option>
                </select>
              </div>
            </div>
            <button type="button" onClick={onClose} className="w-full bg-[var(--accent)] text-white py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors mt-4 hover-trigger">
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Navbar = ({ theme, toggleTheme, onBookClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'py-4 bg-[var(--bg-main)]/80 backdrop-blur-lg border-b border-[var(--border-color)]' : 'py-8 bg-transparent'}`}>
      <div className="max-w-[90%] mx-auto flex justify-between items-center">
        <a href="#" className="font-serif text-3xl font-bold text-[var(--text-main)] relative z-50 hover-trigger mix-blend-difference">
          AROMA<span className="text-[var(--accent)]">.</span>
        </a>
        
        <div className="hidden md:flex items-center space-x-12">
          {['Journey', 'Menu', 'Gallery'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm uppercase tracking-widest text-[var(--text-main)] hover:text-[var(--accent)] transition-colors hover-trigger">
              {item}
            </a>
          ))}
          <button onClick={toggleTheme} className="text-[var(--text-main)] hover:text-[var(--accent)] transition-colors hover-trigger p-2">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <MagneticButton onClick={onBookClick} className="px-8 py-3 rounded-full border border-[var(--text-main)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors duration-300 uppercase text-xs tracking-widest font-bold">
            Book Table
          </MagneticButton>
        </div>

        <div className="md:hidden z-50 flex items-center gap-4">
          <button onClick={toggleTheme} className="text-[var(--text-main)] hover:text-[var(--accent)] transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-[var(--text-main)] hover-trigger">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>
      <div className={`fixed inset-0 bg-[var(--bg-main)] z-40 flex items-center justify-center transition-all duration-700 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col space-y-8 text-center">
          {['Home', 'Journey', 'Menu', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-5xl font-serif text-[var(--text-muted)] hover:text-[var(--accent)] hover:italic transition-all duration-300">
              {item}
            </a>
          ))}
          <button onClick={() => {setIsOpen(false); onBookClick();}} className="text-3xl font-serif text-[var(--accent)] font-bold mt-8">Book Table</button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onBookClick }) => {
  const filterRef = useRef(null);
  const timeRef = useRef(0);
  useEffect(() => {
    let rAF;
    const animate = () => {
      timeRef.current += 0.003; 
      if (filterRef.current) {
        const xFreq = 0.005 + Math.sin(timeRef.current) * 0.002;
        const yFreq = 0.005 + Math.cos(timeRef.current * 0.8) * 0.002;
        filterRef.current.setAttribute('baseFrequency', `${xFreq} ${yFreq}`);
      }
      rAF = requestAnimationFrame(animate);
    };
    rAF = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rAF);
  }, []);

  return (
    <div id="hero" className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-center items-center">
      <svg className="hidden">
        <filter id="water-filter">
          <feTurbulence ref={filterRef} type="fractalNoise" baseFrequency="0.005 0.005" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="absolute inset-0 opacity-60" style={{ filter: 'url(#water-filter)' }}>
        <img src="https://images.unsplash.com/photo-1447933601403-0c60e017bc32?q=80&w=2574&auto=format&fit=crop" alt="Hero Background" className="w-full h-full object-cover transform scale-110" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--bg-main)] transition-colors duration-500"></div>
      <div className="relative z-10 text-center px-4 max-w-[90vw]">
        <Reveal>
          <h1 className="text-[12vw] leading-[0.85] font-serif font-bold text-white mix-blend-overlay tracking-tighter">AROMA</h1>
        </Reveal>
        <Reveal className="delay-100">
          <h1 className="text-[12vw] leading-[0.85] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 tracking-tighter mt-[-2vw]">CAFÉ</h1>
        </Reveal>
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
          <Reveal className="delay-200">
            <p className="max-w-md text-left text-stone-300 text-lg leading-relaxed font-light border-l-2 border-[var(--accent)] pl-6">
              Locally roasted coffee, fresh pastries, and a quiet spot to work or hang out. 
            </p>
          </Reveal>
          <Reveal className="delay-300">
            <MagneticButton onClick={onBookClick} className="group w-32 h-32 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs transition-all hover:scale-110">
              <span className="group-hover:-rotate-12 transition-transform duration-300 text-shadow">Book<br/>Now</span>
            </MagneticButton>
          </Reveal>
        </div>
      </div>
      <div className="absolute bottom-10 w-full flex justify-between px-10 text-white/40 uppercase text-xs tracking-[0.3em]">
        <span>Est. 2024</span><span className="animate-bounce"><ArrowDown /></span><span>Scroll Down</span>
      </div>
    </div>
  );
};

const HorizontalScrollSection = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;
      const parent = containerRef.current;
      const track = trackRef.current;
      const parentTop = parent.offsetTop;
      const parentHeight = parent.offsetHeight;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      let percentage = (scrollY - parentTop) / (parentHeight - viewportHeight);
      percentage = Math.max(0, Math.min(1, percentage));
      track.style.transform = `translateX(-${percentage * 66.66}%)`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cards = [
    { id: "01", title: "The Source", subtitle: "Ethical Farming", desc: "We partner directly with small-lot farmers in Ethiopia and Colombia.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" },
    { id: "02", title: "The Roast", subtitle: "Local & Fresh", desc: "Roasted in small batches right here in the city every morning.", img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop" },
    { id: "03", title: "The Pour", subtitle: "Precision Brewing", desc: "Baristas who treat every cup like a masterpiece.", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop" }
  ];

  return (
    <div id="journey" ref={containerRef} className="horizontal-container bg-[var(--bg-secondary)]">
      <div className="horizontal-sticky">
        <div ref={trackRef} className="horizontal-track h-full w-[300vw]">
          {cards.map((card, i) => (
            <div key={i} className="w-[100vw] h-full flex items-center justify-center px-8 md:px-20 relative overflow-hidden border-r border-[var(--border-color)]">
              <div className="absolute inset-0 z-0"><img src={card.img} className="w-full h-full object-cover opacity-20 grayscale" alt={card.title} /></div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full items-center">
                <div className="order-2 md:order-1">
                  <h4 className="text-[var(--accent)] text-lg uppercase tracking-[0.3em] mb-4">{card.subtitle}</h4>
                  <h2 className="text-6xl md:text-9xl font-serif text-[var(--text-main)] mb-8 leading-none">{card.id}.<br/>{card.title}</h2>
                  <p className="text-[var(--text-muted)] text-xl md:text-2xl max-w-md leading-relaxed">{card.desc}</p>
                </div>
                <div className="order-1 md:order-2 h-[300px] md:h-[600px] w-full overflow-hidden rounded-lg shadow-2xl group hover-trigger">
                  <img src={card.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={card.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuSection = () => {
  const [activeImg, setActiveImg] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imgContainerRef = useRef(null);
  const fillRef = useTextFill();

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const items = [
    { name: 'The Espresso', desc: 'Single origin Ethiopian Yirgacheffe.', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Velvet Cap', desc: 'Double shot espresso, silky micro-foam.', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Kyoto Cold', desc: 'Steeped for 24 hours. Dark chocolate.', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=687&auto=format&fit=crop' },
    { name: 'Laminated', desc: 'AOC butter, 27 layers, baked fresh.', img: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?q=80&w=1926&auto=format&fit=crop' },
    { name: 'Hass & Dough', desc: 'Sourdough, smashed Hass avocado.', img: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?q=80&w=687&auto=format&fit=crop' },
  ];

  return (
    <section id="menu" className="py-40 bg-[var(--bg-main)] text-[var(--text-main)] relative overflow-hidden transition-colors duration-500">
      <div className="max-w-[90%] mx-auto relative z-20 flex flex-col lg:flex-row gap-32">
        <div className="lg:w-1/2 flex flex-col justify-center">
            <Reveal>
              <div className="mb-24">
                  <h2 className="text-xs text-[var(--accent)] uppercase tracking-[0.4em] mb-6 font-bold">The Collection</h2>
                  <h3 ref={fillRef} className="text-outline-fill font-serif text-6xl leading-tight">Curated for the discerning palate. Quality over quantity.</h3>
              </div>
            </Reveal>
            <div className="space-y-0">
            {items.map((item, idx) => (
              <Reveal key={idx} className={`delay-${idx * 100}`}>
                <div onMouseEnter={() => setActiveImg(idx)} className="group relative cursor-none hover-trigger py-10 border-t border-[var(--border-color)] hover:border-[var(--border-hover)] transition-all duration-500" >
                  <div className="flex items-baseline justify-between relative z-10">
                      <h3 className="text-5xl md:text-7xl font-serif text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors duration-500 ease-out translate-x-0 group-hover:translate-x-4">{item.name}</h3>
                      <span className="hidden md:block text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-500 text-[var(--accent)]">Explore</span>
                  </div>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]">
                      <p className="pt-6 text-[var(--text-muted)] text-lg font-light tracking-wide max-w-md">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-[var(--border-color)]"></div>
          </div>
        </div>

        {/* 3D Tilt Image Container */}
        <div className="lg:w-1/2 relative h-[80vh] w-full hidden lg:block sticky top-20 perspective-1000" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
           <div 
             ref={imgContainerRef}
             className="w-full h-full tilt-card transition-transform duration-100 ease-out"
             style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
           >
              {items.map((item, idx) => (
                <div key={idx} className={`absolute inset-0 transition-all duration-700 ease-out ${activeImg === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                   <div className="w-full h-full overflow-hidden relative bg-[var(--bg-main)] shadow-2xl tilt-content border border-[var(--border-color)]">
                     <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-10 left-10 z-20">
                         <div className="bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 text-white text-xs uppercase tracking-widest shadow-lg">Origin / House Blend</div>
                     </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

const ParallaxGallery = () => {
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const animationRef = useRef(null);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  useEffect(() => {
    const handleScroll = () => { targetScroll.current = window.scrollY; };
    const update = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.08;
      if (col1Ref.current && col2Ref.current) {
        col1Ref.current.style.transform = `translateY(${-currentScroll.current * 0.1}px)`;
        col2Ref.current.style.transform = `translateY(${currentScroll.current * 0.15}px)`;
      }
      animationRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', handleScroll); update();
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(animationRef.current); };
  }, []);
  const col1 = ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop","https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=2070&auto=format&fit=crop","https://images.unsplash.com/photo-1507133750069-69d3cdad863a?q=80&w=1974&auto=format&fit=crop"];
  const col2 = ["https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=987&auto=format&fit=crop","https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop","https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop"];
  return (
    <section id="gallery" className="py-32 bg-[var(--bg-main)] relative overflow-hidden transition-colors duration-500 z-20 mb-[100vh] shadow-2xl rounded-b-[3rem]">
      <div className="max-w-[90%] mx-auto flex flex-col md:flex-row gap-8 h-[180vh]">
        <div className="md:w-1/3 flex flex-col justify-center sticky top-32 h-fit z-10 mb-20 md:mb-0">
          <Reveal>
            <h2 className="text-7xl md:text-9xl font-serif text-[var(--text-main)] mb-6">THE<br/>VIBE</h2>
            <p className="text-[var(--text-muted)] text-xl">Come for the coffee, stay for the experience.</p>
          </Reveal>
        </div>
        <div className="md:w-2/3 flex gap-8 relative will-change-transform">
          <div ref={col1Ref} className="w-1/2 flex flex-col gap-8">
             {col1.map((src, i) => (<div key={i} className="w-full aspect-[3/4] overflow-hidden rounded-sm hover-trigger"><img src={src} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 ease-out" /></div>))}
          </div>
          <div ref={col2Ref} className="w-1/2 flex flex-col gap-8 mt-[-300px]">
             {col2.map((src, i) => (<div key={i} className="w-full aspect-[3/4] overflow-hidden rounded-sm hover-trigger"><img src={src} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 ease-out" /></div>))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onBookClick }) => {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const footerVisible = Math.max(0, scrollPosition - (totalHeight - window.innerHeight));
      setOffset(footerVisible);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer id="contact" className="fixed bottom-0 w-full h-screen bg-[var(--accent)] text-[var(--bg-main)] pt-32 pb-10 z-0 flex flex-col justify-between overflow-hidden">
      <div className="max-w-[90%] mx-auto w-full flex-grow flex flex-col justify-center relative z-10">
        
        {/* Top Section: Brand & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
            <div className="space-y-12">
              <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[0.8] transform transition-transform duration-500 ease-out" style={{ transform: `translateY(${Math.max(0, 50 - offset * 0.1)}px)` }}>
                LET'S<br/>BREW
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4 text-xl font-medium">
                    <p className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300"><MapPin size={20}/> Shop 12, MG Road</p>
                    <p className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300"><Phone size={20}/> +91 98765 43210</p>
                    <p className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300"><Send size={20}/> hello@aroma.cafe</p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-bold uppercase tracking-widest mb-2 opacity-70">Hours</h4>
                     <p>Mon-Fri: 8am - 10pm</p>
                     <p>Sat-Sun: 9am - 11pm</p>
                  </div>
              </div>
              {/* Newsletter Signup */}
              <div className="max-w-md relative group">
                 <h4 className="font-bold uppercase tracking-widest mb-4 text-sm">Join the Club</h4>
                 <div className="flex border-b-2 border-[var(--bg-main)] pb-2 relative overflow-hidden">
                    <input type="email" placeholder="Your email address" className="bg-transparent w-full focus:outline-none placeholder-[var(--bg-main)]/60 font-serif text-xl" />
                    <button className="hover:opacity-70 hover-trigger transition-transform group-hover:translate-x-1"><ArrowRight /></button>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-end items-start md:items-end space-y-8">
               {/* Map Placeholder / Image */}
               <div className="w-full h-64 bg-[var(--bg-main)]/10 rounded-2xl overflow-hidden relative group hover-trigger cursor-pointer shadow-xl">
                  <img src="https://images.unsplash.com/photo-1507133750069-69d3cdad863a?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500 mix-blend-overlay grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[var(--bg-main)] text-[var(--accent)] px-6 py-3 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                         <Map size={16} /> Get Directions
                      </div>
                  </div>
               </div>

               <div className="bg-[var(--bg-main)]/10 p-8 rounded-2xl backdrop-blur-sm w-full max-w-md border border-[var(--bg-main)]/10 hover:bg-[var(--bg-main)]/20 transition-colors duration-300">
                 <h3 className="text-2xl font-bold uppercase mb-4">Ready to Visit?</h3>
                 <p className="mb-6 font-medium">Tables fill up fast on weekends. Secure your spot now.</p>
                 <MagneticButton onClick={onBookClick} className="bg-[var(--bg-main)] text-[var(--text-main)] px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-full shadow-lg">Reserve a Table</MagneticButton>
               </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-[var(--bg-main)]/20 pt-10 text-sm font-bold uppercase tracking-widest">
          <div className="flex gap-8 mb-4 md:mb-0">
              <a href="#" className="hover:text-white transition-colors hover-trigger relative group">
                  Instagram
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </a>
              <a href="#" className="hover:text-white transition-colors hover-trigger relative group">
                  Facebook
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </a>
          </div>
          <div className="flex items-center gap-8">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 hover:text-white transition-colors hover-trigger">
                  Back to Top <ArrowUp size={16} />
              </button>
              <span>© 2024 Aroma Café</span>
          </div>
        </div>
      </div>
      
      {/* Giant Text Parallax */}
      <div className="absolute bottom-0 left-0 w-full text-center pointer-events-none overflow-hidden">
          <h1 
            className="text-[22vw] font-serif font-bold leading-none text-[var(--bg-main)] opacity-10"
            style={{ transform: `translateY(${20 - offset * 0.05}%)` }}
          >
            AROMA
          </h1>
      </div>
    </footer>
  );
};

const FloatingCTA = ({ onBookClick }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button 
      onClick={onBookClick}
      className={`fixed bottom-8 right-8 z-[9990] bg-[var(--accent)] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover-trigger flex items-center gap-2 group ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
    >
       <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap text-sm font-bold uppercase tracking-widest">Book Now</span>
       <Clock />
    </button>
  );
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)]">
      <GlobalStyles />
      <Preloader />
      <ScrollProgress />
      <div className="noise-overlay"></div>
      <CustomCursor />
      <FloatingCTA onBookClick={() => setIsReservationOpen(true)} />
      
      <Navbar theme={theme} toggleTheme={toggleTheme} onBookClick={() => setIsReservationOpen(true)} />
      <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
      
      {/* Wrap main content to sit ABOVE the fixed footer */}
      <main className="relative z-10 bg-[var(--bg-main)] shadow-2xl transition-colors duration-500 rounded-b-[3rem]">
        <Hero onBookClick={() => setIsReservationOpen(true)} />
        <Marquee text="Fresh Coffee • Daily Bakes • Good Vibes •" speed={20} />
        <HorizontalScrollSection />
        <MenuSection />
        <Marquee text="Reserve Your Table • Open 8am to 10pm •" speed={30} />
        <ParallaxGallery />
      </main>
      
      <Footer onBookClick={() => setIsReservationOpen(true)} />
    </div>
  );
};

export default App;