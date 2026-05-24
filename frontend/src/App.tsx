import { useState, useEffect } from 'react';
import { ArrowRight, Clock, Menu, X, LogOut } from 'lucide-react';
import { Shader, ChromaFlow, FilmGrain, FlutedGlass, Swirl } from 'shaders/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

export default function App() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false } as const;
      setTime(now.toLocaleTimeString('en-GB', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen font-sans bg-[#EFEFEF]">
      {/* SECTION 1: HERO */}
      <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Shader Background */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Shader>
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
            <ChromaFlow baseColor="#ffffff" downColor="#ff5f03" leftColor="#ff5f03" rightColor="#ff5f03" upColor="#ff5f03" momentum={13} radius={3.5} />
            <FlutedGlass aberration={0.61} angle={31} frequency={8} highlight={0.12} highlightSoftness={0} lightAngle={-90} refraction={4} shape="rounded" softness={1} speed={0.15} />
            <FilmGrain strength={0.05} />
          </Shader>
        </div>

        {/* Navigation */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3">
          <nav className="bg-white rounded-full p-[5px] flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F26522] rounded-full flex items-center justify-center text-white text-[10px] sm:text-[11px] font-bold tracking-tight">
                SO
              </div>
              <div className="hidden md:flex items-center gap-6 ml-6">
                <button onClick={() => navigate('/')} className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors duration-300 font-medium">Home</button>
                <button onClick={() => navigate('/offers')} className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors duration-300 font-medium">Offers</button>
                
                {user ? (
                  <>
                    <button onClick={() => navigate('/admin')} className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors duration-300 font-medium">Dashboard</button>
                    <button onClick={async () => await supabase.auth.signOut()} className="text-[14px] text-gray-500 hover:text-red-500 transition-colors duration-300 font-medium flex items-center gap-1.5">
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <button onClick={() => navigate('/auth')} className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors duration-300 font-medium">Sign In</button>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <span className="hidden lg:block text-[13px] text-gray-600">Discover limited-time experiences</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-[14px] h-[14px] text-[#F26522]" />
                <span className="text-[13px] text-gray-600">{time} Live</span>
              </div>
              <button 
                onClick={() => navigate('/offers')}
                className="group bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 flex items-center gap-3 hover:bg-[#F26522] transition-colors duration-300"
              >
                <div className="h-[20px] overflow-hidden flex flex-col">
                  <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Browse Offers</span>
                  <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Browse Offers</span>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-900" />
                </div>
              </button>
            </div>

            <button className="md:hidden w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white mr-1" onClick={() => setMenuOpen(true)}>
              <Menu className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className={`absolute bottom-3 left-3 right-3 bg-white rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'translate-y-0' : 'translate-y-[120%]'}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-1.5">
                <Clock className="w-[14px] h-[14px] text-[#F26522]" />
                <span className="text-[13px] text-gray-600">{time} Live</span>
              </div>
              <button className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-900" onClick={() => setMenuOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4 mb-8">
                <button onClick={() => { setMenuOpen(false); navigate('/'); }} className="text-[28px] sm:text-[32px] font-medium text-gray-900 text-left">Home</button>
                <button onClick={() => { setMenuOpen(false); navigate('/offers'); }} className="text-[28px] sm:text-[32px] font-medium text-gray-900 text-left">Offers</button>
                {user ? (
                  <>
                    <button onClick={() => { setMenuOpen(false); navigate('/admin'); }} className="text-[28px] sm:text-[32px] font-medium text-gray-900 text-left">Dashboard</button>
                    <button onClick={async () => { setMenuOpen(false); await supabase.auth.signOut(); }} className="text-[28px] sm:text-[32px] font-medium text-red-500 text-left">Sign Out</button>
                  </>
                ) : (
                  <button onClick={() => { setMenuOpen(false); navigate('/auth'); }} className="text-[28px] sm:text-[32px] font-medium text-gray-900 text-left">Sign In</button>
                )}
            </div>
            <button 
              onClick={() => { setMenuOpen(false); navigate('/offers'); }}
              className="w-full bg-gray-900 text-white text-[15px] font-medium rounded-full px-5 py-3.5 flex items-center justify-between"
            >
              Browse Offers
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-gray-900" />
              </div>
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20 mt-auto">
          <p className="text-[13px] sm:text-[14px] text-[#F26522] font-medium tracking-wide mb-5 sm:mb-8 uppercase">Smart Offer Platform</p>
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
            Discover exclusive offers <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            and book limited slots <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            before they're gone.
          </h1>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
            <button 
              onClick={() => navigate('/offers')}
              className="group bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] rounded-full pl-5 sm:pl-6 pr-2 py-2 flex items-center gap-3 transition-colors duration-300"
            >
              <div className="h-[20px] overflow-hidden flex flex-col font-medium">
                <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Explore Availability</span>
                <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">Explore Availability</span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                <ArrowRight className="w-4 h-4 text-[#F26522]" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT / TYPOGRAPHY HEAVY */}
      <section className="bg-white pt-24 sm:pt-32 pb-24 sm:pb-32 overflow-hidden w-full relative">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#F26522]"></div>
                <span className="text-[12px] font-semibold tracking-widest text-gray-400 uppercase">Our Philosophy</span>
              </div>
              <h2 className="text-[32px] sm:text-[42px] font-medium leading-[1.1] text-gray-900 tracking-tight">
                Not just booking.<br/>An orchestration<br/>of time.
              </h2>
            </div>
            
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-12">
              <p className="text-[18px] sm:text-[24px] leading-[1.6] text-gray-600 font-light">
                We believe that access to premium experiences should be fluid, instantaneous, and beautiful. We strip away the friction of traditional reservation systems, replacing it with a cinematic interface that honors the value of your time.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                <div>
                  <h3 className="text-[18px] font-semibold text-gray-900 mb-3">01. Curation</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    Every offer is rigorously vetted. We only partner with businesses that deliver exceptional, unforgettable services.
                  </p>
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-gray-900 mb-3">02. Immediacy</h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    Real-time synchronization ensures that when you see a slot, it's yours to take. No double bookings. No waiting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE UNIQUE OFFERS MARQUEE */}
      <section className="bg-gray-900 py-32 overflow-hidden relative w-full">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mb-16 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#F26522]"></div>
            <span className="text-[12px] font-semibold tracking-widest text-white/50 uppercase">Current Exclusives</span>
          </div>
          <h2 className="text-[32px] sm:text-[42px] font-medium leading-[1.1] text-white tracking-tight">
            Limited availability.<br/>Unlimited potential.
          </h2>
        </div>

        {/* CSS Marquee for Offers */}
        <div className="relative w-full overflow-hidden flex flex-col gap-6 z-10">
          <div className="flex w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} onClick={() => navigate('/offers')} className="flex items-center gap-8 px-8 cursor-pointer group">
                <span className="text-[60px] sm:text-[80px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/20 group-hover:from-[#F26522] group-hover:to-[#F26522]/50 transition-all duration-500 whitespace-nowrap">
                  PREMIUM SPA
                </span>
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#F26522] group-hover:border-[#F26522] transition-colors duration-500">
                  <ArrowRight className="w-6 h-6 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex w-max animate-[marquee_30s_linear_infinite_reverse] hover:[animation-play-state:paused]">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} onClick={() => navigate('/offers')} className="flex items-center gap-8 px-8 cursor-pointer group">
                <span className="text-[60px] sm:text-[80px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/20 group-hover:from-[#F26522] group-hover:to-[#F26522]/50 transition-all duration-500 whitespace-nowrap">
                  FITNESS ELITE
                </span>
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#F26522] group-hover:border-[#F26522] transition-colors duration-500">
                  <ArrowRight className="w-6 h-6 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#EFEFEF] pt-24 pb-8 w-full border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div className="md:col-span-2">
              <div className="w-12 h-12 bg-[#F26522] rounded-full flex items-center justify-center text-white text-[14px] font-bold tracking-tight mb-6">
                SO
              </div>
              <p className="text-[20px] font-medium text-gray-900 max-w-sm leading-snug">
                The smart way to discover and reserve premium experiences.
              </p>
            </div>
            
            <div>
              <h4 className="text-[12px] font-semibold tracking-widest text-gray-400 uppercase mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigate('/offers')} className="text-[14px] text-gray-600 hover:text-[#F26522] transition-colors">Browse Offers</button></li>
                <li><button onClick={() => navigate('/auth')} className="text-[14px] text-gray-600 hover:text-[#F26522] transition-colors">Business Login</button></li>
                <li><button onClick={() => navigate('/auth')} className="text-[14px] text-gray-600 hover:text-[#F26522] transition-colors">Partner with Us</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[12px] font-semibold tracking-widest text-gray-400 uppercase mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-300 gap-4">
            <p className="text-[13px] text-gray-500">© 2026 Smart Offers. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900">Twitter</a>
              <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900">Instagram</a>
              <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
