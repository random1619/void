import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using the VOID Atelier website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services.',
      'These terms constitute a legally binding agreement between you and VOID Atelier. We may update these terms at any time, and continued use of our services constitutes acceptance of any changes.',
    ],
  },
  {
    title: '2. Use of Our Services',
    body: [
      'You may use our website only for lawful purposes and in accordance with these Terms. You agree not to use the site in any way that could damage, disable, or impair the service or interfere with another user\'s use.',
      'You must provide accurate and complete information when creating an account or placing an order, and you are responsible for maintaining the confidentiality of your account credentials.',
    ],
  },
  {
    title: '3. Products & Pricing',
    body: [
      'We strive to display our products and their colors accurately. However, we cannot guarantee that your device\'s display will reflect the exact appearance of any product. Slight variations in materials and hand-finishing are inherent to artisanal production.',
      'All prices are listed in US Dollars (USD) unless otherwise stated. We reserve the right to change prices and availability at any time without notice. Orders are subject to acceptance and availability.',
    ],
  },
  {
    title: '4. Orders & Payment',
    body: [
      'When you place an order, you make an offer to purchase. We reserve the right to accept or decline your order at our discretion. If we decline, any payment will be refunded in full.',
      'Payment must be received in full before an order is processed. We accept major credit cards and other payment methods as displayed at checkout. All payments are processed securely through our payment partners.',
    ],
  },
  {
    title: '5. Shipping & Delivery',
    body: [
      'Each piece is hand-finished to order, with processing times of 3–5 business days. Shipping timelines are estimates and not guaranteed. We are not liable for delays caused by carriers, customs, or circumstances beyond our control.',
      'Risk of loss passes to you upon delivery. If your order is lost or damaged in transit, please contact us immediately so we can assist with the carrier claim process.',
    ],
  },
  {
    title: '6. Returns & Refunds',
    body: [
      'Our return policy allows returns within 14 days of delivery for unworn, unaltered pieces in original condition. Made-to-order and customized pieces are final sale.',
      'Approved refunds will be issued to the original payment method within 5–10 business days. Shipping charges are non-refundable except in cases of defect or error on our part.',
    ],
  },
  {
    title: '7. Intellectual Property',
    body: [
      'All content on this website · including text, graphics, logos, images, designs, and software · is the property of VOID Atelier and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.',
      'The VOID Atelier name, logo, and all related marks are trademarks of our company. Unauthorized use is strictly prohibited.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, VOID Atelier shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products, including but not limited to loss of profits, data, or goodwill.',
      'Our total liability for any claim arising from these terms or your use of our services shall not exceed the amount you paid us in the preceding 12 months.',
    ],
  },
  {
    title: '9. Governing Law',
    body: [
      'These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts located in New York County, New York.',
    ],
  },
  {
    title: '10. Contact',
    body: [
      'If you have questions about these Terms of Service, please contact our concierge team at concierge@voidatelier.com.',
    ],
  },
];

export default function Terms() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] atelier-bg text-ink selection:bg-sienna/30 selection:text-sienna pt-24 pb-16"
    >
      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[rgba(var(--sienna-rgb),0.1)] rounded-full blur-[120px] pointer-events-none" />
        <div className="container-void relative z-10 text-center max-w-3xl section-gap-sm">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUpVariants} className="mb-6">
              <span className="atelier-eyebrow text-sienna inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(var(--sienna-rgb),0.08)] border border-[rgba(var(--sienna-rgb),0.3)]">
                <FileText className="w-3.5 h-3.5" /> Legal
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUpVariants}
              className="atelier-display text-5xl md:text-6xl mb-4 leading-none"
            >
              Terms of <em>Service</em>
            </motion.h1>
            <motion.p
              variants={fadeUpVariants}
              className="text-sm text-ink-mute font-light"
            >
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-8">
        <div className="container-void max-w-3xl">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border border-hairline bg-[var(--bone)]/40 p-8"
          >
            <div className="flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-sienna flex-shrink-0 mt-1" />
              <p className="text-sm text-ink-mute leading-relaxed font-light">
                Welcome to VOID Atelier. These Terms of Service govern your use of our website and the purchase of our products. Please read them carefully before using our services.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="py-8">
        <div className="container-void max-w-3xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-8"
          >
            {SECTIONS.map((section) => (
              <motion.div
                key={section.title}
                variants={fadeUpVariants}
                className="border border-hairline bg-[var(--bone)]/40 p-8"
              >
                <h2 className="atelier-display text-xl mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm text-ink-mute leading-relaxed font-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-gap-sm">
        <div className="container-void max-w-3xl">
          <div className="border border-hairline bg-[var(--bone)]/40 p-8 text-center">
            <h2 className="atelier-display text-xl mb-3">Questions About These Terms?</h2>
            <p className="text-sm text-ink-mute font-light mb-2">
              Contact our concierge team:
            </p>
            <a
              href="mailto:concierge@voidatelier.com"
              className="text-sienna hover:text-ink transition-colors text-sm"
            >
              concierge@voidatelier.com
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}