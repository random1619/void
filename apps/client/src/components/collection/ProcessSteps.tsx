import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';
import { staggerContainer, fadeUpVariants } from '../../lib/animations';
import { useReducedMotion } from 'framer-motion';

const STEPS = [
  { title: 'Source', body: 'Organic silk, heavyweight wool, and full-grain leather selected from Italian and Japanese mills.' },
  { title: 'Cut', body: 'Pattern pieces are laid by hand, respecting grain and drape before any machine touches the cloth.' },
  { title: 'Sew', body: 'Seams are finished with single-needle stitching, pressed open, and reinforced where form meets force.' },
  { title: 'Number', body: 'Each garment receives an edition number, recorded in the house archive before it ships.' },
];

/** Magnetic step number — pulls toward cursor with a spring. */
function StepNumber({ num }: { num: number }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(((e.clientX - centerX) / rect.width) * 8);
    y.set(((e.clientY - centerY) / rect.height) * 8);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="flex-shrink-0 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-ink-mute hover:border-sienna hover:text-sienna transition-colors duration-300 cursor-default"
    >
      {num}
    </motion.span>
  );
}

/** Parallax image — shifts subtly opposite to cursor for depth. */
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 22, mass: 1 });
  const springY = useSpring(y, { stiffness: 150, damping: 22, mass: 1 });

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
        className="absolute inset-0 w-[106%] h-[106%] object-cover -left-[3%] -top-[3%]"
        style={{ x: springX, y: springY }}
      />
    </motion.div>
  );
}

export function ProcessSteps() {
  return (
    <section className="section-gap atelier-bg overflow-hidden">
      <div className="container-void">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUpVariants} className="mb-10">
              <span className="atelier-eyebrow text-sienna block mb-4">Atelier Process</span>
              <h2 className="atelier-display text-[clamp(32px,4.5vw,56px)]">
                From Mill <em>to Number</em>
              </h2>
            </motion.div>

            <motion.ol variants={staggerContainer} className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  variants={fadeUpVariants}
                  className="flex gap-5 group"
                >
                  <StepNumber num={i + 1} />
                  <div>
                    <h3 className="font-display text-xl text-ink group-hover:text-sienna transition-colors duration-300 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-ink-soft text-sm leading-relaxed">{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            <motion.div variants={fadeUpVariants} className="mt-10 flex items-center gap-2 text-ink-mute text-xs">
              <Check className="w-4 h-4 text-sienna" aria-hidden="true" />
              <span>Every piece is numbered, finished by hand, and shipped in a recycled cotton garment bag.</span>
            </motion.div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="atelier-frame aspect-square lg:aspect-[4/5] relative overflow-hidden"
          >
            <ParallaxImage
              src="/lookbook-3-detail.png"
              alt="Detail shot of an Ivory Series garment construction"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-ivory">
              <span className="atelier-eyebrow">Process Detail</span>
              <span className="atelier-eyebrow text-sienna">Nº 03</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
