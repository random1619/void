import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { staggerContainer, fadeUpVariants } from '../../lib/animations';

const HOUSES = [
  { index: 'I', name: 'Atelier', slug: 'atelier', description: 'Draped silhouettes and custom-tailored forms.' },
  { index: 'II', name: 'Outerwear', slug: 'outerwear', description: 'Architectural coats built for structure and weather.' },
  { index: 'III', name: 'Footwear', slug: 'footwear', description: 'Sculptural boots engineered in full-grain leather.' },
];

export function CollectionIndex() {
  return (
    <section className="section-gap atelier-bg-deep border-y border-hairline">
      <div className="container-void">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={fadeUpVariants} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="atelier-display text-[clamp(32px,4.5vw,56px)]">
              Three Disciplines, <em>One Series</em>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {HOUSES.map((house) => (
              <motion.div key={house.slug} variants={fadeUpVariants}>
                <Link
                  to={`/collections/${house.slug}`}
                  className="group block atelier-bg border border-hairline p-8 hover:border-[rgba(180,85,45,0.4)] transition-colors duration-500"
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className="atelier-eyebrow text-ink-mute text-[10px]">{house.index}</span>
                    <span className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-ink-mute group-hover:bg-sienna group-hover:border-sienna group-hover:text-ivory transition-colors duration-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="font-display text-3xl text-ink group-hover:text-sienna transition-colors duration-500 mb-3">
                    {house.name}
                  </h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{house.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
