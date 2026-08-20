import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Truck,
  Package,
  RotateCcw,
  Globe2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

const SHIPPING_OPTIONS = [
  {
    icon: Truck,
    title: 'White-Glove Courier',
    description: 'Domestic orders ship via insured, climate-controlled courier with appointment-based handoff.',
    timeline: '3–5 business days processing + 2–4 days transit',
    cost: 'Free over $200 · $15 under',
  },
  {
    icon: Globe2,
    title: 'International Express',
    description: 'Global shipping with full insurance and tracking. Customs duties and taxes are the recipient\'s responsibility.',
    timeline: '3–5 business days processing + 7–14 days transit',
    cost: 'Calculated at checkout',
  },
  {
    icon: Clock,
    title: 'Atelier Priority',
    description: 'Expedited hand-finishing and next-flight-out shipping for time-sensitive acquisitions.',
    timeline: '1–2 business days processing + 1–2 days transit',
    cost: '$75 flat fee',
  },
];

const RETURN_STEPS = [
  {
    step: '01',
    title: 'Contact Concierge',
    body: 'Email concierge@voidatelier.com within 14 days of delivery with your order number and reason for return.',
  },
  {
    step: '02',
    title: 'Receive Authorization',
    body: 'Our team will issue a return authorization number and arrange insured courier pickup at no cost to you.',
  },
  {
    step: '03',
    title: 'Prepare Your Piece',
    body: 'Pack the item in its original packaging with all tags, certificates, and accessories intact.',
  },
  {
    step: '04',
    title: 'Refund Processed',
    body: 'Once inspected and approved, your refund will be issued to the original payment method within 5–10 business days.',
  },
];

const RETURN_RULES = [
  { text: 'Returns accepted within 14 days of delivery', included: true },
  { text: 'Item must be unworn, unaltered, and in original condition', included: true },
  { text: 'All tags, certificates, and packaging must be included', included: true },
  { text: 'Free insured courier pickup arranged by our team', included: true },
  { text: 'Made-to-order and customized pieces are final sale', included: false },
  { text: 'Shipping charges are non-refundable (except for defects)', included: false },
];

export default function Shipping() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] atelier-bg text-ink selection:bg-sienna/30 selection:text-sienna pt-24 pb-16"
    >
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(var(--sienna-rgb),0.1)] rounded-full blur-[120px] pointer-events-none" />
        <div className="container-void relative z-10 text-center max-w-3xl section-gap-sm">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUpVariants} className="mb-6">
              <span className="atelier-eyebrow text-sienna inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(var(--sienna-rgb),0.08)] border border-[rgba(var(--sienna-rgb),0.3)]">
                <Sparkles className="w-3.5 h-3.5" /> Concierge Logistics
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUpVariants}
              className="atelier-display text-5xl md:text-6xl mb-6 leading-none"
            >
              Shipping &<br />
              <em>Returns</em>
            </motion.h1>
            <motion.p
              variants={fadeUpVariants}
              className="text-base md:text-lg text-ink-mute max-w-2xl mx-auto font-light leading-relaxed"
            >
              Every order is hand-finished and shipped with white-glove care. Here is everything you need to know about delivery and returns.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SHIPPING OPTIONS */}
      <section className="section-gap-sm">
        <div className="container-void">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <span className="atelier-eyebrow text-sienna block mb-2">
              Delivery Methods
            </span>
            <h2 className="atelier-display text-3xl md:text-4xl">Shipping <em>Options</em></h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {SHIPPING_OPTIONS.map((option) => (
              <motion.div
                key={option.title}
                variants={fadeUpVariants}
                className="border border-hairline bg-[var(--bone)]/40 p-8 hover:border-[rgba(var(--sienna-rgb),0.5)] transition-colors duration-300"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(var(--sienna-rgb),0.12)] text-sienna mb-5">
                  <option.icon className="w-5 h-5" />
                </span>
                <h3 className="atelier-display text-xl mb-3">{option.title}</h3>
                <p className="text-sm text-ink-mute leading-relaxed font-light mb-6">
                  {option.description}
                </p>
                <div className="space-y-3 pt-4 border-t border-hairline">
                  <div>
                    <p className="atelier-eyebrow text-sienna mb-1">
                      Timeline
                    </p>
                    <p className="text-xs text-ink-mute">{option.timeline}</p>
                  </div>
                  <div>
                    <p className="atelier-eyebrow text-sienna mb-1">
                      Cost
                    </p>
                    <p className="text-xs text-ink">{option.cost}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* RETURN PROCESS */}
      <section className="section-gap-sm atelier-bg-deep border-y border-hairline">
        <div className="container-void max-w-4xl">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <span className="atelier-eyebrow text-sienna block mb-2">
              The Process
            </span>
            <h2 className="atelier-display text-3xl md:text-4xl">How <em>Returns</em> Work</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RETURN_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="border border-hairline bg-[var(--ivory)] p-6 h-full">
                  <span className="atelier-display text-3xl text-[rgba(var(--sienna-rgb),0.4)] block mb-3">
                    {step.step}
                  </span>
                  <h3 className="font-display text-base text-ink mb-2">{step.title}</h3>
                  <p className="text-xs text-ink-mute leading-relaxed font-light">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RETURN POLICY DETAILS */}
      <section className="section-gap-sm">
        <div className="container-void max-w-3xl">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="border border-hairline bg-[var(--bone)]/40 p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <RotateCcw className="w-5 h-5 text-sienna" />
              <h2 className="atelier-display text-2xl">Return Policy</h2>
            </div>

            <div className="space-y-4">
              {RETURN_RULES.map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  {rule.included ? (
                    <Check className="w-5 h-5 text-sienna flex-shrink-0 mt-0.5" />
                  ) : (
                    <span className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center text-ink-mute">
                      <X className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                  <p className={`text-sm leading-relaxed font-light ${rule.included ? 'text-ink-soft' : 'text-ink-mute'}`}>
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-hairline grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-sienna flex-shrink-0 mt-0.5" />
                <div>
                  <p className="atelier-eyebrow text-sienna mb-1">
                    Exchanges
                  </p>
                  <p className="text-xs text-ink-mute font-light">
                    Size exchanges accepted subject to availability within 14 days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sienna flex-shrink-0 mt-0.5" />
                <div>
                  <p className="atelier-eyebrow text-sienna mb-1">
                    Damaged Items
                  </p>
                  <p className="text-xs text-ink-mute font-light">
                    Report damage within 48 hours for immediate replacement.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gap-sm">
        <div className="container-void">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="atelier-display text-3xl md:text-4xl mb-4">
              Need <em>Assistance?</em>
            </h2>
            <p className="text-ink-mute mb-8 font-light">
              Our concierge team handles all shipping and return inquiries personally.
            </p>
            <Link
              to="/contact"
              className="atelier-btn inline-flex items-center gap-2"
            >
              Contact Concierge
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}