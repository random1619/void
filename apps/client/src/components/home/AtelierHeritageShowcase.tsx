import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Scissors, Watch, FileCheck2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { springs } from '../../lib/motion-tokens';
import { Image } from '../ui/Image';

interface Step {
  id: string;
  stepNum: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Compass;
  image: string;
  specs: { label: string; value: string }[];
  tag: string;
  link: string;
  linkText: string;
}

const HERITAGE_STEPS: Step[] = [
  {
    id: 'step-pattern',
    stepNum: '01',
    title: 'Architectural Blueprint Patterning',
    subtitle: 'Geometric Drafts & Zero-Waste Origami Cutting',
    description:
      'Before a single meter of wool is cut, each garment is drafted as an architectural structure. We balance high-density structured shoulders with natural fluid drape, calibrated down to the millimeter.',
    icon: Compass,
    image: '/chapter_one_silhouettes.jpg',
    tag: 'Phase I · Pattern Lab',
    link: '/collections',
    linkText: 'Explore Tailoring',
    specs: [
      { label: 'Draft Precision', value: '0.25mm Cadence' },
      { label: 'Pattern Rounds', value: '4 Prototype Iterations' },
      { label: 'Lapel Construction', value: 'Floating Canvas' },
    ],
  },
  {
    id: 'step-textile',
    stepNum: '02',
    title: 'Historic Bishu & Biella Milling',
    subtitle: 'Ultra-Dense Japanese Merinos & Raw Silks',
    description:
      'We partner with multi-generational heritage mills in Owari and Piedmont. Sourcing ultra-fine 17.5-micron virgin merinos and hand-spun raw mulberry silks, woven on slow vintage shuttle looms.',
    icon: Scissors,
    image: '/chapter_three_matter.jpg',
    tag: 'Phase II · Raw Matter',
    link: '/products',
    linkText: 'Discover Textiles',
    specs: [
      { label: 'Fabric Density', value: '420 GSM' },
      { label: 'Provenance', value: 'Historic Owari Mill' },
      { label: 'Dye Process', value: 'Cold Botanical Set' },
    ],
  },
  {
    id: 'step-horology',
    stepNum: '03',
    title: 'Grade 5 Titanium Calibration',
    subtitle: 'Caliber 801 Skeleton Movement & Hand Beveling',
    description:
      'Our timepiece cases are milled from single blocks of aerospace Grade 5 titanium, hand-beveled with diamond compound paste and fitted with double-domed anti-reflective sapphire crystals.',
    icon: Watch,
    image: '/chapter_two_metallurgy.jpg',
    tag: 'Phase III · Metallurgy',
    link: '/watch',
    linkText: 'Configure Horology',
    specs: [
      { label: 'Case Alloy', value: 'Grade 5 Titanium' },
      { label: 'Movement', value: 'VOID Automatic 801' },
      { label: 'Power Reserve', value: '48 Hours' },
    ],
  },
  {
    id: 'step-ledger',
    stepNum: '04',
    title: 'Master Ledger Serialization',
    subtitle: 'Individually Numbered Editions & Certificate',
    description:
      'Every creation that leaves the atelier is engraved with its individual serial number and recorded in our permanent master ledger, guaranteeing exclusivity in strictly limited runs of fifty.',
    icon: FileCheck2,
    image: '/lookbook_look_01_drape.jpg',
    tag: 'Phase IV · Archival Proof',
    link: '/about',
    linkText: 'Read Master Ledger',
    specs: [
      { label: 'Batch Run', value: 'Strict 50 Pieces' },
      { label: 'Ledger Registry', value: 'Cryptographic Hash' },
      { label: 'Guarantee', value: 'Lifetime Atelier Care' },
    ],
  },
];

export function AtelierHeritageShowcase() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = HERITAGE_STEPS[activeStepIdx];

  return (
    <section aria-labelledby="heritage-heading" className="section-gap atelier-bg border-t border-hairline">
      <div className="container-void">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-sienna" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-sienna font-bold">
                The Four Pillars
              </span>
            </div>
            <AnimatedHeading
              id="heritage-heading"
              text="The Anatomy of _Obsessive Craft_"
              variant="tracking"
              className="atelier-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink"
            />
          </div>
          <p className="text-sm md:text-base text-ink-soft max-w-md leading-relaxed">
            From initial structural blueprint to final ledger serialization, explore the four uncompromised phases of every VOID creation.
          </p>
        </div>

        {/* Interactive 4-Step Navigation Rail */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {HERITAGE_STEPS.map((step, idx) => {
            const isActive = activeStepIdx === idx;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepIdx(idx)}
                className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[140px] ${
                  isActive
                    ? 'atelier-bg-deep border-sienna shadow-[0_4px_24px_rgba(163,72,36,0.12)]'
                    : 'atelier-bg border-hairline hover:border-sienna/40 hover:bg-bone/30'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <span
                    className={`font-mono text-xs font-bold tracking-widest ${
                      isActive ? 'text-sienna' : 'text-ink-mute'
                    }`}
                  >
                    PHASE {step.stepNum}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-sienna text-white' : 'bg-bone text-ink-mute group-hover:text-ink'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4
                    className={`font-display text-sm md:text-base font-bold transition-colors ${
                      isActive ? 'text-ink' : 'text-ink-soft group-hover:text-ink'
                    }`}
                  >
                    {step.title.split(' ')[0]} {step.title.split(' ')[1]}
                  </h4>
                  <span className="font-mono text-[10px] text-ink-mute/70 uppercase tracking-wider block mt-0.5">
                    {step.tag.split('· ')[1]}
                  </span>
                </div>

                {/* Active progress indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="heritage-active-line"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-sienna rounded-full"
                    transition={springs.snappy}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Featured Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 md:p-10 rounded-3xl atelier-bg-deep border border-hairline shadow-soft"
          >
            {/* Left Column: Details & Telemetry Specs */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sienna" />
                  <span className="font-mono text-[10px] font-bold text-sienna uppercase tracking-widest">
                    {activeStep.tag}
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-2">
                  {activeStep.title}
                </h3>
                <p className="font-mono text-xs text-sienna font-semibold uppercase tracking-wider mb-4">
                  {activeStep.subtitle}
                </p>
                <p className="text-ink-soft text-sm md:text-base leading-relaxed max-w-lg">
                  {activeStep.description}
                </p>
              </div>

              {/* 3-Point Telemetry Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-bone/60 border border-hairline">
                {activeStep.specs.map((spec) => (
                  <div key={spec.label}>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-ink-mute mb-1">
                      {spec.label}
                    </span>
                    <span className="font-sans text-xs md:text-sm font-bold text-ink block truncate">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to={activeStep.link}
                  className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-ink text-ivory font-mono text-xs uppercase tracking-widest font-bold hover:bg-sienna hover:text-white transition-colors duration-300 shadow-sm"
                >
                  <span>{activeStep.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: High-Res Master Photography Frame */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-bone border border-hairline shadow-md group">
                <Image
                  src={activeStep.image}
                  alt={activeStep.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-luxury)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[10px] text-white/90 uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    Atelier Ledger Serialized
                  </span>
                  <span className="font-mono text-[10px] text-white/80 uppercase">
                    0{activeStepIdx + 1} of 04
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
