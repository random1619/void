import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useGsapParallax } from '../../hooks/useGsapScrollEffect';
import { Image } from '../ui/Image';


gsap.registerPlugin(ScrollTrigger);

export function PinnedHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useGsapParallax<HTMLDivElement>({ yPercent: 8, scrub: 1.5 });
  const imageRef = useGsapParallax<HTMLDivElement>({ yPercent: 15, scrub: 1.2 });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="collection-hero-heading"
      className="relative min-h-[100dvh] w-full overflow-hidden atelier-ink text-ivory"
    >
      {/* Cinematic background layer */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        <Image
          src="/pinned_hero_drape.png"
          alt=""
          loading="eager"
          decoding="async"
          className="w-full h-[120%] object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90" />
      </div>

      {/* Hairline frame */}
      <div className="pointer-events-none absolute inset-4 md:inset-6 border border-ivory/20" aria-hidden="true" />

      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <span className="atelier-eyebrow text-sienna mb-6 tracking-[0.32em]">SS / 2026</span>
        <h1 id="collection-hero-heading" className="atelier-display text-ivory text-[clamp(48px,10vw,132px)] leading-[0.95]">
          The Ivory <em>Series</em>
        </h1>
        <p className="mt-8 max-w-xl text-ivory/70 text-base md:text-lg leading-relaxed measure">
          A study in restraint. Sculpted silhouettes and hand-finished tailoring cut from organic silk, cashmere, and wool.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <a href="#lookbook" className="atelier-btn-inverse">
            Enter the Lookbook <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#pieces" className="atelier-eyebrow text-ivory/80 text-[10px] inline-flex items-center gap-2 hover:text-sienna transition-colors">
            <ArrowDown className="w-3 h-3" /> Explore the pieces
          </a>
        </div>
      </div>

      {/* Bottom season index */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-between items-end container-void text-ivory/50">
        <span className="atelier-eyebrow text-[10px]">VOID Atelier</span>
        <span className="atelier-eyebrow text-[10px]">13 numbered looks</span>
      </div>
    </section>
  );
}
