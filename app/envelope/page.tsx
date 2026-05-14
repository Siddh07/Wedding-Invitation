'use client';

export default function EnvelopePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-amber-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Decorative top element */}
        <div className="flex justify-center mb-12">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center space-y-16">
          
          {/* Hero Section */}
          <div className="space-y-8">
            {/* Small decorative text */}
            <p className="text-rose-400/70 text-sm tracking-[0.3em] uppercase font-light">
              Together with their families
            </p>

            {/* Bride & Groom Names */}
            <div className="space-y-6">
              <h1 className="font-['var(--font-great-vibes)'] text-6xl md:text-8xl text-rose-900/90 leading-tight">
                Sumit Shrestha
              </h1>
              
              <div className="flex items-center justify-center gap-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-300/40 to-rose-300/40" />
                <span className="text-rose-400/70 text-sm tracking-widest">&</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent via-rose-300/40 to-rose-300/40" />
              </div>

              <h1 className="font-['var(--font-great-vibes)'] text-6xl md:text-8xl text-rose-900/90 leading-tight">
              Prerna Shrestha
              </h1>
            </div>

            {/* Invitation text */}
            <p className="font-['var(--font-cormorant)'] text-xl md:text-2xl text-stone-600/90 font-light leading-relaxed max-w-2xl mx-auto">
              Request the honor of your presence at the celebration of their marriage
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-8 border border-rose-300/30 rotate-45" />
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
            <svg className="w-6 h-6 text-rose-300/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
            <div className="w-20 h-px bg-gradient-to-l from-transparent via-rose-300/40 to-transparent" />
            <div className="w-8 h-8 border border-rose-300/30 rotate-45" />
          </div>

          {/* Event Details */}
          <div className="space-y-12 bg-white/40 backdrop-blur-sm border border-rose-200/30 rounded-lg p-12 md:p-16 shadow-lg shadow-rose-100/20">
            {/* Date & Time */}
            <div className="space-y-3">
              <p className="text-rose-400/70 text-xs tracking-[0.3em] uppercase">When</p>
              <p className="font-['var(--font-cormorant)'] text-3xl md:text-4xl text-stone-700 font-light">
                Saturday, December 25th, 2024
              </p>
              <p className="font-['var(--font-cormorant)'] text-xl text-stone-500">
                Six o'clock in the evening
              </p>
            </div>

            {/* Thin divider */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent mx-auto" />

            {/* Venue */}
            <div className="space-y-3">
              <p className="text-rose-400/70 text-xs tracking-[0.3em] uppercase">Where</p>
              <p className="font-['var(--font-cormorant)'] text-3xl md:text-4xl text-stone-700 font-light">
                Garden of Serenity
              </p>
              <p className="font-['var(--font-cormorant)'] text-xl text-stone-500">
                123 Celebration Street<br />
                Kathmandu, Nepal
              </p>
            </div>

            {/* Thin divider */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent mx-auto" />

            {/* Dress Code */}
            <div className="space-y-3">
              <p className="text-rose-400/70 text-xs tracking-[0.3em] uppercase">Attire</p>
              <p className="font-['var(--font-cormorant)'] text-xl text-stone-600">
                Formal & Traditional Attire
              </p>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="space-y-6 pt-8">
            <p className="font-['var(--font-cormorant)'] text-xl text-stone-600/90 font-light">
              Kindly respond by <span className="text-rose-600 font-medium">December 10th, 2024</span>
            </p>
            
            <button className="inline-block px-12 py-4 
              bg-gradient-to-r from-rose-100 to-rose-50 
              hover:from-rose-200 hover:to-rose-100
              text-rose-800 
              border border-rose-200/50
              rounded-sm
              font-['var(--font-cormorant)'] text-lg tracking-wider
              transition-all duration-300 
              shadow-md hover:shadow-xl hover:shadow-rose-200/30
              hover:-translate-y-0.5">
              CONFIRM ATTENDANCE
            </button>

            {/* Contact info */}
            <div className="pt-6 space-y-2">
              <p className="font-['var(--font-cormorant)'] text-stone-500 text-sm">
                For inquiries, please contact:
              </p>
              <p className="font-['var(--font-cormorant)'] text-stone-600">
                +977 98765 43210 • invitation@sudhabilip.com
              </p>
            </div>
          </div>

          {/* Footer decorative element */}
          <div className="flex justify-center pt-12">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
          </div>

          {/* Closing message */}
          <p className="font-['var(--font-cormorant)'] text-stone-500/80 text-lg italic pt-4">
            We look forward to celebrating with you
          </p>

        </div>
      </div>
    </div>
  );
}