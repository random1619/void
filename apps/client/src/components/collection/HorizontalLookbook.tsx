import { useRef, useLayoutEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/utils';
import { Image } from '../ui/Image';

gsap.registerPlugin(ScrollTrigger);

const LOOKS = [
  { id: '01', image: '/lookbook-1-alt.png', title: 'The Draped Hour', subtitle: 'Silk & Structure' },
  { id: '02', image: '/lookbook-2-alt.png', title: 'Ivory Volume', subtitle: 'Wool & Weight' },
  { id: '03', image: '/lookbook-3-alt.png', title: 'Soft Armor', subtitle: 'Leather & Line' },
  { id: '04', image: '/lookbook-4-alt.png', title: 'Quiet Storm', subtitle: 'Cashmere & Control' },
  { id: '05', image: '/lookbook-1-detail.png', title: 'Undertone', subtitle: 'Bone & Brass' },
  { id: '06', image: '/lookbook-2-detail.png', title: 'After Hours', subtitle: 'Ink & Ivory' },
];

export function HorizontalLookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() === true;

  useLayoutEffect(() => {
    if (reducedMotion || prefersReducedMotion()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth;
      const viewportWidth = section.offsetWidth;
      const distance = scrollWidth - viewportWidth;

      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      aria-labelledby="lookbook-heading"
      className={`relative min-h-[100dvh] w-full atelier-bg ${reducedMotion ? 'overflow-x-auto' : 'overflow-hidden'}`}
    >
      <div className="absolute top-8 left-0 right-0 z-10 container-void flex justify-between items-center">
        <span id="lookbook-heading" className="atelier-eyebrow text-sienna">
          The Lookbook
        </span>
        <span className="atelier-eyebrow text-ink-mute text-[10px] hidden md:block">
          Lookbook
        </span>
      </div>

      <div
        ref={trackRef}
        className={`${reducedMotion ? 'relative w-max' : 'absolute top-0 left-0 will-change-transform'} h-[100dvh] flex items-center gap-6 px-6 md:px-12`}
        style={{ paddingTop: '6rem', paddingBottom: '3rem' }}
      >
        {LOOKS.map((look) => (
          <article
            key={look.id}
            className="relative h-full flex-shrink-0 w-[78vw] md:w-[42vw] lg:w-[32vw] group"
          >
            <div className="atelier-frame atelier-frame-hover h-full w-full relative overflow-hidden">
              <Image
                src={look.image}
                alt={`Look ${look.id}: ${look.title}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-ivory">
                <span className="atelier-eyebrow text-sienna text-[10px] block mb-2">
                  Look Nº {look.id}
                </span>
                <h3 className="font-display text-3xl md:text-4xl leading-none">{look.title}</h3>
                <p className="text-ivory/70 text-sm mt-2 font-light">{look.subtitle}</p>
              </div>
            </div>
          </article>
        ))}

        {/* Closing card */}
        <div className="flex-shrink-0 h-full w-[78vw] md:w-[42vw] lg:w-[32vw] flex items-center justify-center border border-hairline bg-[var(--bone)]/30">
          <div className="text-center p-8">
            <span className="atelier-eyebrow text-sienna block mb-4">End of Lookbook</span>
            <a href="#pieces" className="atelier-btn">
              Shop the Series <span className="atelier-eyebrow text-[10px]">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Progress rail */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {LOOKS.map((look, i) => (
          <span
            key={look.id}
            className="w-8 h-px bg-ink-mute/30"
            aria-hidden="true"
            style={{ ['--index' as string]: i + 1 }}
          />
        ))}
      </div>
    </section>
  );
}
