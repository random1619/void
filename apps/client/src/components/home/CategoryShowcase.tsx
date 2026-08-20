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

/** Bento card with specular cursor illumination and parallax */
function BentoCard({ house }: { house: (typeof HOUSES)[0] }) {
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotOpacity = useMotionValue(0);

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    spotOpacity.set(1);
  };

  const handleMouseLeave = () => {
    spotOpacity.set(0);
  };

  return (
    <motion.div
      variants={clipReveal}
      className={`relative group ${house.gridClass}`}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
    >
      <Link
        to={house.to}
        className="group block focus-visible:outline-offset-4 h-full w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-[shadow,transform] duration-500 hover:-translate-y-1"
        aria-label={`Explore ${house.label}`}
      >
        <div className="relative w-full h-full bg-bone border border-hairline overflow-hidden rounded-2xl">
          <ParallaxImage src={house.image} alt={`${house.label} editorial showcase`} />
          
          {/* Specular spotlight cursor glow */}
          {!reducedMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
              style={{
                opacity: spotOpacity,
                background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 80%)`,
              }}
            />
          )}

          {/* Dark luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Card content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4 z-20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sienna" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-ivory/90 font-bold">
                  {house.sub}
                </span>
              </div>
              <h3 className="font-display text-xl md:text-3xl font-bold text-ivory transition-colors duration-300 group-hover:text-sienna">
                {house.label}
              </h3>
            </div>
            <MagneticArrow />
          </div>
        </div>
      </Link>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-sienna animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-sienna font-bold">
                  Maison Architecture
                </span>
              </div>
              <AnimatedHeading
                id="categories-heading"
                text="Four Houses, _One Aesthetic_"
                variant="tracking"
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink"
              />
            </div>
            <Link
              to="/collections"
              className="group font-mono text-xs uppercase tracking-widest text-ink inline-flex items-center gap-2 px-2 py-3 border-b border-ink/30 hover:border-sienna transition-colors focus-visible:outline-offset-4"
            >
              <span>Explore All Archives</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sienna transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* Gapless Bento Grid: 4 columns x 2 rows */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 grid-flow-dense gap-5 w-full">
            {HOUSES.map((house) => (
              <BentoCard key={house.to} house={house} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
