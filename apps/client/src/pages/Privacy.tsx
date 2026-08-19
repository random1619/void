import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'We collect information you provide directly to us, such as your name, email address, shipping address, and payment details when you create an account, place an order, or subscribe to our newsletter.',
      'We also automatically collect certain information about your device and usage of our website, including IP address, browser type, pages visited, and timestamps, through cookies and similar technologies.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'To process and fulfill your orders, including shipping, returns, and customer support.',
      'To communicate with you about your account, orders, and atelier updates, including private seasonal drops and lookbook releases.',
      'To improve our website, products, and services through analysis of usage patterns and feedback.',
      'To detect, prevent, and address fraud, security issues, and technical problems.',
    ],
  },
  {
    title: '3. Information Sharing',
    body: [
      'We do not sell, rent, or trade your personal information to third parties. We share data only with trusted partners who assist us in operating our website, conducting business, or servicing you · such as payment processors, shipping carriers, and analytics providers.',
      'These partners are bound by confidentiality obligations and are prohibited from using your data for any other purpose. We may also disclose information when required by law or to protect our rights and safety.',
    ],
  },
  {
    title: '4. Data Security',
    body: [
      'We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS) and at rest, access controls, and regular security assessments.',
      'While we strive to protect your data, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to using best practices to safeguard your information.',
    ],
  },
  {
    title: '5. Cookies & Tracking',
    body: [
      'Our website uses cookies to enhance your browsing experience, remember preferences, and analyze traffic. You may control cookies through your browser settings, though disabling them may affect website functionality.',
      'We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted or expire) for authentication, personalization, and analytics.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails or managing preferences in your dashboard.',
      'To exercise any of these rights, please contact concierge@voidatelier.com. We will respond to your request within 30 days, in accordance with applicable data protection laws.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    body: [
      'Our website and services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us for prompt deletion.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.',
    ],
  },
];

export default function Privacy() {
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
                <ShieldCheck className="w-3.5 h-3.5" /> Legal
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUpVariants}
              className="atelier-display text-5xl md:text-6xl mb-4 leading-none"
            >
              Privacy <em>Policy</em>
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
                VOID Atelier ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or purchase our products.
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
            <h2 className="atelier-display text-xl mb-3">Questions About Privacy?</h2>
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