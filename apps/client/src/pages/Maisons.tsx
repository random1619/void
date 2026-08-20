import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react';
import { Image } from '../components/ui/Image';
import { useGsapParallax } from '../hooks/useGsapScrollEffect';
import { springs } from '../lib/motion-tokens';

/**
 * Maisons — the flagships.
 * Editorial store catalog: a cinematic hero, a hairlined store index with
 * real flagship imagery, and service details in the maison's ledger language.
 */

const MAISONS = [
  {
    city: 'New Delhi',
    district: 'Defence Colony',
    address: 'Atelier House, Block D — DefCol',
    image: '/maisons_new_delhi.jpg',
    alt: 'VOID flagship in New Delhi',
    phone: '+91 11 4000 0000',
    hours: 'Mon–Sat · 10:00 – 20:00',
    featured: true,
  },
  {
    city: 'Milano',
    district: 'Via Montenapoleone',
    address: 'Via Montenapoleone 8',
    image: '/maisons_milano_flagship.png',
    alt: 'VOID flagship in Milano',
    phone: '+39 02 7600 0000',
    hours: 'Mon–Sat · 10:30 – 19:30',
    featured: false,
  },
  {
    city: 'Paris',
    district: 'Le Marais',
    address: 'Rue Vieille du Temple 12',
    image: '/maisons_paris_flagship.jpg',
    alt: 'VOID flagship in Paris',
    phone: '+33 1 42 00 0000',
    hours: 'Tue–Sun · 11:00 – 19:00',
    featured: false,
  },
  {
    city: 'Kyoto',
    district: 'Sanjō',
    address: 'Chūō-ku, Sanjō-bashi 27',
    image: '/maisons_kyoto_flagship.png',
    alt: 'VOID flagship in Kyoto',
    phone: '+81 75 213 0000',
    hours: 'Daily · 11:00 – 19:00',
    featured: false,
  },
];

export default function Maisons() {
  const heroImageRef = useGsapParallax<HTMLDivElement>({ yPercent: 12, scrub: 1.2 });

  return (
    <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
      <main className="overflow-x-hidden w-full max-w-full">
        {/* ==================== HERO ==================== */}
        <section className="relative min-h-[86vh] flex items-center overflow-hidden" aria-labelledby="maisons-h1">
          <div ref={heroImageRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
            <Image
              src="/maisons_hero_banner.jpg"
              alt=""
              loading="eager"
              className="w-full h-[112%] object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent" />
          </div>

          <div className="relative z-10 container-void">
            <div className="max-w-2xl">
              <h1
                id="maisons-h1"
                className="atelier-display atelier-display-xl text-ivory mb-6"
              >
                Four Maisons, <em>One Discipline.</em>
              </h1>
              <p className="max-w-xl text-ivory/70 text-base md:text-lg leading-relaxed font-light measure">
                Flagship ateliers in four cities — each one an inhabitable expression of the
                house: engineered, hairlined, and lit like a workshop.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/stores" className="atelier-btn-inverse">
                  Find a Store <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link to="/contact" className="atelier-eyebrow text-ivory/80 text-[11px] inline-flex items-center gap-2 hover:text-sienna transition-colors">
                  Plan a private visit
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-between items-end container-void text-ivory/50">
            <span className="atelier-eyebrow text-[10px]">VOID Atelier · Flagships</span>
            <span className="atelier-eyebrow text-[10px] hidden sm:block">4 cities · 1 language</span>
          </div>
        </section>

        {/* ==================== STORE INDEX ==================== */}
        <section className="section-gap-lg" aria-label="Flagship index">
          <div className="container-void space-y-10">
            {MAISONS.map((m, i) => {
              const isFeatured = m.featured;
              return (
                <motion.article
                  key={m.city}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ ...springs.gentle, delay: i * 0.08 }}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isFeatured ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className={`lg:col-span-6 ${isFeatured ? 'lg:order-2' : ''}`}>
                    <div className="atelier-frame overflow-hidden atelier-frame-hover img-grain aspect-[16/10]">
                      <Image
                        src={m.image}
                        alt={m.alt}
                        loading="lazy"
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className={`lg:col-span-6 ${isFeatured ? 'lg:order-1' : ''}`}>
                    <span className="atelier-eyebrow text-sienna block mb-3">
                      {isFeatured ? 'Flagship Maison' : `Maison 0${i + 1}`}
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl text-ink mb-2 leading-tight">
                      {m.city}
                    </h2>
                    <p className="atelier-eyebrow text-ink-mute mb-6">{m.district}</p>

                    <dl className="border-t border-hairline">
                      <div className="flex justify-between items-center gap-4 py-3 border-b border-hairline">
                        <dt className="flex items-center gap-2.5 text-sm text-ink-soft">
                          <MapPin className="w-4 h-4 text-sienna" aria-hidden="true" /> Address
                        </dt>
                        <dd className="font-mono text-xs text-ink text-right">{m.address}</dd>
                      </div>
                      <div className="flex justify-between items-center gap-4 py-3 border-b border-hairline">
                        <dt className="flex items-center gap-2.5 text-sm text-ink-soft">
                          <Phone className="w-4 h-4 text-sienna" aria-hidden="true" /> Telephone
                        </dt>
                        <dd className="font-mono text-xs text-ink text-right">{m.phone}</dd>
                      </div>
                      <div className="flex justify-between items-center gap-4 py-3">
                        <dt className="flex items-center gap-2.5 text-sm text-ink-soft">
                          <Clock className="w-4 h-4 text-sienna" aria-hidden="true" /> Hours
                        </dt>
                        <dd className="font-mono text-xs text-ink text-right">{m.hours}</dd>
                      </div>
                    </dl>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}