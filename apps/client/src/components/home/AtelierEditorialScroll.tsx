import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Layers, ArrowUpRight } from 'lucide-react';
import { springs } from '../../lib/motion-tokens';

interface ChapterSpec {
  label: string;
  value: string;
}

interface Chapter {
  id: string;
  chapterNum: string;
  tag: string;
  category: string;
  title: string;
  desc: string;
  image: string;
  link: string;
  linkText: string;
  specs: ChapterSpec[];
}

const EDITORIAL_CHAPTERS: Chapter[] = [
  {
    id: 'chapter-silhouettes',
    chapterNum: '01',
    tag: 'Chapter I / Silhouettes',
    category: 'Architectural Tailoring',
    title: 'Architectural precision meets fluid tailoring.',
    desc: 'Every garment is patterned from structural blueprints, balancing sculpted shoulders with weightless Japanese wool-silk drape.',
    image: '/chapter_one_silhouettes.jpg',
    link: '/collections',
    linkText: 'Explore Silhouettes',
    specs: [
      { label: 'Edition', value: '50 Pieces' },
      { label: 'Textile', value: 'Bishu Wool-Silk' },
      { label: 'Finish', value: 'Hand-Rolled Lapel' },
    ],
  },
  {
    id: 'chapter-metallurgy',
    chapterNum: '02',
    tag: 'Chapter II / Metallurgy',
    category: 'Horology Studio',
    title: 'Horology calibrated to mechanical eternity.',
    desc: 'Hand-beveled titanium cases housing custom automatic movements, individually engraved and registered in our master ledger.',
    image: '/chapter_two_metallurgy.jpg',
    link: '/watch',
    linkText: 'Configure Timepiece',
    specs: [
      { label: 'Casing', value: 'Grade 5 Titanium' },
      { label: 'Caliber', value: 'VOID Cal. 801' },
      { label: 'Ledger', value: 'Serialized 01/50' },
    ],
  },
  {
    id: 'chapter-matter',
    chapterNum: '03',
    tag: 'Chapter III / Matter',
    category: 'Textile Heritage',
    title: 'Hyper-dense Japanese merinos and raw silks.',
    desc: 'Uncompromising textile sourcing from historic heritage mills in Owari and Kyoto, finished by hand in micro-batches of fifty.',
    image: '/chapter_three_matter.jpg',
    link: '/products',
    linkText: 'Discover Raw Matter',
    specs: [
      { label: 'Density', value: '420 GSM Merino' },
      { label: 'Provenance', value: 'Historic Owari Mill' },
      { label: 'Dye Method', value: 'Botanical Cold-Set' },
    ],
  },
];

export function AtelierEditorialScroll() {
  const [activeChapter, setActiveChapter] = useState(0);
  const currentChapter = EDITORIAL_CHAPTERS[activeChapter];

  return (
    <section
      aria-label="The Atelier Manifesto & Chapters"
      className="section-gap relative bg-[var(--ivory-deep)] border-y border-hairline text-ink overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-sienna/10 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-sienna/5 blur-[140px] pointer-events-none"
      />

      <div className="container-void relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: The Manifesto & Chapter Switcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sienna/10 border border-sienna/20 mb-6 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-sienna animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-sienna font-bold">
                  The Atelier Manifesto
                </span>
              </div>

              {/* Main headline */}
              <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-ink leading-[1.1] mb-5">
                Form without compromise,{' '}
                <span className="text-sienna italic font-normal">substance</span>{' '}
                without excess.
              </h2>

              {/* High-contrast manifesto description */}
              <p className="font-sans text-base text-ink-soft leading-relaxed max-w-md">
                We craft for those who reject ephemeral cycles. Every VOID edition is engineered at the intersection of architectural discipline, Japanese raw textile mastery, and micro-batch horology.
              </p>
            </div>

            {/* Interactive Chapter Index Tabs */}
            <div className="pt-6 border-t border-hairline">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute font-bold flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-sienna" />
                  Chapter Archive
                </span>
                <span className="font-mono text-[10px] text-sienna font-bold">
                  0{activeChapter + 1} / 03
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {EDITORIAL_CHAPTERS.map((chap, idx) => {
                  const isActive = activeChapter === idx;
                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => setActiveChapter(idx)}
                      className={`text-left p-3.5 rounded-2xl transition-all duration-300 border flex flex-col gap-1 relative ${
                        isActive
                          ? 'bg-[var(--bone)] border-sienna shadow-[0_4px_16px_rgba(163,72,36,0.15)]'
                          : 'bg-[var(--ivory)] border-hairline hover:bg-[var(--bone)]/60 hover:border-ink/20'
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          isActive ? 'text-sienna' : 'text-ink-mute'
                        }`}
                      >
                        {chap.chapterNum}
                      </span>
                      <span
                        className={`font-display text-xs font-semibold truncate ${
                          isActive ? 'text-ink' : 'text-ink-mute'
                        }`}
                      >
                        {chap.tag.split('/ ')[1]}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="active-chapter-indicator"
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-sienna rounded-full"
                          transition={springs.snappy}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badges and links row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-hairline">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sienna" />
                  <span className="font-mono text-xs text-ink-soft">Certified Atelier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sienna" />
                  <span className="font-mono text-xs text-ink-soft">Strict 50 Pieces</span>
                </div>
              </div>

              <Link
                to="/about"
                className="group font-mono text-xs uppercase tracking-widest text-ink hover:text-sienna inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Read Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Active Chapter Dynamic Frame */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -12 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl bg-[var(--ivory)] border border-hairline p-6 md:p-8 backdrop-blur-xl shadow-lg space-y-6"
              >
                {/* Image Container with Telemetry Pill */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--bone)] border border-hairline group">
                  <img
                    src={currentChapter.image}
                    alt={currentChapter.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Bar on Image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-ink/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-ivory">
                      {currentChapter.category}
                    </span>
                    <span className="font-mono text-[10px] text-ivory/90 bg-ink/70 px-3 py-1 rounded-full border border-white/15">
                      Edition {currentChapter.chapterNum} / 03
                    </span>
                  </div>
                </div>

                {/* Chapter Content Details */}
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-2 tracking-tight">
                    {currentChapter.title}
                  </h3>
                  <p className="text-sm md:text-base text-ink-soft leading-relaxed max-w-xl font-light">
                    {currentChapter.desc}
                  </p>
                </div>

                {/* 3-Point Craft Specs */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bone)]/50 border border-hairline">
                  {currentChapter.specs.map((spec) => (
                    <div key={spec.label}>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-ink-mute mb-0.5">
                        {spec.label}
                      </span>
                      <span className="font-sans text-xs md:text-sm font-bold text-ink block truncate">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Link */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to={currentChapter.link}
                    className="btn-island-primary group"
                  >
                    <span>{currentChapter.linkText}</span>
                    <span className="icon-pill">
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>

                  <Link
                    to="/lookbook"
                    className="font-mono text-xs text-ink-mute hover:text-sienna inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Lookbook</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

