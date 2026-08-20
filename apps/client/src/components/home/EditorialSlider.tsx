import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '../ui/Image';

export interface SlideItem {
  id: string;
  tag: string;
  season: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  specs: { label: string; value: string }[];
}

const SLIDES: SlideItem[] = [
  {
    id: 'slide-01',
    tag: 'Capsule 01 · Runway Edition',
    season: 'Edition IV / 2026',
    title: 'Monolithic Architectural Silhouettes',
    subtitle: 'Sculpted Volume & Razor Lapels',
    description:
      'Engineered in our Milan atelier from double-faced Biella virgin wool, balancing structured geometric shoulders with fluid, weightless motion.',
    image: '/slider_runway_capsule_01.jpg',
    link: '/collections',
    linkText: 'Explore Collection',
    specs: [
      { label: 'Edition', value: 'Strictly 50' },
      { label: 'Textile', value: '540 GSM Biella Wool' },
      { label: 'Craft', value: '17kg Steam Press' },
    ],
  },
  {
    id: 'slide-02',
    tag: 'Capsule 02 · Atelier Drafting',
    season: 'Pattern Lab',
    title: 'Zero-Waste Geometric Geometry',
    subtitle: 'Blueprint Patterning & Bias Seams',
    description:
      'Every prototype begins on the drafting table as an architectural blueprint before a single meter of cloth is cut, calibrated down to the quarter millimeter.',
    image: '/slider_runway_capsule_02.jpg',
    link: '/craft-atelier',
    linkText: 'View Pattern Lab',
    specs: [
      { label: 'Tolerance', value: '0.25mm Cadence' },
      { label: 'Prototyping', value: '4 Iterations' },
      { label: 'Origin', value: 'Jura Workshop' },
    ],
  },
  {
    id: 'slide-03',
    tag: 'Capsule 03 · Metallurgy',
    season: 'Horology Studio',
    title: 'Aerospace Grade 5 Titanium Monolith',
    subtitle: 'Skeleton Caliber 801 Movement',
    description:
      'Timepiece cases milled from solid aerospace titanium blocks, diamond-paste beveled by hand, and registered in our permanent cryptographic master ledger.',
    image: '/slider_runway_capsule_03.jpg',
    link: '/watch',
    linkText: 'Configure Horology',
    specs: [
      { label: 'Material', value: 'Grade 5 Titanium' },
      { label: 'Movement', value: 'VOID Cal. 801' },
      { label: 'Sapphire', value: '9 Mohs Corundum' },
    ],
  },
  {
    id: 'slide-04',
    tag: 'Capsule 04 · Heritage Weave',
    season: 'Textile Archive',
    title: 'Ultra-Dense Japanese Shuttle Looming',
    subtitle: 'Raw Mulberry Silk & 17.5µ Merino',
    description:
      'Woven exclusively in historic Owari mills on slow vintage shuttle looms to produce rich tactile drape that contours organically to human posture.',
    image: '/slider_runway_capsule_04.jpg',
    link: '/materials',
    linkText: 'Browse Textile Archive',
    specs: [
      { label: 'Density', value: '420 GSM' },
      { label: 'Loom', value: 'Vintage Shuttle' },
      { label: 'Dye', value: 'Botanical Cold-Set' },
    ],
  },
];

const AUTOPLAY_DELAY = 6500; // ms

export function EditorialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const reducedMotion = useReducedMotion();

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[currentIndex];

  const goToSlide = useCallback((index: number, newDirection?: 1 | -1) => {
    setDirection(newDirection ?? (index > currentIndex ? 1 : -1));
    setCurrentIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [totalSlides]);

  // Autoplay loop with progress tracking
  useEffect(() => {
    if (isPaused || reducedMotion) return;

    const interval = 50; // update progress every 50ms
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / AUTOPLAY_DELAY) * 100);
      setProgress(currentProgress);

      if (elapsed >= AUTOPLAY_DELAY) {
        handleNext();
      }
    }, interval);

    timerRef.current = timer;
    return () => window.clearInterval(timer);
  }, [handleNext, isPaused, reducedMotion, currentIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  // Swipe drag handler
  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -400) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 400) {
      handlePrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '6%' : '-6%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-6%' : '6%',
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section
      aria-label="Editorial Runway Showcase"
      className="section-gap bg-[var(--ivory-deep)] border-y border-hairline overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        startTimeRef.current = Date.now() - (progress / 100) * AUTOPLAY_DELAY;
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="container-void">
        {/* Header bar: Title & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sienna" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-sienna font-bold">
                Runway & Capsule Showcase
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink">
              Curated <em className="italic font-normal text-sienna">Horizons</em>
            </h2>
          </div>

          {/* Controls: Prev / Next / Counter / Pause Toggle */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs text-ink-mute tracking-widest uppercase font-bold">
              [ <span className="text-sienna">{String(currentIndex + 1).padStart(2, '0')}</span> /{' '}
              {String(totalSlides).padStart(2, '0')} ]
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-full border border-hairline bg-ivory text-ink flex items-center justify-center hover:bg-bone hover:border-ink transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-full border border-hairline bg-ivory text-ink flex items-center justify-center hover:bg-bone hover:border-ink transition-all active:scale-95 shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Play Autoplay' : 'Pause Autoplay'}
                className="w-10 h-10 rounded-full border border-hairline bg-ivory text-ink-mute hover:text-ink flex items-center justify-center hover:bg-bone transition-all active:scale-95 shadow-sm"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-sienna" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main Slider Card Frame */}
        <div className="relative atelier-frame overflow-hidden bg-ivory border border-hairline rounded-2xl shadow-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={reducedMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[560px] cursor-grab active:cursor-grabbing relative"
            >
              {/* Media Column (7 Cols on desktop) */}
              <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] lg:h-auto overflow-hidden bg-bone/30 group">
                <motion.div
                  initial={{ scale: 1.08, filter: 'brightness(0.92)' }}
                  animate={{ scale: 1.0, filter: 'brightness(1)' }}
                  transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
                  className="w-full h-full"
                >
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-40 pointer-events-none" />

                {/* Badge Over Image */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sienna animate-pulse" />
                  {currentSlide.season}
                </motion.div>
              </div>

              {/* Information Column (5 Cols on desktop) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-12 flex flex-col justify-between bg-ivory">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="atelier-eyebrow text-sienna font-bold mb-2"
                  >
                    {currentSlide.tag}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, type: 'spring', stiffness: 180, damping: 22 }}
                    className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight mb-3"
                  >
                    {currentSlide.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.4 }}
                    className="font-display italic text-base text-ink-soft mb-4"
                  >
                    {currentSlide.subtitle}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.34, duration: 0.5 }}
                    className="text-sm text-ink-soft leading-relaxed font-light mb-6 line-clamp-3 lg:line-clamp-none"
                  >
                    {currentSlide.description}
                  </motion.p>

                  {/* Specifications Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="grid grid-cols-3 gap-3 py-4 border-y border-hairline mb-6"
                  >
                    {currentSlide.specs.map((spec, i) => (
                      <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.44 + i * 0.06, duration: 0.35 }}
                      >
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-ink-mute">
                          {spec.label}
                        </span>
                        <span className="block font-display text-xs sm:text-sm font-bold text-ink truncate mt-0.5">
                          {spec.value}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Action CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.4 }}
                  className="pt-2"
                >
                  <Link
                    to={currentSlide.link}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-ink text-ivory font-mono text-xs uppercase tracking-wider font-bold hover:bg-sienna hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-sienna/20 group/cta"
                  >
                    <span>{currentSlide.linkText}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Linear Progress Bar at bottom */}
          {!reducedMotion && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bone/80 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sienna to-sienna/70"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          )}
        </div>

        {/* Bottom Pagination Dots / Pills */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className={`transition-all duration-400 relative flex items-center rounded-full ${
                  isActive ? 'w-10 h-2.5 bg-sienna shadow-[0_2px_8px_-2px_rgba(163,72,36,0.4)]' : 'w-2.5 h-2.5 bg-ink/15 hover:bg-ink/30 hover:scale-110'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
