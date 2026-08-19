import { motion, useReducedMotion } from 'framer-motion';
import { Star, Award, ShieldCheck } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../../lib/animations';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const PRESS_ACCOLADES = [
  { outlet: 'Vogue Hommes', quote: 'The most structural menswear silhouette of the decade.' },
  { outlet: 'Monocle Horology', quote: 'Caliber 801 sets a new benchmark in titanium micro-finishing.' },
  { outlet: 'Architectural Digest', quote: 'Pure geometric discipline translated into wearable form.' },
  { outlet: 'GQ Style', quote: 'Strictly 50 pieces per edition. Exclusivity without gimmicks.' },
];

const TESTIMONIALS = [
  {
    quote:
      'The tailoring is unlike anything in my wardrobe. Every seam feels structural; it is wearable architecture engineered with Japanese perfection.',
    name: 'Isabella Moreau',
    role: 'Creative Director, Paris',
    serial: 'VOID-2026-ED01-007',
    stars: 5,
  },
  {
    quote:
      'VOID is the only house that treats contemporary silhouettes with bespoke couture discipline. The drape and 420 GSM weight are simply unmatched.',
    name: 'Kenji Watanabe',
    role: 'Horology & Design Collector, Tokyo',
    serial: 'VOID-2026-ED02-014',
    stars: 5,
  },
  {
    quote:
      'From unboxing to the door-to-wardrobe handoff, the entire experience is flawless. This is what true modern luxury looks like.',
    name: 'Amara Okafor',
    role: 'Editor-in-Chief, London & Lagos',
    serial: 'VOID-2026-ED03-033',
    stars: 5,
  },
];

function QuoteMark({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      initial={reducedMotion ? undefined : { opacity: 0, scale: 0.9, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.6 }}
      className="inline-block text-sienna font-display text-5xl md:text-6xl leading-none select-none"
      aria-hidden="true"
    >
      {children}
    </motion.span>
  );
}

function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  featured?: boolean;
}) {
  return (
    <motion.figure
      variants={fadeUpVariants}
      className={`atelier-card atelier-card-hover p-8 md:p-10 flex flex-col justify-between gap-6 rounded-3xl border border-hairline bg-bone/30 ${
        featured ? 'md:col-span-2' : 'flex-1'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <QuoteMark>&ldquo;</QuoteMark>
          <div className="flex items-center gap-1 text-sienna">
            {[...Array(testimonial.stars)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-sienna text-sienna" />
            ))}
          </div>
        </div>
        <blockquote className="text-ink text-base md:text-lg leading-relaxed font-light">
          {testimonial.quote}
        </blockquote>
      </div>

      <figcaption className="flex items-center justify-between gap-4 pt-4 border-t border-hairline">
        <div>
          <p className="text-ink font-display text-sm font-bold">{testimonial.name}</p>
          <p className="text-ink-mute font-mono text-xs mt-0.5">{testimonial.role}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 text-sienna font-mono text-[10px]">
          <ShieldCheck className="w-3 h-3" />
          <span>{testimonial.serial}</span>
        </div>
      </figcaption>
    </motion.figure>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="section-gap atelier-bg-deep border-y border-hairline">
      <div className="container-void">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Section Heading */}
          <motion.div variants={fadeUpVariants} className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-4">
              <Award className="w-3.5 h-3.5 text-sienna" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-sienna font-bold">
                Archival Provenance
              </span>
            </div>
            <AnimatedHeading
              id="testimonials-heading"
              text="Worn by Those Who _Define the Skyline_"
              variant="tracking"
              className="atelier-display text-[clamp(32px,4vw,52px)]"
            />
          </motion.div>

          {/* Testimonial Cards Grid */}
          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <TestimonialCard testimonial={TESTIMONIALS[0]} featured />
            <div className="flex flex-col gap-8">
              {TESTIMONIALS.slice(1).map((t) => (
                <TestimonialCard key={t.name} testimonial={t} />
              ))}
            </div>
          </motion.div>

          {/* Editorial Press Strip */}
          <motion.div
            variants={fadeUpVariants}
            className="pt-10 border-t border-hairline grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PRESS_ACCOLADES.map((item) => (
              <div key={item.outlet} className="space-y-1.5">
                <span className="font-display font-bold text-ink text-sm block">
                  {item.outlet}
                </span>
                <p className="font-sans text-xs text-ink-mute leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
