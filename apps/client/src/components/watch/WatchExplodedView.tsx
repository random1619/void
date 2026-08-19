import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ShieldCheck, Cpu, Compass, Eye, Sparkles, Target } from 'lucide-react';
import { Watch3DCanvas, CameraPreset } from './Watch3DCanvas';

export interface MechanismPart {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  tolerance: string;
  icon: typeof Layers;
  explodeLevel: number;
  cameraPreset: CameraPreset;
}

const MECHANISM_PARTS: MechanismPart[] = [
  {
    id: 'crystal',
    name: 'Sapphire Crystal Monolith',
    subtitle: 'Dual AR-Coated Glass Shield (9 Mohs)',
    description: 'Carved from synthetic corundum with a Mohs hardness rating of 9. Features dual anti-reflective coating for zero-glare clarity in any lighting condition.',
    material: 'Synthetic Sapphire Corundum',
    tolerance: '±0.002 mm',
    icon: Eye,
    explodeLevel: 1.0,
    cameraPreset: 'front',
  },
  {
    id: 'bezel',
    name: 'Octagonal Bezel & Tachymeter Scale',
    subtitle: 'Ceramic-Titanium Architecture',
    description: 'Precision-machined octagonal bezel anchored by 8 exposed titanium screws with an engraved 60–500 tachymeter scale.',
    material: 'Grade 5 Titanium & Ceramic Composite',
    tolerance: '±0.001 mm',
    icon: ShieldCheck,
    explodeLevel: 0.75,
    cameraPreset: 'profile',
  },
  {
    id: 'dial',
    name: 'Skeleton Dial & Chronograph Trio',
    subtitle: 'Super-LumiNova & Working Sub-Dials',
    description: 'Laser-cut skeletonized dial face exposing the kinetic inner heart, accented by 3 working sub-dials (Small Sec, 30-Min, 12-Hr) and Super-LumiNova hour markers.',
    material: 'Matte Carbon & Rhodium Plating',
    tolerance: '±0.0005 mm',
    icon: Compass,
    explodeLevel: 0.5,
    cameraPreset: 'exploded',
  },
  {
    id: 'movement',
    name: 'Caliber V-01 Automatic Heart',
    subtitle: 'Geneva Stripes & Perlage Finishing',
    description: 'In-house automatic movement with 27 synthetic ruby jewels, Glucydur balance wheel with 3D spiral hairspring, Côtés de Genève bridge plates, and kinetic rotor.',
    material: '27 Rubies, Brass & Titanium',
    tolerance: 'Micro-Horological Spec',
    icon: Cpu,
    explodeLevel: 0.25,
    cameraPreset: 'back',
  },
];

export function WatchExplodedView() {
  const [activePart, setActivePart] = useState<MechanismPart>(MECHANISM_PARTS[2]);
  const [explodeSlider, setExplodeSlider] = useState<number>(0.8);
  const [activePreset, setActivePreset] = useState<CameraPreset>('exploded');

  const handleSelectPart = (part: MechanismPart) => {
    setActivePart(part);
    setExplodeSlider(part.explodeLevel);
    setActivePreset(part.cameraPreset);
  };

  return (
    <div className="py-24 px-6 md:px-16 bg-gradient-to-b from-void-black via-void-dark to-void-black relative overflow-hidden border-t border-void-gold/10">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-label-caps text-label-caps text-void-gold tracking-[0.4em] uppercase inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Deconstructed Haute Horologie
          </span>
          <h2 className="atelier-display atelier-display-md text-white mb-4">
            THE EXPLODED MECHANISM
          </h2>
          <p className="text-void-muted font-light text-sm md:text-base leading-relaxed">
            Inspect individual layers to isolate the micro-components, Geneva stripes, and Glucydur balance hairspring engineered inside the VOID Monolith.
          </p>
        </div>

        {/* 3D Viewport + Interactive Controller Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Center 3D Interactive Canvas Viewport (7 Cols) */}
          <div className="lg:col-span-7 relative h-[550px] md:h-[620px] glass-panel border-void-gold/20 p-4 overflow-hidden rounded-none gold-glow">
            {/* Viewport Header Status Bar */}
            <div className="absolute top-6 left-6 right-6 z-20 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2 bg-void-black/80 backdrop-blur-md border border-void-gold/40 px-3.5 py-1.5 font-label-caps text-[11px] text-void-gold uppercase tracking-widest">
                <Target className="w-3.5 h-3.5 animate-pulse" /> Active Focus: {activePart.name}
              </div>

              {/* Angle Presets */}
              <div className="flex gap-1.5 bg-void-black/80 backdrop-blur-md p-1 border border-white/10">
                {(['front', 'profile', 'exploded', 'back'] as CameraPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setActivePreset(preset)}
                    className={`px-3 py-1 text-[10px] font-label-caps uppercase tracking-wider transition-all ${
                      activePreset === preset
                        ? 'bg-void-gold text-black font-semibold'
                        : 'text-void-muted hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Live 3D Canvas */}
            <Watch3DCanvas
              cameraPreset={activePreset}
              explodeProgress={explodeSlider}
              className="w-full h-full"
            />

            {/* Exploded Distance Slider */}
            <div className="absolute bottom-6 left-6 right-6 z-20 bg-void-black/80 backdrop-blur-md border border-void-gold/20 p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="font-label-caps text-[11px] text-void-gold uppercase tracking-widest min-w-[150px]">
                Layer Separation: {Math.round(explodeSlider * 100)}%
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodeSlider}
                onChange={(e) => setExplodeSlider(parseFloat(e.target.value))}
                className="w-full accent-void-gold bg-void-dark cursor-pointer h-1.5"
              />
              <button
                onClick={() => setExplodeSlider(explodeSlider > 0.5 ? 0 : 0.85)}
                className="font-label-caps text-[10px] px-3.5 py-1.5 border border-void-gold/40 text-void-gold uppercase tracking-wider hover:bg-void-gold hover:text-black transition-colors"
              >
                {explodeSlider > 0.5 ? 'Assemble' : 'Explode'}
              </button>
            </div>
          </div>

          {/* Right Mechanism Layer Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="font-label-caps text-xs text-void-gold tracking-widest uppercase mb-1">
              Select Component Layer to Focus
            </div>

            {MECHANISM_PARTS.map((part) => {
              const IconComp = part.icon;
              const isSelected = activePart.id === part.id;

              return (
                <motion.div
                  key={part.id}
                  onClick={() => handleSelectPart(part)}
                  whileHover={{ x: 4 }}
                  className={`cursor-pointer glass-panel p-5 transition-all duration-300 border ${
                    isSelected
                      ? 'border-void-gold bg-void-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-void-gold/20 hover:border-void-gold/50 bg-void-black/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-none border ${
                          isSelected
                            ? 'bg-void-gold text-black border-void-gold'
                            : 'bg-void-dark text-void-gold border-void-gold/30'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-lg text-white font-medium">
                          {part.name}
                        </h4>
                        <p className="font-label-caps text-[11px] text-void-gold/80 uppercase tracking-widest">
                          {part.subtitle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-void-gold animate-ping" />
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-void-gold/20 space-y-3"
                      >
                        <p className="text-void-muted text-xs font-light leading-relaxed">
                          {part.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
                          <div className="bg-void-black/60 p-2.5 border border-white/5">
                            <span className="font-label-caps text-[9px] text-void-muted uppercase block mb-0.5 font-sans">
                              Materiality
                            </span>
                            <span className="text-xs text-white">
                              {part.material}
                            </span>
                          </div>
                          <div className="bg-void-black/60 p-2.5 border border-white/5">
                            <span className="font-label-caps text-[9px] text-void-muted uppercase block mb-0.5 font-sans">
                              Machining Precision
                            </span>
                            <span className="text-xs text-void-gold">
                              {part.tolerance}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
