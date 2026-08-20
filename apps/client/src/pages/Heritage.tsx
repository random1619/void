import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '../components/ui/Image';
import { useGsapParallax } from '../hooks/useGsapScrollEffect';
import { prefersReducedMotion } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

/**
 * Heritage — a monolith lineage ledger.
 * The house's story reads as a vertical timeline of founding moments,
 * each anchored by a real editorial frame. Image-first, hairline-ruled,
 * with a GSAP-drifting hero.
 */

const ERAS = [
  {
    year: '1929',
    title: 'The Founding',
    body: 'VOID is established in a Val-de-Travers workshop, cutting architectural silhouettes for the engineers of the Jura — garments built like instruments, not like trends.',
    image: '/heritage_era_1929.jpg',
    alt: 'Historic VOID silhouette archive',
  },
  {
    year: '1958',
    title: 'The Metallurgy',
    body: 'The house pioneers titanium alloying for couture frames, borrowing horological precision for hardwear that outlasts a decade of wear.',
    image: '/heritage_era_1958.jpg',
    alt: 'VOID metallurgy experiments',
  },
  {
    year: '1994',
    title: 'The Atelier',
    body: 'A single workshop under one roof — pattern cutters, metalworkers and finishers working in one room, the way the maison still works today.',
    image: '/heritage_era_1994.jpg',
    alt: 'Inside the VOID atelier',
  },
  {
    year: '2026',
    title: 'The Monolith',
    body: 'The current flagship — the ceramic-titanium Monolith timepiece — is unveiled, and the maison returns toward its engineered beginnings.',
    image: '/heritage_era_2026.jpg',
    alt: 'VOID Monolith editorial',
  },
];

const PRINCIPLES = [
  'One room. One object. No shortcuts.',
  'The seam is a line of intention.',
  'Materials earn their place or they leave.',
];

export default function Heritage() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useGsapParallax<HTMLDivElement>({ yPercent: 10, scrub: 1.2 });

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to('.heritage-hero-copy', {
        yPercent: -14,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 35%',
          scrub: 1,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
      <main className="overflow-x-hidden w-full max-w-full">
        {/* ==================== HERO ==================== */}
        <section
          ref={heroRef}
          className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
          aria-labelledby="heritage-h1"
        >
          <div ref={imageRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
            <Image
              src="/heritage_hero_banner.jpg"
              alt=""
              loading="eager"
              className="w-full h-[120%] object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />
          </div>

          <div className="pointer-events-none absolute inset-4 md:inset-6 border border-ivory/20" aria-hidden="true" />

          <div className="relative z-10 container-void flex flex-col items-center text-center">
            <motion.div
              className="heritage-hero-copy"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                id="heritage-h1"
                className="atelier-display text-ivory atelier-display-xl mb-6"
              >
                A Century in <em>Monolith.</em>
              </h1>
              <p className="max-w-xl mx-auto text-ivory/70 text-base md:text-lg leading-relaxed font-light measure">
                From a single Jura workshop to an engineered maison — the house has always believed
                that clothing, like horology, is a discipline of measurable precision.
              </p>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-between items-end container-void text-ivory/50">
            <span className="atelier-eyebrow text-[10px]">VOID Atelier · Est. 1929</span>
            <span className="atelier-eyebrow text-[10px] hidden sm:block">Scroll to descend</span>
          </div>
        </section>

        {/* ==================== TIMELINE ==================== */}
        <section className="section-gap-lg" aria-label="Heritage timeline">
          <div className="container-void">
            <ol className="relative border-l border-hairline ml-4 md:ml-36 space-y-24">
              {ERAS.map((era, index) => (
                <motion.li
                  key={era.year}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-8 md:pl-14 group"
                >
                  <span
                    className="absolute -left-[5px] top-3 w-2.5 h-2.5 bg-sienna transition-transform duration-300 group-hover:scale-125"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="atelier-frame overflow-hidden atelier-frame-hover img-grain aspect-[4/3]">
                        <Image
                          src={era.image}
                          alt={era.alt}
                          loading="lazy"
                          wrapperClassName="w-full h-full"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <span className="font-display text-5xl md:text-6xl text-sienna font-bold block mb-4">
                        {era.year}
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl text-ink mb-3 leading-snug">
                        {era.title}
                      </h2>
                      <p className="text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-xl">
                        {era.body}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ==================== PRINCIPLES ==================== */}
        <section className="section-gap atelier-bg-deep" aria-label="House principles">
          <div className="container-void">
            <div className="max-w-2xl mb-12">
              <h2 className="atelier-display atelier-display-lg">
                The <em>House Rules.</em>
              </h2>
            </div>
            <div className="border-t border-hairline">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="py-8 flex items-baseline gap-6 border-b border-hairline group"
                >
                  <span className="atelier-eyebrow text-sienna shrink-0">0{i + 1}</span>
                  <p className="font-display text-2xl md:text-4xl text-ink leading-tight group-hover:text-sienna transition-colors duration-300">
                    {p}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== NEXT ==================== */}
        <section className="section-gap" aria-label="Continue exploring">
          <div className="container-void text-center">
            <p className="atelier-eyebrow text-ink-mute mb-6">Continue the story</p>
            <h2 className="atelier-display atelier-display-lg mb-10 max-w-3xl mx-auto">
              See the objects the lineage <em>produced.</em>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/craft-atelier" className="atelier-btn">
                Visit the Craft Atelier <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/materials" className="atelier-btn-ghost">
                The Materials Archive
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}