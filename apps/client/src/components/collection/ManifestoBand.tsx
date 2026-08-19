import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { fadeUpVariants } from '../../lib/animations';

/** Parallax text layer — shifts opposite to cursor for depth. */
function ParallaxText({ children, range = 8 }: { children: React.ReactNode; range?: number }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 22, mass: 1 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    x.set(((centerX - e.clientX) / rect.width) * range);
  };

  const handlePointerLeave = () => {
    x.set(0);
  };

  return (
    <motion.div
      style={{ x: springX }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export function ManifestoBand() {
  return (
    <section className="section-gap atelier-bg border-y border-hairline relative overflow-hidden">
      {/* Subtle animated background gradient. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-sienna/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-ink/5 rounded-full blur-3xl" />
      </div>

      <div className="container-void max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <blockquote className="atelier-display text-[clamp(28px,4vw,48px)] leading-[1.05] mb-8">
            <ParallaxText range={6}>
              We do not chase seasons.
            </ParallaxText>
            <br className="hidden md:block" />
            <ParallaxText range={10}>
              We chase the <em className="text-sienna">permanent</em> line.
            </ParallaxText>
          </blockquote>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="text-ink-soft text-base md:text-lg leading-relaxed measure mx-auto"
          >
            Every piece in the Ivory Series is released in a numbered edition, cut slowly, finished by hand, and designed to outlast the trend cycle. No logos. No noise. Only form, fabric, and the conviction to do less.
          </motion.p>
          <hr className="atelier-rule mt-12 max-w-xs mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
