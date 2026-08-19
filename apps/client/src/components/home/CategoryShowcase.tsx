import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fadeUpVariants, staggerContainer, clipReveal } from '../../lib/animations';
import { useReducedMotion } from 'framer-motion';
import { AnimatedHeading } from '../ui/AnimatedHeading';

/**
 * Gapless Bento Category Showcase — 4 Houses, mathematically interlocking grid.
 * Harmonized dimensions, gapless spacing, and micro-hover physics.
 */
const HOUSES = [
  {
    label: 'Haute Couture',
    sub: 'Sculpted Silhouettes',
    to: '/collections/atelier',
    image: '/products/haute_couture_editorial.jpg',
    gridClass: 'md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[480px]',
  },
  {
    label: 'Architectural Outerwear',
    sub: 'Shielding Elements',
    to: '/collections/outerwear',
    image: '/products/outerwear_architectural.jpg',
    gridClass: 'md:col-span-2 md:row-span-1 min-h-[230px]',
  },
  {
    label: 'Horology Archive',
    sub: 'Chrono Calibration',
    to: '/watch',
    image: '/products/luxury_watch_horology.jpg',
    gridClass: 'md:col-span-1 md:row-span-1 min-h-[230px]',
  },
  {
    label: 'Sculptural Footwear',
    sub: 'Monolithic Forms',
    to: '/collections/footwear',
    image: '/products/sculptural_footwear_boots.jpg',
    gridClass: 'md:col-span-1 md:row-span-1 min-h-[230px]',
  },
];

/** Magnetic arrow pill — pulls toward cursor on hover. */
function MagneticArrow() {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 340, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 340, damping: 30, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(((e.clientX - centerX) / rect.width) * 10);
    y.set(((e.clientY - centerY) / rect.height) * 10);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className="w-9 h-9 shrink-0 rounded-full glass-refraction-dark text-ivory flex items-center justify-center transition-[background-color,transform,color] duration-200 ease-[var(--ease-out)] group-hover:bg-sienna group-hover:scale-[1.03] group-hover:text-white"
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.span>
  );
}

/** Parallax image — shifts subtly with cursor while enabling GPU scale on hover. */
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.6 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(((centerX - e.clientX) / rect.width) * 12);
    y.set(((centerY - e.clientY) / rect.height) * 12);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-[108%] h-[108%] object-cover -left-[4%] -top-[4%] transition-transform duration-500 ease-[var(--ease-luxury)] group-hover:scale-[1.03]"
        style={{ x: springX, y: springY }}
      />
    </motion.div>
  );
}

export function CategoryShowcase() {
  return (
    <section aria-labelledby="categories-heading" className="section-gap">
      <div className="container-void">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Section Header */}
          <motion.div variants={fadeUpVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <AnimatedHeading
                id="categories-heading"
                text="Four Houses, _One Aesthetic_" variant="tracking"
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink"
              />
            </div>
            <Link
              to="/collections"
              className="group font-mono text-xs uppercase tracking-widest text-ink inline-flex items-center gap-2 px-2 py-4 border-b border-ink/30 hover:border-sienna transition-colors focus-visible:outline-offset-4"
            >
              <span>Explore All Archives</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sienna transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* Gapless Bento Grid: 4 columns x 2 rows */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 grid-flow-dense gap-5 w-full">
            {HOUSES.map((house) => (
              <motion.div
                key={house.to}
                variants={clipReveal}
                className={`relative group ${house.gridClass}`}
              >
                <Link
                  to={house.to}
                  className="group block focus-visible:outline-offset-4 h-full w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  aria-label={`Explore ${house.label}`}
                >
                  <div className="relative w-full h-full bg-bone border border-hairline overflow-hidden">
                    <ParallaxImage src={house.image} alt={`${house.label} editorial showcase`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-200" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-3 z-10">
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-ivory transition-colors duration-300 group-hover:text-sienna">
                          {house.label}
                        </h3>
                        <p className="mt-1 font-mono text-[11px] text-ivory/70 tracking-wider">
                          {house.sub}
                        </p>
                      </div>
                      <MagneticArrow />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
