import { motion } from 'framer-motion';
import { NewsletterSignup } from '../ui/NewsletterSignup';
import { fadeUpVariants } from '../../lib/animations';
import { AnimatedHeading } from '../ui/AnimatedHeading';

/**
 * Editorial newsletter band above the footer. Ivory world: centered editorial
 * headline, sienna eyebrow, hairline top rule — no glow, no glass.
 */
export function NewsletterCta() {
  return (
    <section aria-labelledby="newsletter-heading" className="section-gap-sm border-t border-hairline">
      <div className="container-void">
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mx-auto text-center"
        >
          <AnimatedHeading
            id="newsletter-heading"
            text="Private Access, _Before the World_" variant="tracking"
            className="atelier-display text-[clamp(32px,4.5vw,56px)]"
          />
          <motion.p variants={fadeUpVariants} className="text-ink-soft text-sm md:text-base leading-relaxed mt-5 mb-10 max-w-xl mx-auto">
            Receive private invitations to seasonal drops, atelier lookbooks, and
            members-only releases, delivered with the discretion the house is known for.
          </motion.p>
          <motion.div variants={fadeUpVariants}>
            <NewsletterSignup />
            <p className="atelier-eyebrow text-ink-mute mt-5">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
