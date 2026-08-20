import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUpVariants } from '../../lib/animations';

/**
 * Parallax text — shifts opposite to cursor for depth perception.
 */
function ParallaxText({ children, range = 12 }: { children: React.ReactNode; range?: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 22, mass: 1 });
  const springY = useSpring(my, { stiffness: 150, damping: 22, mass: 1 });

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mx.set(((centerX - e.clientX) / rect.width) * range);
    my.set(((centerY - e.clientY) / rect.height) * range);
  };
  const onPointerLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic CTA button with spring press feedback — inline physics so we
 * avoid a cross-import dependency on the hooks module.
 */
import { Image } from '../ui/Image';
function MagneticCtaLink({ to, children }: { to: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 30, mass: 0.5 });
  const springY = useSpring(my, { stiffness: 200, damping: 30, mass: 0.5 });
  const scale = useSpring(1, { stiffness: 400, damping: 20, mass: 0.5 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 16);
    my.set(((e.clientY - rect.top - rect.height / 2) / rect.height) * 16);
  };
  const onPointerLeave = () => { mx.set(0); my.set(0); };
  const onPointerDown = () => scale.set(0.96);
  const onPointerUp = () => scale.set(1);

  return (
    <motion.a
      ref={ref}
      href={to}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="atelier-btn-inverse inline-flex items-center gap-2"
      style={{ x: springX, y: springY, scale }}
    >
      {children}
    </motion.a>
  );
}

export function ClosingCta() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center atelier-ink text-ivory overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/cta_closing_bg.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/60 to-ink/80" />
      </div>

      <div className="relative z-10 container-void text-center max-w-3xl">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <ParallaxText range={8}>
            <span className="atelier-eyebrow text-sienna block mb-6">Acquire the Series</span>
          </ParallaxText>
          <ParallaxText range={14}>
            <h2 className="atelier-display text-ivory text-[clamp(36px,6vw,72px)] leading-[1.0] mb-8">
              Join the <em>Atelier Circle</em>
            </h2>
          </ParallaxText>
          <ParallaxText range={6}>
            <p className="text-ivory/70 text-base md:text-lg leading-relaxed measure mx-auto mb-10">
              Numbered editions, white-glove delivery, and private access to future drops · reserved for those who dress with intent.
            </p>
          </ParallaxText>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticCtaLink to="/products">
              Shop All Pieces <ArrowRight className="w-4 h-4" />
            </MagneticCtaLink>
            <Link
              to="/collections"
              className="atelier-eyebrow text-ivory/80 text-[10px] inline-flex items-center gap-2 hover:text-sienna transition-colors"
            >
              Explore Collections →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
