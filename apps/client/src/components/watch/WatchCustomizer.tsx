import { useState } from 'react';
import { ShoppingBag, Sparkles, Check, Eye } from 'lucide-react';
import { Watch3DCanvas, WatchFinish, CameraPreset } from './Watch3DCanvas';
import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../types';

interface FinishOption {
  id: WatchFinish;
  name: string;
  material: string;
  hex: string;
  accent: string;
  priceModifier: number;
}

const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Titanium',
    material: 'Grade 5 Vacuum-PVD Titanium & Gold',
    hex: '#18191a',
    accent: '#d4af37',
    priceModifier: 0,
  },
  {
    id: 'platinum',
    name: 'Platinum Silver',
    material: '950 Brushed Platinum & Cyan Accents',
    hex: '#d0d5dd',
    accent: '#00f0ff',
    priceModifier: 650,
  },
  {
    id: 'rosegold',
    name: '18K Rose Gold',
    material: '18K Warm Rose Gold & Chocolate Dial',
    hex: '#b87333',
    accent: '#ffd700',
    priceModifier: 1200,
  },
  {
    id: 'emerald',
    name: 'Royal Emerald',
    material: 'Metallic Emerald Ceramic & Gold Bezel',
    hex: '#1a2e26',
    accent: '#10b981',
    priceModifier: 850,
  },
];

const STRAP_OPTIONS = [
  { id: 'titanium', name: 'Titanium Link Bracelet', priceModifier: 0 },
  { id: 'leather', name: 'Horween Leather Strap', priceModifier: 150 },
  { id: 'rubber', name: 'Tactical FKM Rubber', priceModifier: -100 },
];

export function WatchCustomizer() {
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(FINISH_OPTIONS[0]);
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0]);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const { addItem, openCart } = useCartStore();

  const basePrice = 4850;
  const totalPrice = basePrice + selectedFinish.priceModifier + selectedStrap.priceModifier;

  const handleAcquireCustomWatch = () => {
    const customProduct: Product = {
      _id: `prod_watch_${selectedFinish.id}_${selectedStrap.id}`,
      name: `VOID Monolith Caliber V-01 · ${selectedFinish.name}`,
      slug: `void-monolith-${selectedFinish.id}`,
      description: `Custom ${selectedFinish.material} timepiece paired with ${selectedStrap.name}. Powered by Caliber V-01 automatic movement with 72-hour power reserve.`,
      brand: 'VOID',
      category: { _id: 'cat_watch', name: 'Horological Monolith', slug: 'watches', active: true },
      price: totalPrice,
      comparePrice: totalPrice + 700,
      sku: `VD-WTCH-${selectedFinish.id.toUpperCase()}`,
      images: [
        {
          url: '/products/obsidian_titanium_hero.png',
          alt: `VOID Monolith ${selectedFinish.name}`,
        },
      ],
      colorways: [{ name: selectedFinish.name, hex: selectedFinish.accent, images: [] }],
      sizes: [{ label: '42mm', stock: 5 }],
      materials: [selectedFinish.material, selectedStrap.name, 'Sapphire Crystal'],
      tags: ['watch', 'luxury', '3d-custom'],
      featured: true,
      isNew: true,
      onSale: false,
      avgRating: 5.0,
      reviewCount: 24,
      createdAt: new Date().toISOString(),
    };

    addItem(customProduct, customProduct.colorways[0], '42mm');
    openCart();
  };

  return (
    <div className="py-24 px-6 md:px-16 bg-void-black relative border-t border-void-gold/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-label-caps text-label-caps text-void-gold tracking-[0.4em] uppercase inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Interactive 3D Studio
          </span>
          <h2 className="atelier-display atelier-display-md text-white mb-4">
            TIMEPIECE CONFIGURATOR
          </h2>
          <div className="w-16 h-px bg-void-gold mx-auto mb-4" />
          <p className="text-void-muted text-sm md:text-base font-light max-w-xl mx-auto">
            Tailor the material finish, strap architecture, and camera perspective in real-time.
          </p>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Turntable Viewport (7 Cols) */}
          <div className="lg:col-span-7 h-[500px] md:h-[600px] glass-panel border-void-gold/30 p-4 relative overflow-hidden flex flex-col justify-between gold-glow">
            {/* Viewport Overlay Controls */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
              <div className="bg-void-black/70 backdrop-blur-md px-3 py-1.5 border border-void-gold/30 font-label-caps text-[11px] text-white uppercase tracking-wider">
                FINISH: <span style={{ color: selectedFinish.accent }}>{selectedFinish.name}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`p-2 border backdrop-blur-md transition-colors ${
                    isWireframe
                      ? 'bg-void-gold text-black border-void-gold'
                      : 'bg-void-black/70 text-void-muted border-white/10 hover:text-white'
                  }`}
                  title="Toggle Blueprint Wireframe"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <Watch3DCanvas
              finish={selectedFinish.id}
              cameraPreset={cameraPreset}
              wireframe={isWireframe}
              className="w-full h-full"
            />

            {/* Camera Controls Bar */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-center gap-2 bg-void-black/80 backdrop-blur-md p-2 border border-white/10">
              {(['front', 'profile', 'exploded', 'back'] as CameraPreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCameraPreset(preset)}
                  className={`px-3 py-1.5 font-label-caps text-[10px] uppercase tracking-wider transition-all ${
                    cameraPreset === preset
                      ? 'bg-void-gold text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'text-void-muted hover:text-white'
                  }`}
                >
                  {preset} View
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Customization Controls & Summary (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Finish Selector */}
            <div className="glass-panel p-6 border-void-gold/20">
              <span className="font-label-caps text-xs text-void-gold uppercase tracking-widest block mb-4">
                1. Case Finish & Materiality
              </span>

              <div className="grid grid-cols-2 gap-3">
                {FINISH_OPTIONS.map((finish) => {
                  const isSelected = selectedFinish.id === finish.id;

                  return (
                    <button
                      key={finish.id}
                      onClick={() => setSelectedFinish(finish)}
                      className={`p-3 text-left transition-all border relative flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'border-void-gold bg-void-gold/10'
                          : 'border-void-gold/20 hover:border-void-gold/40 bg-void-black/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: finish.accent }}
                        />
                        {isSelected && <Check className="w-4 h-4 text-void-gold" />}
                      </div>

                      <div>
                        <div className="font-display text-sm text-white font-medium">
                          {finish.name}
                        </div>
                        <div className="font-mono text-[10px] text-void-muted">
                          {finish.priceModifier > 0
                            ? `+$${finish.priceModifier}`
                            : 'Included'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strap Selector */}
            <div className="glass-panel p-6 border-void-gold/20">
              <span className="font-label-caps text-xs text-void-gold uppercase tracking-widest block mb-4">
                2. Strap Architecture
              </span>

              <div className="space-y-2">
                {STRAP_OPTIONS.map((strap) => {
                  const isSelected = selectedStrap.id === strap.id;

                  return (
                    <button
                      key={strap.id}
                      onClick={() => setSelectedStrap(strap)}
                      className={`w-full p-3.5 text-left border flex justify-between items-center transition-all ${
                        isSelected
                          ? 'border-void-gold bg-void-gold/10 text-white'
                          : 'border-void-gold/20 text-void-muted hover:text-white bg-void-black/40'
                      }`}
                    >
                      <span className="font-display text-sm">{strap.name}</span>
                      <span className="font-mono text-xs text-void-gold">
                        {strap.priceModifier > 0
                          ? `+$${strap.priceModifier}`
                          : strap.priceModifier < 0
                          ? `-$${Math.abs(strap.priceModifier)}`
                          : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Acquisition Box */}
            <div className="glass-panel p-6 border-void-gold/40 gold-glow bg-void-black/80 flex flex-col gap-4">
              <div className="flex justify-between items-baseline border-b border-void-gold/20 pb-4">
                <div>
                  <span className="font-label-caps text-xs text-void-muted uppercase">
                    Configured Total
                  </span>
                  <div className="font-display text-3xl text-white font-bold mt-0.5">
                    ${totalPrice.toLocaleString()}
                  </div>
                </div>

                <span className="font-label-caps text-[10px] text-void-gold border border-void-gold/30 px-2 py-1 uppercase">
                  In Stock (Lim. 5 Units)
                </span>
              </div>

              <button
                onClick={handleAcquireCustomWatch}
                className="w-full py-4 bg-void-gold text-black font-label-caps text-xs uppercase tracking-widest font-semibold hover:bg-white hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Acquire Configured Monolith
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
