import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Accordion from '@radix-ui/react-accordion';
import {
  ChevronDown,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Search,
} from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        question: 'How long does it take to process and ship an order?',
        answer:
          'Each piece is hand-finished to order. Processing takes 3–5 business days, after which your garment ships via white-glove courier. You will receive a tracking number and appointment handoff details by email once your order departs the atelier.',
      },
      {
        question: 'Do you offer international shipping?',
        answer:
          'Yes. We ship globally with climate-controlled, insured transit. International orders may be subject to customs duties and taxes, which are the responsibility of the recipient. Delivery timelines vary by destination, typically 7–14 business days.',
      },
      {
        question: 'Is shipping free?',
        answer:
          'Complimentary white-glove shipping is included on all orders over $200. For orders below this threshold, a flat $15 shipping fee applies at checkout.',
      },
      {
        question: 'Can I modify or cancel my order after placing it?',
        answer:
          'Because each piece is made to order, modifications or cancellations must be requested within 12 hours of purchase. Please contact concierge@voidatelier.com immediately with your order number.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'We accept returns within 14 days of delivery for unworn, unaltered pieces in their original condition with all tags and certificates intact. Returns must be authorized in advance by contacting our concierge team.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Email concierge@voidatelier.com with your order number and reason for return. Our team will issue a return authorization and arrange insured courier pickup at no cost to you.',
      },
      {
        question: 'Can I exchange a piece for a different size?',
        answer:
          'Yes. Exchanges for size are subject to stock availability. If the requested size is unavailable, a full refund will be issued instead. Contact us within 14 days of delivery to arrange an exchange.',
      },
      {
        question: 'Are made-to-order or customized pieces returnable?',
        answer:
          'Due to their bespoke nature, made-to-order and customized pieces are final sale and not eligible for return or exchange unless they arrive damaged or defective.',
      },
    ],
  },
  {
    category: 'Product & Craft',
    items: [
      {
        question: 'Are your pieces numbered or limited edition?',
        answer:
          'Every VOID Atelier piece is individually numbered and issued with a certificate of authenticity. Production runs are intentionally limited to preserve exclusivity and craftsmanship standards.',
      },
      {
        question: 'What materials do you use?',
        answer:
          'We source only the finest materials: organic Japanese virgin wool, Mongolian cashmere, Italian silk, and proprietary ceramic-titanium alloys for our horological pieces. Full material composition is listed on each product page.',
      },
      {
        question: 'How should I care for my VOID garment?',
        answer:
          'Most pieces require professional dry cleaning only. Detailed care instructions are included with every order and printed on the interior label. For specific care questions, our concierge team is available to advise.',
      },
      {
        question: 'Do you offer custom or bespoke tailoring?',
        answer:
          'Yes. Our atelier accepts a limited number of custom commissions each season. Please contact us through the Contact page and select "Custom Atelier Order" to begin a consultation.',
      },
    ],
  },
  {
    category: 'Account & Privacy',
    items: [
      {
        question: 'Do I need an account to place an order?',
        answer:
          'No. You may check out as a guest. However, creating an account unlocks order tracking, wishlist saving, faster checkout, and access to private seasonal drops.',
      },
      {
        question: 'How is my personal data protected?',
        answer:
          'We take privacy seriously. Your data is encrypted in transit and at rest, never sold to third parties, and used solely for order fulfillment and atelier communications. See our Privacy Policy for full details.',
      },
      {
        question: 'Can I unsubscribe from the newsletter?',
        answer:
          'Yes. Every newsletter email includes an unsubscribe link at the bottom. You may also manage your preferences from your dashboard at any time.',
      },
    ],
  },
];

export default function FAQ() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

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
                <Sparkles className="w-3.5 h-3.5" /> Knowledge Base
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUpVariants}
              className="atelier-display text-5xl md:text-6xl mb-6 leading-none"
            >
              Frequently Asked<br />
              <em>Questions</em>
            </motion.h1>
            <motion.p
              variants={fadeUpVariants}
              className="text-base md:text-lg text-ink-mute max-w-2xl mx-auto font-light leading-relaxed"
            >
              Everything you need to know about the VOID Atelier · orders, shipping, returns, and craftsmanship.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-8">
        <div className="container-void max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-mute" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="atelier-input !pl-12 !py-3.5"
            />
          </div>
        </div>
      </section>

      {/* FAQ ACCORDIONS */}
      <section className="py-8">
        <div className="container-void max-w-3xl">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="w-12 h-12 text-ink-mute mx-auto mb-4" />
              <p className="text-ink-soft font-display text-lg">No matching questions found</p>
              <p className="text-ink-mute text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filtered.map((cat, catIndex) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                >
                  <h2 className="atelier-eyebrow text-sienna mb-6 pb-3 border-b border-hairline">
                    {cat.category}
                  </h2>

                  <Accordion.Root type="single" collapsible className="space-y-3">
                    {cat.items.map((item, itemIndex) => (
                      <Accordion.Item
                        key={itemIndex}
                        value={`item-${catIndex}-${itemIndex}`}
                        className="atelier-card rounded-2xl overflow-hidden"
                      >
                        <Accordion.Header>
                          <Accordion.Trigger className="group flex w-full items-center justify-between p-5 text-left hover:bg-[rgba(var(--sienna-rgb),0.05)] transition-colors">
                            <span className="font-display text-base text-ink pr-4">
                              {item.question}
                            </span>
                            <ChevronDown className="w-5 h-5 text-sienna flex-shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="px-5 pb-5 text-sm text-ink-mute leading-relaxed font-light">
                            {item.answer}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </motion.div>
              ))}
            </div>
          )}
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
            className="text-center max-w-2xl mx-auto atelier-card rounded-2xl p-10"
          >
            <h2 className="atelier-display text-2xl mb-3">Still Have Questions?</h2>
            <p className="text-ink-mute mb-8 font-light">
              Our concierge team is available to assist with any inquiry.
            </p>
            <Link
              to="/contact"
              className="atelier-btn inline-flex items-center gap-2"
            >
              Contact the Atelier
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}