'use client';

import {
  Calendar,
  Clock,
  Gift,
  Heart,
  MapPin,
  RotateCcw,
  Timer,
  Users,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Great_Vibes, Montserrat, Playfair_Display } from 'next/font/google';
import { useCallback, useEffect, useRef, useState } from 'react';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-playfair'
});

const greatVibes = Great_Vibes({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes'
});

const montserrat = Montserrat({ 
  subsets: ['latin'],                                 
  weight: ['300', '400', '500'],
  variable: '--font-montserrat'
});

// ✅ FIX: Move the static date outside the component to avoid recreation on every render
const WEDDING_DATE = new Date(2026, 6, 3, 17, 0, 0); // month 6 = July

const INV_MIN_ZOOM = 1;
const INV_MAX_ZOOM = 4;
const INV_ZOOM_STEP = 0.25;

function touchDistance(touches: { length: number; [i: number]: { clientX: number; clientY: number } }) {
  if (touches.length < 2) return 0;
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}

export default function WeddingInvitation() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  // 🎵 Music state and refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicControl, setShowMusicControl] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [invitationScale, setInvitationScale] = useState(1);
  const [invitationPan, setInvitationPan] = useState({ x: 0, y: 0 });
  const invitationViewportRef = useRef<HTMLDivElement>(null);
  const invitationDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const invitationPinchRef = useRef<{ d0: number; scale0: number } | null>(null);

  const closeInvitationModal = useCallback(() => {
    setShowInvitationModal(false);
    setInvitationScale(1);
    setInvitationPan({ x: 0, y: 0 });
    invitationPinchRef.current = null;
    invitationDragRef.current = null;
  }, []);

  useEffect(() => {
    if (!showInvitationModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeInvitationModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showInvitationModal, closeInvitationModal]);

  useEffect(() => {
    if (!showInvitationModal) return;
    const el = invitationViewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setInvitationScale((prev) => {
        const next = Math.min(
          INV_MAX_ZOOM,
          Math.max(INV_MIN_ZOOM, prev + (-e.deltaY) * 0.0015),
        );
        if (next <= INV_MIN_ZOOM) setInvitationPan({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [showInvitationModal]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // update every minute

    return () => clearInterval(timer);
  }, []); // ✅ Empty dependency array – runs only once on mount

  // 🎵 Initialize audio and attempt autoplay
  useEffect(() => {
    // Create audio element only on client
    if (typeof window !== 'undefined') {
      const audio = new Audio('/assets/wedding-music.mp3');
      audio.loop = true;
      audio.volume = 0.01; // 2% volume
      audioRef.current = audio;

      // Attempt to play automatically
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
            setShowMusicControl(true);
          })
          .catch((error) => {
            // Autoplay was prevented – show control button
            console.log('Autoplay blocked:', error);
            setIsMusicPlaying(false);
            setShowMusicControl(true);
          });
      }

      // Cleanup on unmount
      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, []);

  // 🎵 Toggle play/pause
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Still blocked? Keep button visible
        });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const onInvitationPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (invitationScale <= 1.01) return;
    invitationDragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: invitationPan.x,
      originY: invitationPan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onInvitationPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = invitationDragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    setInvitationPan({
      x: d.originX + e.clientX - d.startX,
      y: d.originY + e.clientY - d.startY,
    });
  };

  const onInvitationPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = invitationDragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    invitationDragRef.current = null;
  };

  const onInvitationTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      invitationPinchRef.current = {
        d0: touchDistance(e.touches),
        scale0: invitationScale,
      };
    }
  };

  const onInvitationTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && invitationPinchRef.current) {
      e.preventDefault();
      const { d0, scale0 } = invitationPinchRef.current;
      if (d0 < 1) return;
      const d = touchDistance(e.touches);
      const next = Math.min(INV_MAX_ZOOM, Math.max(INV_MIN_ZOOM, scale0 * (d / d0)));
      setInvitationScale(next);
      if (next <= INV_MIN_ZOOM) setInvitationPan({ x: 0, y: 0 });
    }
  };

  const onInvitationTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) invitationPinchRef.current = null;
  };

  const zoomInvitationIn = () => {
    setInvitationScale((s) => Math.min(INV_MAX_ZOOM, s + INV_ZOOM_STEP));
  };

  const zoomInvitationOut = () => {
    setInvitationScale((s) => {
      const next = Math.max(INV_MIN_ZOOM, s - INV_ZOOM_STEP);
      if (next <= INV_MIN_ZOOM) setInvitationPan({ x: 0, y: 0 });
      return next;
    });
  };

  const resetInvitationZoom = () => {
    setInvitationScale(1);
    setInvitationPan({ x: 0, y: 0 });
  };

  return (
    <div className={`${playfair.variable} ${greatVibes.variable} ${montserrat.variable} min-h-screen bg-gradient-to-br from-stone-50 via-white to-rose-50/10 relative overflow-hidden`}>
      
      {/* 🎵 Floating music control button (appears if autoplay blocked or user toggles) */}
      {showMusicControl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 p-4 bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
        >
          {isMusicPlaying ? (
            <Volume2 className="size-5 text-rose-500/80 group-hover:text-rose-600" strokeWidth={1.5} />
          ) : (
            <VolumeX className="size-5 text-stone-500/80 group-hover:text-stone-600" strokeWidth={1.5} />
          )}
        </button>
      )}

      {/* Background icons – clean & cute */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2' fill='%239c6d6d'/%3E%3C/svg%3E")`,
          backgroundSize: '300px'
        }}
      />

      {/* Linen texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMCAwaDEwdjEwSDB6TTEwIDEwaDEwdjEwSDEwek0yMCAyMGgxMHYxMEgyMHpNMzAgMzBoMTB2MTBIMzBaTTQwIDQwaDEwdjEwSDQwek01MCA1MGgxMHYxMEg1MHpNNjAgNjBoMTB2MTBINjB6TTcwIDcwaDEwdjEwSDcweiIgZmlsbD0iI2UyZTJlMiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9zdmc+')] opacity-40 pointer-events-none" />

      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-rose-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-amber-100/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>

      <main className="relative z-10">

        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-14 animate-fade-in-up">
            
            <header className="space-y-5">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-200/50"></div>
                <Users className="size-4 text-rose-300" strokeWidth={1.2} />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-rose-200/50"></div>
              </div>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-stone-500/70 font-light">
                Together with their families
              </p>
              <h2 className="font-serif text-xl md:text-2xl text-stone-600/90 font-light italic max-w-xl mx-auto leading-relaxed">
                Have the honour of inviting you to celebrate their wedding
              </h2>
            </header>

            <div className="space-y-10">
              <h1 className="font-script text-6xl md:text-7xl lg:text-8xl text-stone-800 leading-none tracking-wide">
                Sumit Shrestha
              </h1>
              
              {/* ✨ Custom "weds" heart – now perfectly contained */}
              <div className="flex items-center justify-center gap-6">
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-stone-300/50 to-transparent"></div>
                
                <div className="relative flex items-center justify-center">
                  <svg 
                    width="36" 
                    height="36" 
                    viewBox="0 0 23 23" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-rose-300/80 animate-float"
                  >
                    <path
                      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                      fill="currentColor"
                      fillOpacity="0.3"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <text
                      x="12"
                      y="12"
                      fontSize="4.2"
                      fontWeight="400"
                      textAnchor="middle"
                      fill="#b97c7c"
                      fontFamily="var(--font-montserrat), sans-serif"
                      letterSpacing="0.8"
                    >
                      weds
                    </text>
                  </svg>
                </div>
                
                <div className="w-20 h-px bg-gradient-to-l from-transparent via-stone-300/50 to-transparent"></div>
              </div>

              <h1 className="font-script text-6xl md:text-7xl lg:text-8xl text-stone-800 leading-none tracking-wide">
              Prerna Pradhan
              </h1>
            </div>

            <div className="pt-6">
              <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-stone-200/60 shadow-sm">
                <Calendar className="size-5 text-rose-400/70" strokeWidth={1.5} />
                <p className="font-serif text-xl md:text-2xl text-stone-700 tracking-wide font-light">
                  Friday, July 3, 2026
                </p>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-px h-12 bg-gradient-to-b from-rose-300/30 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto space-y-24">

            {/* Event Details Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-10 md:p-16 shadow-2xl shadow-stone-200/30 relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
              
              <div className="relative mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
                
                {/* Time */}
                <div className="text-center space-y-4 group">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-rose-50/70 border border-rose-100/70 mb-3 group-hover:border-rose-200 group-hover:bg-rose-50 transition-all duration-500">
                    <Clock className="size-7 text-rose-400/90 group-hover:text-rose-500 transition-colors" strokeWidth={1.3} />
                  </div>
                  <h3 className="font-sans text-xs tracking-[0.25em] uppercase text-stone-500/70 font-medium">
                    Time
                  </h3>
                  <div>
                    <p className="font-serif text-2xl text-stone-800 font-light">
                      Four o'clock
                    </p>
                    <p className="font-serif text-stone-500/90 text-sm mt-1.5 italic">
                      in the evening
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="text-center space-y-4 group">
                  <div className="inline-flex items-center justify-center size-16 rounded-full bg-amber-50/70 border border-amber-100/70 mb-3 group-hover:border-amber-200 group-hover:bg-amber-50 transition-all duration-500">
                    <MapPin className="size-7 text-amber-500/80 group-hover:text-amber-600 transition-colors" strokeWidth={1.3} />
                  </div>
                  <h3 className="font-sans text-xs tracking-[0.25em] uppercase text-stone-500/70 font-medium">
                    Venue
                  </h3>
                  <div>
                    <p className="font-serif text-2xl text-stone-800 font-light">
                    White palace Banquet

                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="font-serif text-stone-500/90">
                      Kaushaltar, Bhaktapur
                      </p>
                      <p className="font-serif text-stone-500/90">
                        Nepal
                      </p>
                    </div>
                    <a 
                      href="https://maps.app.goo.gl/QScwq6RkKrT6wKp47" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-4 font-sans text-xs uppercase tracking-wider text-amber-600/80 hover:text-amber-700 border-b border-amber-200/50 hover:border-amber-300 pb-0.5 transition-all"
                    >
                      View on map
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 💝 GIFTS SECTION */}
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center size-14 rounded-full bg-rose-50/70 border border-rose-100/70 mb-2">
                <Gift className="size-7 text-rose-400/80" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-stone-700 font-light">
                Gifts
              </h3>
              <p className="font-serif text-stone-600/80 text-xl italic font-semibold leading-relaxed">
                Your presence is the greatest gift we can receive.
              </p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-200/60 to-transparent mx-auto my-6"></div>
              <p className="font-serif text-stone-600/70 text-lg font-light leading-relaxed max-w-lg mx-auto">
                Having you by our side on this special day is all we need. However, if you wish to give us a gift, any form of present will be received with much love and gratitude.
              </p>
            </div>

            {/* ⏳ COUNTDOWN SECTION – days, hours, minutes + date below */}
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center justify-center size-14 rounded-full bg-amber-50/70 border border-amber-100/70 mb-2">
                <Timer className="size-7 text-amber-500/80" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-stone-700 font-light">
                Countdown
              </h3>
              <p className="font-serif text-stone-600/80 text-xl italic font-light">
                To the most special day of our lives
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/60 shadow-md">
                  <div className="font-serif text-4xl md:text-5xl text-stone-700 font-light">
                    {timeLeft.days}
                  </div>
                  <div className="font-sans text-xs tracking-[0.2em] uppercase text-stone-500/70 mt-2">
                    Days
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/60 shadow-md">
                  <div className="font-serif text-4xl md:text-5xl text-stone-700 font-light">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="font-sans text-xs tracking-[0.2em] uppercase text-stone-500/70 mt-2">
                    Hours
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/60 shadow-md">
                  <div className="font-serif text-4xl md:text-5xl text-stone-700 font-light">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="font-sans text-xs tracking-[0.2em] uppercase text-stone-500/70 mt-2">
                    Minutes
                  </div>
                </div>
              </div>
              
              {/* Wedding date displayed elegantly below */}
              <p className="font-serif text-stone-500/80 text-lg italic font-light pt-6 border-t border-stone-200/40 inline-block px-8">
                Friday, July 03, 2026 • Four o'clock in the evening
              </p>
            </div>

            {/* View invitation card */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowInvitationModal(true)}
                className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 text-white font-serif text-lg tracking-wide rounded-full transition-all duration-300 hover:-translate-y-1 active:translate-y-0 shadow-xl hover:shadow-2xl shadow-stone-800/20"
              >
                <Heart className="size-5 fill-white/30" strokeWidth={1.2} />
                View Invitation
                <Heart className="size-5 fill-white/30" strokeWidth={1.2} />
              </button>
            </div>

            {/* FOOTER */}
            <footer className="text-center pt-16">
              <div className="space-y-8">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent mx-auto"></div>
                
                <div className="space-y-4">
                  <p className="font-serif text-stone-600/80 text-xl italic font-light leading-relaxed max-w-lg mx-auto">
                    With love and gratitude, we look forward to celebrating with you
                  </p>
                  <div className="pt-6">
                    <p className="font-script text-4xl text-stone-400/70">
                      Sumit & Prerna
                    </p>
                    <p className="font-sans text-xs tracking-[0.3em] uppercase text-stone-400/50 mt-4">
                      July 03 (Ashar 19), 2026
                    </p>
                  </div>
                </div>

                <div className="pt-8 text-stone-400/50 font-sans text-[0.7rem] uppercase tracking-[0.3em]">
                  made with love by Siddhant Shrestha 💕
                </div>
              </div>
            </footer>

          </div>
        </section>
      </main>

      {showInvitationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invitation-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/75 backdrop-blur-sm transition-opacity"
            aria-label="Close invitation preview"
            onClick={closeInvitationModal}
          />
          <div className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-4xl flex-col items-center">
            <h2 id="invitation-modal-title" className="sr-only">
              Wedding invitation card
            </h2>
            <button
              type="button"
              onClick={closeInvitationModal}
              className="absolute -right-1 -top-12 sm:right-0 sm:top-0 sm:translate-x-1/2 sm:-translate-y-full z-20 flex size-11 items-center justify-center rounded-full bg-white text-stone-600 shadow-lg ring-1 ring-stone-200/80 transition hover:bg-stone-50 hover:text-stone-900"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.8} />
            </button>
            <div className="relative w-full overflow-hidden rounded-xl bg-white/95 p-2 shadow-2xl ring-1 ring-stone-200/60 sm:p-4">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 px-1">
                <div className="flex items-center gap-1 rounded-full border border-stone-200/80 bg-stone-50/90 p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={zoomInvitationOut}
                    disabled={invitationScale <= INV_MIN_ZOOM}
                    className="flex size-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-900 disabled:pointer-events-none disabled:opacity-35"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="size-4" strokeWidth={1.8} />
                  </button>
                  <span className="min-w-[3.25rem] text-center font-sans text-xs tabular-nums text-stone-500">
                    {Math.round(invitationScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={zoomInvitationIn}
                    disabled={invitationScale >= INV_MAX_ZOOM}
                    className="flex size-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-900 disabled:pointer-events-none disabled:opacity-35"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="size-4" strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    onClick={resetInvitationZoom}
                    className="flex size-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-900"
                    aria-label="Reset zoom and position"
                  >
                    <RotateCcw className="size-4" strokeWidth={1.8} />
                  </button>
                </div>
                <p className="w-full text-center font-sans text-[0.65rem] uppercase tracking-wide text-stone-400 sm:w-auto sm:text-left">
                  Scroll to zoom · pinch on touch · drag when zoomed
                </p>
              </div>
              <div
                ref={invitationViewportRef}
                className={`relative h-[min(85vh,820px)] w-full touch-none overflow-hidden rounded-lg bg-stone-100/40 ${
                  invitationScale > 1.01 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                }`}
                onPointerDown={onInvitationPointerDown}
                onPointerMove={onInvitationPointerMove}
                onPointerUp={onInvitationPointerUp}
                onPointerCancel={onInvitationPointerUp}
                onTouchStart={onInvitationTouchStart}
                onTouchMove={onInvitationTouchMove}
                onTouchEnd={onInvitationTouchEnd}
              >
                <div
                  className="flex h-full w-full items-center justify-center will-change-transform select-none"
                  style={{
                    transform: `translate(${invitationPan.x}px, ${invitationPan.y}px) scale(${invitationScale})`,
                  }}
                >
                  <img
                    src="/assets/invitation.png"
                    alt="Wedding invitation card for Sumit and Prerna"
                    draggable={false}
                    className="max-h-[min(85vh,820px)] w-auto max-w-full object-contain pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
